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
   /*
    if (data.eventName === "MyEvent") {
        document.getElementById("counterevent").innerHTML = data.eventData;
    }
   */
    if (data.eventName === "trainingStart") {
        document.getElementById("trainingsstartevent").innerHTML = data.eventData;
    }

    if (data.eventName === "trainingEnd") {
        document.getElementById("trainingsendeevent").innerHTML = data.eventData;
    }

    if (data.eventName === "totalHantelbewegung") {
        document.getElementById("totalbewegungscounterevent").innerHTML = data.eventData;
    }

    if (data.eventName === "lastBewegungsCounter") {
        document.getElementById("lastbewegungscounter").innerHTML = data.eventData;
    }
}

async function setCounter() {
    // read the value from the input field
    var counter = document.getElementById("counterinput").value;

    // call the function
    var response = await axios.post(rootUrl + "/api/device/0/function/setCounter", { arg: counter });

    // Handle the response from the server
    alert("Response: " + response.data.result); // we could to something meaningful with the return value here ... 
}

async function getLastBewegungsCounter() {
    // request the variable "lastBewegungsCounter"
    var response = await axios.get(rootUrl + "/api/device/0/variable/lastBewegungsCounter");
    var lastBewegungsCounter = response.data.result;

    // update the html element
    document.getElementById("buttonlastbewegungscounter").innerHTML = lastBewegungsCounter;
}
