const animationSize = 550;

// stars
const starNumber = 50;
const stars = [];
const shootingStars = [];

// planets
const planetX = animationSize - 150;
const planetY = animationSize - 350;

// waves
const waveNumber = 5;
const waveSeparation = 20;
const waveStart = 350;

const waveColor = 'rgb(255, 253, 250)';
const backgroundColor = 'rgb(95, 158, 160)';
const sunColor = 'rgb(41, 106, 109)';

// SETUP AND STAR CREATION
// ---------------------------------------
function setup() {
	
	createCanvas(animationSize, animationSize).id('ocean');

	// star creation
	for (let i = 0; i < starNumber; i++) {
		stars.push({
			x: random(0, animationSize),
			y: random(0, animationSize - waveStart / 2),
			size: random(1, 3),
		});
	}

	strokeWeight(1 / 4);
}

// DRAW
// ---------------------------------------
function draw() {
	background(backgroundColor);

	// draw stars
	push();
	for (let i = 0; i < stars.length; i++) {
		let star = stars[i];
		noStroke();
		let alpha = map(noise(i, frameCount * 0.05), 0, 1, 0, 255);
		let starColor = color(waveColor);
		starColor.setAlpha(alpha);
		fill(starColor);
		ellipse(star.x, star.y, star.size, star.size);
	}
	pop();

	// create shooting stars
	if (random(0, 1) < 0.005) {
		shootingStars.push({
			x: random(0, animationSize),
			y: random(0, animationSize - waveStart / 3),
			size: random(0.5, 1.5),
			speed: random(1, 3),
			alpha: 255,
			prevX: [],
			prevY: [],
		});
	}

	// draw shooting stars
	push();
	for (let i = 0; i < shootingStars.length; i++) {
		drawShootingStar(shootingStars[i]);
	}
	pop();

	// draw sun
	push();
	fill(sunColor);
	ellipse(planetX, planetY, animationSize / 6, animationSize / 6);
	pop();

	// draw waves
	push();
	for (let i = 0; i < waveNumber; i++) {
		drawWave(i);
	}
	pop();
}

// HELPER FUNCTIONS
// ---------------------------------------
function drawWave(waveIndex) {

	// set opacity
	let currentWaveColor = color(waveColor);
	currentWaveColor.setAlpha(map(waveIndex, 0, waveNumber, 40, 100));

	fill(currentWaveColor);
	beginShape();

	// wave creation
	let waveSmoothing = map(waveIndex, 0, waveNumber, 0, 25);
	let waveSpeed = map(waveIndex, 0, waveNumber, 20, 100);
	for (let i = 0; i < width; i++) {
		let x = map(i, 0, width, 0, TWO_PI);
		let y = sin(x + frameCount / waveSpeed) * waveSmoothing;
		y += noise((i * 1) / 100, (frameCount * 1) / 100) * (10 - waveIndex * 10);
		vertex(i, y + waveIndex * waveSeparation + waveStart);
	}

	vertex(width, height);
	vertex(0, height);
	endShape(CLOSE);
}

function drawShootingStar(star) {
	star.prevX.push(star.x);
	star.prevY.push(star.y);

	if (star.prevX.length > 10) {
		star.prevX.shift();
		star.prevY.shift();
	}

	for (let i = 0; i < star.prevX.length; i++) {
		let alpha = map(i, 0, star.prevX.length, 0, star.alpha);
		let starColor = color(waveColor);
		let r = starColor.levels[0];
		let g = starColor.levels[1];
		let b = starColor.levels[2];
		stroke(r, g, b, alpha);
		strokeWeight(star.size);
		line(star.x, star.y, star.prevX[i], star.prevY[i]);
	}

	star.x += star.speed;
	star.y += star.speed;

	if (star.y > waveStart) {
		shootingStars.splice(shootingStars.indexOf(star), 1);
	}

	star.alpha -= 5;
}
