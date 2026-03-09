import { Sidebar } from "@/components/layout/Sidebar"
import { Header } from "@/components/layout/Header"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background text-foreground overflow-x-hidden relative">
      <Sidebar />
      
      <div className="flex-1 md:pl-[18rem] flex flex-col min-h-screen relative z-10 w-full">
        <Header />
        <main className="flex-1 px-8 pb-12 lg:px-12">
          {children}
        </main>
      </div>
    </div>
  )
}
