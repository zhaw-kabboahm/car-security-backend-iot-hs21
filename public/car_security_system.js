var rootUrl = window.location.origin; // get the root URL, e.g. https://example.herokuapp.com or http://localhost:3001

// initialise server-sent events
function initSSE() {
    if (typeof (EventSource) !== "undefined") {
        var url = rootUrl + "/api/events";
        var source = new EventSource(url);
        source.onmessage = (event) => {
            updateVariables(JSON.parse(event.data));
        };
    } else {
        alert("Your browser does not support server-sent events.");
    }
}
initSSE();

// initialise some elements in the HTML
async function init() {
    let responseAutoStatus = await axios.get(rootUrl + "/api/device/0/variable/autoStatus");
    if (responseAutoStatus.data.result !== "Tür ist geschlossen") {
        document.getElementById("meldungeventID").style.background = "red";
        document.getElementById('autoStatusID').style.color = "white";
        document.getElementById('autostatusevent').style.color = "white";
    } else {
        document.getElementById("meldungeventID").style.background = "white";
        document.getElementById('autoStatusID').style.color = "black";
        document.getElementById('autostatusevent').style.color = "grey";
    }
    document.getElementById("autostatusevent").innerHTML = responseAutoStatus.data.result;

    let responseAlarmStatus = await axios.get(rootUrl + "/api/device/0/variable/alarmStatus");
    if (responseAlarmStatus.data.result === "Alarm ist AUS") {
        document.getElementById("alarmID").style.background = "#fed713";
        document.getElementById('alarmTitleID').style.color = "white";
        document.getElementById('alarmstatusevent').style.color = "white";
    } else {
        document.getElementById("alarmID").style.background = "#46c35f";
        document.getElementById('alarmTitleID').style.color = "white";
        document.getElementById('alarmstatusevent').style.color = "white";
    }
    document.getElementById("alarmstatusevent").innerHTML = responseAlarmStatus.data.result;

    let responseAlarmState = await axios.get(rootUrl + "/api/device/0/variable/alarmState");
    if (responseAlarmState.data.result === 1) {
        document.getElementById("myManualSwitchButton").checked = true;
    } else {
        document.getElementById("myManualSwitchButton").checked = false;
    }
}
init();

function updateVariables(data) {
    // update the html elements
    document.getElementById("lastevent").innerHTML = JSON.stringify(data);
    if (data.eventName === "heartbeat") {
        document.getElementById("heartbeatevent").innerHTML = data.eventData;
    }

    if (data.eventName === "tuerOeffnungsCounter") {
        document.getElementById("tueroeffnungscounterevent").innerHTML = data.eventData;
    }

    if (data.eventName === "autoStatus") {
        document.getElementById("autostatusevent").innerHTML = data.eventData;
    }

    if (data.eventName === "alarmStatus") {
        document.getElementById("alarmstatusevent").innerHTML = data.eventData;
    }

    if (data.eventName === "manualSwitchOffAlarm") {
        document.getElementById("manualswitchoffalarmerevent").innerHTML = data.eventData;
    }

    if (data.eventName === "meldung") {
        document.getElementById("meldungevent").innerHTML = data.eventData;
    }

    if (data.eventData === "ACHTUNG DIEBSTAHL!!!") {
        document.getElementById("meldungeventID").style.background = "red";
        document.getElementById('autoStatusID').style.color = "white";
        document.getElementById('autostatusevent').style.color = "white";
    }

    if (data.eventData === "Alles in Ordnung :)") {
        document.getElementById('autoStatusID').style.color = "black";
        document.getElementById('autostatusevent').style.color = "grey";
        document.getElementById("meldungeventID").style.background = "white";
    }

    if (data.eventData === "Alarm ist AUS") {
        document.getElementById("alarmID").style.background = "#fed713";
        document.getElementById('alarmTitleID').style.color = "white";
        document.getElementById('alarmstatusevent').style.color = "white";

        document.getElementById('myManualSwitchButton').checked = false;
    }

    if (data.eventData === "Alarm ist aktiv") {
        document.getElementById("alarmID").style.background = "#46c35f";
        document.getElementById('alarmTitleID').style.color = "white";
        document.getElementById('alarmstatusevent').style.color = "white";

        document.getElementById('myManualSwitchButton').checked = true;
    }
    getResult();
}

async function getTuerOeffnungsCounter() {
    // request the variable "tuerOeffnungsCounter"
    var response = await axios.get(rootUrl + "/api/device/0/variable/tuerOeffnungsCounter");
    var tuerOeffnungsCounter = response.data.result;

    // update the html element
    document.getElementById("buttontueroeffnungscounter").innerHTML = tuerOeffnungsCounter;
}

