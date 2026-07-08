const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})
test('of empty list is zero', () => {
  const blogs = []
  const result = listHelper.totalLikes(blogs)
  assert.strictEqual(result, 0)
})

describe('total likes', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0
    }
  ]

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    assert.strictEqual(result, 5)
  })
})
describe('total likes', () => {
  const listWithManyBlogs = [
    {
      _id: '5ahfbabfhe3322njfjf33',
       title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0
    },
    {
      _id: '5ahfbabfhe3322njfjf34',
      title: 'JSON.stringify considered harmful',
      author: 'Douglas Crockford',
      url: 'https://www.crockford.com/wrrrld/json.html',
      likes: 10,
      __v: 0
    }
  ]
    test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithManyBlogs)
    assert.strictEqual(result, 15)
    })
})