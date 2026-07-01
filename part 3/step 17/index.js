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

// GET all persons

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

app.get('/info', (req, res) => {

  Person.countDocuments({}).then(count => { 
    res.send(`<p>Phonebook has info for ${count} people</p><p>${new Date()}</p>`)
  })

})

// POST a new person

app.post('/api/persons', (request, response,next) => {

  const body = request.body

  if (!body.name || !body.number) {

    return response.status(400).json({

      error: 'name must be unique'

    })

  }

 

  const person = new Person(
    {
    name: body.name,
    number: body.number,
  }
) 

  person.save().then(savedPerson => {

    response.json(savedPerson)

  })
    .catch(error => { next(error) })

})
// PUT update a person by ID
app.put('/api/persons/:id',(req,res)=>{
  const {number} =req.body
  Person.findByIdAndUpdate(req.params.id)
  .then(person=>{
    if(!person){
      return res.status(404).end()
    }
    person.number = number
   

    return person.save().then((updatedPerson)=>{
      res.json(updatedPerson)
    })
  })
  .catch(error=>next(error))
})

// DELETE a person by ID
app.delete('/api/persons/:id', (req, res, next) => {

  const id = req.params.id

  Person.findByIdAndDelete(id).then(result => {

    res.status(204).end()

  })

})

const errorHandler = (error, req, res, next) => {
  console.log(error.message)
  if(error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  }
  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT

app.listen(PORT, () => {

  console.log(`port ${PORT} running...`)

})