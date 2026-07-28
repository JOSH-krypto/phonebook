const jwt = require('jsonwebtoken')
const blogRouter = require('express').Router()

const Blog = require('../models/blog')
const User = require('../models/users')

blogRouter.get('/', async (req, res) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    res.json(blogs)
})
blogRouter.post('/', async (req, res, next) => {
    const body = req.body

    try {
        const user = req.user
        if (!user) {
            return res.status(401).json({ error: 'token missing or invalid' })
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
    } catch (error) {
        next(error)
    }
})

blogRouter.delete('/:id', async (req, res, next) => {
    try {
        const user = req.user
        if (!user) {
            return res.status(401).json({ error: 'token missing or invalid' })
        }

        const blog = await Blog.findById(req.params.id)
        if (!blog) {
            return res.status(404).end()
        }

        // blog.user is an ObjectId (or populated object) — compare as strings
        const blogUserId = (blog.user && blog.user.toString) ? blog.user.toString() : String(blog.user)

        if (blogUserId !== user.id && blogUserId !== String(user._id)) {
            // user not the creator
            return res.status(403).json({ error: 'forbidden: only the creator can delete the blog' })
        }

        await Blog.findByIdAndDelete(req.params.id)
        res.status(204).end()
    } catch (error) {
        next(error)
    }
})

blogRouter.delete('/:id', async (req, res, next) => {
    try {
        if (!req.token) {
            return res.status(401).json({ error: 'token missing' })
        }

        const decodedToken = jwt.verify(req.token, process.env.SECRET)
        if (!decodedToken.id) {
            return res.status(401).json({ error: 'token invalid' })
        }

        const blog = await Blog.findById(req.params.id)
        if (!blog) {
            return res.status(404).end()
        }

        // blog.user is an ObjectId (or populated object) — compare as strings
        const blogUserId = (blog.user && blog.user.toString) ? blog.user.toString() : String(blog.user)

        if (blogUserId !== decodedToken.id) {
            // token valid but user not the creator
            return res.status(403).json({ error: 'forbidden: only the creator can delete the blog' })
        }

        await Blog.findByIdAndDelete(req.params.id)
        res.status(204).end()
    } catch (error) {
        next(error)
    }
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