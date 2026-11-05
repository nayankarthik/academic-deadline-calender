// Academic Deadline Calendar
// Simple JavaScript project. Data is saved in localStorage.

// ---------- Variables ----------
var events = [];           // all events
var courses = [];          // all courses
var doneList = {};         // events marked as done by student
var role = "student";      // student or faculty
var view = "month";        // month or list
var shownDate = new Date();   // the month/date we are looking at
var editingId = "";        // id of the event being edited
var detailKey = "";        // id|date of the event shown in details

// change this number whenever the sample data is changed
var DATA_VERSION = "2";

var colors = ["#2f5d9e", "#c0392b", "#27ae60", "#8e44ad", "#e67e22", "#16a085"];
var monthNames = ["January", "February", "March", "April", "May", "June",
                  "July", "August", "September", "October", "November", "December"];
var dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];


// ---------- Helper functions ----------

// converts a Date to text like 2026-11-04
function formatDate(d) {
  var month = d.getMonth() + 1;
  var day = d.getDate();
  if (month < 10) month = "0" + month;
  if (day < 10) day = "0" + day;
  return d.getFullYear() + "-" + month + "-" + day;
}

// converts text like 2026-11-04 to a Date
function makeDate(text) {
  var parts = text.split("-");
  return new Date(parts[0], parts[1] - 1, parts[2]);
}

// gives the date after adding some days
function addDays(d, n) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
}

// number of days between two date texts
function daysBetween(text1, text2) {
  var diff = makeDate(text2) - makeDate(text1);
  return Math.round(diff / (1000 * 60 * 60 * 24));
}

// finds course name and color using id
function getCourse(id) {
  for (var i = 0; i < courses.length; i++) {
    if (courses[i].id == id) return courses[i];
  }
  return { name: "Unknown", color: "gray" };
}

// finds an event using id
function getEvent(id) {
  for (var i = 0; i < events.length; i++) {
    if (events[i].id == id) return events[i];
  }
  return null;
}

// stops html tags in text from breaking the page
function safe(text) {
  text = String(text);
  text = text.replace(/&/g, "&amp;");
  text = text.replace(/</g, "&lt;");
  text = text.replace(/>/g, "&gt;");
  return text;
}


// ---------- Save and load ----------
function saveData() {
  localStorage.setItem("events", JSON.stringify(events));
  localStorage.setItem("courses", JSON.stringify(courses));
  localStorage.setItem("doneList", JSON.stringify(doneList));
  localStorage.setItem("dataVersion", DATA_VERSION);
}

function loadData() {
  var e = localStorage.getItem("events");
  var c = localStorage.getItem("courses");
  var d = localStorage.getItem("doneList");

  // if the saved data is from an older version, replace it with the new sample data
  var version = localStorage.getItem("dataVersion");

  if (e && c && version == DATA_VERSION) {
    events = JSON.parse(e);
    courses = JSON.parse(c);
    if (d) doneList = JSON.parse(d);
  } else {
    addSampleData();
  }

  if (localStorage.getItem("role")) {
    role = localStorage.getItem("role");
  }
}

// some sample data for the first time
function addSampleData() {
  var today = new Date();

  courses = [
    { id: 1, name: "CHE 110", color: colors[0] },
    { id: 2, name: "CSE 111", color: colors[1] },
    { id: 3, name: "CSE 326", color: colors[2] },
    { id: 4, name: "MTH 165", color: colors[3] },
    { id: 5, name: "PHY 175", color: colors[4] },
    { id: 6, name: "ECE 120", color: colors[5] }
  ];

  events = [
    { id: 1, title: "Assignment 1", course: 4, type: "Assignment",
      date: formatDate(addDays(today, 2)), time: "23:59", repeat: "none", until: "", reminder: 2, desc: "Submit on the portal" },
    { id: 2, title: "Mid Sem Exam", course: 5, type: "Exam",
      date: formatDate(addDays(today, 9)), time: "10:00", repeat: "none", until: "", reminder: 7, desc: "Units 1 to 3" },
    { id: 3, title: "Mini Project Demo", course: 3, type: "Project",
      date: formatDate(addDays(today, 5)), time: "14:00", repeat: "none", until: "", reminder: 2, desc: "5 minute demo" },
    { id: 4, title: "Weekly Quiz", course: 2, type: "Quiz",
      date: formatDate(addDays(today, 1)), time: "09:00", repeat: "weekly", until: formatDate(addDays(today, 50)), reminder: 1, desc: "Quiz on last week topics" },
    { id: 5, title: "Lab Record Submission", course: 6, type: "Lab",
      date: formatDate(addDays(today, 3)), time: "11:00", repeat: "weekly", until: formatDate(addDays(today, 60)), reminder: 0, desc: "Submit to lab teacher" },
    { id: 6, title: "Test 1", course: 1, type: "Quiz",
      date: formatDate(addDays(today, 12)), time: "10:00", repeat: "none", until: "", reminder: 2, desc: "" }
  ];

  saveData();
}


