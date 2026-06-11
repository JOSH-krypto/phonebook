import { useState, useEffect } from 'react'
import personServices from './services/person'
import Notification from './Components/Notification'
//  Filter
const Filter = ({ value, onChange }) => (
  <div>
    filter shown with: <input value={value} onChange={onChange} />
  </div>
)

// 🔹 Form
const PersonForm = ({
  onSubmit,
  newName,
  onNameChange,
  newNumber,
  onNumberChange
}) => (
  <form onSubmit={onSubmit}>
    <div>
      name: <input value={newName} onChange={onNameChange} />
    </div>
    <div>
      number: <input value={newNumber} onChange={onNumberChange} />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
)

//  List
const Persons = ({ persons, handleDelete }) => (
  <ul>
    {persons.map(person => (
      <li key={person.id}>
        {person.name} {person.number}
        <button onClick={() => handleDelete(person.id)}>delete</button>
      </li>
    ))}
  </ul>
)

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState('success')

  //  GET (fetch data)
  useEffect(() => {
    personServices.getAll().then(response => {
      setPersons(response.data)
    })
  }, [])

  //  DELETE
  const handleDelete = (id) => {
    const person = persons.find(p => p.id === id)

    if (!person) return

    if (window.confirm(`Delete ${person.name}?`)) {
      personServices
        .deleteContact(id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== id))
        })
        .catch(() => {
          alert("Error deleting person")
        })
    }
  }

  // ADD / UPDATE
  const handleSubmit = (e) => {
    e.preventDefault()

    if (newName.trim() === '' || newNumber.trim() === '') {
      alert("Name or number cannot be empty")
      return
    }

    const existingPerson = persons.find(
      p => p.name.toLowerCase() === newName.toLowerCase()
    )

    // UPDATE
    if (existingPerson) {
      if (window.confirm(`${newName} is already added. Replace the old number?`)) {
        const updatedPerson = {
          ...existingPerson,
          number: newNumber
        }

        personServices
          .update(existingPerson.id, updatedPerson)
          .then(response => {
            setPersons(persons.map(p =>
              p.id === existingPerson.id ? response.data : p
            ))
            setNewName('')
            setNewNumber('')

            setMessage(`Updated ${response.data.name}`)
            setMessageType('success')

            setTimeout(() => {
              setMessage(null)
            }, 3000)
          })
          .catch(() => {
            setMessage("Error updating person")
            setMessageType('error')

            setTimeout(() => setMessage(null), 3000)
          })
      }
      return
    }

    //  CREATE
    const newPerson = {
      name: newName,
      number: newNumber
    }

    personServices
      .create(newPerson)
      .then(response => {
        setPersons(prev => prev.concat(response.data))
        setNewName('')
        setNewNumber('')

        setMessage(`Added ${response.data.name}`)
        setMessageType('success')

        setTimeout(() => {
          setMessage(null)
        }, 3000)
      })
      .catch(() => {
        setMessage("Error adding person")
        setMessageType('error')

        setTimeout(() => setMessage(null), 3000)
      })
  }

  //  FILTER
  const personsToShow = filter
    ? persons.filter(p =>
      p.name.toLowerCase().includes(filter.toLowerCase())
    )
    : persons

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} type={messageType} />
      <Filter
        value={filter}
        onChange={e => setFilter(e.target.value)}
      />

      <h3>Add a new</h3>
      <PersonForm
        onSubmit={handleSubmit}
        newName={newName}
        onNameChange={e => setNewName(e.target.value)}
        newNumber={newNumber}
        onNumberChange={e => setNewNumber(e.target.value)}
      />

      <h3>Numbers</h3>
      <Persons
        persons={personsToShow}
        handleDelete={handleDelete}
      />
    </div>
  )
}

export default App