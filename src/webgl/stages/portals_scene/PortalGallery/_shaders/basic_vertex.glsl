varying vec2 vUv;

// Attributes
// attribute vec4 a_randoms;

// Attribute Varyings
// varying vec4 v_randoms;

void main(){

    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    // Varyings:
    vUv = uv;
    // v_randoms = a_randoms;
}