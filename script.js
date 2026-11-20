let events = JSON.parse(localStorage.getItem("events")) || [];
let view = "month";
let month = new Date();

// Save events
function save() {
    localStorage.setItem("events", JSON.stringify(events));
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
        let d = year + "-" + String(m+1).padStart(2,"0") + "-" + String(i).padStart(2,"0");

        html += "<td>" + i;

        events.forEach(e => {
            if (e.date == d) {
                html += "<div class='event'>" + e.title + "</div>";
            }
        });

        html += "</td>";

        if (new Date(year,m,i).getDay() == 6) {
            html += "</tr><tr>";
        }
    }

    document.getElementById("calendar").innerHTML = html + "</tr></table>";
}

// List view
function showList() {
    document.getElementById("title").innerHTML = "All Events";

    let html = "";

    events.forEach((e,i) => {
        html += "<p>" + e.title + " - " + e.date +
        " <button onclick='deleteEvent(" + i + ")'>Delete</button></p>";
    });

    document.getElementById("calendar").innerHTML =
        html || "No events";
}

// Add event
function saveEvent() {
    let title = document.getElementById("evTitle").value;
    let date = document.getElementById("evDate").value;

    if (title == "" || date == "") {
        alert("Enter event details");
        return;
    }

    events.push({title:title, date:date});

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
showCalendar();
