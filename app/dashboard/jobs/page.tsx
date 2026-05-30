'use client'

import { useEffect, useState, useMemo } from 'react'
import { Job } from '@/types'
import { getJobs, addJob, deleteJob, updateJobStatus } from '@/lib/data'

const DEPARTMENTS = ['Engineering', 'Design', 'Product', 'Marketing', 'Data', 'Operations', 'HR']
const TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship']
const STATUSES: Job['status'][] = ['open', 'closed', 'draft']

function statusLabel(s: string) {
  return s === 'open' ? 'Buka' : s === 'closed' ? 'Tutup' : 'Draft'
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [showModal, setShowModal] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [form, setForm] = useState({
    title: '', department: 'Engineering', location: '', type: 'Full-time',
    status: 'open' as Job['status'], description: '',
  })
  const [submitting, setSubmitting] = useState(false)

  const load = () => getJobs().then(d => { setJobs(d); setLoading(false) })
  useEffect(() => { load() }, [])

  const filtered = useMemo(() => {
    return jobs.filter(j => {
      const matchSearch = j.title.toLowerCase().includes(search.toLowerCase()) ||
        j.department.toLowerCase().includes(search.toLowerCase()) ||
        j.location.toLowerCase().includes(search.toLowerCase())
      const matchStatus = filterStatus === 'all' || j.status === filterStatus
      return matchSearch && matchStatus
    })
  }, [jobs, search, filterStatus])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    await addJob(form)
    await load()
    setShowModal(false)
    setForm({ title: '', department: 'Engineering', location: '', type: 'Full-time', status: 'open', description: '' })
    setSubmitting(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus lowongan ini?')) return
    setDeleting(id)
    await deleteJob(id)
    await load()
    setDeleting(null)
  }

  const handleStatusChange = async (id: string, status: Job['status']) => {
    await updateJobStatus(id, status)
    await load()
  }

  const inputStyle = {
    width: '100%', padding: '10px 12px', borderRadius: 8,
    background: '#0a0b0f', border: '1px solid var(--border)',
    color: 'var(--text-primary)', fontSize: 13, outline: 'none',
  }

  return (
    <div style={{ padding: '32px', maxWidth: 1200 }}>
      <div className="animate-fadeIn" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.4px' }}>Job Management</h1>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>Kelola semua posisi yang tersedia</p>
        </div>
        <button onClick={() => setShowModal(true)} style={{
          display: 'flex', alignItems: 'center', gap: 7,
          padding: '10px 18px', borderRadius: 10,
          background: 'linear-gradient(135deg, #4f7cff, #3d6aed)',
          border: 'none', color: 'white', fontSize: 13, fontWeight: 700,
          cursor: 'pointer', boxShadow: '0 4px 16px #4f7cff30',
        }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Tambah Lowongan
        </button>
      </div>

      {/* Filters */}
      <div className="animate-fadeIn stagger-1" style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: '1 1 240px' }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}>
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari lowongan..." style={{ ...inputStyle, paddingLeft: 36 }} />
        </div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ ...inputStyle, width: 'auto', flex: '0 0 auto', cursor: 'pointer' }}>
          <option value="all">Semua Status</option>
          {STATUSES.map(s => <option key={s} value={s}>{statusLabel(s)}</option>)}
        </select>
      </div>

      {/* Jobs count */}
      <p className="animate-fadeIn stagger-2" style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>
        Menampilkan <strong style={{ color: 'var(--text-secondary)' }}>{filtered.length}</strong> dari {jobs.length} lowongan
      </p>

      {/* Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-muted)' }}>Memuat data...</div>
      ) : filtered.length === 0 ? (
        <div className="glass" style={{ borderRadius: 16, padding: 60, textAlign: 'center' }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🔍</div>
          <p style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Tidak ada lowongan ditemukan</p>
        </div>
      ) : (
        <div className="glass animate-fadeIn stagger-3" style={{ borderRadius: 16, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['Posisi', 'Departemen', 'Lokasi', 'Tipe', 'Status', 'Aksi'].map(h => (
                    <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((job, i) => (
                  <tr key={job.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid var(--border-subtle)' : 'none', transition: 'background 0.15s' }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#ffffff03'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                  >
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{job.title}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                        {new Date(job.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--text-secondary)' }}>{job.department}</td>
                    <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--text-secondary)' }}>{job.location}</td>
                    <td style={{ padding: '14px 16px', fontSize: 12 }}>
                      <span style={{ background: '#ffffff08', padding: '3px 10px', borderRadius: 999, color: 'var(--text-secondary)', fontWeight: 500 }}>{job.type}</span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <select value={job.status} onChange={e => handleStatusChange(job.id, e.target.value as Job['status'])}
                        style={{ background: 'transparent', border: 'none', outline: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600, color: job.status === 'open' ? 'var(--success)' : job.status === 'closed' ? 'var(--danger)' : 'var(--warning)' }}>
                        <option value="open">Buka</option>
                        <option value="closed">Tutup</option>
                        <option value="draft">Draft</option>
                      </select>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <button onClick={() => handleDelete(job.id)} disabled={deleting === job.id} style={{
                        background: 'var(--danger-soft)', border: '1px solid #ef444430',
                        color: 'var(--danger)', borderRadius: 8, padding: '5px 10px',
                        fontSize: 12, fontWeight: 600, cursor: 'pointer',
                      }}>
                        {deleting === job.id ? '...' : 'Hapus'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', inset: 0, background: '#00000080', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 24,
        }} onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="glass animate-fadeIn" style={{ borderRadius: 20, padding: 32, width: '100%', maxWidth: 520, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800 }}>Tambah Lowongan Baru</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 20, lineHeight: 1 }}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              {[
                { label: 'Judul Posisi', key: 'title', type: 'text', placeholder: 'e.g. Senior Frontend Developer' },
                { label: 'Lokasi', key: 'location', type: 'text', placeholder: 'e.g. Jakarta, Remote' },
              ].map(f => (
                <div key={f.key} style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>{f.label}</label>
                  <input required type={f.type} placeholder={f.placeholder} value={(form as any)[f.key]}
                    onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    style={inputStyle} />
                </div>
              ))}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Departemen</label>
                  <select value={form.department} onChange={e => setForm(p => ({ ...p, department: e.target.value }))} style={{ ...inputStyle, cursor: 'pointer' }}>
                    {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Tipe</label>
                  <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))} style={{ ...inputStyle, cursor: 'pointer' }}>
                    {TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Status</label>
                <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value as Job['status'] }))} style={{ ...inputStyle, cursor: 'pointer' }}>
                  {STATUSES.map(s => <option key={s} value={s}>{statusLabel(s)}</option>)}
                </select>
              </div>
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Deskripsi</label>
                <textarea rows={4} placeholder="Deskripsi singkat posisi..." value={form.description}
                  onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                  style={{ ...inputStyle, resize: 'vertical' }} />
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: '11px', borderRadius: 10, background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-secondary)', fontWeight: 600, cursor: 'pointer', fontSize: 14 }}>Batal</button>
                <button type="submit" disabled={submitting} style={{ flex: 2, padding: '11px', borderRadius: 10, background: 'linear-gradient(135deg, #4f7cff, #3d6aed)', border: 'none', color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>
                  {submitting ? 'Menyimpan...' : 'Simpan Lowongan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
