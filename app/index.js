import { settingsStorage } from "settings";
import * as messaging from "messaging";
import clock from "clock";
import { HeartRateSensor } from "heart-rate";
import { BodyPresenceSensor } from "body-presence";
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

// labels
const hourLabel = document.getElementById("hour");
const minuteLabel = document.getElementById("minute");
const dateLabel = document.getElementById("date");
const batteryLabel = document.getElementById("battery");
const heartRateLabel = document.getElementById("heart-rate");

const stepsLabel = document.getElementById("steps-label");
const calsLabel = document.getElementById("cals-label");
const activeMinLabel = document.getElementById("active-min-label");
const distLabel = document.getElementById("dist-label");

// icons
const heartIcon = document.getElementById("heart-icon");
const batteryIcon = document.getElementById("battery-icon");

// buttons
const activityCycleBtn = document.getElementById("activity-cycle-button");

// activities containers
const activities = document.getElementsByClassName("activity-container");

// inititialize sensors and starting values
var body = new BodyPresenceSensor();
var hrm = new HeartRateSensor();
heartRateLabel.text = "--";
clock.granularity = "minutes";

// show only one activity at a time
var visibleActivityIndex = 0;
activities.forEach(element => {
  element.style.display = "none";
});
toggle(activities[visibleActivityIndex]);

// == Cycling the Activity Stats display ==
activityCycleBtn.onactivate = function(evt) {
  // hide current activity
  toggle(activities[visibleActivityIndex])

  // show next activity
  visibleActivityIndex++;
  if(visibleActivityIndex >= activities.length) {
    visibleActivityIndex = 0;
  }
  toggle(activities[visibleActivityIndex]);
}

// Toggle Show/Hide
function toggle(ele) {
  ele.style.display = (ele.style.display === "inline") ? "none" : "inline";
}

// == CLOCK AND DATE ==

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

    // == ACTIVITIES ==
    stepsLabel.text = (userActivity.today.adjusted["steps"] || 0);
    calsLabel.text = (userActivity.today.adjusted["calories"] || 0);
    distLabel.text = Math.round((userActivity.today.adjusted["distance"] || 0) / 10) / 100 + " km";
    activeMinLabel.text = (userActivity.today.adjusted["activeMinutes"] || 0) + " min";
}

// == HEART RATE AND BODY PRESENCE ==
hrm.onreading = function() {
  heartRateLabel.text = hrm.heartRate;
}

body.onreading = () => {
  if (!body.present) {
    // Stop monitoring the heart rate sensor
    hrm.stop();
    heartRateLabel.text = "--";
  } else {
    // Begin monitoring the heart rate sensor
    hrm.start();
  }
};
body.start();

// == COLOR SETTINGS ==
messaging.peerSocket.onmessage = function(evt) {
  minuteLabel.style.fill = evt.data.value;
  heartIcon.style.fill = evt.data.value;
}