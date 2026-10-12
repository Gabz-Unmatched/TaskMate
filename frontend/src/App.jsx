
import { useEffect, useState } from 'react'
import './App.css'


const API = 'http://127.0.0.1:5000/api/assignments'


function App() {
  const [assignments, setAssignments] = useState([])
  const [title, setTitle] = useState('')
  const [subject, setSubject] = useState('')
  const [due, setDue] = useState('')
  const [priority, setPriority] = useState('Medium')
  const [filter, setFilter] = useState('All')
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState(null)

  async function loadAssignments() {
    try {
      const res = await fetch(API)
      if (!res.ok) throw new Error('Could not load assignments')

      const data = await res.json()
      setAssignments(data.map(a => ({
        ...a,
        due: a.deadline || '',
        completed: Boolean(a.completed)
      })))
      setError('')
    } catch {
      setError('Cannot connect to the backend. Check that the server is running.')
    }
  }

  useEffect(() => {
    loadAssignments()
  }, [])

  async function addAssignment(e) {
    e.preventDefault()

    try {
      const res = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          subject: subject.trim(),
          deadline: due,
          priority
        })
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Could not add assignment')
      }

      setTitle('')
      setSubject('')
      setDue('')
      setPriority('Medium')
      setError('')
      await loadAssignments()
    } catch (err) {
      setError(err.message)
    }
  }

  
function startEditing(a) {
  setEditingId(a.id)
  setTitle(a.title)
  setSubject(a.subject)
  setDue(a.due || '')
  setPriority(a.priority || 'Medium')
}

function cancelEditing() {
  setEditingId(null)
  setTitle('')
  setSubject('')
  setDue('')
  setPriority('Medium')
}

async function saveEdit(e) {
  e.preventDefault()

  try {
    const res = await fetch(`${API}/${editingId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: title.trim(),
        subject: subject.trim(),
        deadline: due,
        priority
      })
    })

    if (!res.ok) {
      const data = await res.json()
      throw new Error(data.error || 'Could not update assignment')
    }

    cancelEditing()
    setError('')
    await loadAssignments()
  } catch (err) {
    setError(err.message)
  }
}


  async function toggleComplete(a) {
    try {
      const res = await fetch(`${API}/${a.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !a.completed })
      })

      if (!res.ok) throw new Error('Could not update assignment')
      await loadAssignments()
    } catch (err) {
      setError(err.message)
    }
  }

  async function deleteAssignment(id) {
    try {
      const res = await fetch(`${API}/${id}`, {
        method: 'DELETE'
      })

      if (!res.ok) throw new Error('Could not delete assignment')
      await loadAssignments()
    } catch (err) {
      setError(err.message)
    }
  }

  const visibleAssignments = assignments.filter(a => {
    if (filter === 'Pending') return !a.completed
    if (filter === 'Completed') return a.completed
    return true
  })

  const pending = assignments.filter(a => !a.completed).length
  const completed = assignments.filter(a => a.completed).length

  return (
    <div className="app">
      <aside className="sidebar">
        <h2 className="brand">Task<span>Mate</span></h2>
        <p className="sidebar-label">WORKSPACE</p>
        <p className="nav-item active">▦ &nbsp; Dashboard</p>
        <p className="nav-item">▤ &nbsp; Assignments</p>
        <div className="sidebar-bottom">
          Student workspace<br />
          <span>Stay on top of your work.</span>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <p className="eyebrow">STUDENT WORKSPACE</p>
            <h1>Dashboard</h1>
          </div>
          <div className="avatar">S</div>
        </header>

        <section className="welcome">
          <div>
            <p className="eyebrow">YOUR ACADEMIC ORGANIZER</p>
            <h2>Make every deadline count.</h2>
            <p>Keep your assignments organised and your progress in sight.</p>
          </div>
          <div className="welcome-icon">✓</div>
        </section>

        {error && <p role="alert" style={{ color: 'crimson' }}>{error}</p>}

        <section className="stats">
          <div className="stat-card">
            <span>Total assignments</span>
            <strong>{assignments.length}</strong>
            <small>Across all subjects</small>
          </div>
          <div className="stat-card">
            <span>Pending</span>
            <strong>{pending}</strong>
            <small>Still to complete</small>
          </div>
          <div className="stat-card">
            <span>Completed</span>
            <strong>{completed}</strong>
            <small>Work finished</small>
          </div>
        </section>

        <section className="content-grid">
          <div className="panel">
            <div className="panel-heading">
              <div>
                <h3>Your assignments</h3>
                <p>Track and manage your academic work.</p>
              </div>
              <select
                value={filter}
                onChange={e => setFilter(e.target.value)}
                aria-label="Filter assignments"
              >
                <option>All</option>
                <option>Pending</option>
                <option>Completed</option>
              </select>
            </div>

            <div className="assignment-list">
              {visibleAssignments.length === 0 && (
                <p className="empty">No assignments here yet.</p>
              )}

              {visibleAssignments.map(a => (
                <article className="assignment" key={a.id}>
                  <button
                    className={`check ${a.completed ? 'checked' : ''}`}
                    onClick={() => toggleComplete(a)}
                    aria-label="Toggle completion"
                  >
                    {a.completed ? '✓' : ''}
                  </button>

                  <div className="assignment-info">
                    <strong className={a.completed ? 'done' : ''}>
                      {a.title}
                    </strong>
                    <span>{a.subject} · Due {a.due || 'Not set'}</span>
                  </div>

                  <span className={`priority ${a.priority.toLowerCase()}`}>
                    {a.priority}
                  </span>

                  <button
                    type="button"
                    onClick={() => startEditing(a)}
                    aria-label="Edit assignment"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className="delete"
                    onClick={() => deleteAssignment(a.id)}
                    aria-label="Delete assignment"
                  >
                    ×
                  </button>
                </article>
              ))}
            </div>
          </div>

          <div className="panel form-panel">
            <h3>Add an assignment</h3>
            <p>Enter the details below to add a task.</p>

            <form onSubmit={editingId !== null ? saveEdit : addAssignment}>
              <label>
                Assignment title
                <input
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Finish lab report"
                  required
                />
              </label>

              <label>
                Subject
                <input
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  placeholder="e.g. DBMS"
                  required
                />
              </label>

              <label>
                Deadline
                <input
                  type="date"
                  value={due}
                  onChange={e => setDue(e.target.value)}
                  required
                />
              </label>

              <label>
                Priority
                <select
                  value={priority}
                  onChange={e => setPriority(e.target.value)}
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </label>

              <button className="add-button" type="submit">
              {editingId !== null ? 'Save changes' : '+ Add assignment'}
            </button>

            {editingId !== null && (
              <button type="button" onClick={cancelEditing}>
                Cancel edit
              </button>
            )}
            </form>
          </div>
        </section>

        <footer>TaskMate · A simpler way to manage student life.</footer>
      </main>
    </div>
  )
}

export default App
