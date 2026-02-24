let cell = 8;
let t = 0;

let precipitation = 0;
let pg;

let currentCity = "MANCHESTER";

let input;

function setup() {
  createCanvas(1500, 1000);
  noStroke();

  textFont("parabolica");

  pg = createGraphics(width, height);
  pg.pixelDensity(1);

  // ---- Minimal Exhibition Input ----
  input = createInput(currentCity);
  input.position(40, 40);
  input.size(260);

  input.style("font-family", "parabolica");
  input.style("font-weight", "700");
  input.style("font-size", "18px");
  input.style("letter-spacing", "1px");
  input.style("background", "transparent");
  input.style("border", "none");
  input.style("outline", "none");
  input.style("color", "black");
  input.style("border-bottom", "1px solid black");

  getWeatherByCity(currentCity);
}

function draw() {
  background(255);

  let density = map(precipitation, 0, 100, 0.3, 1.0);
  let frequency = map(precipitation, 0, 100, 0.002, 0.02);

  t += frequency;

  // --- TYPO BUFFER ---
  pg.background(0);
  pg.fill(255);
  pg.textAlign(CENTER, CENTER);
  pg.textFont("parabolica");
  pg.textStyle(BOLD);
  pg.textSize(200);

  // 🔥 CITY NAME REPLACES "RAIN"
  pg.text(currentCity.toUpperCase(), width / 2, height / 2);

  pg.loadPixels();

  // --- HALFTONE SYSTEM ---
  for (let y = 0; y < height; y += cell) {
    for (let x = 0; x < width; x += cell) {

      let index = 4 * (int(y) * width + int(x));
      let brightness = pg.pixels[index];

      if (brightness > 128) {

        let rain = noise(x * 0.01, y * 0.01, t);
        let threshold = map(density, 0, 1, 0.7, 0.25);
        let intensity = constrain(
          map(rain, threshold, 1, 0, 1),
          0,
          1
        );

        let d = pow(intensity, 1.3) * cell;

        if (d > 0.5) {
          fill(0);
          ellipse(x, y, d, d);
        }
      }
    }
  }

  // subtle data readout
  fill(0);
  textSize(14);
  textAlign(LEFT, TOP);
  text("Rain Probability: " + nf(precipitation, 1, 1) + "%", 40, 80);
}

// Trigger update on ENTER
function keyPressed() {
  if (keyCode === ENTER) {
    currentCity = input.value();
    getWeatherByCity(currentCity);
  }
}

// -----------------------------
// GET WEATHER BY CITY NAME
// -----------------------------
function getWeatherByCity(city) {

  // Step 1: Geocode city name
  let geoURL =
    `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`;

  fetch(geoURL)
    .then(res => res.json())
    .then(geoData => {

      if (!geoData.results) return;

      let lat = geoData.results[0].latitude;
      let lon = geoData.results[0].longitude;

      // Step 2: Get precipitation probability
      let weatherURL =
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=precipitation_probability&forecast_days=1`;

      return fetch(weatherURL);
    })
    .then(res => res.json())
    .then(data => {

      if (!data || !data.hourly) return;

      precipitation = data.hourly.precipitation_probability[0];

      console.log("City:", city);
      console.log("Precipitation:", precipitation);
    })
    .catch(err => {
      console.log("Weather fetch failed");
      precipitation = 50;
    });
}