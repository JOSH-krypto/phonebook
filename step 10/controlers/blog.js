const blogRouter = require('express').Router()

const Blog = require('../models/blog')

blogRouter.get('/', async(req, res) => {
    const blogs= await Blog.find({})
    res.json(blogs)
})
blogRouter.post('/', (req, res, next) => {
    const body = req.body

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
    })

    blog.save()
        .then(savedBlog => {
            res.status(201).json(savedBlog)
        })
        .catch(error => {
            next(error)
        })
})
blogRouter.delete('/:id', (req, res, next) => {
    Blog.findByIdAndDelete(req.params.id)
        .then(() => {
            res.status(204).end()
        }).catch(error => next(error))
})
blogRouter.put('/:id', (req, res, next) => {
    const {title,author,url,likes} = req.body
  
    Blog.findById(req.params.id)
      .then(blog => {
        if (!blog) {
          return res.status(404).end()
        }
  
        blog.title = title
        blog.author = author
        blog.url = url
        blog.likes = likes
  
        return blog.save()
      })
      .then(updatedBlog => {
        res.json(updatedBlog)
      })
      .catch(error => next(error))
})
module.exports = blogRouter