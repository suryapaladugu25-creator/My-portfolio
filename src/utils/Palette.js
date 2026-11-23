/**
 * Palette.js — Natural Daytime Sky & Earthy Palette
 * Blue skies, natural bark, multiple shades of realistic green leaves,
 * clean white cards, dark navy text, and single blue accent #2563EB.
 */

export const PALETTE = {
  // Sky gradients (Daytime default)
  skyTopDay:        '#4A90D9',
  skyHorizonDay:    '#BFE3FF',

  // Section sky atmospheres (smooth transitions)
  skyTealTop:       '#3A88B8',
  skyTealHorizon:   '#A8DCEF',
  skySunsetTop:     '#405B8C',
  skySunsetHorizon: '#E8A87C',

  // Dark mode sky (deep navy night, not black/gold)
  skyTopDark:       '#0B1B33',
  skyHorizonDark:   '#1E3A5F',

  // UI Colors (Light, clean cards)
  cardBgLight:      'rgba(255, 255, 255, 0.88)',
  cardBorderLight:  '1px solid rgba(16, 36, 62, 0.08)',
  cardShadowLight:  '0 12px 36px rgba(16, 36, 62, 0.10)',

  cardBgDark:       'rgba(15, 28, 48, 0.88)',
  cardBorderDark:   '1px solid rgba(255, 255, 255, 0.12)',
  cardShadowDark:   '0 12px 36px rgba(0, 0, 0, 0.45)',

  // Typography
  textNavy:         '#10243E',
  textMuted:        '#475569',
  textLight:        '#F8FAFC',
  textMutedDark:    '#94A3B8',

  // Primary Accent (One Blue Accent)
  accentBlue:       '#2563EB',
  accentBlueHover:  '#1D4ED8',
  accentBlueSoft:   'rgba(37, 99, 235, 0.12)',

  // Natural Tree & Landscape
  barkLight:        '#5A3E2B',
  barkDark:         '#3B2B20',

  // Leaf shades: multi-toned green with sunlit highlights
  leafGreen1:       '#2F8F4E', // rich green
  leafGreen2:       '#3FA65F', // mid foliage green
  leafGreen3:       '#5CBF72', // fresh bright green
  leafSunlit:       '#7CD98E', // sun-catching highlight leaf

  // Ground & Landscape
  grassGround:      '#3D8A4E',
  flowerPetal1:     '#FFFFFF',
  flowerPetal2:     '#FDE047',
  rockStone:        '#71717A',

  // Sunlight
  sunlightWarm:     '#FFF4D6',

  // Hex numbers for Three.js
  hex: {
    skyTopDay:        0x4A90D9,
    skyHorizonDay:    0xBFE3FF,
    skyTealTop:       0x3A88B8,
    skyTealHorizon:   0xA8DCEF,
    skySunsetTop:     0x405B8C,
    skySunsetHorizon: 0xE8A87C,
    skyTopDark:       0x0B1B33,
    skyHorizonDark:   0x1E3A5F,

    sunlightWarm:     0xFFF4D6,
    ambientDay:       0xCCE4FF,
    ambientDark:      0x1B2C47,

    barkLight:        0x5A3E2B,
    barkDark:         0x3B2B20,

    leaf1:            0x2F8F4E,
    leaf2:            0x3FA65F,
    leaf3:            0x5CBF72,
    leafSun:          0x7CD98E,

    grassGround:      0x3D8A4E,
    flowerYellow:     0xFDE047,
    flowerWhite:      0xF8FAFC,
    rockStone:        0x71717A,

    accentBlue:       0x2563EB,
    accentBlueHover:  0x1D4ED8,
    textNavy:         0x10243E,
  }
};
