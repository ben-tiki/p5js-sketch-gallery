// SHADERS
// ---------------------------------------
let glassShader;
function preload() {
    glassShader = loadShader('shaders/shader.vert', 'shaders/shader.frag');
}

// SETUP
// ---------------------------------------
function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
}

// DRAW FUNCTION
// ---------------------------------------
function draw() {

    shader(glassShader);
    // send the resolution and time to the shader
    glassShader.setUniform('u_resolution', [width * pixelDensity(), height * pixelDensity()]);
    glassShader.setUniform('u_time', millis() / 1000);

    rect(0, 0, width, height);
}

// EVENT LISTENERS
// ---------------------------------------
function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}