import { DashboardPage } from "@/components/dashboard-page"
import { DashboardAuth } from "@/components/dashboard-auth"

export default function Dashboard() {
  return (
    <DashboardAuth>
      <div className="min-h-screen bg-background">
        <DashboardPage />
      </div>
    </DashboardAuth>
  )
}

