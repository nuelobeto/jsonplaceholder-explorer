/** Hue families the 5,000 photo colours are bucketed into, in spectrum order. */
export const HUE_FAMILIES = [
  "Red",
  "Yellow",
  "Green",
  "Cyan",
  "Blue",
  "Magenta",
  "Grey",
] as const

export type HueFamily = (typeof HUE_FAMILIES)[number]

/** Lightness bands, darkest first. */
export const LIGHTNESS_BANDS = [
  "0–20%",
  "20–40%",
  "40–60%",
  "60–80%",
  "80–100%",
] as const

export type LightnessBand = (typeof LIGHTNESS_BANDS)[number]

/**
 * The photo URLs encode their colour in the last path segment, unpadded — see
 * the note in features/photos/components/photo-tile.tsx.
 */
export const hexFromPhotoUrl = (url: string): string | null => {
  const segment = url.split("/").pop() ?? ""
  return /^[0-9a-f]{1,6}$/i.test(segment) ? segment.padStart(6, "0") : null
}

type Hsl = { hue: number; saturation: number; lightness: number }

export const hexToHsl = (hex: string): Hsl => {
  const r = parseInt(hex.slice(0, 2), 16) / 255
  const g = parseInt(hex.slice(2, 4), 16) / 255
  const b = parseInt(hex.slice(4, 6), 16) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const delta = max - min
  const lightness = (max + min) / 2

  if (delta === 0) return { hue: 0, saturation: 0, lightness }

  const saturation = delta / (1 - Math.abs(2 * lightness - 1))
  const hue =
    max === r
      ? 60 * (((g - b) / delta) % 6)
      : max === g
        ? 60 * ((b - r) / delta + 2)
        : 60 * ((r - g) / delta + 4)

  return { hue: (hue + 360) % 360, saturation, lightness }
}

/** Near-grey colours have no meaningful hue, so they get their own bucket. */
const GREY_SATURATION_CEILING = 0.15

export const hueFamilyOf = ({ hue, saturation }: Hsl): HueFamily => {
  if (saturation < GREY_SATURATION_CEILING) return "Grey"

  // Six 60°-wide families centred on the primaries and secondaries.
  const index = Math.floor(((hue + 30) % 360) / 60)
  return (["Red", "Yellow", "Green", "Cyan", "Blue", "Magenta"] as const)[index]
}

export const lightnessBandOf = ({ lightness }: Hsl): LightnessBand =>
  LIGHTNESS_BANDS[Math.min(4, Math.floor(lightness * 5))]
