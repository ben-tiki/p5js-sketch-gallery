// SONG PRELOAD
// ---------------------------------------
let song;
function preload() {
	song = loadSound('../../audio/song.mp3');
}

// ANIMATION AND SETUP
// ---------------------------------------
const canvasSize = 800;
const scale = 18;
const gridWidth = 800;
const gridHeight = 500;

const noiseMult = 100;
const waveMult = 10;

let terrain = [];
let cols, rows;

let fft;
function setup() {
	createCanvas(canvasSize, canvasSize, WEBGL).id('canvas');

	cols = gridWidth / scale;
	rows = gridHeight / scale;

	// initialize terrain with zeros
	for (let x = 0; x < cols; x++) {
		terrain[x] = [];
		for (let y = 0; y < rows; y++) {
			terrain[x][y] = 0;
		}
	}

	// audio
	fft = new p5.FFT();

	strokeWeight(0.5);

	pixelDensity(3);
}

// DRAW
// ---------------------------------------
const backgroundColor = '#493323';
const gridColor = '#FFDF91';
function draw() {
	updateTerrain();

	// color
	background(backgroundColor);
	stroke(gridColor);

	// fill
	let fillColor = color(gridColor);
	fillColor.setAlpha(60);
	fill(fillColor);

	// camera
	translate(0, -100, -500);
	rotateX(PI / 4);
	rotateY(-PI / 20);
	translate(-gridWidth / 2, -gridHeight / 2);

	for (let y = 0; y < rows - 1; y++) {
		beginShape(TRIANGLE_STRIP);

		for (let x = 0; x < cols - 1; x++) {
			// apply noise
			let noiseMultFinal = noise(x * 0.05, y * 0.05, frameCount * 0.01) * noiseMult;

			vertex(x * scale, y * scale, terrain[x][y] + noiseMultFinal);
			vertex(x * scale, (y + 1) * scale, terrain[x][y + 1] + noiseMultFinal);
			
		}
		endShape();
	}
}

// AUDIO ANALYSIS
// ---------------------------------------
const interpolationFactor = 0.8;
function updateTerrain() {
	let spectrum = fft.analyze();

	let centerX = floor(cols / 2);
	let centerY = floor(rows / 2);

	let radius = min(centerX, centerY) * 5;
	let maxHeight = 200;

	// Loop through the terrain grid
	for (let x = 0; x < cols; x++) {
		for (let y = 0; y < rows; y++) {
			let distance = dist(x, y, centerX, centerY);

			let index = floor(map(distance, 0, radius, 0, spectrum.length));
			let height = map(spectrum[index], 0, 255, 0, maxHeight) * (1 - (distance / radius) * 1.5);

			terrain[x][y] = lerp(terrain[x][y], height, interpolationFactor);
		}
	}
}

// EVENT LISTENERS
// ---------------------------------------
function keyPressed() {
    if (key == ' ') {
        // hide message
        let message = document.getElementById('message');
        message.style.visibility = 'hidden';

        if (song.isPlaying()) {
            song.pause();
        } else {
            song.play();
        }
    }
}

function windowResized() {
	resizeCanvas(canvasSize, canvasSize);
}
