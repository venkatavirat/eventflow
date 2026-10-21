const CATEGORIES = ['All', 'Work', 'Personal', 'Study']

export default function FilterBar({ activeCategory, onCategoryChange, search, onSearchChange }) {
  return (
    <div className="filter-bar">
      <div className="filter-tabs" role="tablist" aria-label="Filter events by category">
        {CATEGORIES.map((category) => (
          <button
            key={category}
            className={`filter-tab ${activeCategory === category ? 'active' : ''}`}
            type="button"
            role="tab"
            aria-selected={activeCategory === category}
            onClick={() => onCategoryChange(category)}
          >
            {category}
          </button>
        ))}
      </div>
      <label className="search-box">
        <svg viewBox="0 0 20 20" aria-hidden="true">
          <circle cx="8.8" cy="8.8" r="5.8" />
          <path d="m13.2 13.2 4 4" />
        </svg>
        <span className="visually-hidden">Search events</span>
        <input
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search your events..."
        />
        <kbd>/</kbd>
      </label>
    </div>
  )
}
