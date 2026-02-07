/**
 * UK Postcode Parser
 *
 * UK postcodes have the format: outward code + space + inward code.
 * The inward code is always the last 3 characters (digit + 2 letters).
 * The outward code is everything before that.
 *
 * Examples:
 *   "B1 1AA"   → outward: "B1",   district: "B",  inward: "1AA"
 *   "SW1A 1AA" → outward: "SW1A", district: "SW", inward: "1AA"
 *   "M60 1NW"  → outward: "M60",  district: "M",  inward: "1NW"
 */

// UK postcode regex: 1-2 letters, then digit(s) with optional trailing letter, then digit + 2 letters
const UK_POSTCODE_REGEX = /^[A-Z]{1,2}\d[A-Z\d]?\d[A-Z]{2}$/

export interface ParsedPostcode {
  normalised: string  // e.g. "B1 1AA"
  outward: string     // e.g. "B1"
  district: string    // e.g. "B"
  inward: string      // e.g. "1AA"
}

export function parsePostcode(raw: string): ParsedPostcode | null {
  // 1. Strip all spaces, uppercase
  const cleaned = raw.replace(/\s+/g, '').toUpperCase()

  // 2. Validate format
  if (!UK_POSTCODE_REGEX.test(cleaned)) {
    return null
  }

  // 3. Inward = last 3 chars
  const inward = cleaned.slice(-3)

  // 4. Outward = everything before last 3
  const outward = cleaned.slice(0, -3)

  // 5. District = letters-only prefix of outward
  const districtMatch = outward.match(/^[A-Z]+/)
  const district = districtMatch ? districtMatch[0] : outward

  // 6. Re-format with single space
  const normalised = `${outward} ${inward}`

  return { normalised, outward, district, inward }
}
