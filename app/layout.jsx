import '@/styles/globals.css';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { MapsProvider } from '@/components/MapsProvider';

const plusJakartaSans = Plus_Jakarta_Sans({ 
  subsets: ['latin'],
  variable: '--font-pjs',
  display: 'swap',
});

export const metadata = {
  title: "Findr - City-Wide Lost & Found Ecosystem",
  description: 'The trustworthy city network for reuniting lost belongings with their owners.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={plusJakartaSans.variable}>
      <body className={`${plusJakartaSans.className} font-sans antialiased`}>
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
          <MapsProvider>
            {children}
          </MapsProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
