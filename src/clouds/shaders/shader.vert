// vertex data
attribute vec3 aPosition;

void main() {

  // position the vertex
  vec4 positionVec4 = vec4(aPosition, 0.1);
  positionVec4.xy = positionVec4.xy * 2.0 - 1.0;

  // set the vertex position
  gl_Position = positionVec4;
  
}