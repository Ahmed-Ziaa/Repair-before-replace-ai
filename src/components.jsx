import { Link, NavLink } from 'react-router-dom'
import { ArrowRight, Check, CircleHelp, Leaf, Menu, Sparkles, X } from 'lucide-react'
import { useState } from 'react'

export const Logo = ({ compact = false }) => (
  <Link to="/" className="flex items-center gap-2.5 text-slate-950">
    <span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-600 text-white shadow-sm shadow-emerald-200">
      <Leaf size={19} strokeWidth={2.5} />
    </span>
    {!compact && <span className="font-display text-[17px] font-semibold tracking-[-0.03em]">Repair<span className="text-emerald-600">Before</span></span>}
  </Link>
)

export function Navbar({ app = false }) {
  const [open, setOpen] = useState(false)
  return (
    <header className={`relative z-20 border-b border-slate-200/70 bg-white/85 backdrop-blur ${app ? '' : 'absolute inset-x-0 top-0 border-transparent bg-transparent'}`}>
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 lg:px-8">
        <Logo />
        {!app && <nav className="hidden items-center gap-8 md:flex">
          <a href="#how-it-works" className="text-sm font-medium text-slate-600 transition hover:text-slate-950">How it works</a>
          <a href="#features" className="text-sm font-medium text-slate-600 transition hover:text-slate-950">Features</a>
          <a href="#promise" className="text-sm font-medium text-slate-600 transition hover:text-slate-950">Our promise</a>
        </nav>}
        {app ? <div className="flex items-center gap-4"><span className="hidden text-sm text-slate-500 sm:block">Alex Morgan</span><span className="grid h-9 w-9 place-items-center rounded-full bg-slate-900 text-xs font-semibold text-white">AM</span></div> : <div className="hidden items-center gap-3 md:flex"><Link to="/login" className="px-3 py-2 text-sm font-semibold text-slate-600 hover:text-slate-950">Log in</Link><Link to="/register" className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-slate-300 transition hover:-translate-y-0.5">Start for free <ArrowRight className="ml-1 inline" size={15} /></Link></div>}
        <button onClick={() => setOpen(!open)} className="rounded-lg p-2 text-slate-700 md:hidden" aria-label="Toggle menu">{open ? <X size={21} /> : <Menu size={21} />}</button>
      </div>
      {open && <div className="border-t border-slate-200 bg-white px-5 py-4 md:hidden"><div className="flex flex-col gap-4">{!app && <><a href="#how-it-works" onClick={() => setOpen(false)} className="text-sm font-medium">How it works</a><a href="#features" onClick={() => setOpen(false)} className="text-sm font-medium">Features</a></>}<Link to={app ? '/diagnose' : '/login'} className="text-sm font-semibold text-emerald-700">{app ? 'Diagnose an item' : 'Log in'}</Link></div></div>}
    </header>
  )
}

export function Button({ children, to, variant = 'dark', className = '', ...props }) {
  const styles = variant === 'green' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200 hover:bg-emerald-700' : variant === 'soft' ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100' : 'bg-slate-950 text-white shadow-lg shadow-slate-300 hover:bg-slate-800'
  const classes = `inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition hover:-translate-y-0.5 ${styles} ${className}`
  return to ? <Link to={to} className={classes}>{children}</Link> : <button className={classes} {...props}>{children}</button>
}

export function Footer() {
  return <footer className="border-t border-slate-200 bg-white"><div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-10 sm:flex-row sm:items-center sm:justify-between lg:px-8"><div><Logo /><p className="mt-3 max-w-xs text-sm leading-6 text-slate-500">A second opinion for the things you already own.</p></div><div className="flex gap-6 text-sm text-slate-500"><a href="#features" className="hover:text-slate-950">Features</a><a href="#promise" className="hover:text-slate-950">Our promise</a><a href="mailto:hello@repairbefore.com" className="hover:text-slate-950">Contact</a></div><p className="text-xs text-slate-400">© 2025 Repair Before Replace</p></div></footer>
}

export const SectionLabel = ({ children }) => <span className="mb-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-emerald-700"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />{children}</span>

export function AppSidebar() {
  return <aside className="hidden w-60 shrink-0 border-r border-slate-200 bg-white lg:block"><div className="sticky top-0 flex h-screen flex-col px-4 py-6"><div className="px-3"><Logo /></div><p className="mb-3 mt-12 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Workspace</p><nav className="space-y-1"><NavLink to="/dashboard" className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold ${isActive ? 'bg-emerald-50 text-emerald-800' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}><span>◌</span> Overview</NavLink><NavLink to="/diagnose" className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold ${isActive ? 'bg-emerald-50 text-emerald-800' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}><Sparkles size={16} /> Diagnose an item</NavLink><NavLink to="/history" className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold ${isActive ? 'bg-emerald-50 text-emerald-800' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}><span>◷</span> History</NavLink><NavLink to="/maintenance" className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold ${isActive ? 'bg-emerald-50 text-emerald-800' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}><span>✦</span> Maintenance</NavLink><NavLink to="/settings" className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold ${isActive ? 'bg-emerald-50 text-emerald-800' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}><span>⚙</span> Settings</NavLink></nav><div className="mt-auto rounded-2xl bg-slate-950 p-4 text-white"><p className="text-xs font-semibold text-emerald-300">Your impact</p><p className="mt-2 font-display text-2xl font-semibold">142 kg</p><p className="mt-1 text-xs leading-5 text-slate-400">of waste avoided this year</p><div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full w-[68%] rounded-full bg-emerald-400" /></div></div><Link to="/" className="mt-5 px-3 text-xs font-medium text-slate-400 hover:text-slate-700">← Back to website</Link></div></aside>
}

export function MobileAppHeader() {
  const [open, setOpen] = useState(false)
  return <div className="relative border-b border-slate-200 bg-white lg:hidden"><div className="flex items-center justify-between px-5 py-4"><Logo compact /><div className="flex items-center gap-2"><span className="grid h-8 w-8 place-items-center rounded-full bg-slate-900 text-[10px] font-semibold text-white">AM</span><button onClick={() => setOpen(!open)} className="rounded-lg p-2 text-slate-600" aria-label="Toggle workspace navigation">{open ? <X size={19} /> : <Menu size={19} />}</button></div></div>{open && <nav className="border-t border-slate-100 px-5 py-3"><div className="grid gap-1"><NavLink onClick={() => setOpen(false)} to="/dashboard" className={({ isActive }) => `rounded-lg px-3 py-2.5 text-sm font-semibold ${isActive ? 'bg-emerald-50 text-emerald-800' : 'text-slate-600'}`}>Overview</NavLink><NavLink onClick={() => setOpen(false)} to="/diagnose" className={({ isActive }) => `rounded-lg px-3 py-2.5 text-sm font-semibold ${isActive ? 'bg-emerald-50 text-emerald-800' : 'text-slate-600'}`}>Diagnose an item</NavLink><NavLink onClick={() => setOpen(false)} to="/history" className={({ isActive }) => `rounded-lg px-3 py-2.5 text-sm font-semibold ${isActive ? 'bg-emerald-50 text-emerald-800' : 'text-slate-600'}`}>Repair history</NavLink><NavLink onClick={() => setOpen(false)} to="/maintenance" className={({ isActive }) => `rounded-lg px-3 py-2.5 text-sm font-semibold ${isActive ? 'bg-emerald-50 text-emerald-800' : 'text-slate-600'}`}>Maintenance</NavLink><NavLink onClick={() => setOpen(false)} to="/settings" className={({ isActive }) => `rounded-lg px-3 py-2.5 text-sm font-semibold ${isActive ? 'bg-emerald-50 text-emerald-800' : 'text-slate-600'}`}>Profile & settings</NavLink></div></nav>}</div>
}

export const CheckItem = ({ children }) => <li className="flex items-start gap-3 text-sm leading-6 text-slate-600"><span className="mt-1 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-700"><Check size={11} strokeWidth={3} /></span>{children}</li>

export const HelpTip = ({ children }) => <span title={children} className="inline-flex cursor-help text-slate-400"><CircleHelp size={14} /></span>
