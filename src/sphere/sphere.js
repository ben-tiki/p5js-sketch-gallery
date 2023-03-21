// AUDIO & SHADERS
// ---------------------------------------
let song, sphereShader;
function preload() {
    song = loadSound('../../audio/song.mp3');
    sphereShader = loadShader('shaders/shader.vert', 'shaders/shader.frag');
}

// SETUP
// ---------------------------------------
let fft, amplitude;
function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);

    fft = new p5.FFT();
    amplitude = new p5.Amplitude();
    songDuration = song.duration() * 0.9;
}

// DRAW FUNCTION
// ---------------------------------------
let shpereSize = 0.15,
    sphereColor = 'rgb(255, 91, 153)',
    sphereLightColor = 'rgb(255, 230, 204)',
    backgroundColor = 'rgb(173, 216, 230)',
    barColor = 'rgb(255, 144, 169)';

const axisRotationSpeed = 1 / 200;

function draw() {
    background(backgroundColor);

    // time tracking
    let songCurrentTime = song.currentTime(),
        percent = songCurrentTime / songDuration;

    // progress bar
    let barWidth = width * percent;
    push();
    fill(barColor);
    noStroke();
    rect(-width / 2, -height / 2, barWidth, 10);
    pop();

    // audio analysis
    fft.analyze();
    let bass = fft.getEnergy('bass'),
        bassMap = map(bass, 0, 250, 0.7, 1.2),
        ampLevel = amplitude.getLevel(),
        ampLevelMap = map(ampLevel, 0, 1, 0, 2);

    // sphereShader uniforms
    sphereShader.setUniform('u_resolution', [width, height]);
    sphereShader.setUniform('u_time', millis() * 0.001);
    sphereShader.setUniform('u_volume', ampLevelMap);

    // color
    sphereColor = color(sphereColor).levels;
    let mainR = sphereColor[0] / 255,
        mainG = sphereColor[1] / 255,
        mainB = sphereColor[2] / 255;

    sphereShader.setUniform('u_color', [mainR, mainG, mainB]);

    // light color
    sphereLightColor = color(sphereLightColor).levels;
    let lightR = sphereLightColor[0] / 255,
        lightG = sphereLightColor[1] / 255,
        lightB = sphereLightColor[2] / 255;

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
