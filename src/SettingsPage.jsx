import { useEffect, useState } from 'react'
import { Bell, Check, ChevronRight, Eye, LockKeyhole, Save, ShieldCheck, UserRound } from 'lucide-react'
import { Button } from './components'
import { useToast } from './toast-context'
import api, { getApiError } from './api'

const initialProfile = { name: 'Alex Morgan', email: 'alex@example.com', location: 'Portland, Oregon', bio: 'Trying to keep the good stuff going.' }

export default function SettingsPage() {
  const [section, setSection] = useState('profile')
  const [profile, setProfile] = useState(initialProfile)
  const [notifications, setNotifications] = useState({ reminders: true, updates: true, newsletter: false })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const { toast } = useToast()

  useEffect(() => {
    api.get('/profile').then(({ data }) => {
      setProfile({ ...initialProfile, ...data.user })
      setNotifications({ reminders: true, updates: true, newsletter: false, ...data.user.preferences })
      setLoading(false)
    }).catch((error) => { setLoadError(getApiError(error)); setLoading(false) })
  }, [])

  const updateProfile = (key, value) => {
    setProfile((current) => ({ ...current, [key]: value }))
    setErrors((current) => ({ ...current, [key]: '' }))
  }

  const saveProfile = async (event) => {
    event.preventDefault()
    const nextErrors = {}
    if (!profile.name.trim()) nextErrors.name = 'Your name is required.'
    if (!/^\S+@\S+\.\S+$/.test(profile.email)) nextErrors.email = 'Enter a valid email address.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length === 0) {
      try { await api.patch('/profile', profile); toast('Profile settings saved', 'success') } catch (error) { toast(getApiError(error), 'error') }
    }
  }

  const saveNotifications = async () => {
    try { await api.patch('/profile', { preferences: notifications }); toast('Notification preferences updated', 'success') } catch (error) { toast(getApiError(error), 'error') }
  }

  if (loading) return <div className="mx-auto max-w-5xl px-5 py-24 text-center text-sm text-slate-500">Loading profile settings...</div>
  if (loadError) return <div className="mx-auto max-w-5xl px-5 py-24 text-center"><p className="text-sm font-semibold text-rose-700">{loadError}</p></div>
  return <div className="mx-auto max-w-5xl px-5 py-8 lg:px-10 lg:py-12"><div><p className="text-sm font-medium text-emerald-700">Workspace</p><h1 className="mt-2 font-display text-4xl font-semibold tracking-[-0.05em]">Profile & settings</h1><p className="mt-2 text-sm text-slate-500">Manage how Repair Before Replace works for you.</p></div><div className="mt-10 grid gap-6 lg:grid-cols-[220px_1fr]"><aside className="h-fit rounded-2xl border border-slate-200 bg-white p-2 shadow-sm"><SettingsNav icon={UserRound} label="Profile" active={section === 'profile'} onClick={() => setSection('profile')} /><SettingsNav icon={Bell} label="Notifications" active={section === 'notifications'} onClick={() => setSection('notifications')} /><SettingsNav icon={LockKeyhole} label="Privacy" active={section === 'privacy'} onClick={() => setSection('privacy')} /></aside><main>{section === 'profile' && <ProfileSection profile={profile} errors={errors} update={updateProfile} onSubmit={saveProfile} />}{section === 'notifications' && <NotificationsSection values={notifications} setValues={setNotifications} onSave={saveNotifications} />}{section === 'privacy' && <PrivacySection />}</main></div></div>
}

function ProfileSection({ profile, errors, update, onSubmit }) { return <section className="rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="border-b border-slate-100 p-6 sm:p-8"><div className="flex items-center gap-4"><span className="grid h-14 w-14 place-items-center rounded-2xl bg-slate-950 font-display text-lg font-semibold text-white">AM</span><div><h2 className="font-display text-xl font-semibold">Personal details</h2><p className="mt-1 text-sm text-slate-500">This information is only used to personalize your workspace.</p></div></div></div><form onSubmit={onSubmit} className="space-y-5 p-6 sm:p-8"><div className="grid gap-5 sm:grid-cols-2"><Field label="Full name" value={profile.name} error={errors.name} onChange={(value) => update('name', value)} /><Field label="Email address" type="email" value={profile.email} error={errors.email} onChange={(value) => update('email', value)} /><Field label="Location" value={profile.location} onChange={(value) => update('location', value)} /><label className="block text-sm font-semibold text-slate-700">Preferred experience<select className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-normal outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"><option>Simple & guided</option><option>More technical detail</option></select></label></div><label className="block text-sm font-semibold text-slate-700">About you<span className="ml-2 text-xs font-normal text-slate-400">Optional</span><textarea value={profile.bio} onChange={(event) => update('bio', event.target.value)} rows="3" className="mt-2 w-full resize-none rounded-xl border border-slate-200 px-4 py-3.5 text-sm font-normal outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100" /></label><div className="flex justify-end border-t border-slate-100 pt-5"><Button type="submit" variant="green"><Save size={16} /> Save changes</Button></div></form></section> }

