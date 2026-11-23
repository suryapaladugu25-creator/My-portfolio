/**
 * Palette.js — Shared color design tokens for Three.js & UI
 * Refined dark with warm gold, soft emeralds, soft dawn sky (no neon)
 */

export const PALETTE = {
  bgDeep:          '#0B0F14',
  bgGradientMid:   '#111A22',
  surfaceCard:     'rgba(255, 255, 255, 0.04)',
  surfaceBorder:   'rgba(255, 255, 255, 0.08)',
  accentGold:      '#E6B450',
  accentHover:     '#F2CC7A',
  secondaryEmerald:'#4FB58F',
  emeraldShades: [
    '#2F8F6F',
    '#4FB58F',
    '#7FD3B0'
  ],
  tertiarySky:     '#8FB8E8',
  barkTrunk:       '#3B2B20',
  textPrimary:     '#F4EFE6',
  textMuted:       '#9AA4B2',
  dawnGradient: [
    '#1B2A41',
    '#E6B450',
    '#F4D9A8'
  ],
  // Three.js hex numbers
  hex: {
    bgDeep:           0x0B0F14,
    bgGradientMid:    0x111A22,
    accentGold:       0xE6B450,
    accentHover:      0xF2CC7A,
    secondaryEmerald: 0x4FB58F,
    emerald1:         0x2F8F6F,
    emerald2:         0x4FB58F,
    emerald3:         0x7FD3B0,
    tertiarySky:      0x8FB8E8,
    barkTrunk:        0x3B2B20,
    dawnDark:         0x1B2A41,
    dawnWarm:         0xE6B450,
    dawnLight:        0xF4D9A8
  }
};
