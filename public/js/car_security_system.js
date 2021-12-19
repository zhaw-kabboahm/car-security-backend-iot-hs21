var rootUrl = window.location.origin; // get the root URL, e.g. https://example.herokuapp.com or http://localhost:3001

// initialise server-sent events
function initSSE() {
    if (typeof (EventSource) !== "undefined") {
        var url = rootUrl + "/api/events";
        var source = new EventSource(url);
        source.onmessage = (event) => {
            updateCarStatus(JSON.parse(event.data));
        };
    } else {
        alert("Your browser does not support server-sent events.");
    }
}
initSSE();

// initialise some elements in the HTML
async function init() {
    var responseAutoStatus = await axios.get(rootUrl + "/api/device/0/variable/autoStatus");

    if (responseAutoStatus.data.result !== "Tuer ist geschlossen") {
        document.getElementById("meldungeventID").style.background = "red";
        document.getElementById('autoStatusID').style.color = "white";
        document.getElementById('autostatusevent').style.color = "white";
    } else {
        document.getElementById("meldungeventID").style.background = "white";
        document.getElementById('autoStatusID').style.color = "black";
        document.getElementById('autostatusevent').style.color = "grey";
    }
    document.getElementById("autostatusevent").innerHTML = responseAutoStatus.data.result;

    var responseAlarmStatus = await axios.get(rootUrl + "/api/device/0/variable/alarmStatus");
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

    var responseAlarmState = await axios.get(rootUrl + "/api/device/0/variable/alarmState");
    if (responseAlarmState.data.result === 1) {
        document.getElementById("myManualSwitchButton").checked = true;
    } else {
        document.getElementById("myManualSwitchButton").checked = false;
    }
}
init();

function updateCarStatus(data) {
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
        document.getElementById("meldungeventID").style.background = "white";
        document.getElementById('autoStatusID').style.color = "black";
        document.getElementById('autostatusevent').style.color = "grey";
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
