import { ArrowLeft, Home, LockKeyhole, Search } from 'lucide-react'
import { Link, Navigate, Outlet, useLocation } from 'react-router-dom'
import { Button } from './components'

export function ProtectedRoute({ isAuthenticated = Boolean(localStorage.getItem('repair_token')) }) {
  const location = useLocation()
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  return <Outlet />
}

export function NotFoundPage() {
  return <main className="grid min-h-screen place-items-center bg-[#f7f9f6] px-5 py-16 text-center"><div className="max-w-md"><div className="mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-emerald-50 text-emerald-700"><Search size={31} /></div><p className="mt-8 text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">404 · Page not found</p><h1 className="mt-3 font-display text-4xl font-semibold tracking-[-0.05em] text-slate-950">This page took a wrong turn.</h1><p className="mt-4 text-sm leading-6 text-slate-500">The page you’re looking for doesn’t exist, or it may have moved somewhere else.</p><div className="mt-8 flex flex-wrap justify-center gap-3"><Button to="/dashboard" variant="green"><Home size={16} /> Go to workspace</Button><Link to="/" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"><ArrowLeft size={16} /> Back home</Link></div></div></main>
}

export function AccessDeniedState() {
  return <div className="grid min-h-[60vh] place-items-center p-6 text-center"><div><LockKeyhole className="mx-auto text-slate-300" size={30} /><p className="mt-4 font-semibold text-slate-800">Sign in to continue</p><p className="mt-1 text-sm text-slate-500">Your workspace is private to your account.</p><Link to="/login" className="mt-5 inline-flex text-sm font-semibold text-emerald-700">Go to sign in</Link></div></div>
}
