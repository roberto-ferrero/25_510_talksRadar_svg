uniform float uAngleS;
uniform float uAngleM;
uniform float uAngleF;
uniform vec3 uBagroundColor; // Color uniform for the shader
uniform vec3 uReverseColor; // Color uniform for the shader

uniform sampler2D  uTexture; // Texture uniform for the shader
uniform vec2 uPlaneDimensions; // Dimensions of the plane
uniform vec2 uTextureDimensions; // Dimensions of the texture
uniform float uPosOffset;
uniform float uCurrentAngleRad;

// Varyings
varying vec2 vUv;

int getInt(float value) {
    return int(floor(value + 0.5));
}

vec3 adjustBrightness(vec3 color, float brightness) {
    return color * brightness;
}

float get_angleFactor(float _angle1, float _angle2, float _currentAngle) {
    return clamp((_currentAngle - _angle1) / (_angle2 - _angle1), 0.0, 1.0);
}

const float PI = 3.14159265359;

void main() {

    vec2 uv = vUv;

    //--------------------------
    // ASPECT RATIO:
    float planeRatio = uPlaneDimensions.x / uPlaneDimensions.y;
    float textureRatio = uTextureDimensions.x / uTextureDimensions.y;
    // Adjust UVs to "contain" the texture within the plane without distortion
    if (textureRatio > planeRatio) {
        // Texture is taller — fit to height, crop horizontally
        float scale = textureRatio / planeRatio;
        uv.x = 0.5 + (uv.x - 0.5) / scale;
    } else {
        // Texture is wider — fit to width, crop vertically
        float scale = planeRatio / textureRatio;
        uv.y = 0.5 + (uv.y - 0.5) / scale;
    }

    // Check if we're outside the valid UV range and discard if needed
    if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
        discard;
    }
    //--------------------------


    vec4 color = texture2D(uTexture, uv);

    if(uCurrentAngleRad <= uAngleF){
        color.rgb = uBagroundColor; // If the angle is -PI, set the color to the background color
        // color.rgb = vec3(1.0, 0.0, 0.0); // If the angle is -PI, set the color to the background color

    }else if(uCurrentAngleRad < uAngleS && uCurrentAngleRad >= uAngleM){
        float flip_factor = get_angleFactor(uAngleS,  uAngleM, uCurrentAngleRad);
        color.rgb = adjustBrightness(color.rgb, 1.0-(flip_factor*0.5));

    }else if(uCurrentAngleRad < uAngleM && uCurrentAngleRad > uAngleF){
        // float flip_factor = 1.0 - clamp((uCurrentAngleRad + PI) / (PI * 0.5), 0.0, 1.0);
        float flip_factor = get_angleFactor(uAngleM,  uAngleF, uCurrentAngleRad);
        color.rgb = mix(uReverseColor, uBagroundColor, flip_factor); // Apply a tint based on the angle
        // color.rgb = mix(color.rgb, uBagroundColor, flip_factor); // Apply a tint based on the angle
        
    }else if(uCurrentAngleRad >= uAngleS){
        float flip_factor = get_angleFactor(uAngleS,  0.0, uCurrentAngleRad);
        color.rgb = adjustBrightness(color.rgb, 1.0-(flip_factor*0.5)); // Adjust brightness if needed
    }

    // float brightness_incr = 0.5/5.0;
    // float brightness = 1.0-(uPosOffset* brightness_incr); // Adjust brightness based on position offset
    // color.rgb = adjustBrightness(color.rgb, brightness); // Adjust brightness if needed
    // color.rgb = uBagroundColor;

    gl_FragColor = color;

}