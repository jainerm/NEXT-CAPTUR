export const colors = {
  green: '#22C55E',
  orange: '#F97316',
  red: '#EF4444',
  backgroundGray: '#F3F4F6',
  darkGray: '#374151',
  white: '#FFFFFF',
  blue: '#1E3A8A',
};

export const palette = {
  green: {
    light: '#A7F3D0',
    main: '#22C55E',
    dark: '#004d39',
    transparent: '#d4e5e0',
  },
  orange: {
    light: '#FDBA74',
    main: '#F97316',
    dark: '#C2410C',
  },
  red: {
    light: '#FCA5A5',
    main: '#EF4444',
    dark: '#B91C1C',
  },
  backgroundGray: {
    light: '#F3F4F6',
    main: '#D1D5DB',
    dark: '#6B7280',
  },
  darkGray: {
    light: '#4B5563',
    main: '#374151',
    dark: '#1F2937',
  },
  white: {
    light: '#FFFFFF',
    main: '#F8FAFC',
    dark: '#E5E7EB',
  },
  blue: {
    light: '#93C5FD',
    main: '#1E3A8A',
    dark: '#1E40AF',
  },
};

export const gradients = {
  buttonPrimary: {
    colors: ['#EF4444', '#F97316'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 0 },
  },
  topBar: {
    colors: ['#F97316', '#22C55E'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 0 },
  },
  sectionBackground: {
    colors: ['rgba(34, 197, 94, 0.1)', 'rgba(34, 197, 94, 0.05)'],
    start: { x: 0, y: 0 },
    end: { x: 0, y: 1 },
  },
  screenBackground: {
    colors: ['#DCFCE7', '#F3F4F6'],
    start: { x: 0, y: 0 },
    end: { x: 0, y: 1 },
  },
};

export const shadows = {
  elevatedButton: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  textShadow: {
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
};

export type ThemeColors = typeof colors;
export type ThemePalette = typeof palette;
export type ThemeGradients = typeof gradients;
export type ThemeShadows = typeof shadows;

export default {
  colors,
  palette,
  gradients,
  shadows,
};
