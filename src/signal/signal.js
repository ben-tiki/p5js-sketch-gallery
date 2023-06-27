const verticalRectColors = ['#ffffff', '#ffec06', '#0cdbf9', '#7cfe0a', '#ff1be1', '#f50158', '#551cff'];
const horizontalRectColors = ['#1717f9', '#000000', '#fd19de', '#000000', '#92fce8', '#000000', '#cdcdcd'];

let gradientStart = '#f6f6f6';
let gradientEnd = '#666666';

const bannerColor = '#000000';
const textColor = '#ffffff';

const backgroundColor = '#000000';
const startTintColor = '#ff0000';
const endTintColor = '#00ffff';

// SETUP AND CREATE CANVAS
// ---------------------------------------
function setup() {
	createCanvas(windowWidth, windowHeight);
	noStroke();
}

// IMAGE GENERATION & MODIFICATION
// ---------------------------------------
function generateMainImage() {

	// main color rects
	let lenColors = verticalRectColors.length;
	for (let i = 0; i < lenColors; i++) {
		fill(verticalRectColors[i]);
		rect(i * (width / lenColors), 0, width / lenColors, height);

		fill(horizontalRectColors[i]);
		rect(i * (width / lenColors), height - height / 12, width / lenColors, height / 20);
	}

	// bottom gradient
	gradientStart = color(gradientStart);
	gradientEnd = color(gradientEnd);
	push();
	for (let i = 0; i <= 0 + width; i++) {
		let inter = map(i, 0, width, 0, 1);
		let c = lerpColor(gradientStart, gradientEnd, inter);
		stroke(c);
		strokeWeight(5);
		line(i, 0 + height, i, height - height / 30);
	}
	pop();

	// banner & text
	// size depending of size of screen
	textSize(height / 12);
	let mainText = 'NO SIGNAL';
	let mainTextWidth = textWidth(mainText);

	// banner
	fill(bannerColor);
	let sidePadding = width / 12;
	let topPadding = height / 10;
	rect(width / 2 - mainTextWidth / 2 - sidePadding, height / 2 - topPadding * 1.25, mainTextWidth + sidePadding * 2, topPadding * 2);

	// text
	fill(textColor);
	text(mainText, width / 2 - mainTextWidth / 2, height / 2);

	let img = get();
	clear();

	return img;
}

function glitchImageColor(img, shiftX, shiftY) {

	push();
	blendMode(ADD);
	tint(startTintColor);
	image(img, -shiftX, -shiftY);

	tint(endTintColor);
	image(img, shiftX, shiftY);
	pop();
    
	let glitchedImg = get();
	clear();

	return glitchedImg;
}

function glitchImagePosition(img, shift, level) {
    
	image(img, 0, 0);

	for (let i = 0; i < level; i++) {
		let sx = random(img.width * 0.5);
		let sy = random(img.height * 0.1);
		let x = random(img.width - sx * 0.5);
		let y = random(img.height - sy * 0.5);

		let ix = x + random(-1, 1) * shift;
		let iy = y;

		image(img, ix, iy, sx, sy, x, y, sx, sy);
	}

	let glitchedImg = get();
	clear();

	return glitchedImg;
}

let t = 0;
function horizontalLines(lineSpacing) {
	push();
	stroke(0, 30);
	strokeWeight(1);

	for (let i = 0; i < height; i += height / lineSpacing) {
		line(0, i + sin(t) * 10, width, i + sin(t) * 10);
	}
	pop();

    t += 0.01;
}

// DRAW
// ---------------------------------------
function draw() {
	let img = generateMainImage();

	let glitchedImg = glitchImageColor(img, 5, 5);

	glitchedImg = glitchImagePosition(glitchedImg, 2.5, 2.5);

	image(glitchedImg, 0, 0);

	horizontalLines(300);
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}