function NotificationsSection({ values, setValues, onSave }) { return <section className="rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="border-b border-slate-100 p-6 sm:p-8"><h2 className="font-display text-xl font-semibold">Notification preferences</h2><p className="mt-1 text-sm text-slate-500">Choose what deserves a place in your inbox.</p></div><div className="divide-y divide-slate-100">{[{ key: 'reminders', title: 'Maintenance reminders', body: 'Get a gentle nudge when an item is due for care.', icon: Bell }, { key: 'updates', title: 'Diagnosis updates', body: 'Receive updates about saved repair plans and history.', icon: ShieldCheck }, { key: 'newsletter', title: 'Repair notes', body: 'Occasional practical tips for keeping things in use.', icon: Eye }].map(({ key, title, body, icon: Icon }) => <div key={key} className="flex items-start justify-between gap-4 p-6 sm:p-8"><div className="flex gap-4"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-700"><Icon size={18} /></span><div><p className="text-sm font-semibold text-slate-800">{title}</p><p className="mt-1 max-w-md text-sm leading-6 text-slate-500">{body}</p></div></div><button type="button" aria-label={`Toggle ${title}`} onClick={() => setValues((current) => ({ ...current, [key]: !current[key] }))} className={`relative h-6 w-11 shrink-0 rounded-full transition ${values[key] ? 'bg-emerald-600' : 'bg-slate-200'}`}><span className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${values[key] ? 'left-6' : 'left-1'}`} /></button></div>)}</div><div className="flex justify-end border-t border-slate-100 p-6 sm:p-8"><Button type="button" variant="green" onClick={onSave}><Save size={16} /> Save preferences</Button></div></section> }

function PrivacySection() { return <section className="rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="border-b border-slate-100 p-6 sm:p-8"><h2 className="font-display text-xl font-semibold">Privacy & data</h2><p className="mt-1 text-sm text-slate-500">You stay in control of your repair decisions and your information.</p></div><div className="space-y-4 p-6 sm:p-8"><PrivacyRow title="Private workspace" body="Your diagnoses are visible only in your workspace." /><PrivacyRow title="No automatic purchasing" body="Repair Before Replace never buys or replaces anything for you." /><PrivacyRow title="Delete your data" body="Mock data only for now. Data controls will be available before launch." muted /></div></section> }
function PrivacyRow({ title, body, muted }) { return <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-4"><ShieldCheck size={18} className={muted ? 'text-slate-400' : 'text-emerald-600'} /><div><p className="text-sm font-semibold text-slate-800">{title}</p><p className="mt-1 text-xs leading-5 text-slate-500">{body}</p></div>{!muted && <Check size={16} className="ml-auto text-emerald-600" />}</div> }
function SettingsNav({ icon: Icon, label, active, onClick }) { return <button onClick={onClick} className={`flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-sm font-semibold transition ${active ? 'bg-emerald-50 text-emerald-800' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}><span className="flex items-center gap-3"><Icon size={16} />{label}</span><ChevronRight size={15} className={active ? 'text-emerald-600' : 'text-slate-300'} /></button> }
function Field({ label, type = 'text', value, error, onChange }) { return <label className="block text-sm font-semibold text-slate-700">{label}<input type={type} value={value} onChange={(event) => onChange(event.target.value)} className={`mt-2 w-full rounded-xl border bg-white px-4 py-3.5 text-sm font-normal outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 ${error ? 'border-rose-400' : 'border-slate-200'}`} />{error && <span className="mt-2 block text-xs font-medium text-rose-600">{error}</span>}</label> }

