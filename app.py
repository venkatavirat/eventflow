from datetime import date
from pathlib import Path

import click
from flask import Flask, abort, redirect, render_template, request, url_for
from flask_sqlalchemy import SQLAlchemy


app = Flask(__name__)
Path(app.instance_path).mkdir(parents=True, exist_ok=True)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///eventflow.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)

CATEGORIES = ("Work", "Personal", "Study")


class Event(db.Model):
    __tablename__ = "event"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=True)
    date = db.Column(db.Date, nullable=False)
    category = db.Column(db.String(32), nullable=False, default="Personal")


def event_form_data(event=None):
    """Return submitted values and validation errors for the event form."""
    values = {
        "title": request.form.get("title", event.title if event else ""),
        "description": request.form.get(
            "description", event.description if event else ""
        ),
        "date": request.form.get(
            "date", event.date.isoformat() if event else ""
        ),
        "category": request.form.get(
            "category", event.category if event else "Personal"
        ),
    }
    values["title"] = values["title"].strip()
    errors = {}

    if not values["title"]:
        errors["title"] = "Please enter an event title."

    parsed_date = None
    if not values["date"]:
        errors["date"] = "Please choose a date."
    else:
        try:
            parsed_date = date.fromisoformat(values["date"])
        except ValueError:
            errors["date"] = "Enter a valid date."

    if values["category"] not in CATEGORIES:
        errors["category"] = "Choose a valid category."

    return values, errors, parsed_date


def render_event_form(event=None, values=None, errors=None):
    return render_template(
        "add_event.html",
        event=event,
        values=values or {
            "title": event.title if event else "",
            "description": event.description if event else "",
            "date": event.date.isoformat() if event else "",
            "category": event.category if event else "Personal",
        },
        errors=errors or {},
        categories=CATEGORIES,
    )


@app.get("/")
def index():
    events = Event.query.order_by(Event.date.asc(), Event.id.asc()).all()
    category = request.args.get("category", "All")
    search = request.args.get("search", "").strip()
    if category not in ("All", *CATEGORIES):
        abort(400, description="Unknown event category.")

    if category != "All":
        events = [event for event in events if event.category == category]
    if search:
        search_term = search.casefold()
        events = [
            event
            for event in events
            if search_term in event.title.casefold()
            or search_term in (event.description or "").casefold()
        ]

    return render_template(
        "index.html",
        events=events,
        categories=CATEGORIES,
        active_category=category,
        search=search,
        total_count=Event.query.count(),
    )


@app.route("/add", methods=["GET", "POST"])
def add_event():
    if request.method == "GET":
        return render_event_form()

    values, errors, parsed_date = event_form_data()
    if errors:
        return render_event_form(values=values, errors=errors)

    event = Event(
        title=values["title"],
        description=values["description"].strip(),
        date=parsed_date,
        category=values["category"],
    )
    db.session.add(event)
    db.session.commit()
    return redirect(url_for("index"))


@app.route("/edit/<int:id>", methods=["GET", "POST"])
def edit_event(id):
    event = db.get_or_404(Event, id)
    if request.method == "GET":
        return render_event_form(event=event)

    values, errors, parsed_date = event_form_data(event)
    if errors:
        return render_event_form(event=event, values=values, errors=errors)

    event.title = values["title"]
    event.description = values["description"].strip()
    event.date = parsed_date
    event.category = values["category"]
    db.session.commit()
    return redirect(url_for("index"))


@app.post("/delete/<int:id>")
def delete_event(id):
    event = db.get_or_404(Event, id)
    db.session.delete(event)
    db.session.commit()
    return redirect(url_for("index"))


@app.cli.command("init-db")
def init_db():
    """Create the SQLite database tables."""
    db.create_all()
    click.echo("EventFlow database initialized.")


if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run()
