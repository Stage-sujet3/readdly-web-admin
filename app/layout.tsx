import '../styles/globals.css';
import { SidebarProvider } from '@/contexts/SidebarContext';

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
