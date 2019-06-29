import { settingsStorage } from "settings";
import * as messaging from "messaging";
import { me } from "companion";

let KEY_COLOR = "themeColor";

settingsStorage.onchange = function(evt) {
  if (evt.oldValue !== evt.newValue) {
    sendValue(evt.key, evt.newValue);
  }
}

// Settings were changed while the companion was not running	
if (me.launchReasons.settingsChanged) {	
  // Send the value of the setting	
  sendValue(KEY_COLOR, settingsStorage.getItem(KEY_COLOR));	
}

function sendValue(key, val) {
  if (val) {
    sendSettingData({
      key: key,
      value: JSON.parse(val)
    });
  }
}

function sendSettingData(data) {
  // If we have a MessageSocket, send the data to the device
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    messaging.peerSocket.send(data);
  } else {
    console.log("No peerSocket connection");
  }
}