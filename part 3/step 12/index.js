const express=require('express')
const morgan = require('morgan')
const cors =require('cors')
const app=express()

app.use(cors())
app.use(express.static('dist'))
// const requestLogger = (request, response, next) => {
//   console.log('Method:', request.method)
//   console.log('Path:  ', request.path)
//   console.log('Body:  ', request.body)
//   console.log('---')
//   next()
// }

// app.use(requestLogger)
app.use(express.json())
// app.use(morgan('tiny')) 

morgan.token('body', (req) =>{
  return req.method === 'POST' ? JSON.stringify(req.body) : ''  
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))  


let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]
app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
  const id =req.params.id
  const person=persons.find(person =>person.id === id) 
  
  if(person){
    res.json(person)
  } else{
    res.status(404).end()
  }
})

app.delete('/api/persons/:id',(req,res) =>{
  const id =req.params.id
  persons=persons.filter(person =>person.id !==id)
  res.status(204).end()
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

  persons = persons.concat(person)

    response.json(person)
})

// const unknownEndpoint=(req,res)=>{
//   res.status(404).send({error:'unknown endpoint'})
// }
// app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT,()=>{
    console.log(`port ${PORT} running...`)
})