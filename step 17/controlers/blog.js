const blogRouter = require('express').Router()

const Blog = require('../models/blog')
const User = require('../models/users')

blogRouter.get('/', async(req, res) => {
    const blogs= await Blog.find({})
    res.json(blogs)
})
blogRouter.post('/', async (req, res, next) => {
    try {
        const body = req.body || {}

        const blogData = {
            title: body.title,
            author: body.author,
            url: body.url,
            likes: body.likes || 0
        }

        // accept either body.user or body.userId when a client supplies a user reference
        if (body.user) blogData.user = body.user
        if (body.userId) blogData.user = body.userId

        const blog = new Blog(blogData)
        const savedBlog = await blog.save()

        // if the request included a user id, add the blog reference to that user (defensive)
        if (blog.user) {
            try {
                const user = await User.findById(blog.user)
                if (user) {
                    user.blogs = user.blogs.concat(savedBlog._id)
                    await user.save()
                }
            } catch (e) {
                // log but don't fail the request because blog is already saved
                console.error('Failed to update user with new blog:', e.message)
            }
        }

        res.status(201).json(savedBlog)
    } catch (error) {
        next(error)
    }
})
blogRouter.delete('/:id', async(req, res, next) => {
    await Blog.findByIdAndDelete(req.params.id)
          res.status(204).end()
})
blogRouter.put('/:id', async(req, res, next) => {
    const {title,author,url,likes} = req.body
  
    const blog=await Blog.findById(req.params.id)
        if (!blog) {
          return res.status(404).end()
        }
  
        blog.title = title
        blog.author = author
        blog.url = url
        blog.likes = likes
  
         const updatedBlog=await  blog.save()
        res.json(updatedBlog)

      .catch(error => next(error))
})
module.exports = blogRouter