// ---------- Finding events for a date ----------

// checks if the event happens on the given date (also for repeating events)
function happensOn(ev, dateText) {
  if (dateText < ev.date) return false;

  if (ev.repeat == "none") {
    return dateText == ev.date;
  }

  if (ev.until != "" && dateText > ev.until) return false;

  var diff = daysBetween(ev.date, dateText);

  if (ev.repeat == "daily") return true;
  if (ev.repeat == "weekly") return diff % 7 == 0;
  if (ev.repeat == "monthly") return makeDate(dateText).getDate() == makeDate(ev.date).getDate();

  return false;
}

// checks the search box and the filters
function passesFilter(ev) {
  var course = document.getElementById("courseFilter").value;
  var type = document.getElementById("typeFilter").value;
  var search = document.getElementById("search").value.toLowerCase();

  if (course != "all" && ev.course != course) return false;
  if (type != "all" && ev.type != type) return false;
  if (search != "" && ev.title.toLowerCase().indexOf(search) == -1) return false;

  return true;
}

// gives all events on a date (sorted by time)
function getEventsOn(dateText) {
  var result = [];
  for (var i = 0; i < events.length; i++) {
    if (passesFilter(events[i]) && happensOn(events[i], dateText)) {
      result.push(events[i]);
    }
  }
  result.sort(function (a, b) {
    return a.time < b.time ? -1 : 1;
  });
  return result;
}

function isDone(ev, dateText) {
  return doneList[ev.id + "|" + dateText] == true;
}


// ---------- Showing the calendar ----------
function showCalendar() {
  document.body.className = role;
  document.getElementById("role").value = role;

  // highlight the selected view button
  document.getElementById("monthBtn").className = (view == "month") ? "active-view" : "";
  document.getElementById("listBtn").className = (view == "list") ? "active-view" : "";

  if (view == "month") {
    showMonth();
  } else {
    showList();
  }
  showReminders();
}

function showMonth() {
  var year = shownDate.getFullYear();
  var month = shownDate.getMonth();
  document.getElementById("title").innerHTML = monthNames[month] + " " + year;

  // first cell of the table = Sunday of the week having 1st date
  var first = new Date(year, month, 1);
  var start = addDays(first, -first.getDay());
  var todayText = formatDate(new Date());

  var html = "<table><tr>";
  for (var i = 0; i < 7; i++) {
    html += "<th>" + dayNames[i] + "</th>";
  }
  html += "</tr>";

  for (var row = 0; row < 6; row++) {
    html += "<tr>";
    for (var col = 0; col < 7; col++) {
      var d = addDays(start, row * 7 + col);
      var dateText = formatDate(d);

      var cls = "";
      if (d.getMonth() != month) cls = "other-month";
      if (dateText == todayText) cls = "today";

      html += "<td class='" + cls + "' onclick=\"clickDay('" + dateText + "')\">";
      html += "<b>" + d.getDate() + "</b>";

      var list = getEventsOn(dateText);
      for (var k = 0; k < list.length; k++) {
        var ev = list[k];
        var c = getCourse(ev.course);
        var extra = isDone(ev, dateText) ? " done" : "";
        html += "<div class='event" + extra + "' style='background-color:" + c.color + "' ";
        html += "onclick=\"clickEvent(event, " + ev.id + ", '" + dateText + "')\">";
        html += safe(ev.title) + "</div>";
      }
      html += "</td>";
    }
    html += "</tr>";
  }
  html += "</table>";

  document.getElementById("calendar").innerHTML = html;
}

// list view shows the next 60 days
function showList() {
  document.getElementById("title").innerHTML = "Upcoming 60 days";

  var html = "";
  var count = 0;

  for (var i = 0; i < 60; i++) {
    var d = addDays(shownDate, i);
    var dateText = formatDate(d);
    var list = getEventsOn(dateText);

    if (list.length > 0) {
      html += "<h4 class='list-date'>" + dayNames[d.getDay()] + ", " + d.getDate() + " " +
              monthNames[d.getMonth()] + " " + d.getFullYear() + "</h4>";

      for (var k = 0; k < list.length; k++) {
        var ev = list[k];
        var c = getCourse(ev.course);
        var extra = isDone(ev, dateText) ? " done" : "";
        html += "<div class='list-item" + extra + "' style='border-left-color:" + c.color + "' ";
        html += "onclick=\"clickEvent(event, " + ev.id + ", '" + dateText + "')\">";
        html += "<b>" + safe(ev.title) + "</b><br>";
        html += "<span class='small-text'>" + safe(c.name) + " | " + ev.type + " | " + ev.time + "</span>";
        html += "</div>";
        count++;
      }
    }
  }

  if (count == 0) {
    html = "<p>No events found.</p>";
  }
  document.getElementById("calendar").innerHTML = html;
}

