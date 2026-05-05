import { StatsGrid } from "@/features/dashboard/components/StatsGrid"
import { ChartsSection } from "@/features/dashboard/components/ChartsSection"
import { LibraryChartsSection } from "@/features/dashboard/components/LibraryChartsSection"
import { ActivitySection } from "@/features/dashboard/components/ActivitySection"
import { HealthMessagesSection } from "@/features/dashboard/components/HealthMessagesSection"

export default function DashboardPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <StatsGrid />
      <ChartsSection />
      <ActivitySection />
      <LibraryChartsSection />
      <HealthMessagesSection />
    </div>
  )
}
