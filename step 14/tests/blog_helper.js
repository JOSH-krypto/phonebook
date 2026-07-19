const Blog=require('../models/blog')
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

const nonExistingId=async ()=>{
    const blog=new Blog({ content:'willremovethissoon'})
    await blog.save()
    await blog.deleteOne()

    return blog._id.toString()
}

const blogInDb=async()=>{
    const blog=await Blog.find({})
    return blog.map(blog => blog.toJSON())
}

module.exports={
    initialBlogs,
    nonExistingId,
    blogInDb
}