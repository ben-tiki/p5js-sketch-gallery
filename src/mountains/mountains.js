const backgroundColor = "#FFFFFF";
const fillColorOne = "#666666";
const fillColorTwo = "#444444";
const fillColorThree = "#171717";

const sketchWidth = window.innerWidth + 100;
const sketchHeight = window.innerHeight;

const vertexStep = 10;
const noiseStep = 0.07;
const staticNoiseDensity = 400_000;

// SETUP
// ----------------------------------------
function setup() {
    createCanvas(sketchWidth, sketchHeight).id('mountains')
    noLoop();
};

// DRAW
// ----------------------------------------
function draw() {
    background(backgroundColor);

    // 'mountains' from top to bottom
    fill(fillColorOne);
    noStroke();
    drawMountain(0, 150, 300);

    fill(fillColorTwo);
    noStroke();
    drawMountain(100, 200, 320);

    fill(fillColorThree);
    noStroke();
    drawMountain(200, 250, 400);

    drawStaticNoise();
};

function drawMountain(yoff, ymin, ymax) {
    beginShape();
    let xoff = 0;
    for (let x = 0; x <= width; x += vertexStep) {
        let y = map(noise(xoff, yoff), 0, 1, ymin, ymax);
        vertex(x, y);
        xoff += noiseStep;
    }
    vertex(width, height);
    vertex(0, height);
    endShape(CLOSE);
};

function drawStaticNoise() {
    strokeWeight(1);
    for (let i = 0; i < staticNoiseDensity; i++) {
        const x = random(width);
        const y = random(height);
        stroke(255, 15);
        point(x, y);
    }
};
