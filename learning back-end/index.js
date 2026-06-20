require('dotenv').config()

const mongoose = require('mongoose')
const express = require('express')
const cors = require('cors')
const Note = require('./models/notes')



mongoose.connect(process.env.MONGODB_URI, { family: 4 })
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })
mongoose.set('strictQuery',false)
mongoose.connect(process.env.MONGODB_URI, { family: 4 })

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

const app = express()
// const Note = mongoose.model('Note', noteSchema)
app.use(cors())
app.use(express.static('dist'))
app.use(express.json())

let notes = [
  {
    id: "1",
    content: "HTML is easy",
    important: true
  },
  {
    id: "2",
    content: "Browser can execute only JavaScript",
    important: false
  },
  {
    id: "3",
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true
  }
]


app.get('/api/notes',(request,response) =>{
  Note.find({}).then(notes =>{
      response.json(notes)
  })

})
app.get('/api/notes/:id', (request, response) => {
  const id = request.params.id
  const note = notes.find(note => note.id === id)
  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})
app.delete('/api/notes/:id', (request, response) => {
  const id = request.params.id
  notes = notes.filter(note => note.id !== id)

  response.status(204).end()
})

const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => Number(n.id)))
    : 0
  return String(maxId + 1)
}

app.post('/api/notes', (request, response) => {
  const body = request.body

  if (!body.content) {
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }

  const note = {
    content: body.content,
    important: body.important || false,
    id: generateId(),
  }

  note.save().then(savedNote=>{
    response.json(note)
  })

})

app.put('/api/notes',(req,res)=>{
  const id =req.params.id
  const body = req.body
  const noteUpdate ={
    content: body.content,
    important: body.important,
  }
  notes = notes.map(note => note.id === id ? noteUpdate : note)
  res.json(note)

})
const PORT = process.env.PORT
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
