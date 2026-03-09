export interface AdminStats {
  totalUsers: number
  totalParents: number
  totalOrthophonistes: number
  totalEnfants: number
  activeUsers: number
  growth: {
    users: number
    parents: number
    orthos: number
    enfants: number
  }
  monthlyGrowth: { month: string; users: number }[]
  weeklyActivity: { day: string; activities: number }[]
}
