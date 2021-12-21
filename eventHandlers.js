const logger = require('./db/logger.js');

exports.sendEvent = null;

exports.registerEventHandlers = function (source) {
    // Anzahl Türöffungen soweit
    source.addEventListener('tuerOeffnungsCounter', handleCarSecurityEvents);

    // Auto Status derzeit
    source.addEventListener('autoStatus', handleCarSecurityEvents);

    // Alarm geht zu
    source.addEventListener('alarmStatus', handleCarSecurityEvents);

    // Alarm manuel abgestellt
    source.addEventListener('manualSwitchOffAlarm', handleCarSecurityEvents);

    // Meldungen aus dem Argon
    source.addEventListener('meldung', handleCarSecurityEvents);

}

function handleCarSecurityEvents(event) {
    // read variables from the event
    var data = {
        eventName: event.type,
        eventData: JSON.parse(event.data).data, // the value of the event
        deviceId: JSON.parse(event.data).coreid,
        timestamp: JSON.parse(event.data).published_at
    };

    try {        
      
        //console.log("batticha") //Debugging

        // Log the event in the database
        logger.logOne("MyDB", "carSecuritySystem", data);

        // send data to all connected clients
        exports.sendEvent(data);
    } catch (error) {
        console.log("Could not handle event: " + JSON.stringify(event) + "\n");
        console.log(error)
    }
}