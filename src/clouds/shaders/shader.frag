#ifdef GL_ES
    precision highp float;
#endif

// inputs
uniform vec2 u_resolution;
uniform float u_time;

// Functions from Book of Shaders
// generate random number 
float random (vec2 coords) {
    return fract(sin(dot(coords.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

// perlin noise
float noise(vec2 coords) {
    
	vec2 i = floor(coords);
	vec2 f = fract(coords);

	float a = random(i);
	float b = random(i + vec2(1.0, 0.0));
	float c = random(i + vec2(0.0, 1.0));
	float d = random(i + vec2(1.0, 1.0));

	vec2 cubic = f * f * (3.0 - 2.0 * f);

	return mix(a, b, cubic.x) + (c - a) * cubic.y * (1.0 - cubic.x) + (d - b) * cubic.x * cubic.y;
}

// fractal brownian motion
#define NUM_OCTAVES 10
float fbm(in vec2 coords)
{
	float value = 0.0;
	float scale = 0.2;

    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));

	for (int i = 0; i < NUM_OCTAVES; i++)
	{
		value += noise(coords) * scale;
		coords = rot * coords * 3.0;
		scale *= 0.5;
	}

	return value;
}

void main() {
    
    // screen coordinates
    vec2 aspect = vec2(u_resolution.x / u_resolution.y, 1.0);
    vec2 uv = gl_FragCoord.xy / u_resolution.xy * aspect;

    vec2 planetPos = vec2(u_resolution.x / 2.0, u_resolution.y / 1.5) / u_resolution.xy * aspect;
    float planetRad = 0.15;
    float planetDist = length(uv - planetPos);

    // PLANET
    // ---------------------------------------
    if (planetDist < planetRad) {
    
        // fill with gradient
        vec2 planetGradCoords = (uv - planetPos) / planetRad + 0.5;
        vec3 planetRed = vec3(0.6, 0.35, 0.65);
        vec3 planetBlack = vec3(1.0, 1.0, 1.0);
        vec3 planetBlue = vec3(0.5, 0.0, 0.5);
        vec3 planetColor = mix(planetBlue, planetBlack, planetGradCoords.y / 5.0);
        planetColor = mix(planetColor, planetRed, planetGradCoords.y);

        // add noise
        vec2 noiseCoords = uv * 10.0;
        float noise = fbm(noiseCoords) * 2.0;
        planetColor = mix(planetColor, vec3(1.0, 1.0, 1.0), noise * 0.25);

        // add motion
        vec2 motionCoords = uv * 8.0 + u_time * 0.5;
        float motion = fbm(motionCoords) * 2.0;
        planetColor = mix(planetColor, vec3(1.0, 1.0, 1.0), motion * 0.125);

        gl_FragColor = vec4(planetColor, 1.0);
    
    // BACKGROUND
    // ---------------------------------------
    } else {   

        // motion
        vec2 backgroundMotion = vec2(fbm(uv + u_time * 0.05));
        uv = uv + backgroundMotion * 2.0;

        // fbm
        float backgroundNoise = fbm(uv);

        // color
        vec3 backgroundWhite = vec3(1.0, 0.9, 1.0);
        vec3 backgroundGreen = vec3(0.0, 0.4, 0.0);
        vec3 backgroundBlue = vec3(0.4, 0.0, 1.0);

        vec3 backgroundColor = mix(backgroundWhite, backgroundGreen, backgroundNoise);
        backgroundColor = mix(backgroundColor, backgroundBlue, backgroundNoise);

        gl_FragColor = vec4(backgroundColor, 1.0);

    }
}