async function manualSwitchOffAlarm() {

    if(document.getElementById("myManualSwitchButton").checked == false){

     // read the value from the input field
    var alarm = "off";

    // call the function
    var response = await axios.post(rootUrl + "/api/device/0/function/manualSwitchOffAlarm", { arg: alarm });

    // show meaningful Alert Message
    var responseMeldung = await axios.get(rootUrl + "/api/device/0/variable/meldung");

    // Handle the response from the server
    //alert(responseMeldung.data.result);

    document.getElementById("myManualSwitchButton").checked = false;

    // for testing
    //console.log("im NOT checked")

    } else {
        // read the value from the input field
        var alarm = "on";

        // call the function
        var response = await axios.post(rootUrl + "/api/device/0/function/manualSwitchOffAlarm", { arg: alarm });

        // show meaningful Alert Message
        var responseMeldung = await axios.get(rootUrl + "/api/device/0/variable/meldung");

        // Handle the response from the server
        //alert(responseMeldung.data.result);

        document.getElementById("myManualSwitchButton").checked = true;
       
        // for testing
        //console.log("im checked")
        }

}

async function getResult() {
    var dbName = "MyDB";
    var collectionName = "carSecuritySystem";
    var query = "";


    // e.g. http://localhost:3001/api/MyDB/MotionDetected?timestamp=13:00
    var url = rootUrl + "/api/" + dbName + "/" + collectionName +"?" + query; 

    var response = await axios.get(url);

    var result = response.data;
    
    result.sort(function (firstElement, secondElement) {
        return Date.parse(secondElement.timestamp) - Date.parse(firstElement.timestamp);
    });
    let tableElement = document.getElementById("tableId");
    tableElement.innerHTML = '';
    let eventsCounter = document.getElementById("eventsCounter");
    eventsCounter.innerHTML = `Events counter: ${result.length}`;
    for (element of result) {
        let tr = document.createElement("tr");
        for (const [key, value] of Object.entries(element)) {

            if (key === "_id") {
                continue;
            }

            let td = document.createElement("td");
            td.appendChild(document.createTextNode(value));
            tr.appendChild(td);
        }
        tableElement.appendChild(tr);
    }

    // Only for debugging purposes
    console.log(JSON.stringify(result));
}
getResult();




var perPage = 20;

function genTables() {
    var tables = document.querySelectorAll(".pagination");
    for (var i = 0; i < tables.length; i++) {
        perPage = parseInt(tables[i].dataset.pagecount);
        createFooters(tables[i]);
        createTableMeta(tables[i]);
        loadTable(tables[i]);
    }
}

// based on current page, only show the elements in that range
function loadTable(table) {
    var startIndex = 0;

    if (table.querySelector('th'))
        startIndex = 1;

	console.log(startIndex);

    var start = (parseInt(table.dataset.currentpage) * table.dataset.pagecount) + startIndex;
    var end = start + parseInt(table.dataset.pagecount);
    var rows = table.rows;

    for (var x = startIndex; x < rows.length; x++) {
        if (x < start || x >= end)
            rows[x].classList.add("inactive");
        else
            rows[x].classList.remove("inactive");
    }
}

function createTableMeta(table) {
    table.dataset.currentpage = "0";
}

function createFooters(table) {
    var hasHeader = false;
    if (table.querySelector('th'))
        hasHeader = true;

    var rows = table.rows.length;

    if (hasHeader)
        rows = rows - 1;

    var numPages = rows / perPage;
    var pager = document.createElement("div");

    // add an extra page, if we're 
    if (numPages % 1 > 0)
        numPages = Math.floor(numPages) + 1;

    pager.className = "pager";
    for (var i = 0; i < numPages ; i++) {
        var page = document.createElement("div");
        page.innerHTML = i + 1;
        page.className = "pager-item";
        page.dataset.index = i;

        if (i == 0)
            page.classList.add("selected");

        page.addEventListener('click', function() {
            var parent = this.parentNode;
            var items = parent.querySelectorAll(".pager-item");
            for (var x = 0; x < items.length; x++) {
                items[x].classList.remove("selected");
            }
            this.classList.add('selected');
            table.dataset.currentpage = this.dataset.index;
            loadTable(table);
        });
        pager.appendChild(page);
    }

    // insert page at the top of the table
    table.parentNode.insertBefore(pager, table);
}


$(document).ready(function () {
  $('#dtBasicExample').DataTable();
  $('.dataTables_length').addClass('bs-select');
});