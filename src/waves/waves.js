const marginTop = 150,
	marginBottom = 100,
	waveSpacing = 25;

let waveAmplitudeStart = 100,
	waveAmplitude = waveAmplitudeStart,
	wavePoints = 5,
	waveLength = 8e6,
	waveSmoothnessFactor = 120,
	waveAmplitudeStep = 10;

const waveColor = '#F8F8FF',
	backgroundColor = '#1c2e4a';

function setup() {
	createCanvas(500, 600).id('waves');
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
		let waveOffset = width / 2 - y / 2 + waveSpeed - width / 2;
		for (let x = 0; x < width; x += wavePoints) {
			let waveHeightOffset = waveAmplitude - y / waveAmplitudeStep;
			dy = (waveHeightOffset / (1 + pow(x - waveOffset, 4) / waveLength)) * noise(x / waveSmoothnessFactor, y / waveSmoothnessFactor);
			vertex(x, y - dy);
		}
		endShape();

		// reset wave
		if (y + waveSpacing >= height - marginBottom && waveOffset > width * 1.25) {
			frameCount = 0;

			// modulate wave amplitude
			waveAmplitude = random(waveAmplitudeStart - waveAmplitudeStart / 4, waveAmplitudeStart + waveAmplitudeStart / 4);
		}
	}
}
