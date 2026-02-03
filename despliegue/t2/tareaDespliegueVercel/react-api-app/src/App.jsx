import { useState } from 'react'
import './App.css'

function App() {
  const [notes, setNotes] = useState([])
  const [noteText, setNoteText] = useState('')

  // Añadir una nueva nota
  const addNote = () => {
    if (noteText.trim() !== '') {
      const newNote = {
        id: Date.now(),
        text: noteText,
        date: new Date().toLocaleString()
      }
      setNotes([...notes, newNote])
      setNoteText('')
    }
  }

  // Eliminar una nota
  const deleteNote = (id) => {
    setNotes(notes.filter(note => note.id !== id))
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Gestor de Notas</h1>
        <p>Aplicación para gestionar notas</p>
      </header>

      <div className="note-input">
        <textarea
          placeholder="Escribe tu nota aquí..."
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          rows="4"
        />
        <button onClick={addNote} className="btn-add">
          Añadir Nota
        </button>
      </div>

      <div className="notes-container">
        <h2>Notas Creadas ({notes.length})</h2>
        {notes.length === 0 ? (
          <p className="empty-message">No hay notas aún.</p>
        ) : (
          <div className="notes-list">
            {notes.map((note) => (
              <div key={note.id} className="note-card">
                <p className="note-text">{note.text}</p>
                <div className="note-footer">
                  <span className="note-date">{note.date}</span>
                  <button
                    onClick={() => deleteNote(note.id)}
                    className="btn-delete"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <footer className="footer">
        <p>Víctor Manuel Ridao Chaves 2025/26</p>
      </footer>
    </div>
  )
}

export default App
