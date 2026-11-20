let events = JSON.parse(localStorage.getItem("events")) || [];
let view = "month";
let month = new Date();

let courses = ["Data Structures", "Database Systems",
               "Web Technologies", "Coding Club"];

let types = ["Assignment", "Exam", "Quiz", "Project", "Other"];

// Save events
function save() {
    localStorage.setItem("events", JSON.stringify(events));
}

// Fill dropdowns
function fillFilters() {
    document.getElementById("courseFilter").innerHTML =
        "<option value='all'>All Subjects</option>";

    courses.forEach(c => {
        document.getElementById("courseFilter").innerHTML +=
            "<option>" + c + "</option>";
    });

    document.getElementById("typeFilter").innerHTML =
        "<option value='all'>All Types</option>";

    types.forEach(t => {
        document.getElementById("typeFilter").innerHTML +=
            "<option>" + t + "</option>";
    });

    document.getElementById("evCourse").innerHTML = "";
    document.getElementById("evType").innerHTML = "";

    courses.forEach(c => {
        document.getElementById("evCourse").innerHTML +=
            "<option>" + c + "</option>";
    });

    types.forEach(t => {
        document.getElementById("evType").innerHTML +=
            "<option>" + t + "</option>";
    });
}

// Filter events
function getEvents() {
    let course = document.getElementById("courseFilter").value;
    let type = document.getElementById("typeFilter").value;
    let search = document.getElementById("search").value.toLowerCase();

    return events.filter(e =>
        (course == "all" || e.course == course) &&
        (type == "all" || e.type == type) &&
        e.title.toLowerCase().includes(search)
    );
}

// Change view
function setView(v) {
    view = v;
    showCalendar();
}

// Change month
function goPrevious() {
    month.setMonth(month.getMonth() - 1);
    showCalendar();
}

function goNext() {
    month.setMonth(month.getMonth() + 1);
    showCalendar();
}

function goToday() {
    month = new Date();
    showCalendar();
}

// Display calendar
function showCalendar() {
    if (view == "month") {
        showMonth();
    } else {
        showList();
    }
}

// Month view
function showMonth() {
    let html = "";
    let year = month.getFullYear();
    let m = month.getMonth();
    let total = new Date(year, m + 1, 0).getDate();

    document.getElementById("title").innerHTML =
        month.toLocaleString("default", {month:"long"}) + " " + year;

    html = "<table><tr>";

    ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].forEach(d => {
        html += "<th>" + d + "</th>";
    });

    html += "</tr><tr>";

    for (let i = 1; i <= total; i++) {
        let d = year + "-" + String(m+1).padStart(2,"0") +
                "-" + String(i).padStart(2,"0");

        html += "<td>" + i;

        getEvents().forEach(e => {
            if (e.date == d) {
                html += "<div class='event'>" +
                    e.type + ": " + e.title + "</div>";
            }
        });

        html += "</td>";

        if (new Date(year,m,i).getDay() == 6) {
            html += "</tr><tr>";
        }
    }

    document.getElementById("calendar").innerHTML =
        html + "</tr></table>";
}

// List view
function showList() {
    document.getElementById("title").innerHTML = "All Events";

    let html = "";

    getEvents().forEach((e,i) => {
        html += "<p><b>" + e.title + "</b><br>";
        html += e.course + " | " + e.type + "<br>";
        html += e.date + " | " + e.time;
        html += " <button onclick='deleteEvent(" +
            events.indexOf(e) + ")'>Delete</button></p>";
    });

    document.getElementById("calendar").innerHTML =
        html || "No events";
}

// Add event
function saveEvent() {
    let title = document.getElementById("evTitle").value;
    let date = document.getElementById("evDate").value;
    let time = document.getElementById("evTime").value;
    let course = document.getElementById("evCourse").value;
    let type = document.getElementById("evType").value;

    if (title == "" || date == "") {
        alert("Enter event details");
        return;
    }

    events.push({
        title: title,
        date: date,
        time: time,
        course: course,
        type: type
    });

    save();
    closeForm();
    showCalendar();
}

// Delete event
function deleteEvent(i) {
    events.splice(i,1);
    save();
    showCalendar();
}

// Close form
function closeForm() {
    document.getElementById("formBox").style.display = "none";
}

// Start
fillFilters();
showCalendar();
