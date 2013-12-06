/**
 * @file
 *
 * Quick and simple abstraction for sending string messages to / from arduino
 * seperated via STX/ETX bytes.
 */

var serialport = require("serialport");
var SerialPort = serialport.SerialPort;

/**
 *  Dummy function
 *
 *  @TODO: see if this can be found in a more proper way
 */
function ArduinoSerial () {
  /*
    Dont forget to:
    sudo chmod 666 /dev/serial/by-id/usb-Arduino__www.arduino.cc__0043_9523234373335180E1F0-if00

    (for now) or run as sudo?
  */
  var ArduinoSerial = new SerialPort("/dev/tty.usbmodemfa131", {
    baudrate: 9600
  });

  this.serial = ArduinoSerial;
}

ArduinoSerial.prototype.log = console.log;

/**
 * A listener for simple string messages, seperated by STX/ETX bytes
 *
 * http://www.lammertbies.nl/comm/info/ascii-characters.html
 */
ArduinoSerial.prototype.listener = function(callback) {

  var self = this;

  self.serial.on("open", function () {

    self.log('opened serial port');

    var message = '';

    // recieved some bytes from arduino
    self.serial.on('data', function(bytes) {

      // We could be in the middle of a message, so keep a look out.
      for(var i = 0; i < bytes.length; i++) {

        // "Start of message" STX byte has been sent.
        if (bytes[i] === 3) {
          callback('red_button_pressed');
          self.publish('red_button_pressed');
        }

        // "End of message" ETX byte has been sent.
        if (bytes[i] === 4) {
          callback('green_button_pressed');
          self.publish('green_button_pressed');
        }
      }

    });

  });

}

ArduinoSerial.prototype.send = function (message) {
  var self = this;
  self.serial.write(message + "\u0002", function(err, results) {
    if (err) console.log(err);
    console.log('sent: ' + message);
  });
};

ArduinoSerial.prototype.publish = function(topic, args){
  var self = this;
  if (this._eventCache && this._eventCache[topic]) {
    this._eventCache[topic].forEach(function (topicSubscriber) {
      topicSubscriber.apply(self, args || []);
    });
  }
};

ArduinoSerial.prototype.subscribe = function (topic, callback) {
  if (!this._eventCache) this._eventCache = {};
  if (!this._eventCache[topic]) this._eventCache[topic] = [];
  this._eventCache[topic].push(callback);

  return [topic, callback];
}

ArduinoSerial.prototype.on = ArduinoSerial.prototype.subscribe;

ArduinoSerial.prototype.trigger = ArduinoSerial.prototype.publish;

ArduinoSerial.prototype.unsubscribe = function(handle){
  var self = this;
  if (this._eventCache && this._eventCache[handle[0]]) {
    this._eventCache[handle[0]].forEach(function (callback, i) {
      if (handle[1] === callback) {
        self._eventCache[handle[0]].splice(i, 1);
      }
    });
  }
};

module.exports = {
  ArduinoSerial: ArduinoSerial
};
