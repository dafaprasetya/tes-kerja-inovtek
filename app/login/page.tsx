'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const { login, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) router.push('/dashboard')
  }, [user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const ok = await login(email, password)
    if (ok) {
      router.push('/dashboard')
    } else {
      setError('Email atau password salah. Coba: admin@inovtek.id / admin123')
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-primary)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background effects */}
      <div style={{
        position: 'absolute', top: '-20%', left: '-10%',
        width: '60%', height: '60%',
        background: 'radial-gradient(ellipse, #4f7cff0a 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-20%', right: '-10%',
        width: '50%', height: '50%',
        background: 'radial-gradient(ellipse, #a855f70a 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div className="dot-pattern" style={{ position: 'absolute', inset: 0, opacity: 0.5, pointerEvents: 'none' }} />

      <div className="animate-fadeIn" style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 52, height: 52, borderRadius: 14,
            background: 'linear-gradient(135deg, #4f7cff, #a855f7)',
            marginBottom: 20, boxShadow: '0 8px 32px #4f7cff30',
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="9" cy="7" r="4" stroke="white" strokeWidth="2"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
            Recruit<span className="gradient-text">Hub</span>
          </h1>
          <p style={{ marginTop: 8, fontSize: 14, color: 'var(--text-secondary)' }}>
            Inovtek Cipta Digital · Recruitment Platform
          </p>
        </div>

        {/* Card */}
        <div className="glass" style={{ borderRadius: 20, padding: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>Selamat Datang</h2>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 28 }}>
            Masuk ke dashboard rekrutmen Anda
          </p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@inovtek.id"
                required
                style={{
                  width: '100%', padding: '11px 14px', borderRadius: 10,
                  background: '#0a0b0f', border: '1px solid var(--border)',
                  color: 'var(--text-primary)', fontSize: 14, outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={{
                    width: '100%', padding: '11px 44px 11px 14px', borderRadius: 10,
                    background: '#0a0b0f', border: '1px solid var(--border)',
                    color: 'var(--text-primary)', fontSize: 14, outline: 'none',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{
                  position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 0,
                }}>
                  {showPass ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div style={{
                padding: '10px 14px', borderRadius: 8, background: 'var(--danger-soft)',
                border: '1px solid #ef444430', color: 'var(--danger)', fontSize: 13, marginBottom: 16,
              }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '12px', borderRadius: 10,
              background: loading ? '#4f7cff60' : 'linear-gradient(135deg, #4f7cff, #3d6aed)',
              border: 'none', color: 'white', fontSize: 15, fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s', letterSpacing: '-0.2px',
              boxShadow: loading ? 'none' : '0 4px 20px #4f7cff40',
            }}>
              {loading ? 'Memproses...' : 'Masuk'}
            </button>
          </form>

          
        </div>
      </div>
    </div>
  )
}
