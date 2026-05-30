import { supabase } from './supabase'
import { mockJobs, mockCandidates } from './mock-data'
import { Job, Candidate } from '@/types'

const isSupabaseConfigured = () => {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== 'your_supabase_project_url' &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== 'your_supabase_anon_key'
  )
}

// Jobs
export async function getJobs(): Promise<Job[]> {
  if (!isSupabaseConfigured()) return mockJobs
  const { data, error } = await supabase.from('jobs').select('*').order('created_at', { ascending: false })
  if (error) return mockJobs
  return data as Job[]
}

export async function addJob(job: Omit<Job, 'id' | 'created_at'>): Promise<Job | null> {
  if (!isSupabaseConfigured()) {
    const newJob: Job = { ...job, id: Date.now().toString(), created_at: new Date().toISOString() }
    mockJobs.unshift(newJob)
    return newJob
  }
  const { data, error } = await supabase.from('jobs').insert([job]).select().single()
  if (error) return null
  return data as Job
}

export async function updateJobStatus(id: string, status: Job['status']): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    const job = mockJobs.find(j => j.id === id)
    if (job) job.status = status
    return true
  }
  const { error } = await supabase.from('jobs').update({ status }).eq('id', id)
  return !error
}

export async function deleteJob(id: string): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    const idx = mockJobs.findIndex(j => j.id === id)
    if (idx !== -1) mockJobs.splice(idx, 1)
    return true
  }
  const { error } = await supabase.from('jobs').delete().eq('id', id)
  return !error
}

// Candidates
export async function getCandidates(): Promise<Candidate[]> {
  if (!isSupabaseConfigured()) return mockCandidates
  const { data, error } = await supabase.from('candidates').select('*').order('applied_at', { ascending: false })
  if (error) return mockCandidates
  return data as Candidate[]
}

export async function updateCandidateStatus(id: string, status: Candidate['status']): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    const c = mockCandidates.find(c => c.id === id)
    if (c) c.status = status
    return true
  }
  const { error } = await supabase.from('candidates').update({ status }).eq('id', id)
  return !error
}

export async function addCandidate(candidate: Omit<Candidate, 'id' | 'applied_at'>): Promise<Candidate | null> {
  if (!isSupabaseConfigured()) {
    const newCandidate: Candidate = { ...candidate, id: Date.now().toString(), applied_at: new Date().toISOString() }
    mockCandidates.unshift(newCandidate)
    return newCandidate
  }
  const { data, error } = await supabase.from('candidates').insert([candidate]).select().single()
  if (error) return null
  return data as Candidate
}

// Dashboard Stats
export async function getDashboardStats() {
  const jobs = await getJobs()
  const candidates = await getCandidates()
  return {
    totalJobs: jobs.length,
    totalCandidates: candidates.length,
    totalApplications: candidates.length,
    openJobs: jobs.filter(j => j.status === 'open').length,
    hiredCandidates: candidates.filter(c => c.status === 'hired').length,
    interviewCandidates: candidates.filter(c => c.status === 'interview').length,
    appliedCandidates: candidates.filter(c => c.status === 'applied').length,
  }
}
