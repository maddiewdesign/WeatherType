let cell = 10;
let t = 0;

let precipitation = 90;

let slider;
let valueDisplay;

let density;
let frequency;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();

  slider = document.getElementById("rainfall");
  valueDisplay = document.getElementById("rainValue");
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background(255);

  precipitation = Number(slider.value);

  // Update number display
  valueDisplay.textContent = precipitation + "%";

  density = map(precipitation, 0, 100, 0.15, 0.85);
  frequency = map(precipitation, 0, 100, 0.002, 0.02);

  t += frequency;

  for (let y = 0; y < height; y += cell) {
    for (let x = 0; x < width; x += cell) {

      let rain = noise(x * 0.01, y * 0.01, t);
      let threshold = map(density, 0, 1, 0.7, 0.25);

      let intensity = constrain(
        map(rain, threshold, 1, 0, 1),
        0,
        1
      );

      let d = intensity * cell * 0.9;

      if (d > 0) {
        fill(0);
        ellipse(x + cell / 2, y + cell / 2, d, d);
      }
    }
  }
}