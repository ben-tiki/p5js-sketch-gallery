// AUDIO & SHADERS
// ---------------------------------------
let glassShader, song;
function preload() {
    glassShader = loadShader('shaders/shader.vert', 'shaders/shader.frag');
	song = loadSound('../../audio/song.mp3');
}

// SETUP
// ---------------------------------------
let fft, amplitude;
function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);

	fft = new p5.FFT();
	amplitude = new p5.Amplitude();
}

// DRAW FUNCTION
// ---------------------------------------
function draw() {

	// audio analysis
	fft.analyze();

	let ampLevel = amplitude.getLevel() / 2;

    shader(glassShader);
    glassShader.setUniform('u_resolution', [width * pixelDensity(), height * pixelDensity()]);
    glassShader.setUniform('u_time', millis() / 1000);
	glassShader.setUniform('u_amp', ampLevel);

    rect(0, 0, width, height);
}

// EVENT LISTENERS
// ---------------------------------------
function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}

function keyPressed() {
	if (key == ' ') {
		if (song.isPlaying()) {
			song.pause();
			document.getElementById('message').style.display = 'block';
		} else {
			song.play();
			document.getElementById('message').style.display = 'none';
		}
	}
}