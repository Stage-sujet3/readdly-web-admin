import { Metadata } from 'next';
import '../styles/globals.css';
import { SidebarProvider } from '@/contexts/SidebarContext';

export const metadata: Metadata = {
  title: 'Readdly | Administration',
  description: 'Portail d\'administration de la plateforme Readdly',
  icons: {
    icon: '/images/logo-readdly.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="fr" data-scroll-behavior="smooth">
            <body>
                <SidebarProvider>
                    {children}
                </SidebarProvider>
            </body>
        </html>
    )
}
