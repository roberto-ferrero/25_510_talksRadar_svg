// MathUtils.js

const MathUtils = {
  // Linear interpolation between two numbers
  lerp(a, b, t) {
    return a + (b - a) * t
  },

  // Clamp a value between min and max
  clamp(v, min, max) {
    return Math.max(min, Math.min(max, v))
  },

  // Map a value from one range to another
  map(v, inMin, inMax, outMin, outMax) {
    const t = (v - inMin) / (inMax - inMin)
    return outMin + t * (outMax - outMin)
  },

  // Linear interpolation between two arrays (same length)
  lerpArray(a, b, t) {
    if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length)
      throw new Error('lerpArray: both arguments must be arrays of the same length')

    return a.map((val, i) => val + (b[i] - val) * t)
  },

  // Optional: easing support for smooth animation interpolation
  easeInOut(t) {
    return t * t * (3 - 2 * t)
  }
}

export default MathUtils
