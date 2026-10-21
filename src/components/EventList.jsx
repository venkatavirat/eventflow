import EventCard from './EventCard.jsx'

export default function EventList({ events, onEdit, onDelete, onToggleComplete, hasEvents }) {
  if (events.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-illustration" aria-hidden="true">
          <svg viewBox="0 0 96 96" fill="none">
            <rect x="17" y="21" width="62" height="58" rx="12" fill="#edf2ff" />
            <path d="M17 37h62" stroke="#d2ddf7" strokeWidth="3" />
            <path d="M33 15v13M63 15v13" stroke="#7489bd" strokeWidth="4" strokeLinecap="round" />
            <rect x="29" y="47" width="12" height="11" rx="3" fill="#879ee0" />
            <rect x="48" y="47" width="12" height="11" rx="3" fill="#d9e2fa" />
            <rect x="29" y="63" width="12" height="9" rx="3" fill="#d9e2fa" />
            <circle cx="73" cy="70" r="13" fill="#fff" stroke="#f1d895" strokeWidth="3" />
            <path d="M68 70h10M73 65v10" stroke="#d5a63d" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>
        <h3>{hasEvents ? 'No events found' : 'Your calendar is wide open'}</h3>
        <p>
          {hasEvents
            ? 'Try a different search or category to find what you’re looking for.'
            : 'Add your first event and start making room for what matters.'}
        </p>
      </div>
    )
  }

  return (
    <div className="event-grid">
      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleComplete={onToggleComplete}
        />
      ))}
    </div>
  )
}
