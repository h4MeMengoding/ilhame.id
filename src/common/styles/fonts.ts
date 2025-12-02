import { Plus_Jakarta_Sans } from 'next/font/google';

export const jakartaSans = Plus_Jakarta_Sans({
  variable: '--jakartaSans-font',
  subsets: ['latin'],
  display: 'swap',
  weight: ['200', '300', '400', '500', '600', '700', '800'],
  fallback: ['system-ui', 'arial', 'sans-serif'],
  adjustFontFallback: false, // Disable font fallback adjustment to speed up build
});
