"use client"

import { Sidebar } from "@/components/layout/Sidebar"
import { Header } from "@/components/layout/Header"
import { useSidebar } from "@/contexts/SidebarContext"
import { NotificationProvider } from "@/contexts/NotificationContext"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar()

  return (
    <NotificationProvider>
      <div className="flex min-h-screen bg-background text-foreground overflow-x-hidden relative">
        <Sidebar />
        
        <div 
          className={`flex-1 flex flex-col min-h-screen relative z-10 w-full transition-all duration-300 ease-in-out ${
            isCollapsed ? 'md:pl-[6rem]' : 'md:pl-[20rem]'
          }`}
        >
          <Header />
          <main className="flex-1 px-8 pb-12 lg:px-12">
            {children}
          </main>
        </div>
      </div>
    </NotificationProvider>
  )
}
