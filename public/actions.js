var rootUrl = window.location.origin; // get the root URL, e.g. https://example.herokuapp.com or http://localhost:3001

// initialise server-sent events
function initSSE() {
    if (typeof (EventSource) !== "undefined") {
        var url = rootUrl + "/api/events";
        var source = new EventSource(url);
        source.onmessage = (event) => {
            getResult();
        };
    } else {
        alert("Your browser does not support server-sent events.");
    }
}
initSSE();

// initialise some elements in the HTML
async function init() {
    // This initializes our posts table as a dataTable with funky functions
    jQuery( function () {
        var table = $('.posts-table').DataTable();
    });
}
init();

async function getTuerOeffnungsCounter() {
    // request the variable "tuerOeffnungsCounter"
    var response = await axios.get(rootUrl + "/api/device/0/variable/tuerOeffnungsCounter");
    var tuerOeffnungsCounter = response.data.result;

    // update the html element
    document.getElementById("buttontueroeffnungscounter").innerHTML = tuerOeffnungsCounter;
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
    var eventsCounter = document.getElementById("eventsCounter");
    eventsCounter.innerHTML = `Events counter: ${result.length}`;

    jQuery(function () {
        $('.posts-table').DataTable().clear();
        for (element of result) {
            $('.posts-table').DataTable().row.add(
                {
                    "0": element.eventName !== undefined ? element.eventName : "No data",
                    "1": element.eventData !== undefined ? element.eventData : "No data",
                    "2": element.deviceId !== undefined ? element.deviceId : "No data",
                    "3": element.timestamp !== undefined ? element.timestamp : "No data",
                    "4": element.deviceNumber !== undefined ? element.deviceNumber : "No data"
                }
             ).draw();
        }
    });

    // Only for debugging purposes
    console.log(JSON.stringify(result));
}
getResult();
