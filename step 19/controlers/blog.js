const jwt = require('jsonwebtoken')
const blogRouter = require('express').Router()

const Blog = require('../models/blog')
const User = require('../models/users')
const getTokenFrom = request => {
    const authoirization = request.get('authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
        return authorization.replace('Bearer ', '')
    }
    return null
}

blogRouter.get('/', async (req, res) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    res.json(blogs)
})
blogRouter.post('/', async (req, res, next) => {
    const body = req.body

    const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
    if (!decodedToken.id) {
        return response.status(401).json({ error: 'token invalid' })
    }
    const user = await User.findById(decodedToken.id)
    const user = await User.findById(body.userId)
    
    if (!user) {
        return res.status(400).json({ error: 'invalid userid' })
    }
    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
        user: user._id
    })

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    res.status(201).json(savedBlog)
})

blogRouter.delete('/:id', async (req, res, next) => {
    await Blog.findByIdAndDelete(req.params.id)
    res.status(204).end()
})
blogRouter.put('/:id', async (req, res, next) => {
    const { title, author, url, likes } = req.body

    const blog = await Blog.findById(req.params.id)
    if (!blog) {
        return res.status(404).end()
    }

    blog.title = title
    blog.author = author
    blog.url = url
    blog.likes = likes

    const updatedBlog = await blog.save()
    res.json(updatedBlog)

        .catch(error => next(error))
})
module.exports = blogRouter