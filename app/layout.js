import { Fredoka, Nunito } from 'next/font/google';
import './globals.css';
import ConditionalLayout from '@/components/ConditionalLayout';
import { CartProvider } from '@/context/CartContext';
import { FavoritesProvider } from '@/context/FavoritesContext';

const fredoka = Fredoka({ subsets: ['latin'], weight: ['400','500','600','700'], variable: '--font-display', display: 'swap' });
const nunito = Nunito({ subsets: ['latin'], weight: ['400','500','600','700'], variable: '--font-body', display: 'swap' });

export const metadata = {
  title: 'BOLAGINAM — Bolalar o\'yinchoqlari do\'koni',
  description: 'Kichkintoyingiz uchun xavfsiz, sifatli va quvonch bag\'ishlaydigan o\'yinchoqlar',
};

export default function RootLayout({ children }) {
  return (
    <html lang="uz" className={`${fredoka.variable} ${nunito.variable}`}>
      <body>
        <CartProvider>
          <FavoritesProvider>
            <ConditionalLayout>
              {children}
            </ConditionalLayout>
          </FavoritesProvider>
        </CartProvider>
      </body>
    </html>
  );
}
