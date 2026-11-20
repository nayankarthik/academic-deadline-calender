// VARIABLES
let events = JSON.parse(localStorage.getItem("events")) || [];
let view = "month";
let month = new Date();
let courses = ["Data Structures", "Database Systems",
               "Web Technologies", "Coding Club"];
let types = ["Assignment", "Exam", "Quiz", "Project", "Other"];
let role = "student";

// SAMPLE EVENTS
if (events.length == 0) {
    let y = month.getFullYear();
    let m = String(month.getMonth()+1).padStart(2,"0");

    events = [
        {title:"Assignment 1", course:"Data Structures", type:"Assignment", date:y+"-"+m+"-05", time:"10:00"},
        {title:"Unit Test", course:"Database Systems", type:"Exam", date:y+"-"+m+"-10", time:"11:00"},
        {title:"Weekly Quiz", course:"Web Technologies", type:"Quiz", date:y+"-"+m+"-16", time:"12:00"},
        {title:"Mini Project", course:"Coding Club", type:"Project", date:y+"-"+m+"-22", time:"14:00"},
        {title:"Assignment 2", course:"Database Systems", type:"Assignment", date:y+"-"+m+"-27", time:"10:00"}
    ];

    save();
}

// SAVE EVENTS
function save() {
    localStorage.setItem("events", JSON.stringify(events));
}

// FILL DROPDOWNS
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

// CHANGE ROLE
function changeRole() {
    role = document.getElementById("role").value;
    document.body.className = role;
    showCalendar();
}

// FILTER EVENTS
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

// CHANGE VIEW
function setView(v) {
    view = v;
    showCalendar();
}

// CHANGE MONTH
function goPrevious() {
    month.setMonth(month.getMonth()-1);
    showCalendar();
}

function goNext() {
    month.setMonth(month.getMonth()+1);
    showCalendar();
}

function goToday() {
    month = new Date();
    showCalendar();
}

// DISPLAY CALENDAR
function showCalendar() {
    if (view == "month") showMonth();
    else showList();
}

// MONTH VIEW
function showMonth() {
    let year = month.getFullYear();
    let m = month.getMonth();
    let total = new Date(year,m+1,0).getDate();
    let first = new Date(year,m,1).getDay();

    document.getElementById("title").innerHTML =
        month.toLocaleString("default",{month:"long"})+" "+year;

    if (role == "faculty") {
        document.getElementById("title").innerHTML +=
            " <button onclick='openForm()'>+ Add Event</button>";
    }

    let html = "<table><tr>";

    ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].forEach(d => {
        html += "<th>"+d+"</th>";
    });

    html += "</tr><tr>";

    for (let i=0;i<first;i++) html += "<td></td>";

    for (let i=1;i<=total;i++) {
        let d = year+"-"+String(m+1).padStart(2,"0")+
                "-"+String(i).padStart(2,"0");

        html += "<td onclick=\"clickDay('"+d+"')\">"+i;

        getEvents().forEach(e => {
            if (e.date == d) {
                html += "<div class='event'>"+e.type+": "+e.title+
                        "<br><small>"+e.course+"</small></div>";
            }
        });

        html += "</td>";

        if ((first+i)%7==0) html += "</tr><tr>";
    }

    document.getElementById("calendar").innerHTML =
        html+"</tr></table>";
}

// LIST VIEW
function showList() {
    document.getElementById("title").innerHTML = "All Events";

    if (role == "faculty") {
        document.getElementById("title").innerHTML +=
            " <button onclick='openForm()'>+ Add Event</button>";
    }

    let html = "";

    getEvents().forEach(e => {
        html += "<p><b>"+e.title+"</b><br>";
        html += e.course+" | "+e.type+"<br>";
        html += e.date+" | "+e.time+"</p>";
    });

    document.getElementById("calendar").innerHTML =
        html || "No events";
}

// CLICK DATE
function clickDay(d) {
    if (role == "faculty") openForm(d);
}

// OPEN FORM
function openForm(d = "") {
    document.getElementById("formBox").style.display = "block";
    document.getElementById("evTitle").value = "";
    document.getElementById("evDate").value = d;
    document.getElementById("evTime").value = "";
}

// ADD EVENT
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
        title:title,
        date:date,
        time:time,
        course:course,
        type:type
    });

    save();
    closeForm();
    showCalendar();
}

// CLOSE FORM
function closeForm() {
    document.getElementById("formBox").style.display = "none";
}

// START
fillFilters();
showCalendar();
