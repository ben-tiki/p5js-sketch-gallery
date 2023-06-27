const tileSize = 64;
const rectLightnessArray = new Array(tileSize * tileSize);

// reflection, hue and saturation
const reflection = 0.85;
const rectHue = 200;
const rectSaturation = 100;

let looping = false;
function setup() {
    createCanvas(windowWidth, windowHeight);
    frameRate(60);
    noStroke();
    colorMode(HSB);

    noLoop();
}

// DRAW
// ---------------------------------------
function draw() {
    // get mouse positions
    let mapMouseX = map(mouseX, 0, width, 0, tileSize);
    let mapMouseY = map(mouseY, 0, height, 0, tileSize);

    for (let i = 0; i < tileSize; i++) {
        for (let j = 0; j < tileSize; j++) {

            // distance from mouse
            let pos = Math.hypot(i - mapMouseX, j - mapMouseY)

            // lightness
            let rectLightness = (rectLightnessArray[i * tileSize + j] = rectLightnessArray[i * tileSize + j] * reflection + tileSize / (pos + 0.01) || 0);

            fill(rectHue, rectSaturation, rectLightness);
            rect(
                (i * width) / tileSize,
                (j * height) / tileSize,
                width / tileSize,
                height / tileSize
            );
        }
    }
}

function mouseMoved() {
    if (!looping) {
        loop();
    }
}
