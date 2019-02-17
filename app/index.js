import clock from "clock";
import { HeartRateSensor } from "heart-rate";
import { battery } from "power";
import document from "document";
import { preferences } from "user-settings";
import userActivity from "user-activity"; 
import * as util from "../common/utils";

const BATTERY_FULL_PATH = '../resources/icons/battery-full.png';
const BATTERY_HIGH_PATH = '../resources/icons/battery-high.png';
const BATTERY_HALF_PATH = '../resources/icons/battery-half.png';
const BATTERY_LOW_PATH = '../resources/icons/battery-low.png';

const weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Get a handle on the <text> element
const hourLabel = document.getElementById("hour");
const minuteLabel = document.getElementById("minute");
const dateLabel = document.getElementById("date");
const stepsLabel = document.getElementById("steps");
const batteryLabel = document.getElementById("battery");
const heartRateLabel = document.getElementById("heart-rate");

const batteryIcon = document.getElementById("battery-icon");


// == CLOCK AND DATE ==

// Update the clock every minute
clock.granularity = "minutes";

// Update the <text> element every tick with the current time
clock.ontick = (evt) => {
  let today = evt.date;
  let hours = today.getHours();
  if (preferences.clockDisplay === "12h") {
    // 12h format
    hours = hours % 12 || 12;
  }
  // pad zero for both 12h and 24h format
  hours = util.zeroPad(hours);

  hourLabel.text = hours;
  minuteLabel.text = util.zeroPad(today.getMinutes());
  dateLabel.text = weekday[today.getDay()] + " " + today.getDate();


    // == BATTERY ==
    let batteryLevel = battery.chargeLevel;

    // Assignment value battery
    batteryLabel.text = `${batteryLevel} %`; 
    // Update battery icon based on battery level
    if(batteryLevel >= 90) {
        batteryIcon.href = BATTERY_FULL_PATH;
    } else if(batteryLevel > 60) {
        batteryIcon.href = BATTERY_HIGH_PATH;
    } else if(batteryLevel > 30) {
        batteryIcon.href = BATTERY_HALF_PATH;
    } else {
        batteryIcon.href = BATTERY_LOW_PATH;
    }

    // == STEPS ==
    stepsLabel.text = (userActivity.today.adjusted["steps"] || 0);
}



// == HEART RATE ==

// Create a new instance of the HeartRateSensor object
var hrm = new HeartRateSensor();
// Initialize the UI with some values
heartRateLabel.text = "--";

// Declare an event handler that will be called every time a new HR value is received.
hrm.onreading = function() {
  heartRateLabel.text = hrm.heartRate;
}

// Begin monitoring the sensor
hrm.start();


