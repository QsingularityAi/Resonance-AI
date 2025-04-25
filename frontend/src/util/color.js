export function valueToHex(value) {
  // Ensure the input is between 0 and 100
  value = Math.max(0, Math.min(100, value))

  // Convert to a value between 0 and 255
  const byteValue = Math.round((value * 255) / 100)

  // Convert to hex and pad with zero if necessary
  return byteValue.toString(16).padStart(2, "0")
}

/**
 * removes alpha but keeps appearance
 * @param color
 * @returns {string}
 */
export function blendWithWhite(color) {
  // Parse the color
  let r, g, b, a

  if (color.startsWith("rgba")) {
    ;[r, g, b, a] = color.match(/[\d.]+/g).map(Number)
  } else if (color.startsWith("rgb")) {
    ;[r, g, b] = color.match(/\d+/g).map(Number)
    a = 1
  } else if (color.startsWith("#")) {
    const hex = color.slice(1)
    r = parseInt(hex.slice(0, 2), 16)
    g = parseInt(hex.slice(2, 4), 16)
    b = parseInt(hex.slice(4, 6), 16)
    a = hex.length === 8 ? parseInt(hex.slice(6, 8), 16) / 255 : 1
  } else {
    throw new Error("Unsupported color format")
  }

  // Blend with white
  const blendChannel = (c) => Math.round(c * a + 255 * (1 - a))
  r = blendChannel(r)
  g = blendChannel(g)
  b = blendChannel(b)

  // Return as hex
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`
}
