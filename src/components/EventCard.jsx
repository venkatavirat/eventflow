function formatDate(dateString) {
  const [year, month, day] = dateString.split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default function EventCard({ event, onEdit, onDelete, onToggleComplete }) {
  return (
    <article className={`event-card ${event.completed ? 'event-card-completed' : ''}`}>
      <div className="card-topline">
        <span className={`category-badge category-${event.category.toLowerCase()}`}>
          <span className="category-dot" />
          {event.category}
        </span>
        <button
          className={`complete-button ${event.completed ? 'is-complete' : ''}`}
          type="button"
          onClick={() => onToggleComplete(event.id)}
          aria-label={event.completed ? `Mark ${event.title} as upcoming` : `Mark ${event.title} as complete`}
          title={event.completed ? 'Mark as upcoming' : 'Mark as complete'}
        >
          <svg viewBox="0 0 20 20" aria-hidden="true"><path d="m5 10 3.2 3.2L15 6.5" /></svg>
        </button>
      </div>
      <h3 className="event-title">{event.title}</h3>
      {event.description && <p className="event-description">{event.description}</p>}
      <div className="event-date">
        <svg viewBox="0 0 20 20" aria-hidden="true">
          <rect x="3.5" y="5" width="13" height="12" rx="2" />
          <path d="M6.5 3.5v3M13.5 3.5v3M3.5 8.5h13" />
        </svg>
        <span>{formatDate(event.date)}</span>
        {event.completed && <span className="completed-label">Completed</span>}
      </div>
      <div className="card-actions">
        <button type="button" className="text-action" onClick={() => onEdit(event)}>
          <svg viewBox="0 0 20 20" aria-hidden="true"><path d="m12.7 4.3 3 3M4 16l3.5-.7L16.4 6.4a2.1 2.1 0 0 0-3-3L4.7 12 4 16Z" /></svg>
          Edit
        </button>
        <button type="button" className="text-action delete-action" onClick={() => onDelete(event.id)}>
          <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4.5 6h11M8 6V4h4v2m2.5 0-.7 10H6.2L5.5 6m3 3v4m3-4v4" /></svg>
          Delete
        </button>
      </div>
    </article>
  )
}
