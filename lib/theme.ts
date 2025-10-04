import { DarkTheme, DefaultTheme, type Theme } from '@react-navigation/native';

/**
 * MedTrack Design System
 * Cores baseadas no design do Figma
 */
export const COLORS = {
  light: {
    // Cores principais do MedTrack (Figma Light)
    primary: '#05D3DB', // Cyan - Botão confirmar, elementos interativos
    primaryForeground: '#FFFFFF',

    // Cores de texto
    textPrimary: '#121417', // Texto principal
    textSecondary: '#637387', // Texto secundário (horários, dosagens)

    // Backgrounds
    background: '#FFFFFF',
    backgroundSecondary: '#F0F2F5', // Botão adiar, borders

    // Borders e divisores
    border: '#F0F2F5',

    // Estados
    success: '#05D3DB',
    error: '#EF4444',
    warning: '#F59E0B',

    // Cards e superfícies
    card: '#FFFFFF',
    cardForeground: '#121417',
  },
  dark: {
    // Cores principais (Figma Dark)
    primary: '#21ACB1', // Cyan mais escuro para dark theme
    primaryForeground: '#FFFFFF',

    // Cores de texto
    textPrimary: '#FFFFFF', // Texto principal branco
    textSecondary: '#637387', // Texto secundário (mantém do light)

    // Backgrounds
    background: '#121417', // Background principal dark
    backgroundSecondary: '#293038', // Botão adiar, cards, borders

    // Borders
    border: '#293038',

    // Estados
    success: '#21ACB1',
    error: '#EF4444',
    warning: '#F59E0B',

    // Cards e superfícies
    card: '#293038',
    cardForeground: '#FFFFFF',
  },
} as const;

/**
 * Fontes Manrope do MedTrack
 */
export const FONTS = {
  regular: 'Manrope_400Regular',
  medium: 'Manrope_500Medium',
  bold: 'Manrope_700Bold',
} as const;

/**
 * Tamanhos de fonte padronizados
 */
export const FONT_SIZES = {
  xs: 12, // Caption, Tab Bar
  sm: 14, // Horário, Dosagem, Botões
  base: 16, // Nome do medicamento
  lg: 18, // Header, Títulos
  xl: 20,
  '2xl': 24,
} as const;

/**
 * Espaçamentos padronizados (em pixels)
 */
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
} as const;

/**
 * Border radius padronizado
 */
export const RADIUS = {
  sm: 4,
  md: 8, // Padrão do MedTrack
  lg: 12,
  full: 9999,
} as const;

/**
 * Tema antigo (compatibilidade com shadcn/ui)
 * @deprecated Use COLORS, FONTS, etc diretamente
 */
export const THEME = {
  light: {
    background: 'hsl(0 0% 100%)',
    foreground: 'hsl(215 19% 10%)',
    card: 'hsl(0 0% 100%)',
    cardForeground: 'hsl(215 19% 10%)',
    popover: 'hsl(0 0% 100%)',
    popoverForeground: 'hsl(215 19% 10%)',
    primary: 'hsl(183 96% 44%)', // #05D3DB
    primaryForeground: 'hsl(0 0% 100%)',
    secondary: 'hsl(220 14% 96%)', // #F0F2F5
    secondaryForeground: 'hsl(215 19% 10%)',
    muted: 'hsl(220 14% 96%)',
    mutedForeground: 'hsl(215 11% 41%)', // #637387
    accent: 'hsl(183 96% 44%)',
    accentForeground: 'hsl(0 0% 100%)',
    destructive: 'hsl(0 84.2% 60.2%)',
    border: 'hsl(220 14% 96%)',
    input: 'hsl(220 14% 96%)',
    ring: 'hsl(183 96% 44%)',
    radius: '0.5rem',
  },
  dark: {
    background: 'hsl(215 19% 10%)',
    foreground: 'hsl(0 0% 98%)',
    card: 'hsl(215 15% 15%)',
    cardForeground: 'hsl(0 0% 98%)',
    popover: 'hsl(215 15% 15%)',
    popoverForeground: 'hsl(0 0% 98%)',
    primary: 'hsl(183 96% 44%)',
    primaryForeground: 'hsl(0 0% 100%)',
    secondary: 'hsl(215 15% 20%)',
    secondaryForeground: 'hsl(0 0% 98%)',
    muted: 'hsl(215 15% 20%)',
    mutedForeground: 'hsl(215 11% 60%)',
    accent: 'hsl(183 96% 44%)',
    accentForeground: 'hsl(0 0% 100%)',
    destructive: 'hsl(0 70.9% 59.4%)',
    border: 'hsl(215 15% 20%)',
    input: 'hsl(215 15% 20%)',
    ring: 'hsl(183 96% 44%)',
    radius: '0.5rem',
  },
};

export const NAV_THEME: Record<'light' | 'dark', Theme> = {
  light: {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: COLORS.light.background,
      border: COLORS.light.border,
      card: COLORS.light.card,
      notification: COLORS.light.error,
      primary: COLORS.light.primary,
      text: COLORS.light.textPrimary,
    },
  },
  dark: {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: COLORS.dark.background,
      border: COLORS.dark.border,
      card: COLORS.dark.card,
      notification: COLORS.dark.error,
      primary: COLORS.dark.primary,
      text: COLORS.dark.textPrimary,
    },
  },
};
