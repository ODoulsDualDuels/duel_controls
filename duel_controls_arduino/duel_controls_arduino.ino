// this constant won't change:
const int  greenButtonPin = 6;    // the pin that the pushbutton is attached to
const int  redButtonPin = 4;    // the pin that the pushbutton is attached to
int redButtonState = 0;         // current state of the button
int lastPressedRedButton = millis();

int greenButtonState = 0;         // current state of the button
int lastPressedGreenButton = millis();

void setup() {
  // initialize the button pin as a input:
  pinMode(redButtonPin, INPUT);
  pinMode(greenButtonPin, INPUT);
  // initialize serial communication:
  Serial.begin(9600);
}

void loop() {
  // read the pushbutton input pin:
  redButtonState = digitalRead(redButtonPin);
  if (redButtonState == LOW) {
    int lastPressedDiffRedButton = lastPressedRedButton - millis();
    if (lastPressedDiffRedButton < -16) {
      Serial.write(3);
      Serial.println("red");
    }
    lastPressedRedButton = millis();
  }

  // read the pushbutton input pin:
  greenButtonState = digitalRead(greenButtonPin);
  if (greenButtonState == LOW) {
    int lastPressedDiffGreenButton = lastPressedGreenButton - millis();
    if (lastPressedDiffGreenButton < -16) {
      Serial.write(4);
      Serial.println("green");
    }
    lastPressedGreenButton = millis();
  }

}

