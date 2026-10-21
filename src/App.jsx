import { useMemo, useState } from 'react'
import EventFormModal from './components/EventFormModal.jsx'
import EventList from './components/EventList.jsx'
import FilterBar from './components/FilterBar.jsx'
import Navbar from './components/Navbar.jsx'
import useLocalStorage from './hooks/useLocalStorage.js'

function createId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID()
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export default function App() {
  const [events, setEvents] = useLocalStorage('eventflow-events', [])
  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [modalEvent, setModalEvent] = useState(null)
  const [isCreating, setIsCreating] = useState(false)

  const filteredEvents = useMemo(() => {
    const query = search.trim().toLowerCase()
    return [...events]
      .filter((event) => activeCategory === 'All' || event.category === activeCategory)
      .filter((event) => !query || `${event.title} ${event.description}`.toLowerCase().includes(query))
      .sort((first, second) => first.date.localeCompare(second.date))
  }, [events, activeCategory, search])

  const activeCount = events.filter((event) => !event.completed).length

  function saveEvent(eventDetails) {
    if (modalEvent) {
      setEvents((current) => current.map((event) =>
        event.id === modalEvent.id ? { ...event, ...eventDetails } : event,
      ))
    } else {
      setEvents((current) => [...current, { ...eventDetails, id: createId(), completed: false }])
    }
    closeModal()
  }

  function closeModal() {
    setModalEvent(null)
    setIsCreating(false)
  }

  function deleteEvent(id) {
    setEvents((current) => current.filter((event) => event.id !== id))
  }

  function toggleComplete(id) {
    setEvents((current) => current.map((event) =>
      event.id === id ? { ...event, completed: !event.completed } : event,
    ))
  }

  return (
    <div className="app-shell">
      <Navbar activeCount={activeCount} />
      <main className="main-content">
        <section className="welcome-section">
          <div className="welcome-copy">
            <span className="eyebrow"><span className="sparkle">✳</span> YOUR SPACE TO GET THINGS DONE</span>
            <h1>Make room for<br /><span>what matters.</span></h1>
            <p>All your plans, in one calm, organized place.</p>
          </div>
          <div className="welcome-art" aria-hidden="true">
            <div className="art-orbit orbit-one" />
            <div className="art-orbit orbit-two" />
            <div className="art-calendar">
              <div className="art-calendar-head"><i /><i /><i /></div>
              <div className="art-calendar-grid">
                <b /><b /><b /><b /><b /><b /><b /><b /><b /><b /><b /><b />
              </div>
            </div>
            <div className="art-spark art-spark-one">✳</div>
            <div className="art-spark art-spark-two">✦</div>
            <div className="art-check"><svg viewBox="0 0 20 20"><path d="m5 10 3.2 3.2L15 6.5" /></svg></div>
          </div>
          <button className="button button-primary add-event-button" type="button" onClick={() => setIsCreating(true)}>
            <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 4v12M4 10h12" /></svg>
            Add an event
          </button>
        </section>

        <section className="events-section" aria-labelledby="events-heading">
          <div className="section-heading">
            <div>
              <span className="eyebrow">YOUR PLANS</span>
              <h2 id="events-heading">Events <span className="event-count">{events.length}</span></h2>
            </div>
            <p className="section-caption">One step at a time. You’ve got this.</p>
          </div>

          <FilterBar
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            search={search}
            onSearchChange={setSearch}
          />
          <EventList
            events={filteredEvents}
            onEdit={setModalEvent}
            onDelete={deleteEvent}
            onToggleComplete={toggleComplete}
            hasEvents={events.length > 0}
          />
        </section>
        <footer className="page-footer">
          <span>Made for your next big thing <span aria-hidden="true">✦</span></span>
          <span>EVENTFLOW © 2026</span>
        </footer>
      </main>

      {(isCreating || modalEvent) && (
        <EventFormModal event={modalEvent} onClose={closeModal} onSave={saveEvent} />
      )}
    </div>
  )
}
