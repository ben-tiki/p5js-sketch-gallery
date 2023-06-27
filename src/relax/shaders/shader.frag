#ifdef GL_ES
  precision highp float;
#endif

varying vec2 vTexCoord;
uniform vec2 resolution;
uniform vec3 orbs[NUM_ORBS]; // -> NUM_ORBS is defined in the JS file
uniform vec3 orbColors[NUM_ORBS]; // -> NUM_ORBS is defined in the JS file
uniform float containerRadius;
uniform float droneAmp;

void main() {
  float x = vTexCoord.x * resolution.x;
  float y = resolution.y - vTexCoord.y * resolution.y;
  vec3 orbColor = vec3(0.0);

  for (int i = 0; i < NUM_ORBS; i++) {
    vec3 orb = orbs[i]; 
    
    // orb position
    float pixelIntesity = pow(orb.z, 2.0) / (pow(orb.x - x, 2.0) + pow(orb.y - y, 2.0));

    // container rings
    float centerX = resolution.x / 2.0;
    float centerY = resolution.y / 2.0;
    float radius = containerRadius / 2.0; 
    float borderThickness = 5.0; 

    float distanceFromCenter = sqrt(pow(x - centerX, 2.0) + pow(y - centerY, 2.0));
    if (distanceFromCenter > radius - borderThickness && distanceFromCenter < radius + borderThickness) {
        pixelIntesity *= 0.9;
    } else if (distanceFromCenter < radius - borderThickness) {
        pixelIntesity *= 1.0;
    } else {
        pixelIntesity *= droneAmp;
    }

    // orb rgb calculation
    orbColor += orbColors[i] * pixelIntesity;
  }

  // draw
  orbColor = sqrt(orbColor);
  gl_FragColor = vec4(orbColor, 1.0);
}