// reminder box at the top
function showReminders() {
  var box = document.getElementById("reminderBox");
  var todayText = formatDate(new Date());
  var html = "";
  var count = 0;

  // check today and the next 7 days
  for (var i = 0; i <= 7; i++) {
    var dateText = formatDate(addDays(new Date(), i));

    for (var k = 0; k < events.length; k++) {
      var ev = events[k];
      if (happensOn(ev, dateText) && i <= ev.reminder && !isDone(ev, dateText)) {
        var when = "in " + i + " days";
        if (i == 0) when = "today";
        if (i == 1) when = "tomorrow";
        html += "<li>" + safe(ev.title) + " (" + safe(getCourse(ev.course).name) + ") - " + when + "</li>";
        count++;
      }
    }
  }

  if (count > 0) {
    box.innerHTML = "<h3>Reminders</h3><ul>" + html + "</ul>";
    box.style.display = "block";
  } else {
    box.style.display = "none";
  }
}


// ---------- Buttons ----------
function changeRole() {
  role = document.getElementById("role").value;
  localStorage.setItem("role", role);
  showCalendar();
}

function setView(v) {
  view = v;
  showCalendar();
}

function goPrevious() {
  if (view == "month") {
    shownDate = new Date(shownDate.getFullYear(), shownDate.getMonth() - 1, 1);
  } else {
    shownDate = addDays(shownDate, -30);
  }
  showCalendar();
}

function goNext() {
  if (view == "month") {
    shownDate = new Date(shownDate.getFullYear(), shownDate.getMonth() + 1, 1);
  } else {
    shownDate = addDays(shownDate, 30);
  }
  showCalendar();
}

function goToday() {
  shownDate = new Date();
  showCalendar();
}

// faculty can click on a day to add an event
function clickDay(dateText) {
  if (role == "faculty") {
    openForm("", dateText);
  }
}

// click on an event: faculty edits, student sees details
function clickEvent(e, id, dateText) {
  e.stopPropagation();   // so the day cell click is not called
  if (role == "faculty") {
    openForm(id, dateText);
  } else {
    showDetails(id, dateText);
  }
}

function addCourse() {
  var name = prompt("Enter course or activity name:");
  if (name == null || name.trim() == "") return;

  courses.push({ id: Date.now(), name: name.trim(), color: colors[courses.length % colors.length] });
  saveData();
  fillCourseLists();
  showCalendar();
}


// ---------- Add / Edit form ----------
function fillCourseLists() {
  var filterHtml = "<option value='all'>All courses</option>";
  var formHtml = "";

  for (var i = 0; i < courses.length; i++) {
    var option = "<option value='" + courses[i].id + "'>" + safe(courses[i].name) + "</option>";
    filterHtml += option;
    formHtml += option;
  }

  var selected = document.getElementById("courseFilter").value;
  document.getElementById("courseFilter").innerHTML = filterHtml;
  if (selected != "") document.getElementById("courseFilter").value = selected;
  document.getElementById("evCourse").innerHTML = formHtml;
}

function openForm(id, dateText) {
  editingId = id;

  if (id == "") {
    // new event
    document.getElementById("formTitle").innerHTML = "Add Event";
    document.getElementById("deleteBtn").style.display = "none";
    document.getElementById("evTitle").value = "";
    document.getElementById("evType").value = "Assignment";
    document.getElementById("evDate").value = (dateText != "") ? dateText : formatDate(new Date());
    document.getElementById("evTime").value = "";
    document.getElementById("evRepeat").value = "none";
    document.getElementById("evUntil").value = "";
    document.getElementById("evReminder").value = "1";
    document.getElementById("evDesc").value = "";
  } else {
    // edit old event
    var ev = getEvent(id);
    document.getElementById("formTitle").innerHTML = "Edit Event";
    document.getElementById("deleteBtn").style.display = "inline-block";
    document.getElementById("evTitle").value = ev.title;
    document.getElementById("evCourse").value = ev.course;
    document.getElementById("evType").value = ev.type;
    document.getElementById("evDate").value = ev.date;
    document.getElementById("evTime").value = ev.time;
    document.getElementById("evRepeat").value = ev.repeat;
    document.getElementById("evUntil").value = ev.until;
    document.getElementById("evReminder").value = ev.reminder;
    document.getElementById("evDesc").value = ev.desc;
  }

  document.getElementById("formBox").style.display = "block";
}

