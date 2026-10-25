import { PastelPalette } from '../types/resume';

// Helper to convert any hex color to an active PastelPalette object for CV Creative
export function createPaletteFromHex(hex: string, name = 'Warna Pilihan'): PastelPalette {
  const cleanHex = hex.startsWith('#') ? hex : `#${hex}`;

  // Simple brightness calculation
  const r = parseInt(cleanHex.slice(1, 3), 16) || 0;
  const g = parseInt(cleanHex.slice(3, 5), 16) || 0;
  const b = parseInt(cleanHex.slice(5, 7), 16) || 0;
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  const isDark = brightness < 140;

  return {
    id: `custom-${cleanHex.replace('#', '')}`,
    name,
    primary: cleanHex,
    secondary: isDark ? lightenHex(cleanHex, 20) : darkenHex(cleanHex, 20),
    background: lightenHex(cleanHex, 85),
    sidebarBg: cleanHex,
    sidebarText: isDark ? '#FFFFFF' : '#1E293B',
    badgeBg: lightenHex(cleanHex, 75),
    badgeText: isDark ? cleanHex : '#0F172A',
    border: lightenHex(cleanHex, 50),
  };
}

function lightenHex(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.min(255, (num >> 16) + amt);
  const G = Math.min(255, ((num >> 8) & 0x00ff) + amt);
  const B = Math.min(255, (num & 0x0000ff) + amt);
  return `#${((1 << 24) + (R << 16) + (G << 8) + B).toString(16).slice(1)}`;
}

function darkenHex(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.max(0, (num >> 16) - amt);
  const G = Math.max(0, ((num >> 8) & 0x00ff) - amt);
  const B = Math.max(0, (num & 0x0000ff) - amt);
  return `#${((1 << 24) + (R << 16) + (G << 8) + B).toString(16).slice(1)}`;
}

// 10 Theme columns like Microsoft Office Shape Fill
export const OFFICE_THEME_COLUMNS = [
  // 1. White / Grayscale
  ['#FFFFFF', '#F2F2F2', '#D9D9D9', '#BFBFBF', '#A6A6A6', '#7F7F7F'],
  // 2. Black / Dark Grayscale
  ['#000000', '#7F7F7F', '#595959', '#3F3F3F', '#262626', '#0D0D0D'],
  // 3. Navy / Dark Slate Blue
  ['#1F4E79', '#DDEBF7', '#BDD7EE', '#9BC2E6', '#2F5597', '#16365C'],
  // 4. Accent Blue
  ['#2F5597', '#E8EEF8', '#C6D9F1', '#8DB4E2', '#366092', '#1B365D'],
  // 5. Orange / Peach
  ['#C65911', '#FCE4D6', '#F8CBAD', '#F4B084', '#C65911', '#833C0C'],
  // 6. Gray / Silver
  ['#595959', '#F2F2F2', '#D9D9D9', '#BFBFBF', '#3B3838', '#161616'],
  // 7. Gold / Warm Yellow
  ['#FFC000', '#FFF2CC', '#FFE699', '#FFD966', '#BF8F00', '#7F6000'],
  // 8. Cyan / Sky Blue
  ['#41719C', '#DEEBF7', '#BDD7EE', '#5B9BD5', '#2E75B6', '#1F4E78'],
  // 9. Green / Olive / Mint
  ['#548235', '#E2EFDA', '#C6E0B4', '#A9D08E', '#375623', '#1E4E2B'],
  // 10. Purple / Magenta
  ['#7030A0', '#F2DCDB', '#E7E6E6', '#B4A7D6', '#5B2C6F', '#4A235A'],
];

// Standard Office Fill Colors Row
export const OFFICE_STANDARD_COLORS = [
  '#C00000', // Dark Red
  '#FF0000', // Red
  '#FFC000', // Yellow
  '#FFFF00', // Bright Yellow
  '#92D050', // Light Green
  '#00B050', // Green
  '#00B0F0', // Light Blue
  '#0070C0', // Blue
  '#002060', // Dark Navy
  '#7030A0', // Purple
];
