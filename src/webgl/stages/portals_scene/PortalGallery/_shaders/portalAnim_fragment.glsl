// fragment.glsl
precision mediump float;

uniform sampler2D uBaseTexture;

// Quad corners in UV space (you provide these)
uniform vec2 uTL; // top-left
uniform vec2 uTR; // top-right
uniform vec2 uBL; // bottom-left
uniform vec2 uBR; // bottom-right

uniform vec2 uImageTL; // Top Left
uniform vec2 uImageTR; // Top Right
uniform vec2 uImageBR; // Bottom Right
uniform vec2 uImageBL; // Bottom Left   

uniform vec2 uMousePan; // Mouse Pan

uniform float uShadeRatio; // Shade Ratio

uniform vec3 uReverseColor; // Color uniform for the shader
uniform float uReversed; // 0:false 1:true

uniform float uAlpha; // 0:false 1:true

// Feather/edge softness in UV units (e.g. 0.001–0.01)
uniform float uEdgeSoftness; // set something like 0.003


// 2D oriented area (edge function)
float edgeFunc(vec2 a, vec2 b, vec2 p) {
    vec2 ab = b - a;
    vec2 ap = p - a;
    // cross(ab, ap).z
    return ab.x * ap.y - ab.y * ap.x;
}

// Signed distance from point p to the infinite line through segment ab,
// scaled by edge length so units ≈ UV.
float signedDistToEdge(vec2 a, vec2 b, vec2 p) {
    float e = edgeFunc(a, b, p);
    float len = length(b - a) + 1e-8; // avoid div-by-zero
    return e / len;
}

//-------------------------------------------
// Build homography that maps (0,0)->q00, (1,0)->q10, (1,1)->q11, (0,1)->q01
// Then apply it to uv and divide by the projective w.
vec2 get_scaledUv(vec2 uv) {
    // Corner assignment per your mapping:
    vec2 pTR = uImageTR; // (1,0)
    vec2 pTL = uImageTL; // (1,1)
    vec2 pBL = uImageBL; // (0,1)
    vec2 pBR = uImageBR; // (0,0)

    // pBL = vec2(0.10, 0.45);
    // pBR = vec2(0.75, 0.45);
    // pTR = vec2(0.75, 0.55);
    // pTL = vec2(0.10, 0.55);

    vec2 scaledUv = uv;

    // SCALE UV TO FIT IN THE RECTANGLE DEFINED BY THE 4 POINTS
    float xRatio = 1.0/(pBR.x-pBL.x);
    float yRatio = 1.0/(pTL.y-pBL.y);
    scaledUv.x *= xRatio;
    scaledUv.y *= yRatio;

    // TRANSALTE UV TO FIT IN THE RECTANGLE DEFINED BY THE 4 POINTS
    scaledUv.x += -pBL.x*xRatio;
    scaledUv.y += -pBL.y*yRatio;

    vec2 panRange = vec2(0.00, -0.01);
    scaledUv.x += uMousePan.x * panRange.x;
    scaledUv.y += uMousePan.y * panRange.y;

    return scaledUv;
}
//-------------------------------------------

vec3 adjustBrightness(vec3 color, float brightness) {
    return color * brightness;
}

varying vec2 vUv;

void main() {

        // // Invert corners for reversed effect
        // vec2 temp = uTL;
        // uTL = uTR;
        // uTR = temp;
        // temp = uBL;
        // uBL = uBR;
        // uBR = temp;
        
        // Reorder into a looped quad: TL -> TR -> BR -> BL
        vec2 p0 = uTL;
        vec2 p1 = uTR;
        vec2 p2 = uBR;
        vec2 p3 = uBL;

        // Signed distances to each edge
        float d0 = signedDistToEdge(p0, p1, vUv);
        float d1 = signedDistToEdge(p1, p2, vUv);
        float d2 = signedDistToEdge(p2, p3, vUv);
        float d3 = signedDistToEdge(p3, p0, vUv);

        // For clockwise quads, inside means all di >= 0 -> sCW = min(di)
        float sCW  = min(min(d0, d1), min(d2, d3));
        // For counter-clockwise quads, inside means all di <= 0 -> sCCW = min(-di)
        float sCCW = min(min(-d0, -d1), min(-d2, -d3));

        // Robust mask that works for either winding, with soft edges
        float maskCW  = smoothstep(0.0, uEdgeSoftness, sCW);
        float maskCCW = smoothstep(0.0, uEdgeSoftness, sCCW);
        float mask = max(maskCW, maskCCW);

        vec2 scaledUv =  get_scaledUv(vUv);

    vec4 base = vec4(0.0);
    if(uReversed < 0.5){
        base = texture2D(uBaseTexture, scaledUv);
        base.rgb = adjustBrightness(base.rgb, 1.0-(uShadeRatio*1.0)); 
    }else{
        base = vec4(uReverseColor, 1.0);
    }

    // Show texture only inside the quad (with optional alpha feather)
    gl_FragColor = vec4(base.rgb, base.a*mask*uAlpha);
    // gl_FragColor = vec4(base.rgb, base.a );
}