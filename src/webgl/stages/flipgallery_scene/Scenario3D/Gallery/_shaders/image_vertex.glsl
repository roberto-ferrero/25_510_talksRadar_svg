uniform sampler2D  uTexture; // Texture uniform for the shader
uniform vec2 uPlaneDimensions; // Dimensions of the plane
uniform vec2 uTextureDimensions; // Dimensions of the texture

// Varyings
varying vec2 vUv;


void main() {
    // Get original position from the vertex position (using position or a specific attribute)
    vec3 finalPos = position;

    // Set final position
    vec4 mvPosition = modelViewMatrix * vec4(finalPos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    vUv = uv;

}