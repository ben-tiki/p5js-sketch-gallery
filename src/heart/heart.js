// sphere with heart shape parameters
let bump = 0.2;
let thetaVal = 6;
let phyVal = 5;

const maxBump = 2;
const maxThetaVal = 6;
const minThetaVal = -6;

const firstPulse = 150;
const secondPulse = 165;

// colors
const strokeColor = '#c61a09';
const backgroundColor = '#ffc9bb';

// CREATE CANVAS
// ---------------------------------------
let radius;
function setup() {
	createCanvas(700, 700, WEBGL);

	angleMode(DEGREES);

	stroke(strokeColor);
	strokeWeight(1.25);

	radius = width / 6;
}

// DRAW THE SPHERE
// ---------------------------------------
let frame = 0;
let reversed = false;
function draw() {
	background(backgroundColor);

	rotateX(frameCount / 2);
	rotateY(50);

	beginShape(POINTS);
	for (let theta = 0; theta < 180; theta += 2) {
		for (let phy = 0; phy < 360; phy += 2) {
			let thetaBumpModifier = 1 + bump * sin(thetaVal * theta) * sin(phyVal * phy);
			let x = radius * thetaBumpModifier * sin(theta) * cos(phy);
			let y = radius * thetaBumpModifier * sin(theta) * sin(phy);
			let z = radius * thetaBumpModifier * cos(theta);
			vertex(x, y, z);
		}
	}
	endShape();

	// update bump
	thetaVal = updateValue(thetaVal, reversed ? maxThetaVal : minThetaVal, 0.01);
	if (!reversed && thetaVal == minThetaVal) {
		reversed = true;
	} else if (reversed && thetaVal == maxThetaVal) {
		reversed = false;
	}

	if (frame % firstPulse == 0) {
		bump = updateValue(bump, maxBump, 0.1);
	} else if (frame % secondPulse == 0) {
		bump = updateValue(bump, maxBump, 0.1);
		frame = 0;
	} else {
		bump = updateValue(bump, 0.2, 1 / 800);
	}
	frame++;
}

// HELPER FUNCTIONS
// ---------------------------------------
function updateValue(currentValue, targetValue, stepSize) {
	if (currentValue < targetValue) {
		return currentValue + stepSize;
	} else if (currentValue > targetValue) {
		return currentValue - stepSize;
	} else {
		return currentValue;
	}
}
