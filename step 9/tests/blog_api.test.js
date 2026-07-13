const assert=require('node:assert')
const {test,after}=require('node:test')
const mongoose=require('mongoose')
const supertest=require('supertest')
const app=require('../app')
const Blog=require('../models/blog')

const api=supertest(app)

test('notes are  returned in JSON format',async()=>{
    await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})
after(async()=>{
    await mongoose.connection.close()
})

test('unique identifier property of the blog posts is names id',async()=>{
    const response=await api.get('/api/blogs')
    const blogs=response.body
    blogs.forEach(blog=>{
        assert(blog.id !== undefined)
        assert(blog._id === undefined)
    })
})