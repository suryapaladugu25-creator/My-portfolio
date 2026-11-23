/**
 * Palette.js — LLM Playground Style Palette & Dynamic Tree Themes
 *
 * Theme:
 * - Base background: #0B0E14 to #101725 (deep navy-black) with subtle radial glow
 * - Primary accent: Orange #FF5A36 (hover #FF7A59)
 * - Secondary accent: Amber #FFB347
 * - Cards: Dark glass rgba(20, 26, 38, 0.75), border rgba(255, 255, 255, 0.08)
 * - Text: #E8ECF3, muted #8D98AA
 * - Bark: warm brown (#6B4A32 with #8A6244 highlights) lit by warm rim light
 *
 * Section Tree Palettes:
 * - hero: deep teal-green (#1F6F5C, #2E8B73) + orange fireflies
 * - about: soft green (#3E8E5A) with warm light from orange accent
 * - skills: teal to cyan (#2BB3A3) + small glowing orange skill leaves
 * - projects: amber-orange (#E8833A, #FFB347) + glowing fruits
 * - hacktoberfest: autumn red-orange (#D9531E, #F28C28) + falling leaves
 * - beyond: purple-blue (#5B6EE1) and pink (#E26BA0) in dusk light
 * - contact: warm green (#3D8A4E) with orange glow at crown
 */

export const PALETTE = {
  // Base backgrounds
  bgDarkTop:     '#0B0E14',
  bgDarkHorizon: '#1A2236',
  bgMid:         '#101725',

  // Light theme fallback
  bgLightTop:    '#F6F1EA',
  bgLightHorizon:'#EDE5D8',

  // Accents
  accentOrange:      '#FF5A36',
  accentOrangeHover: '#FF7A59',
  accentAmber:       '#FFB347',
  accentSoft:        'rgba(255, 90, 54, 0.15)',

  // Cards & Text
  cardGlassDark:     'rgba(20, 26, 38, 0.75)',
  cardBorderDark:    '1px solid rgba(255, 255, 255, 0.08)',
  textDark:          '#E8ECF3',
  textMutedDark:     '#8D98AA',

  cardGlassLight:    'rgba(255, 255, 255, 0.88)',
  cardBorderLight:   '1px solid rgba(16, 23, 37, 0.08)',
  textLight:         '#101725',
  textMutedLight:    '#5A6474',

  // Bark
  barkBase:          '#6B4A32',
  barkHighlight:     '#8A6244',

  // Hex numbers for Three.js
  hex: {
    bgDarkTop:        0x0B0E14,
    bgDarkHorizon:    0x1A2236,
    accentOrange:     0xFF5A36,
    accentOrangeHover:0xFF7A59,
    accentAmber:      0xFFB347,
    barkBase:         0x6B4A32,
    barkHighlight:    0x8A6244,
  },

  // Per-section dynamic color definitions for tree foliage, sky, fog, and light
  sections: {
    hero: {
      leaves: [0x1F6F5C, 0x2E8B73, 0x3AA389, 0xFFB347], // deep teal-green with amber accents
      skyTop: 0x0B0E14,
      skyHorizon: 0x1A2236,
      fog: 0x141B2D,
      sunColor: 0xFFB347,
      sunIntensity: 1.2,
      particleColor: 0xFF5A36, // orange fireflies
    },
    about: {
      leaves: [0x2A6B42, 0x3E8E5A, 0x54A870, 0xFFB347], // soft green with warm orange
      skyTop: 0x0D121B,
      skyHorizon: 0x1D263B,
      fog: 0x172033,
      sunColor: 0xFF9E54,
      sunIntensity: 1.25,
      particleColor: 0xFF7A59,
    },
    skills: {
      leaves: [0x1B7A75, 0x2BB3A3, 0x3CD2C0, 0xFF5A36], // teal to cyan with orange skill leaves
      skyTop: 0x0C131D,
      skyHorizon: 0x172B3E,
      fog: 0x142536,
      sunColor: 0x5CE1E6,
      sunIntensity: 1.3,
      particleColor: 0xFF5A36,
    },
    projects: {
      leaves: [0xB85A22, 0xE8833A, 0xFF9E40, 0xFFB347], // autumn amber-orange
      skyTop: 0x110F18,
      skyHorizon: 0x2B1D2A,
      fog: 0x221824,
      sunColor: 0xFFA040,
      sunIntensity: 1.4,
      particleColor: 0xFFB347,
    },
    hacktoberfest: {
      leaves: [0x9E2F14, 0xD9531E, 0xF28C28, 0xFFA742], // autumn red-orange
      skyTop: 0x120E15,
      skyHorizon: 0x2E1A1A,
      fog: 0x241517,
      sunColor: 0xFF652F,
      sunIntensity: 1.35,
      particleColor: 0xD9531E,
    },
    beyond: {
      leaves: [0x3B4CA8, 0x5B6EE1, 0x9B59B6, 0xE26BA0], // dusk purple-blue & pink
      skyTop: 0x130D20,
      skyHorizon: 0x3A1F38,
      fog: 0x2B182E,
      sunColor: 0xE26BA0,
      sunIntensity: 1.25,
      particleColor: 0xE26BA0,
    },
    contact: {
      leaves: [0x2A6E3B, 0x3D8A4E, 0x56A868, 0xFF5A36], // warm green with orange crown glow
      skyTop: 0x0B0E14,
      skyHorizon: 0x1A2236,
      fog: 0x141B2D,
      sunColor: 0xFF7A59,
      sunIntensity: 1.3,
      particleColor: 0xFF5A36,
    },
  }
};
