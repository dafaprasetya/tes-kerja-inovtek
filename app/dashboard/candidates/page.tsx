'use client'

import { useEffect, useState } from 'react'
import { Candidate } from '@/types'
import { getCandidates, updateCandidateStatus } from '@/lib/data'

const PIPELINE_STAGES: { key: Candidate['status']; label: string; color: string; bg: string }[] = [
  { key: 'applied', label: 'Applied', color: 'var(--accent)', bg: 'var(--accent-soft)' },
  { key: 'interview', label: 'Interview', color: 'var(--purple)', bg: 'var(--purple-soft)' },
  { key: 'hired', label: 'Hired', color: 'var(--success)', bg: 'var(--success-soft)' },
]

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
}

function getAvatarColor(name: string) {
  const colors = ['#4f7cff', '#a855f7', '#14b8a6', '#f59e0b', '#ef4444', '#22c55e']
  const idx = name.charCodeAt(0) % colors.length
  return colors[idx]
}

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [loading, setLoading] = useState(true)

  const load = () => getCandidates().then(d => { setCandidates(d); setLoading(false) })
  useEffect(() => { load() }, [])

  const handleMove = async (id: string, status: Candidate['status']) => {
    await updateCandidateStatus(id, status)
    await load()
  }

  const byStage = (stage: Candidate['status']) => candidates.filter(c => c.status === stage)

  return (
    <div style={{ padding: '32px' }}>
      <div className="animate-fadeIn" style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.4px' }}>Candidate Pipeline</h1>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>Kelola perjalanan kandidat dari lamar hingga hired</p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-muted)' }}>Memuat kandidat...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          {PIPELINE_STAGES.map((stage, si) => {
            const stageCandidates = byStage(stage.key)
            return (
              <div key={stage.key} className={`animate-fadeIn stagger-${si + 1}`} style={{ opacity: 0 }}>
                {/* Stage header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: stage.color, flexShrink: 0 }} />
                  <h2 style={{ fontSize: 13, fontWeight: 700, flex: 1 }}>{stage.label}</h2>
                  <span style={{
                    background: stage.bg, color: stage.color,
                    padding: '2px 9px', borderRadius: 999, fontSize: 12, fontWeight: 700,
                  }}>
                    {stageCandidates.length}
                  </span>
                </div>

                {/* Cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, minHeight: 200 }}>
                  {stageCandidates.length === 0 && (
                    <div className="glass" style={{ borderRadius: 14, padding: 24, textAlign: 'center', borderStyle: 'dashed' }}>
                      <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Belum ada kandidat</p>
                    </div>
                  )}
                  {stageCandidates.map((c) => {
                    const avatarColor = getAvatarColor(c.name)
                    const nextStage = PIPELINE_STAGES.find(s => {
                      const idx = PIPELINE_STAGES.findIndex(x => x.key === c.status)
                      return PIPELINE_STAGES.indexOf(s) === idx + 1
                    })
                    const prevStage = PIPELINE_STAGES.find(s => {
                      const idx = PIPELINE_STAGES.findIndex(x => x.key === c.status)
                      return PIPELINE_STAGES.indexOf(s) === idx - 1
                    })

                    return (
                      <div key={c.id} className="glass glass-hover" style={{ borderRadius: 14, padding: 16, transition: 'all 0.2s', cursor: 'default' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                          <div style={{
                            width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                            background: `${avatarColor}20`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 13, fontWeight: 700, color: avatarColor,
                          }}>
                            {getInitials(c.name)}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontWeight: 600, fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</div>
                            <div style={{ fontSize: 12, color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.position}</div>
                          </div>
                        </div>

                        <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border-subtle)' }}>
                          <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 8 }}>
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                            <span style={{ fontSize: 11, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.email}</span>
                          </div>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                            Lamar: {new Date(c.applied_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </div>
                        </div>

                        {/* Actions */}
                        <div style={{ display: 'flex', gap: 6, marginTop: 12 }}>
                          {prevStage && (
                            <button onClick={() => handleMove(c.id, prevStage.key)} style={{
                              flex: 1, padding: '6px 0', borderRadius: 8, fontSize: 11, fontWeight: 600,
                              background: 'transparent', border: '1px solid var(--border)',
                              color: 'var(--text-muted)', cursor: 'pointer', transition: 'all 0.15s',
                            }}
                            onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = prevStage.color}
                            onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'}
                            >
                              ← {prevStage.label}
                            </button>
                          )}
                          {nextStage && (
                            <button onClick={() => handleMove(c.id, nextStage.key)} style={{
                              flex: 1, padding: '6px 0', borderRadius: 8, fontSize: 11, fontWeight: 700,
                              background: nextStage.bg, border: `1px solid ${nextStage.color}30`,
                              color: nextStage.color, cursor: 'pointer', transition: 'all 0.15s',
                            }}>
                              {nextStage.label} →
                            </button>
                          )}
                          {!nextStage && (
                            <button onClick={() => handleMove(c.id, 'rejected')} style={{
                              flex: 1, padding: '6px 0', borderRadius: 8, fontSize: 11, fontWeight: 600,
                              background: 'var(--danger-soft)', border: '1px solid #ef444430',
                              color: 'var(--danger)', cursor: 'pointer',
                            }}>
                              Reject
                            </button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Rejected section */}
      {!loading && candidates.filter(c => c.status === 'rejected').length > 0 && (
        <div style={{ marginTop: 32 }}>
          <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 12 }}>
            Rejected ({candidates.filter(c => c.status === 'rejected').length})
          </h2>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {candidates.filter(c => c.status === 'rejected').map(c => (
              <div key={c.id} className="glass" style={{ borderRadius: 10, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 8,
                  background: '#ef444415', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 700, color: 'var(--danger)',
                }}>
                  {getInitials(c.name)}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{c.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{c.position}</div>
                </div>
                <button onClick={() => handleMove(c.id, 'applied')} style={{
                  marginLeft: 8, padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600,
                  background: 'var(--accent-soft)', border: '1px solid var(--accent)30', color: 'var(--accent)',
                  cursor: 'pointer',
                }}>
                  Restore
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
