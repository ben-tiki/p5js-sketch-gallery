// AUDIO & SHADERS
// ---------------------------------------
let song;
let sphereShader;
function preload() {
    song = loadSound('../../audio/song.mp3');
    sphereShader = loadShader('shaders/shader.vert', 'shaders/shader.frag');
}

// SETUP
// ---------------------------------------
let fft;
let amplitude;
function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);

    fft = new p5.FFT();
    amplitude = new p5.Amplitude();
    songDuration = song.duration() * 0.9;
}

// DRAW FUNCTION
// ---------------------------------------
let shpereSize = 0.15;
let sphereColor = 'rgb(255, 91, 153)';
let sphereLightColor = 'rgb(255, 230, 204)';
let backgroundColor = 'rgb(173, 216, 230)';
let barColor = 'rgb(255, 144, 169)';

const axisRotationSpeed = 1 / 200;

function draw() {
    background(backgroundColor);

    // time tracking
    const songCurrentTime = song.currentTime();
    const percent = songCurrentTime / songDuration;

    // progress bar
    const barWidth = width * percent;
    push();
    fill(barColor);
    noStroke();
    rect(-width / 2, -height / 2, barWidth, 10);
    pop();

    // audio analysis
    fft.analyze();
    const bass = fft.getEnergy('bass');
    const bassMap = map(bass, 0, 250, 0.7, 1.2);
    const ampLevel = amplitude.getLevel();
    const ampLevelMap = map(ampLevel, 0, 1, 0, 2);

    // sphereShader uniforms
    sphereShader.setUniform('u_resolution', [width, height]);
    sphereShader.setUniform('u_time', millis() * 0.001);
    sphereShader.setUniform('u_volume', ampLevelMap);

    // color
    sphereColor = color(sphereColor).levels;
    const mainR = sphereColor[0] / 255;
    const mainG = sphereColor[1] / 255;
    const mainB = sphereColor[2] / 255;

    sphereShader.setUniform('u_color', [mainR, mainG, mainB]);

    // light color
    sphereLightColor = color(sphereLightColor).levels;
    const lightR = sphereLightColor[0] / 255;
    const lightG = sphereLightColor[1] / 255;
    const lightB = sphereLightColor[2] / 255;

    sphereShader.setUniform('u_lightColor', [lightR, lightG, lightB]);

    // main
    push();
    noStroke();

    // 3d axis rotation
    rotateY(frameCount * axisRotationSpeed);
    rotateX(frameCount * axisRotationSpeed);

    // sphereShader
    shader(sphereShader);

    // sphere
    sphere(min(width, height) * shpereSize * bassMap);
    pop();
}

// EVENT LISTENERS
// ---------------------------------------
function keyPressed() {
    if (key == ' ') {
        // hide message
        let message = document.getElementById('message');
        message.style.visibility = 'hidden';

        if (song.isPlaying()) {
            song.pause();
        } else {
            song.play();
        }
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
