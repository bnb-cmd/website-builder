import { createTheme } from '@mantine/core';

export const mantineTheme = createTheme({
  primaryColor: 'blue',
  colors: {
    // Map your existing Tailwind colors to Mantine
    blue: [
      '#f0f9ff', // 50
      '#e0f2fe', // 100
      '#bae6fd', // 200
      '#7dd3fc', // 300
      '#38bdf8', // 400
      '#0ea5e9', // 500 - your primary blue
      '#0284c7', // 600
      '#0369a1', // 700
      '#075985', // 800
      '#0c4a6e', // 900
    ],
    // Add other colors you use
    gray: [
      '#f9fafb', // 50
      '#f3f4f6', // 100
      '#e5e7eb', // 200
      '#d1d5db', // 300
      '#9ca3af', // 400
      '#6b7280', // 500
      '#4b5563', // 600
      '#374151', // 700
      '#1f2937', // 800
      '#111827', // 900
    ],
    green: [
      '#f0fdf4', // 50
      '#dcfce7', // 100
      '#bbf7d0', // 200
      '#86efac', // 300
      '#4ade80', // 400
      '#22c55e', // 500
      '#16a34a', // 600
      '#15803d', // 700
      '#166534', // 800
      '#14532d', // 900
    ],
    red: [
      '#fef2f2', // 50
      '#fee2e2', // 100
      '#fecaca', // 200
      '#fca5a5', // 300
      '#f87171', // 400
      '#ef4444', // 500
      '#dc2626', // 600
      '#b91c1c', // 700
      '#991b1b', // 800
      '#7f1d1d', // 900
    ],
  },
  // Use your existing font family
  fontFamily: 'Inter, system-ui, sans-serif',
  // Match your design system
  defaultRadius: 'md',
  // Disable Mantine's default focus styles to use Tailwind's
  focusRing: 'never',
  // Match your spacing scale
  spacing: {
    xs: '0.5rem',
    sm: '0.75rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
  // Disable Mantine's default component styles that conflict with Tailwind
  components: {
    Button: {
      defaultProps: {
        style: {
          // Let Tailwind handle the styling
        },
      },
    },
    Select: {
      defaultProps: {
        style: {
          // Let Tailwind handle the styling
        },
      },
    },
    Switch: {
      defaultProps: {
        style: {
          // Let Tailwind handle the styling
        },
      },
    },
    Avatar: {
      defaultProps: {
        style: {
          // Let Tailwind handle the styling
        },
      },
    },
  },
});
