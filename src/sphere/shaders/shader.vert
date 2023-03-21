//standard vertex shader
#ifdef GL_ES
precision highp float;
#endif
#extension GL_OES_standard_derivatives : enable

// attributes, in
attribute vec3 aPosition;
attribute vec3 aNormal;
attribute vec2 aTexCoord;
attribute vec4 aVertexColor;

// attributes, out
varying vec3 var_vertPos;
varying vec4 var_vertCol;
varying vec3 var_vertNormal;
varying vec2 var_vertTexCoord;

// matrices
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat3 uNormalMatrix;

uniform float u_time;
uniform float u_volume;
uniform vec3 u_color;

// book of shaders noise function
float random(in vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    vec2 u = f * f * (3.0 - 2.0 * f);

    vec2 r1 = i + vec2(0.0, 0.0);
    vec2 r2 = i + vec2(1.0, 0.0);
    vec2 r3 = i + vec2(0.0, 1.0);
    vec2 r4 = i + vec2(1.0, 1.0);

    return mix(mix(random(r1), random(r2), u.x),
               mix(random(r3), random(r4), u.x), u.y);
}

void main() {

  vec2 uv = (aTexCoord - 0.5) * 2.0;
  uv.x = uv.x < 0.0 ? uv.x * - 1.0 : uv.x;
  uv.y = uv.y < 0.0 ? uv.y * - 1.0 : uv.y;

  float noise = noise(uv * 10.0 + u_time) - 0.5;
  vec3 pos = aPosition;
  pos += noise * aNormal * u_volume;
  gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(pos, 1.0);

  // set out value
  var_vertPos = pos;
  var_vertCol = aVertexColor;
  var_vertNormal = aNormal;
  var_vertTexCoord = aTexCoord;

}
