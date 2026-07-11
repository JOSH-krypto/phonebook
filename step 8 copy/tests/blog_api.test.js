// const assert=require('node:assert')
const {test,after}=require('node:test')
const mongoose=require('mongoose')
const supertest=require('supertest')
const app=require('../app')

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