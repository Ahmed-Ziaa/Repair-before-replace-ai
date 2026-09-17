import { useState } from 'react'
import { ArrowRight, LoaderCircle } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Logo, SectionLabel } from './components'
import api, { getApiError } from './api'

export default function AuthPage({ mode }) {
  const isLogin = mode === 'login'
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }))
  const submit = async (event) => {
    event.preventDefault()
    setError('')
    if (!form.email || !form.password || (!isLogin && !form.name)) return setError('Complete all required fields.')
    if (form.password.length < 8) return setError('Password must be at least 8 characters.')
    setLoading(true)
    try {
      const { data } = await api.post(`/auth/${isLogin ? 'login' : 'register'}`, form)
      localStorage.setItem('repair_token', data.token)
      navigate('/dashboard', { replace: true })
    } catch (requestError) {
      setError(getApiError(requestError, 'Unable to complete that request.'))
    } finally { setLoading(false) }
  }
  return <div className="grid min-h-screen bg-[#d4dfcc] lg:grid-cols-2"><div className="hidden flex-col justify-between bg-slate-950 p-10 text-white lg:flex"><div><Logo /><div className="mt-28 max-w-md"><SectionLabel>A better way forward</SectionLabel><h1 className="font-display text-5xl font-semibold leading-[1.05] tracking-[-0.06em]">Keep the good stuff going.</h1><p className="mt-6 text-base leading-7 text-slate-400">A little more context can change the decision entirely. We are here to help you find it.</p></div></div><p className="text-xs text-slate-500">© 2025 Repair Before Replace</p></div><div className="flex flex-col px-5 py-6 sm:px-10"><div className="lg:hidden"><Logo /></div><div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-12"><span className="mb-5 text-sm font-semibold text-emerald-700">{isLogin ? 'Welcome back' : 'Start your repair-first journey'}</span><h1 className="font-display text-4xl font-semibold tracking-[-0.05em] text-slate-950">{isLogin ? 'Sign in to your workspace' : 'Create your free account'}</h1><p className="mt-3 text-sm text-slate-500">{isLogin ? 'Your next best decision is waiting.' : 'Diagnose your first item in under two minutes.'}</p>{error && <div role="alert" className="mt-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">{error}</div>}<form onSubmit={submit} className="mt-7 space-y-4">{!isLogin && <Field label="Full name" value={form.name} placeholder="Alex Morgan" onChange={(value) => update('name', value)} /> }<Field label="Email address" type="email" value={form.email} placeholder="you@example.com" onChange={(value) => update('email', value)} /><Field label="Password" type="password" value={form.password} placeholder="At least 8 characters" onChange={(value) => update('password', value)} /><Button type="submit" variant="green" className="mt-3 w-full" disabled={loading}>{loading ? <LoaderCircle size={16} className="animate-spin" /> : <>{isLogin ? 'Sign in' : 'Create account'} <ArrowRight size={16} /></>}</Button></form><p className="mt-8 text-center text-sm text-slate-500">{isLogin ? "Don't have an account? " : 'Already have an account? '}<Link to={isLogin ? '/register' : '/login'} className="font-semibold text-emerald-700">{isLogin ? 'Create one' : 'Sign in'}</Link></p></div></div></div>
}
function Field({ label, type = 'text', value, placeholder, onChange }) { return <label className="block text-sm font-semibold text-slate-700">{label}<input required type={type} value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-normal outline-none transition placeholder:text-slate-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100" /></label> }
