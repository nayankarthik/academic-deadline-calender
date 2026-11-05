# Academic Deadline Calendar

A unified academic calendar that shows deadlines, exams and activities **by course and activity**.
Built with plain **HTML, CSS and JavaScript** (no frameworks). Data is saved in the browser using `localStorage`.

## Features

| Feature | Description |
|---|---|
| Event/Deadline CRUD | Faculty can create, edit and delete events |
| Course association | Every event belongs to a course/activity, shown with its own colour |
| Calendar views | Month, Week and List (upcoming 60 days) |
| Reminders | Banner shows deadlines that are due within the chosen reminder time |
| Filters | Filter by course, event type, or search text |
| Recurring events | Daily, weekly or monthly repeat with an end date |
| Student / Faculty roles | Faculty manage events; students view them and mark them as done |
| Export | Download the calendar as `.ics` (Google/Outlook calendar) or `.csv` |

## How to run

1. Download or clone this repository
2. Open `index.html` in any modern browser

No installation or server is needed.

## Project structure

```
academic-deadline-calendar/
├── index.html      # page layout and dialogs
├── css/
│   └── style.css   # styling
├── js/
│   └── app.js      # all logic (events, views, filters, export)
├── README.md
└── .gitignore
```

## How to use

- Use the **Logged in as** dropdown (top right) to switch between **Student** and **Faculty**.
- **Faculty:** click **+ Add Event**, or click any day in the month view. Click an event to edit or delete it. Use **+ Add Course** for a new course/activity.
- **Student:** click an event to see details and tick **Mark as done**.
- Use the filters to see only one course or event type.
- Use **Export** to download deadlines.

## Technologies

- HTML5 (`<dialog>` element)
- CSS3 (Grid and Flexbox)
- JavaScript (ES6)
- Browser `localStorage`

## Limitations / future work

- Data is stored only in the user's own browser; a backend with a database and real login would be needed for shared use.
- Reminders appear inside the page (no email or push notifications).
- Editing a repeating event changes the whole series.

## Author

Nayan Karthik - LPU / Computer Science
