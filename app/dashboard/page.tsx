'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth'
import { getDashboardStats } from '@/lib/data'

interface Stats {
  totalJobs: number
  totalCandidates: number
  totalApplications: number
  openJobs: number
  hiredCandidates: number
  interviewCandidates: number
  appliedCandidates: number
}

const StatCard = ({ label, value, sub, color, icon, delay }: {
  label: string; value: number; sub?: string; color: string; icon: React.ReactNode; delay: string
}) => (
  <div className={`glass glass-hover animate-fadeIn`} style={{
    borderRadius: 16, padding: 24, animationDelay: delay, opacity: 0,
    transition: 'all 0.2s', cursor: 'default',
  }}>
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
      <div style={{
        width: 42, height: 42, borderRadius: 12,
        background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: color,
      }}>
        {icon}
      </div>
      <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--success)', background: 'var(--success-soft)', padding: '3px 8px', borderRadius: 999 }}>
        Live
      </span>
    </div>
    <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-1px', marginBottom: 4 }}>{value}</div>
    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>{label}</div>
    {sub && <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>{sub}</div>}
  </div>
)

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getDashboardStats().then(s => { setStats(s); setLoading(false) })
  }, [])

  const now = new Date()
  const greeting = now.getHours() < 12 ? 'Selamat Pagi' : now.getHours() < 17 ? 'Selamat Siang' : 'Selamat Malam'

  return (
    <div style={{ padding: '32px', maxWidth: 1200 }}>
      {/* Header */}
      <div className="animate-fadeIn" style={{ marginBottom: 32 }}>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 4 }}>
          {now.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
        <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.5px' }}>
          {greeting}, <span className="gradient-text">{user?.name?.split(' ')[0]}</span>
        </h1>
        <p style={{ marginTop: 6, fontSize: 14, color: 'var(--text-secondary)' }}>
          Berikut ringkasan aktivitas rekrutmen hari ini.
        </p>
      </div>

      {/* Stats Grid */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="glass" style={{ borderRadius: 16, padding: 24, height: 130, background: 'linear-gradient(90deg, var(--bg-card) 25%, var(--bg-card-hover) 50%, var(--bg-card) 75%)', backgroundSize: '200% 100%' }} />
          ))}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
          <StatCard
            label="Total Lowongan" value={stats?.totalJobs || 0}
            sub={`${stats?.openJobs || 0} sedang buka`}
            color="var(--accent)" delay="0.05s"
            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>}
          />
          <StatCard
            label="Total Kandidat" value={stats?.totalCandidates || 0}
            sub={`${stats?.hiredCandidates || 0} sudah hired`}
            color="var(--purple)" delay="0.1s"
            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>}
          />
          <StatCard
            label="Total Aplikasi" value={stats?.totalApplications || 0}
            sub={`${stats?.interviewCandidates || 0} dalam interview`}
            color="var(--teal)" delay="0.15s"
            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10,9 9,9 8,9"/></svg>}
          />
        </div>
      )}

      {/* Pipeline Overview */}
      {stats && (
        <div className="animate-fadeIn" style={{ animationDelay: '0.25s', opacity: 0 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Pipeline Kandidat</h2>
          <div className="glass" style={{ borderRadius: 16, padding: 24 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16 }}>
              {[
                { label: 'Applied', value: stats.appliedCandidates, color: 'var(--accent)', pct: Math.round((stats.appliedCandidates / (stats.totalCandidates || 1)) * 100) },
                { label: 'Interview', value: stats.interviewCandidates, color: 'var(--purple)', pct: Math.round((stats.interviewCandidates / (stats.totalCandidates || 1)) * 100) },
                { label: 'Hired', value: stats.hiredCandidates, color: 'var(--success)', pct: Math.round((stats.hiredCandidates / (stats.totalCandidates || 1)) * 100) },
              ].map((item) => (
                <div key={item.label} style={{ textAlign: 'center', padding: '16px 8px' }}>
                  <div style={{ fontSize: 28, fontWeight: 800, color: item.color, letterSpacing: '-0.5px' }}>{item.value}</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginTop: 4, marginBottom: 10 }}>{item.label}</div>
                  <div style={{ height: 4, background: '#ffffff08', borderRadius: 999, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${item.pct}%`, background: item.color, borderRadius: 999, transition: 'width 1s ease' }} />
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>{item.pct}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Quick actions */}
      <div className="animate-fadeIn" style={{ marginTop: 24, animationDelay: '0.3s', opacity: 0 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Aksi Cepat</h2>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {[
            { label: 'Tambah Lowongan', href: '/dashboard/jobs', color: 'var(--accent)' },
            { label: 'Lihat Pipeline', href: '/dashboard/candidates', color: 'var(--purple)' },
          ].map(item => (
            <a key={item.label} href={item.href} style={{
              padding: '10px 20px', borderRadius: 10, textDecoration: 'none',
              background: `${item.color}18`, border: `1px solid ${item.color}30`,
              color: item.color, fontSize: 13, fontWeight: 600,
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = `${item.color}28`}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = `${item.color}18`}
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
