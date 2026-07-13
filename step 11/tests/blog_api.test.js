const assert=require('node:assert')
const {test,after, beforeEach}=require('node:test')
const mongoose=require('mongoose')
const supertest=require('supertest')
const app=require('../app')
const Blog=require('../models/blog')
const blog = require('../models/blog')

const api=supertest(app)

const initialBlogs=[
    {
        title: 'test for GET route',
        author:'tester_1',
        url:'http://tester1.com',
        likes:10
    },
       {
        title: 'test for GET route',
        author:'tester_2',
        url:'http://tester2.com',
        likes:12
    },
]

beforeEach(async ()=>{
    await Blog.deleteMany({})
    let blogObject= new Blog(initialBlogs[0])
    await blogObject.save()
    blogObject= new Blog(initialBlogs[1])
    await blogObject.save()
})

test('notes are  returned in JSON format',async()=>{
    await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})
after(async()=>{
    await mongoose.connection.close()
})

test('notes can be added',async()=>{
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

    assert.strictEqual(response.body.length,initialBlogs.length+1)
    assert(blogs.includes('test for POST route'))

})

test.only('likes default',async ()=>{
    
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
test('unique identifier property of the blog posts is names id',async()=>{
    const response=await api.get('/api/blogs')
    const blogs=response.body
    blogs.forEach(blog=>{
        assert(blog.id !== undefined)
        assert(blog._id === undefined)
    })
})
