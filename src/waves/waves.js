const marginTop = 150,
  marginBottom = 100,
  waveSpacing = 25;

let waveAmplitude = 100,
  wavePoints = 5,
  waveLength = 8e6,
  waveSmoothnessFactor = 120,
  waveAmplitudeStep = 10;

const waveColor = "#F8F8FF",
  backgroundColor = "#1c2e4a";

function setup() {
  createCanvas(500, 600).id("waves");
  noFill();
  stroke(waveColor);
  strokeWeight(2);
}

function draw() {
  background(backgroundColor);

  // create wave
  for (let y = marginTop; y < height - marginBottom; y += waveSpacing) {
    beginShape();
    let waveSpeed = frameCount;
    let waveOffset = waveSpeed - y * 0.5 - 100;
    for (let x = 0; x < width; x += wavePoints) {
      let waveHeightOffset = waveAmplitude - y / waveAmplitudeStep;
      let ny = noise(x / waveSmoothnessFactor, y / waveSmoothnessFactor);
      let dy = (waveHeightOffset / (1 + pow(x - waveOffset, 4) / waveLength)) * ny;
      vertex(x, y - dy);
    }
    endShape();

    // reset wave
    if (waveOffset > width * 1.5 + 100) {
      frameCount = 1;
    }
  }
}
