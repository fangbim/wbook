import textStroke from '@designbycode/tailwindcss-text-stroke';

export const content = [
  './pages/**/*.{js,ts,jsx,tsx}',
  './components/**/*.{js,ts,jsx,tsx}',
  './app/**/*.{js,ts,jsx,tsx}', // kalau pakai Next.js App Router
];
export const theme = {
  extend: {
    textStrokeWidth: {
      1: '1px',
      2: '2px',
    },
    textStrokeColor: {
      gray: '#DBDBDB',
      white: '#ffffff',
      black: '#000000',
    },
  },
};
export const plugins = [textStroke];
