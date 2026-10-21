import { useEffect, useState } from 'react'

const EMPTY_FORM = {
  title: '',
  description: '',
  date: '',
  category: 'Work',
}

export default function EventFormModal({ event, onClose, onSave }) {
  const [form, setForm] = useState(() => event ? { ...event } : { ...EMPTY_FORM })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    function handleKeyDown(keyEvent) {
      if (keyEvent.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
    if (errors[field]) setErrors((current) => ({ ...current, [field]: '' }))
  }

  function handleSubmit(submitEvent) {
    submitEvent.preventDefault()
    const nextErrors = {}

    if (!form.title.trim()) nextErrors.title = 'Please give your event a title.'
    if (!form.date) nextErrors.date = 'Please choose a date for your event.'

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    onSave({
      ...form,
      title: form.title.trim(),
      description: form.description.trim(),
    })
  }

  return (
    <div className="modal-backdrop" onMouseDown={(eventClick) => {
      if (eventClick.target === eventClick.currentTarget) onClose()
    }}>
      <section
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="modal-heading">
          <div>
            <span className="eyebrow">{event ? 'MAKE A CHANGE' : 'PLAN SOMETHING'}</span>
            <h2 id="modal-title">{event ? 'Edit your event' : 'Create an event'}</h2>
            <p>A little planning goes a long way.</p>
          </div>
          <button className="icon-button close-button" type="button" onClick={onClose} aria-label="Close dialog">
            <svg viewBox="0 0 20 20" aria-hidden="true"><path d="m5 5 10 10M15 5 5 15" /></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <label className="field-label" htmlFor="event-title">Event title <span>*</span></label>
          <input
            id="event-title"
            className={`form-input ${errors.title ? 'has-error' : ''}`}
            type="text"
            placeholder="e.g. Design project check-in"
            value={form.title}
            onChange={(changeEvent) => updateField('title', changeEvent.target.value)}
            aria-invalid={Boolean(errors.title)}
            aria-describedby={errors.title ? 'title-error' : undefined}
            autoFocus
          />
          {errors.title && <p className="field-error" id="title-error">{errors.title}</p>}

          <label className="field-label field-label-spaced" htmlFor="event-description">
            Description <span className="optional-label">OPTIONAL</span>
          </label>
          <textarea
            id="event-description"
            className="form-input form-textarea"
            placeholder="Add a few details to remember..."
            rows="3"
            value={form.description}
            onChange={(changeEvent) => updateField('description', changeEvent.target.value)}
          />

          <div className="form-row">
            <div className="form-column">
              <label className="field-label" htmlFor="event-date">Date <span>*</span></label>
              <input
                id="event-date"
                className={`form-input ${errors.date ? 'has-error' : ''}`}
                type="date"
                value={form.date}
                onChange={(changeEvent) => updateField('date', changeEvent.target.value)}
                aria-invalid={Boolean(errors.date)}
                aria-describedby={errors.date ? 'date-error' : undefined}
              />
              {errors.date && <p className="field-error" id="date-error">{errors.date}</p>}
            </div>
            <div className="form-column">
              <label className="field-label" htmlFor="event-category">Category</label>
              <select
                id="event-category"
                className="form-input form-select"
                value={form.category}
                onChange={(changeEvent) => updateField('category', changeEvent.target.value)}
              >
                <option>Work</option>
                <option>Personal</option>
                <option>Study</option>
              </select>
            </div>
          </div>

          <div className="modal-actions">
            <button className="button button-secondary" type="button" onClick={onClose}>Cancel</button>
            <button className="button button-primary" type="submit">
              {event ? 'Save changes' : 'Create event'}
              <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 10h12m-5-5 5 5-5 5" /></svg>
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}
