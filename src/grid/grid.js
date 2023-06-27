// SONG PRELOAD
// ---------------------------------------
let song;
function preload() {
	song = loadSound('../../audio/song.mp3');
}

// ANIMATION AND SETUP
// ---------------------------------------
const canvasSize = 800;
const scale = 10;
const gridWidth = 900;
const gridHeight = 600;

const waveMult = 25;

let terrain = [];
let cols;
let rows;

const backgroundColor = '#493323';
const gridColor = '#FFDF91';

let fft;
function setup() {
	createCanvas(canvasSize, canvasSize, WEBGL).id('grid');

	cols = gridWidth / scale;
	rows = gridHeight / scale;

	// initialize terrain with zeros
	terrain = Array.from({length: cols}, () => Array(rows).fill(0));

	// audio
	fft = new p5.FFT();

	strokeWeight(0.5);

}

// DRAW
// ---------------------------------------
function draw() {
	updateTerrain();

	// color
	background(backgroundColor);
	stroke(gridColor);

	// fill
	let fillColor = color(gridColor);
	fillColor.setAlpha(50);
	fill(fillColor);

	// camera
	translate(0, -200, -500);
	rotateX(PI / 4);
	rotateY(-PI / 20);
	translate(-gridWidth / 2, -gridHeight / 2);

	for (let y = 0; y < rows - 1; y++) {
		beginShape(QUAD_STRIP);

		for (let x = 0; x < cols - 1; x++) {
			vertex(x * scale, y * scale, terrain[x][y]);
			vertex(x * scale, (y + 1) * scale, terrain[x][y + 1]);
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

	let radius = sqrt(sq(centerX) + sq(centerY));
	let maxHeight = 100;

	// loop through the terrain grid
	for (let x = 0; x < cols; x++) {
		for (let y = 0; y < rows; y++) {
			let distance = dist(x, y, centerX, centerY);

			let index = floor(map(distance, 0, radius, 0, spectrum.length / 1.5));
			let height = map(spectrum[index], 0, 255, 0, maxHeight);

			// adjust the wave effect to be more pronounced in the center
			let waveFactor = map(distance, 0, radius, 2.5, 1); 

			height += (sin(frameCount * 0.025 + distance * 0.2) * waveMult) * waveFactor;

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
