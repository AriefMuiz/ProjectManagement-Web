import daisyui from 'daisyui';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        light: {
          'color-scheme': 'light',
          primary: 'oklch(57% 0.245 27.325)',
          'primary-content': 'oklch(97% 0.013 17.38)',
          secondary: 'oklch(59% 0.249 0.584)',
          'secondary-content': 'oklch(97% 0.014 343.198)',
          accent: 'oklch(0% 0 0)',
          'accent-content': 'oklch(100% 0 0)',
          neutral: 'oklch(20% 0.042 265.755)',
          'neutral-content': 'oklch(98% 0.003 247.858)',
          info: 'oklch(71% 0.143 215.221)',
          success: 'oklch(72% 0.219 149.579)',
          warning: 'oklch(70% 0.213 47.604)',
          error: 'oklch(64% 0.246 16.439)',
          'base-100': 'oklch(98% 0.003 247.858)',
          'base-content': 'oklch(20% 0.042 265.755)',
        },
      },
    ],
  },
};
