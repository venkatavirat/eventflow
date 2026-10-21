export default function Navbar({ activeCount }) {
  return (
    <header className="site-header">
      <a className="brand" href="#" aria-label="EventFlow home">
        <span className="brand-mark" aria-hidden="true">
          <svg viewBox="0 0 36 36" fill="none">
            <rect x="2" y="2" width="32" height="32" rx="11" fill="currentColor" />
            <path
              d="M11 18.5 15.5 23 25 13.5"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <span className="brand-name">eventflow<span>.</span></span>
      </a>
      <div className="header-note">
        <span className="header-note-dot" />
        <span>You have</span>
        <strong>{activeCount} {activeCount === 1 ? 'upcoming event' : 'upcoming events'}</strong>
      </div>
    </header>
  )
}
