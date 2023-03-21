// modify here to change the sound and visuals
const rootNote = 'A';
const scaleSteps = [0, 3, 5, 7, 10];
const scaleNotes = createScaleFromRoot(rootNote, scaleSteps);
const octave = 5;

let amp;
let drone;
const droneMaxLigth = 200;

const containerRadius = 350;
const orbsArray = [],
    orbRadius = 8,
    orbVelocity = 1,
    orbColor = 'golden', // -> golden, random, blue or red
    numOrbs = scaleNotes.length;

// PRELOAD SHADERS
// ---------------------------------------
let orbShader;
function preload() {
    orbShader = loadShader('shaders/shader.vert', 'shaders/shader.frag', function () {
        // replace variables in shader with values from JS
        const shaderReplaceVars = {
            NUM_ORBS: numOrbs,
        };

        for (let key in shaderReplaceVars) {
            orbShader._fragSrc = orbShader._fragSrc.replaceAll(key, shaderReplaceVars[key]);
        }
    });
}

// SETUP AND SPAWN ORBS
// ---------------------------------------
function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);

    frameRate(60);

    spawnOrbs();

    // load drone mp4 depending on root note
    drone = loadSound('../../audio/drones/' + rootNote + '.mp3', function () {
        drone.setVolume(0.1);
        drone.loop();
    });

    amp = new p5.Amplitude();
}

// DRAW AND UPDATE ORBS
// ---------------------------------------
function draw() {
    // audio analysis
    let droneAmp = amp.getLevel() * droneMaxLigth;

    let orbData = [];
    let orbColors = [];
    for (let i = 0; i < numOrbs; i++) {
        const orb = orbsArray[i];

        orb.update();

        orbData.push(orb.pos.x, orb.pos.y, orb.shine);
        orbColors.push(orb.color[0], orb.color[1], orb.color[2]);
    }

    push();
    shader(orbShader);
    orbShader.setUniform('resolution', [width, height]);
    orbShader.setUniform('orbs', orbData);
    orbShader.setUniform('orbColors', orbColors);
    orbShader.setUniform('containerRadius', containerRadius);
    orbShader.setUniform('droneAmp', droneAmp);
    rect(0, 0, width, height);
    pop();
}

// FUNCTIONS
// ---------------------------------------
function spawnOrbs() {
    for (let i = 0; i < numOrbs; i++) {
        let angle = random(0, 2 * PI);

        // color depends on orbColor variable
        let color;
        switch (orbColor) {
            case 'golden':
                color = [0.9, 0.45, 0.25];
                break;
            case 'random':
                color = [random(0.1, 0.9), random(0.1, 0.9), random(0.1, 0.9)];
                break;
            case 'blue':
                color = [-0.5, 0.5, 1.0];
                break;
            case 'white':
                color = [1.0, 1.0, 1.0];
                break;
        }

        // push new orb to array
        orbsArray.push(
            new Orb(
                createVector(
                    width / 2 + (containerRadius / 2) * cos(angle) * random(0.1, 0.9),
                    height / 2 + (containerRadius / 2) * sin(angle) * random(0.1, 0.9)
                ),
                createVector(orbVelocity * cos(angle), orbVelocity * sin(angle)),
                orbRadius,
                scaleNotes[i],
                octave,
                color,
            )
        );
    }
}

function createScaleFromRoot(root, steps) {
    const noteNames = {
        0: 'C',
        1: 'Db',
        2: 'D',
        3: 'Eb',
        4: 'E',
        5: 'F',
        6: 'Gb',
        7: 'G',
        8: 'Ab',
        9: 'A',
        10: 'Bb',
        11: 'B',
    };

    if (!Object.values(noteNames).includes(root)) {
        throw new Error('Invalid root note. Input must be a natural or flat note.');
    }

    let generatedScale = [];
    let rootIndex = Object.keys(noteNames).find((key) => noteNames[key] === root);

    for (let step of steps) {
        let stepIndex = (parseInt(rootIndex) + step) % 12;
        generatedScale.push(noteNames[stepIndex]);
    }

    return generatedScale;
}
