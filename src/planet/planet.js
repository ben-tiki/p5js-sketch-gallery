const animationWidth = 2500;
const animationHeight = 1500;

const planetRadius = 200;

const numRingParticles = 1024;
const ringParticles = [];
const ringParticleDiameter = 1.5;
const ringParticleSpeed = 0.001;
const ringRadius = 1;

const stars = [];
const numStars = 1000;

let shootingStars = [];

const planetColor = 'rgb(235,78,117)';
const backgroundColor = 'rgb(30,33,113)';
const ringColor = 'rgb(255,117,148)';
const starColor = 'rgb(255,117,148)';

const audioWaveIntesity = 40;

// PRELOAD AUDIO
// ---------------------------------------
let song;
let fft
let amplitude;
function preload() {
    song = loadSound('../../audio/song.mp3');
}

// SETUP & CREATE RING AND STARS
// ---------------------------------------
function setup() {
    createCanvas(animationWidth, animationHeight).id('planet');

    // planet ring
    for (let i = 0; i < numRingParticles; i++) {
        // apply offset to hide circle join
        let offSet = 1.5;
        let angle = map(i, 0, numRingParticles, 0, TWO_PI) - offSet;
        ringParticles.push({
            angle: angle,
            size: ringParticleDiameter,
        });
    }

    // star creation
    for (let i = 0; i < numStars; i++) {
        stars.push({
            x: random(0, animationWidth),
            y: random(0, animationHeight),
            size: random(1, 5),
        });
    }

    fft = new p5.FFT();
    amplitude = new p5.Amplitude();

    strokeWeight(3);
}

// DRAW PLANET, RING, STARS, SHOOTING STARS
// ---------------------------------------
function draw() {
    background(backgroundColor);

    // audio analysis
    fft.analyze();
    let waveForm = fft.waveform();

    let ampLevel = amplitude.getLevel();
    let ampMap = map(ampLevel, 0, 1, 1, 1.2);

    // draw stars
    push();
    for (let i = 0; i < stars.length; i++) {
        let star = stars[i];
        noStroke();
        let alpha = map(noise(i, frameCount * 0.1), 0, 1, 0, 255);
        let fillColor = color(starColor);
        fillColor.setAlpha(alpha);
        fill(fillColor);

        ellipse(star.x, star.y, star.size);
    }

    pop();

    // create shooting stars
    if (random(0, 1) < 0.05) {
        shootingStars.push({
            x: random(0, width),
            y: random(0, height),
            size: random(1, 2),
            speed: random(3, 5),
            alpha: 255,
            prevX: [],
            prevY: [],
        });
    }

    // draw shooting stars
    push();
    for (let i = 0; i < shootingStars.length; i++) {
        drawShootingStar(shootingStars[i]);
    }
    pop();

    // main planet
    push();
    fill(planetColor);
    noStroke();
    ellipse(width / 2, height / 2, planetRadius * ampMap);
    pop();

    // planet ring
    push();
    fill(ringColor);
    for (let i = 0; i < ringParticles.length; i++) {
        drawPlanetRing(ringParticles[i], i, waveForm, ampMap);
    }
    pop();
}

// HELPER FUNCTIONS
// ---------------------------------------
function drawPlanetRing(particle, i, waveform, ampMap) {
    let centerDistance = dist(particle.x, particle.y, width / 2, height / 2);
    let overlapSun = centerDistance < (planetRadius / 1.8) * ampMap;

    let isFrontSun = particle.y > 0.16 * particle.x + 550;

    particle.x = width / 2 + cos(particle.angle) * planetRadius * ringRadius;
    particle.y = height / 2 + (sin(particle.angle) * planetRadius) / 10;

    let ringTilt = (particle.x - width / 2) / 5;
    particle.x += ringTilt;
    particle.y += ringTilt;

    if (overlapSun && !isFrontSun) {
        return;
    }

    particle.x += map(waveform[i], -1, 1, -audioWaveIntesity, audioWaveIntesity);
    particle.y += map(waveform[i], -1, 1, -audioWaveIntesity, audioWaveIntesity);

    fill(ringColor);
    noStroke();
    ellipse(particle.x, particle.y, particle.size, particle.size);

    stroke(ringColor);
    if (i > 0) {
        let prevRing = ringParticles[i - 1];
        line(prevRing.x, prevRing.y, particle.x, particle.y);
    }
}

function drawShootingStar(star) {
    star.prevX.push(star.x);
    star.prevY.push(star.y);

    if (star.prevX.length > 10) {
        star.prevX.shift();
        star.prevY.shift();
    }

    for (let i = 0; i < star.prevX.length; i++) {
        let alpha = map(i, 0, star.prevX.length, 0, star.alpha);
        let r = starColor.substring(4, 7);
        let g = starColor.substring(8, 11);
        let b = starColor.substring(12, 15);
        stroke(r, g, b, alpha);
        strokeWeight(star.size);
        line(star.x, star.y, star.prevX[i], star.prevY[i]);
    }

    star.x += star.speed;
    star.y += star.speed;

    star.alpha -= 5;
}

function keyPressed() {
    if (key == ' ') {
        // hide message
        let message = document.getElementById('message');
        message.style.visibility = 'hidden';
        if (song.isPlaying()) {
            song.pause();
            noLoop();
        } else {
            song.play();
            loop();
        }
    }
}
