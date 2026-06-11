const express=require('express')
const app=express()

const persons = [
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

app.get('/info', (req, res) => {
  const timeReceived = new Date().toLocaleString() 
  const count = persons.length                     

  res.send(`
    <h2>Phonebook Info</h2>
    <p>Phonebook has info for ${count} people</p>
    <p>Request received at: ${timeReceived}</p>
  `)
})

const PORT = 3001
app.listen(PORT,()=>{
    console.log(`port ${PORT} running...`)
})