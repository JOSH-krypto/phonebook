const assert = require('node:assert')
const bcrypt = require('bcrypt')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')

const app = require('../app')
const helper = require('./blog_helper')
const Blog = require('../models/blog')
const User = require('../models/users')

const api = supertest(app)
let token

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  // create a user and obtain a token for authenticated operations
  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({ username: 'root', passwordHash })
  await user.save()

  const loginResp = await api
    .post('/api/login')
    .send({ username: 'root', password: 'sekret' })

  token = loginResp.body.token

  // create initial blogs using the token so they belong to the created user
  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(helper.initialBlogs[0])

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(helper.initialBlogs[1])
})

test('blogs are returned in JSON format', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('blogs can be added', async () => {
  const newBlog = {
    title: 'test for POST route',
    author: 'Tester',
    url: 'http://example.com',
    likes: 5
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  const blogs = response.body.map(blog => blog.title)

  assert.strictEqual(response.body.length, helper.initialBlogs.length + 1)
  assert(blogs.includes(newBlog.title))
})

test('adding a blog fails with 401 Unauthorized if token not provided', async () => {
  const newBlog = {
    title: 'unauthorized blog',
    author: 'NoToken',
    url: 'http://notoken.com',
    likes: 0
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)

  const response = await api.get('/api/blogs')
  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('likes default to zero', async () => {
  const newBlog = {
    title: 'Are likes there',
    author: 'likes',
    url: 'http://likes.com'
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)

  const response = await api.get('/api/blogs')

  const createdBlog = response.body.find(
    blog => blog.title === newBlog.title
  )

  assert.strictEqual(createdBlog.likes, 0)
})

test('blog without url cannot be added', async () => {
  const newBlog = {
    title: 'blogs can be added',
    author: 'addition',
    likes: 5
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(400)

  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('blog without title cannot be added', async () => {
  const newBlog = {
    url: 'http://title.com',
    author: 'addition',
    likes: 5
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(400)

  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('blogs can be deleted', async () => {
  const blogsAtStart = await helper.blogInDb()
  const blogToDelete = blogsAtStart[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(204)

  const blogsAtEnd = await helper.blogInDb()

  const ids = blogsAtEnd.map(blog => blog.id)

  assert(!ids.includes(blogToDelete.id))
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
})

test('unique identifier property of the blog posts is named id', async () => {
  const response = await api.get('/api/blogs')

  response.body.forEach(blog => {
    assert(blog.id !== undefined)
    assert(blog._id === undefined)
  })
})

describe('when there is one user in the db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)

    const user = new User({
      username: 'root',
      passwordHash
    })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.userInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen'
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.username, newUser.username)

    const usersAtEnd = await helper.userInDb()

    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(user => user.username)

    assert(usernames.includes(newUser.username))
  })
})

after(async () => {
  await mongoose.connection.close()
})