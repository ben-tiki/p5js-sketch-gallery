#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec3 u_color;
uniform vec3 u_lightColor;

#define PI 3.1415926535897932384626433832795

//attributes, in
varying vec2 var_vertTexCoord;
varying vec3 var_vertNormal;

vec3 lightDir = vec3(0.5,-0.8,1.0);

void main(){

    vec2 p = gl_FragCoord.xy/u_resolution;
    float ramb = dot(var_vertNormal,lightDir);

    ramb = (ramb + 1.0) * 0.5;

    gl_FragColor = vec4(vec3(1.0 - ramb) * vec3(u_color) + vec3(ramb) * vec3(u_lightColor), 1.0);

}