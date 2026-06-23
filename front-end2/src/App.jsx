import { useState, useEffect } from 'react'
import Footer from './component/Footer.jsx'
import axios from 'axios'
import Note from './component/note.jsx'
import noteService from './services/notes'
import Notification from './component/Notification.jsx'


const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState('some error happened...')


  useEffect(() => {
    noteService
      .getAll()
      .then(initialNotes => {
        // console.log("initialNotes =", initialNotes)
        // console.log("isArray(initialNotes) =", Array.isArray(initialNotes))
        setNotes(initialNotes)
      })
  }, [])

  const toggleImportanceOf = id => {
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }
    noteService
      .update(id, changedNote)
      .then(response => {
        setNotes(notes.map(note => note.id === id ? response.data : note))
      })
      .catch(error => {
        setErrorMessage(`Note '${note.content}' was already removed from server`)

        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)

        setNotes(notes.filter(n => n.id !== id))
      })
  }
  const addNote = (event) => {
    event.preventDefault()
    const noteObject = {
      content: newNote,
      important: Math.random() < 0.5,
      
    }


    noteService
      .create(noteObject)
      .then(response => {
        setNotes(notes.concat(response.data))
        setNewNote('')
      })
  }

  const handleNoteChange = (event) => {
    setNewNote(event.target.value)
  }
  const notesToShow = showAll ? notes : notes.filter(note => note.important)
  // console.log("notes =", notes)
  // console.log("type =", typeof notes)
  // console.log("isArray =", Array.isArray(notes))
  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>

      <ul>
        {
          notesToShow.map(note =>
            <Note key={note.id} note={note}
              toggleImportance={() => toggleImportanceOf(note.id)} />

          )}

      </ul>
      <form onSubmit={addNote}>
        <input value={newNote}
          placeholder="Add New Note"
          onChange={handleNoteChange}
        />
        <button type="submit">save</button>
      </form>
      <Footer />
    </div>
  )
}

export default App
