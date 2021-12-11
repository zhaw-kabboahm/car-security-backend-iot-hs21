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
        document.getElementById("autostatuserevent").innerHTML = data.eventData;
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
}


async function getTuerOeffnungsCounter() {
    // request the variable "tuerOeffnungsCounter"
    var response = await axios.get(rootUrl + "/api/device/0/variable/tuerOeffnungsCounter");
    var tuerOeffnungsCounter = response.data.result;

    // update the html element
    document.getElementById("buttontueroeffnungscounter").innerHTML = tuerOeffnungsCounter;
}

async function manualSwitchOffAlarm() {
    // read the value from the input field
    var alarm = document.getElementById("manualswitchoffalarminput").value;

    // call the function
    var response = await axios.post(rootUrl + "/api/device/0/function/manualSwitchOffAlarm", { arg: alarm });

    // show meaningful Alert Message
    var responseMeldung = await axios.get(rootUrl + "/api/device/0/variable/meldung");

    // Handle the response from the server
    alert(responseMeldung.data.result);
}
