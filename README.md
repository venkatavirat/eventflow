# EventFlow — Flask Event & Task Planner

EventFlow is a small Flask application for creating, editing, filtering, and deleting events. Events are stored in a local SQLite database through Flask-SQLAlchemy.

## Requirements

- Python 3.10 or newer
- `pip`

## Setup

From the project directory, create a virtual environment:

```powershell
python -m venv venv
```

Activate it in PowerShell:

```powershell
.\venv\Scripts\Activate.ps1
```

If PowerShell blocks local scripts, activate from Command Prompt instead:

```bat
venv\Scripts\activate.bat
```

Install the dependencies:

```powershell
python -m pip install -r requirements.txt
```

Initialize the SQLite database and its tables:

```powershell
flask --app app init-db
```

Run the application:

```powershell
python app.py
```

Open the local address printed by Flask (typically <http://127.0.0.1:5000>). The database is stored at `instance/eventflow.db` and is created automatically when running `python app.py`; the explicit `init-db` command is also available for first-time setup.

## Features

- Add and edit events with required title and date validation.
- Delete events from the dashboard.
- Filter by Work, Personal, or Study and search titles/descriptions.
- Responsive Bootstrap 5 interface.
