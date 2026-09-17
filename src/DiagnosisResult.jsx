import { useState } from 'react'
import {
  AlertTriangle,
  ArrowRight,
  Check,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  Hammer,
  Leaf,
  RotateCcw,
  ShieldAlert,
  Wrench,
  X,
} from 'lucide-react'
import { Button } from './components'

const causes = [
  { title: 'Loose internal connection', score: 92, detail: 'The most likely cause based on the intermittent symptom and item age.' },
  { title: 'Worn charging cable or port', score: 64, detail: 'A secondary possibility worth checking before opening the item.' },
  { title: 'Battery degradation', score: 31, detail: 'Less likely, but possible if the issue worsens away from power.' },
]

const repairSteps = [
  'Power the item off and disconnect it from any charger or power source.',
  'Use a bright light to inspect the port and surrounding casing for lint, dust, or movement.',
  'Gently clean the area with a dry, soft brush. Do not insert metal tools.',
  'Reconnect the original cable and test the item. Stop if it becomes hot or smells unusual.',
]

export default function DiagnosisResult({ form, restart }) {
  const [outcome, setOutcome] = useState('')

  if (!form?.name) return <EmptyResult onRestart={restart} />

  return <div className="space-y-6">
    <ResultHero form={form} outcome={outcome} setOutcome={setOutcome} />
    <div className="grid gap-6 xl:grid-cols-[1.35fr_.65fr]">
      <div className="space-y-6">
        <SummaryPanel />
        <CausesPanel />
        <RepairGuide />
      </div>
      <div className="space-y-6">
        <CostPanel />
        <ToolsPanel />
        <SafetyPanel />
      </div>
    </div>
    <ResultActions outcome={outcome} setOutcome={setOutcome} restart={restart} />
  </div>
}

function ResultHero({ form, outcome, setOutcome }) {
  return <section className="overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm"><div className="relative bg-[#eaf4e7] px-6 py-7 sm:px-8"><div className="absolute -right-12 -top-20 h-64 w-64 rounded-full border-[30px] border-white/40" /><div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-start"><div><span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-bold text-emerald-700 shadow-sm"><CheckCircle2 size={14} /> AI diagnosis ready</span><h2 className="mt-4 font-display text-3xl font-semibold tracking-[-0.05em] text-slate-950 sm:text-4xl">Likely loose connection</h2><p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">Based on your {form.name}, the issue sounds repairable with a simple inspection and clean-up first.</p></div><ConfidenceScore /></div></div><div className="flex flex-col gap-4 border-t border-emerald-100 bg-white px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8"><div><p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400">What do you want to do?</p><p className="mt-1 text-sm text-slate-500">We&apos;ll save this outcome to your mock history.</p></div><div className="flex flex-wrap gap-2"><button onClick={() => setOutcome('repaired')} className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${outcome === 'repaired' ? 'bg-emerald-600 text-white' : 'border border-slate-200 text-slate-700 hover:bg-emerald-50'}`}><Check size={16} /> Mark as Repaired</button><button onClick={() => setOutcome('replaced')} className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${outcome === 'replaced' ? 'bg-slate-950 text-white' : 'border border-slate-200 text-slate-700 hover:bg-slate-50'}`}><X size={16} /> Mark as Replaced</button></div></div></section>
}

function ConfidenceScore() { return <div className="flex shrink-0 items-center gap-3 rounded-2xl bg-white/80 px-4 py-3 shadow-sm"><div className="relative grid h-14 w-14 place-items-center rounded-full" style={{ background: 'conic-gradient(#059669 0 92%, #d1e6ce 92% 100%)' }}><div className="grid h-11 w-11 place-items-center rounded-full bg-white"><span className="font-display text-lg font-semibold text-emerald-700">92%</span></div></div><div><p className="text-sm font-semibold text-slate-800">High confidence</p><p className="mt-1 text-xs text-slate-500">Based on your answers</p></div></div> }

function SummaryPanel() { return <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"><PanelTitle eyebrow="At a glance" title="Repair looks like the better next step." /><div className="mt-7 grid gap-3 sm:grid-cols-3"><StatCard icon={Wrench} label="Repairability" value="High" tone="green" /><StatCard icon={Hammer} label="Difficulty" value="Easy" tone="dark" /><StatCard icon={Clock3} label="Estimated time" value="10–20 min" tone="slate" /></div><div className="mt-5 grid gap-3 sm:grid-cols-2"><InfoRow label="Estimated repair cost" value="$8–$20" /><InfoRow label="Estimated replacement cost" value="$90–$140" /></div></section> }

function CausesPanel() { return <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"><PanelTitle eyebrow="What might be happening" title="Possible causes" /><div className="mt-6 space-y-5">{causes.map((cause) => <div key={cause.title}><div className="flex items-center justify-between gap-4"><p className="text-sm font-semibold text-slate-800">{cause.title}</p><span className="text-xs font-bold text-emerald-700">{cause.score}% likely</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-emerald-500" style={{ width: `${cause.score}%` }} /></div><p className="mt-2 text-xs leading-5 text-slate-500">{cause.detail}</p></div>)}</div></section> }

