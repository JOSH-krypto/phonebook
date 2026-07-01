require('dotenv').config()

const mongoose = require('mongoose')

const express = require('express')

const morgan = require('morgan')

const cors = require('cors')

const Person = require('./models/person.js')

console.log('connecting to', process.env.MONGODB_URI)

mongoose.set('strictQuery', false)

mongoose.connect(process.env.MONGODB_URI, { family: 4 })

  .then(result => {

    console.log('connected to MongoDB')

  })

  .catch(error => {

    console.log('error connecting to MongoDB:', error.message)

  })

// const personSchema = new mongoose.Schema({

//   name: String,

//   number: String,

// })

const app = express()

app.use(cors())

app.use(express.static('dist'))

app.use(express.json())

morgan.token('body', (req) => {

  return req.method === 'POST' ? JSON.stringify(req.body) : ''

})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

// let persons = [

//     {

//       "id": "1",

//       "name": "Arto Hellas",

//       "number": "040-123456"

//     },

//     {

//       "id": "2",

//       "name": "Ada Lovelace",

//       "number": "39-44-5323523"

//     },

//     {

//       "id": "3",

//       "name": "Dan Abramov",

//       "number": "12-43-234345"

//     },

//     {

//       "id": "4",

//       "name": "Mary Poppendieck",

//       "number": "39-23-6423122"

//     }

// ]

app.get('/api/persons', (req, res) => {

  Person.find({}).then(persons => {

    res.json(persons)

  })

})

app.get('/api/persons/:id', (req, res) => {

  const id = req.params.id

  Person.findById(id).then(person => {

    if (person) {

      res.json(person)

    } else {

      res.status(404).end()

    }

  })

}

)

app.delete('/api/persons/:id', (req, res) => {

  const id = req.params.id

  Person.findByIdAndDelete(id).then(result => {

    res.status(204).end()

  })

})

const generateId = () => {

  const maxId = persons.length > 0

    ? Math.max(...persons.map(p => Number(p.id)))

    : 0

  return String(maxId + 1)

}

app.post('/api/persons', (request, response) => {

  const body = request.body

  if (!body.name || !body.number) {

    return response.status(400).json({

      error: 'name must be unique'

    })

  }

  if (persons.some(p => p.name === body.name)) {

    return response.status(400).json({

      error: 'name must be unique'

    })

  }

  const person = {

    name: body.name,

    number: body.number,

    id: generateId(),

  }

  person.save().then(savedPerson => {

    response.json(savedPerson)

  })

})

const PORT = process.env.PORT

app.listen(PORT, () => {

  console.log(`port ${PORT} running...`)

})