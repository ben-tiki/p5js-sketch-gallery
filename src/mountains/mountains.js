const BACKGROUND_COLOR = "#FFFFFF";
const FILL_COLOR_ONE = "#666666";
const FILL_COLOR_TWO = "#444444";
const FILL_COLOR_THREE = "#171717";

const SKETCH_WIDTH = window.innerWidth + 100;
const SKETCH_HEIGHT = window.innerHeight;

const VERTEX_STEP = 10;
const NOISE_STEP = 0.07;
const STATIC_NOISE_DENSITY = 400_000;

// CREATE CANVAS
// ---------------------------------------
function setup() {
    createCanvas(SKETCH_WIDTH, SKETCH_HEIGHT).id('mountains-canvas')
    noLoop();
};

// DRAW
// ----------------------------------------
function draw() {
    background(BACKGROUND_COLOR);

    // 'mountains' from top to bottom
    fill(FILL_COLOR_ONE);
    noStroke();
    drawMountain(0, 150, 300);

    fill(FILL_COLOR_TWO);
    noStroke();
    drawMountain(100, 200, 320);

    fill(FILL_COLOR_THREE);
    noStroke();
    drawMountain(200, 250, 400);

    drawStaticNoise();
};

function drawMountain(yoff, ymin, ymax) {
    beginShape();
    let xoff = 0;
    for (let x = 0; x <= width; x += VERTEX_STEP) {
        let y = map(noise(xoff, yoff), 0, 1, ymin, ymax);
        vertex(x, y);
        xoff += NOISE_STEP;
    }
    vertex(width, height);
    vertex(0, height);
    endShape(CLOSE);
};

function drawStaticNoise() {
    strokeWeight(1);
    for (let i = 0; i < STATIC_NOISE_DENSITY; i++) {
        const x = random(width);
        const y = random(height);
        stroke(255, 15);
        point(x, y);
    }
};
