// CIRCLE AND SETUP
// ---------------------------------------
const numCircles = 5;
const containerWidth = 400;
let circles = [];
function setup() {
	createCanvas(windowWidth, windowHeight);

    frameRate(60);
    colorMode(RGB);

    // A minor pentatonic scale
    const notes = {
        A: color('rgb(128,154,206)'),
        C: color('rgb(149,184,209)'),
        D: color('rgb(184,224,210)'),
        E: color('rgb(214,234,223)'),
		G: color('rgb(251,255,243)'),
    };

	for (let i = 0; i < numCircles; i++) {
		let angle = random(0, 2 * PI);
		let circle = {
			x: width / 2 + (containerWidth / 2) * cos(angle) * random(0.5, 1),
			y: height / 2 + (containerWidth / 2) * sin(angle) * random(0.5, 1),
			note: Object.keys(notes)[i],
			radius: 15,
			direction: angle,
			velocity: 1,
			color: Object.values(notes)[i],
		};
		circles.push(circle);
	}
}

// DRAW
// ---------------------------------------
const containerFillColor = '#e1f1fd';
const containerStrokeColor = '#b3d4e8';
function draw() {

	// main circle
	push();
	fill(containerFillColor);
	stroke(containerStrokeColor);
    strokeWeight(0.25);
	ellipse(width / 2, height / 2, containerWidth);
	pop();

	// bouncing circles
	push();
	for (let i = 0; i < circles.length; i++) {
		let circle = circles[i];

        // set alpha
        if(frameCount % 5 == 0){
            circle.color.setAlpha(255);
        }

		// bounce off the edges
		let distance = dist(circle.x, circle.y, width / 2, height / 2);
		if (distance > containerWidth / 2 - circle.radius / 2) {
			circle.direction = atan2(height / 2 - circle.y, width / 2 - circle.x) + random(-PI / 4, PI / 4);

			// play note
			playNote(circle);

            // set alpha
            circle.color.setAlpha(100);
		}

		circle.x += circle.velocity * cos(circle.direction);
		circle.y += circle.velocity * sin(circle.direction);

        fill(circle.color);
		noStroke();

		ellipse(circle.x, circle.y, circle.radius);
	}
	pop();
}

function playNote(circle) {
	let note = circle.note;
	let audio = new Audio(`../../audio/notes/${note}5.mp3`);
	audio.play();
}
