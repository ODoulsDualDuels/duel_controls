

// this constant won't change:
const int  greenButtonPin = 6;    // the pin that the pushbutton is attached to
const int  redButtonPin = 4;    // the pin that the pushbutton is attached to
const int ledPin = 13;       // the pin that the LED is attached to

int redButtonState = 0;         // current state of the button
int lastPressedRedButton = millis();

int greenButtonState = 0;         // current state of the button
int lastPressedGreenButton = millis();

void setup() {
  // initialize the button pin as a input:
  pinMode(redButtonPin, INPUT);
  pinMode(greenButtonPin, INPUT);
  // initialize the LED as an output:
  pinMode(ledPin, OUTPUT);
  // initialize serial communication:
  Serial.begin(9600);
}


void loop() {
  // read the pushbutton input pin:
  redButtonState = digitalRead(redButtonPin);
  if (redButtonState == LOW) {
    int lastPressedDiffRedButton = lastPressedRedButton - millis();
    if (lastPressedDiffRedButton < -50) {
      Serial.write(3);
    }
    lastPressedRedButton = millis();
  }

  // read the pushbutton input pin:
  greenButtonState = digitalRead(greenButtonPin);
  if (greenButtonState == LOW) {
    int lastPressedDiffGreenButton = lastPressedGreenButton - millis();
    if (lastPressedDiffGreenButton < -50) {
      Serial.write(4);
    }
    lastPressedGreenButton = millis();
  }
  


}

void send_message(char message[]) {
  // Signal "Start of Message"
  Serial.write(2); // STX byte

  // String to send
  Serial.print(message);

  // Signal "End of Message"
  Serial.write(3);
}