function CostPanel() { return <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><PanelTitle eyebrow="The practical picture" title="Repair vs replace" /><div className="mt-6 space-y-3"><CompareRow label="Repair estimate" value="$8–$20" highlight /><CompareRow label="New replacement" value="$90–$140" /><CompareRow label="Money saved" value="$70–$132" saved /></div><div className="mt-5 flex items-start gap-3 rounded-xl bg-emerald-50 p-4"><CircleDollarSign size={18} className="mt-0.5 shrink-0 text-emerald-700" /><p className="text-xs leading-5 text-emerald-900">Repairing could save you approximately <strong>$101</strong> compared with replacing it today.</p></div></section> }

function CompareRow({ label, value, highlight, saved }) { return <div className={`flex items-center justify-between rounded-xl px-4 py-3 ${highlight ? 'bg-emerald-50' : saved ? 'bg-slate-950 text-white' : 'border border-slate-100'}`}><span className={`text-xs font-medium ${highlight ? 'text-emerald-800' : saved ? 'text-slate-300' : 'text-slate-500'}`}>{label}</span><span className={`font-display text-lg font-semibold ${highlight ? 'text-emerald-700' : saved ? 'text-emerald-300' : 'text-slate-800'}`}>{value}</span></div> }

function ToolsPanel() { return <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><PanelTitle eyebrow="Before you start" title="Required tools" /><ul className="mt-5 space-y-3">{['Soft, dry cleaning brush', 'Bright flashlight', 'Original charging cable'].map((tool) => <li key={tool} className="flex items-center gap-3 text-sm text-slate-600"><span className="grid h-6 w-6 place-items-center rounded-lg bg-slate-100 text-slate-700"><Check size={13} /></span>{tool}</li>)}</ul></section> }

function SafetyPanel() { return <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6"><p className="flex items-center gap-2 text-sm font-semibold text-amber-900"><ShieldAlert size={17} /> Safety first</p><p className="mt-3 text-xs leading-5 text-amber-800">Unplug before inspecting. Don&apos;t open a swollen battery or work on anything hot, sparking, or wet. Stop and contact a professional if you see damage.</p></section> }

function RepairGuide() { return <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"><PanelTitle eyebrow="Your repair plan" title="Try this first" /><ol className="mt-6 space-y-5">{repairSteps.map((step, index) => <li key={step} className="flex gap-4"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-slate-950 text-xs font-bold text-white">{index + 1}</span><div><p className="text-sm font-semibold text-slate-800">{step}</p>{index === 1 && <p className="mt-1 text-xs leading-5 text-slate-500">A loose-looking port or visible debris would support this diagnosis.</p>}</div></li>)}</ol><div className="mt-7 flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4"><Leaf size={17} className="mt-0.5 shrink-0 text-emerald-600" /><p className="text-xs leading-5 text-slate-600">Keeping this item in use avoids approximately <strong>2.4 kg</strong> of material waste.</p></div></section> }

function ResultActions({ outcome, setOutcome, restart }) { return <section className="flex flex-col justify-between gap-4 rounded-2xl bg-slate-950 p-6 text-white sm:flex-row sm:items-center sm:p-8"><div><p className="font-display text-xl font-semibold">Ready to make the call?</p><p className="mt-1 text-sm text-slate-400">You can update this outcome later in your history.</p></div><div className="flex flex-wrap gap-2"><button onClick={() => setOutcome('repaired')} className={`rounded-xl px-4 py-2.5 text-sm font-semibold ${outcome === 'repaired' ? 'bg-emerald-500 text-white' : 'bg-white/10 text-slate-200 hover:bg-white/15'}`}>{outcome === 'repaired' ? 'Saved as repaired' : 'Mark as Repaired'}</button><button onClick={() => setOutcome('replaced')} className={`rounded-xl px-4 py-2.5 text-sm font-semibold ${outcome === 'replaced' ? 'bg-white text-slate-950' : 'bg-white/10 text-slate-200 hover:bg-white/15'}`}>{outcome === 'replaced' ? 'Saved as replaced' : 'Mark as Replaced'}</button><button onClick={restart} className="inline-flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-400 hover:text-white"><RotateCcw size={15} /> New item</button></div></section> }

function EmptyResult({ onRestart }) { return <section className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm"><div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-slate-100 text-slate-400"><AlertTriangle size={27} /></div><h2 className="mt-6 font-display text-2xl font-semibold">There&apos;s no diagnosis to show yet.</h2><p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-500">Start with an item name and a few symptoms so we can build a useful repair report.</p><Button className="mt-7" variant="green" onClick={onRestart}>Start a diagnosis <ArrowRight size={16} /></Button></section> }

function PanelTitle({ eyebrow, title }) { return <div><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-700">{eyebrow}</p><h3 className="mt-2 font-display text-xl font-semibold tracking-tight text-slate-950">{title}</h3></div> }
function StatCard({ icon: Icon, label, value, tone }) { const styles = tone === 'green' ? 'bg-emerald-50 text-emerald-700' : tone === 'dark' ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-800'; return <div className={`rounded-xl p-4 ${styles}`}><Icon size={17} /><p className="mt-5 text-xs opacity-70">{label}</p><p className="mt-1 font-display text-xl font-semibold">{value}</p></div> }
function InfoRow({ label, value }) { return <div className="flex items-center justify-between rounded-xl border border-slate-100 px-4 py-3"><span className="text-xs text-slate-500">{label}</span><span className="font-display text-lg font-semibold text-slate-800">{value}</span></div> }
