var events = JSON.parse(localStorage.getItem("events")) || [];
var courses = ["CSE", "Maths", "Physics"];
var date = new Date();

function save() {
    localStorage.setItem("events", JSON.stringify(events));
}

function changeRole() {
    document.body.className = document.getElementById("role").value;
    showCalendar();
}

function goPrevious() {
    date.setMonth(date.getMonth() - 1);
    showCalendar();
}

function goNext() {
    date.setMonth(date.getMonth() + 1);
    showCalendar();
}

function goToday() {
    date = new Date();
    showCalendar();
}

function setView(v) {
    view = v;
    showCalendar();
}

var view = "month";
var editId = null;

function showCalendar() {
    document.getElementById("title").innerText =
        date.toLocaleString("default", {month:"long"}) + " " + date.getFullYear();

    var html = "";
    var filtered = events.filter(e =>
        e.title.toLowerCase().includes(document.getElementById("search").value.toLowerCase()) &&
        (document.getElementById("typeFilter").value == "all" ||
        e.type == document.getElementById("typeFilter").value)
    );

    if (view == "list") {
        filtered.forEach(e => {
            html += `<div class="list-item" onclick="openForm(${e.id})">
                ${e.title} - ${e.date} - ${e.type}</div>`;
        });
    } else {
        html = "<table><tr>";
        ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].forEach(d => html += `<th>${d}</th>`);
        html += "</tr><tr>";

        var first = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
        var days = new Date(date.getFullYear(), date.getMonth()+1, 0).getDate();

        for (var i=0; i<first; i++) html += "<td></td>";

        for (var d=1; d<=days; d++) {
            var day = date.getFullYear()+"-"+String(date.getMonth()+1).padStart(2,"0")+"-"+String(d).padStart(2,"0");

            html += `<td onclick="openForm('', '${day}')"><b>${d}</b>`;

            filtered.forEach(e => {
                if (e.date == day)
                    html += `<div class="event">${e.title}</div>`;
            });

            html += "</td>";
            if ((first+d)%7 == 0) html += "</tr><tr>";
        }

        html += "</tr></table>";
    }

    document.getElementById("calendar").innerHTML = html;
}

function openForm(id="", day="") {
    editId = id;
    var e = events.find(x => x.id == id);

    document.getElementById("formBox").style.display = "block";
    document.getElementById("evTitle").value = e ? e.title : "";
    document.getElementById("evDate").value = e ? e.date : day;
    document.getElementById("evType").value = e ? e.type : "Assignment";
    document.getElementById("evCourse").value = e ? e.course : courses[0];
    document.getElementById("deleteBtn").style.display = e ? "inline-block" : "none";
}

function closeForm() {
    document.getElementById("formBox").style.display = "none";
}

function saveEvent() {
    var e = {
        id: editId || Date.now(),
        title: document.getElementById("evTitle").value,
        course: document.getElementById("evCourse").value,
        type: document.getElementById("evType").value,
        date: document.getElementById("evDate").value
    };

    if (!e.title || !e.date) return alert("Enter title and date");

    if (editId) {
        var i = events.findIndex(x => x.id == editId);
        events[i] = e;
    } else events.push(e);

    save();
    closeForm();
    showCalendar();
}

function deleteEvent() {
    events = events.filter(e => e.id != editId);
    save();
    closeForm();
    showCalendar();
}

function closeDetail() {
    document.getElementById("detailBox").style.display = "none";
}

function markDone() {
    alert("Event marked as done!");
}

function addCourse() {
    var c = prompt("Enter course name");
    if (c) {
        courses.push(c);
        var s = document.getElementById("evCourse");
        s.innerHTML += `<option>${c}</option>`;
    }
}

function exportCSV() {
    var text = "Title,Course,Type,Date\n";
    events.forEach(e => text += `${e.title},${e.course},${e.type},${e.date}\n`);

    var a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([text]));
    a.download = "events.csv";
    a.click();
}

function exportICS() {
    alert("ICS export is not included in this short version.");
}

changeRole();
