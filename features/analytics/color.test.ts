import { describe, expect, test } from "vitest"

import {
  hexFromPhotoUrl,
  hexToHsl,
  hueFamilyOf,
  lightnessBandOf,
} from "./color"

describe("hexFromPhotoUrl", () => {
  test("reads the colour from a photo URL", () => {
    expect(hexFromPhotoUrl("https://via.placeholder.com/150/92c952")).toBe(
      "92c952"
    )
  })

  test("zero-pads the short segments the source data emits", () => {
    // 302 of the 5,000 photos hex-encode the colour without padding it.
    expect(hexFromPhotoUrl("https://via.placeholder.com/150/abef8")).toBe(
      "0abef8"
    )
    expect(hexFromPhotoUrl("https://via.placeholder.com/150/d34")).toBe(
      "000d34"
    )
  })

  test("rejects anything that isn't hex", () => {
    expect(hexFromPhotoUrl("https://example.com/150/zzzzzz")).toBeNull()
    expect(hexFromPhotoUrl("https://example.com/150/")).toBeNull()
  })
})

describe("hexToHsl", () => {
  test("maps the primaries onto their hue angles", () => {
    expect(Math.round(hexToHsl("ff0000").hue)).toBe(0)
    expect(Math.round(hexToHsl("00ff00").hue)).toBe(120)
    expect(Math.round(hexToHsl("0000ff").hue)).toBe(240)
  })

  test("reports greys as unsaturated", () => {
    expect(hexToHsl("808080").saturation).toBe(0)
    expect(hexToHsl("000000").lightness).toBe(0)
    expect(hexToHsl("ffffff").lightness).toBe(1)
  })
})

describe("hueFamilyOf", () => {
  test("buckets saturated colours by hue", () => {
    expect(hueFamilyOf(hexToHsl("ff0000"))).toBe("Red")
    expect(hueFamilyOf(hexToHsl("ffff00"))).toBe("Yellow")
    expect(hueFamilyOf(hexToHsl("00ff00"))).toBe("Green")
    expect(hueFamilyOf(hexToHsl("00ffff"))).toBe("Cyan")
    expect(hueFamilyOf(hexToHsl("0000ff"))).toBe("Blue")
    expect(hueFamilyOf(hexToHsl("ff00ff"))).toBe("Magenta")
  })

  test("sends near-greys to their own bucket, whatever their hue", () => {
    expect(hueFamilyOf(hexToHsl("808080"))).toBe("Grey")
    expect(hueFamilyOf(hexToHsl("827e7e"))).toBe("Grey")
  })
})

describe("lightnessBandOf", () => {
  test("splits the range into five bands", () => {
    expect(lightnessBandOf(hexToHsl("000000"))).toBe("0–20%")
    expect(lightnessBandOf(hexToHsl("808080"))).toBe("40–60%")
    expect(lightnessBandOf(hexToHsl("ffffff"))).toBe("80–100%")
  })

  test("clamps pure white into the last band rather than a sixth", () => {
    expect(lightnessBandOf({ hue: 0, saturation: 0, lightness: 1 })).toBe(
      "80–100%"
    )
  })
})
