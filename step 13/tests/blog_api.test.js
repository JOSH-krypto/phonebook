const assert=require('node:assert')
const {test,after, beforeEach}=require('node:test')
const mongoose=require('mongoose')
const supertest=require('supertest')
const app=require('../app')
const helper=require('./blog_helper')
const Blog=require('../models/blog')

const api=supertest(app)

beforeEach(async ()=>{
    await Blog.deleteMany({})
    let blogObject= new Blog(helper.initialBlogs[0])
    await blogObject.save()
    blogObject= new Blog(helper.initialBlogs[1])
    await blogObject.save()
})

test('blogs are  returned in JSON format',async()=>{
    await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})
after(async()=>{
    await mongoose.connection.close()
})

test('blogs can be added',async()=>{
    const newBlog={
        title: 'test for POST route',
        author: 'Tester',
        url: 'http://example.com',
        likes:5,
    }
    await api
    .post('/api/blogs') 
    .send(newBlog)
    .expect(201)
    .expect('Content-Type',/application\/json/)

    const response=await api.get('/api/blogs')
    const blogs=response.body.map(m=>m.title)

    assert.strictEqual(response.body.length,helper.initialBlogs.length+1)
    assert(blogs.includes('test for POST route'))

})

test('likes default',async ()=>{
    
    const newBlog={
            title:'Are likes there',
            author:'likes',
            url:'http://likes.com',
            
        }

    await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type',/application\/json/)

    const response=await api.get('/api/blogs')
    const createdBlog=response.body.find(
        blog => blog.title==='Are likes there'
    )

    assert.strictEqual(createdBlog.likes,0)
})

test('blog without url cannot  be added',async()=>{
    const newBlog={
            title:'blogs can be added',
            author:'addition',
            likes:5
            
        }

    await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

    const response=await api.get('/api/blogs')

    assert.strictEqual(response.body.length,helper.initialBlogs.length)
})
test('blog without title cannot  be added',async()=>{
    const newBlog={
            url:'http://title.com',
            author:'addition',
            likes:5
            
        }

    await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

    const response=await api.get('/api/blogs')

    assert.strictEqual(response.body.length,helper.initialBlogs.length)
})

test('blogs can be deleted',async()=>{
     const blogAtStart=await helper.blogInDb()
     const blogToDelete=blogAtStart[0]

     await api
     .delete(`/api/blogs/${blogToDelete.id}`)
     .expect(204)

     const blogAtEnd=await helper.blogInDb()

     const ids=blogAtEnd.map(n=>n.id)
     assert(!ids.includes(blogToDelete.id))

     assert.strictEqual(blogAtEnd.length,helper.initialBlogs.length-1)
})

test('unique identifier property of the blog posts is names id',async()=>{
    const response=await api.get('/api/blogs')
    const blogs=response.body
    blogs.forEach(blog=>{
        assert(blog.id !== undefined)
        assert(blog._id === undefined)
    })
})
  