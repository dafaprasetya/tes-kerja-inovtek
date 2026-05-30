export interface Job {
  id: string
  title: string
  department: string
  location: string
  type: string
  status: 'open' | 'closed' | 'draft'
  description: string
  created_at: string
}

export interface Candidate {
  id: string
  name: string
  email: string
  phone: string
  position: string
  status: 'applied' | 'interview' | 'hired' | 'rejected'
  job_id: string
  applied_at: string
  avatar_url: string | null
}

export interface DashboardStats {
  totalJobs: number
  totalCandidates: number
  totalApplications: number
  openJobs: number
  hiredCandidates: number
}