function closeForm() {
  document.getElementById("formBox").style.display = "none";
}

function saveEvent() {
  var title = document.getElementById("evTitle").value.trim();
  var date = document.getElementById("evDate").value;
  var repeat = document.getElementById("evRepeat").value;
  var until = document.getElementById("evUntil").value;

  // checking the inputs
  if (title == "") {
    alert("Please enter the title");
    return;
  }
  if (date == "") {
    alert("Please select the date");
    return;
  }
  if (repeat != "none" && until == "") {
    alert("Please select the 'repeat until' date");
    return;
  }
  if (repeat != "none" && until < date) {
    alert("'Repeat until' date cannot be before the start date");
    return;
  }
  if (repeat == "none") until = "";

  var ev;
  if (editingId == "") {
    ev = { id: Date.now() };
    events.push(ev);
  } else {
    ev = getEvent(editingId);
  }

  ev.title = title;
  ev.course = document.getElementById("evCourse").value;
  ev.type = document.getElementById("evType").value;
  ev.date = date;
  ev.time = document.getElementById("evTime").value;
  ev.repeat = repeat;
  ev.until = until;
  ev.reminder = Number(document.getElementById("evReminder").value);
  ev.desc = document.getElementById("evDesc").value;

  saveData();
  closeForm();
  showCalendar();
}

function deleteEvent() {
  if (confirm("Do you want to delete this event?")) {
    var newList = [];
    for (var i = 0; i < events.length; i++) {
      if (events[i].id != editingId) newList.push(events[i]);
    }
    events = newList;
    saveData();
    closeForm();
    showCalendar();
  }
}


// ---------- Event details (student) ----------
function showDetails(id, dateText) {
  var ev = getEvent(id);
  var c = getCourse(ev.course);
  detailKey = id + "|" + dateText;

  var html = "<h3>" + safe(ev.title) + "</h3>";
  html += "<p><b>Course:</b> " + safe(c.name) + "</p>";
  html += "<p><b>Type:</b> " + ev.type + "</p>";
  html += "<p><b>Date:</b> " + dateText + " " + ev.time + "</p>";
  if (ev.repeat != "none") html += "<p><b>Repeats:</b> " + ev.repeat + " until " + ev.until + "</p>";
  if (ev.desc != "") html += "<p><b>Description:</b> " + safe(ev.desc) + "</p>";

  document.getElementById("detailText").innerHTML = html;
  document.getElementById("doneBox").checked = (doneList[detailKey] == true);
  document.getElementById("detailBox").style.display = "block";
}

function closeDetail() {
  document.getElementById("detailBox").style.display = "none";
}

function markDone() {
  if (document.getElementById("doneBox").checked) {
    doneList[detailKey] = true;
  } else {
    delete doneList[detailKey];
  }
  saveData();
  showCalendar();
}


// ---------- Export ----------

// downloads a text file
function downloadFile(name, text) {
  var link = document.createElement("a");
  link.href = "data:text/plain;charset=utf-8," + encodeURIComponent(text);
  link.download = name;
  link.click();
}

function exportCSV() {
  var text = "Title,Course,Type,Date,Time\n";

  // next 365 days
  for (var i = 0; i < 365; i++) {
    var dateText = formatDate(addDays(new Date(), i));
    var list = getEventsOn(dateText);
    for (var k = 0; k < list.length; k++) {
      var ev = list[k];
      text += '"' + ev.title + '","' + getCourse(ev.course).name + '",' + ev.type + "," + dateText + "," + ev.time + "\n";
    }
  }
  downloadFile("deadlines.csv", text);
}

function exportICS() {
  var text = "BEGIN:VCALENDAR\nVERSION:2.0\n";

  for (var i = 0; i < 365; i++) {
    var d = addDays(new Date(), i);
    var dateText = formatDate(d);
    var day = dateText.replace(/-/g, "");
    var list = getEventsOn(dateText);

    for (var k = 0; k < list.length; k++) {
      var ev = list[k];
      text += "BEGIN:VEVENT\n";
      text += "UID:" + ev.id + "-" + day + "@deadlinecalendar\n";
      if (ev.time != "") {
        text += "DTSTART:" + day + "T" + ev.time.replace(":", "") + "00\n";
      } else {
        text += "DTSTART;VALUE=DATE:" + day + "\n";
      }
      text += "SUMMARY:" + ev.title + " (" + getCourse(ev.course).name + ")\n";
      text += "END:VEVENT\n";
    }
  }
  text += "END:VCALENDAR";
  downloadFile("deadlines.ics", text);
}


// ---------- Start ----------
loadData();
fillCourseLists();
showCalendar();
