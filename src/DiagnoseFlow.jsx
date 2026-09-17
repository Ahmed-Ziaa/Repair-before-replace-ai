import { useRef, useState } from 'react'
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Camera,
  Check,
  CheckCircle2,
  CircleHelp,
  FileImage,
  ImagePlus,
  LoaderCircle,
  RotateCcw,
  Sparkles,
  Wrench,
  X,
} from 'lucide-react'
import { AppSidebar, Button, HelpTip, MobileAppHeader } from './components'
import DiagnosisResult from './DiagnosisResultApi'
import api, { getApiError } from './api'

const STEPS = [
  'Category',
  'Photo',
  'Details',
  'Problem',
  'Questions',
  'Analysis',
  'Result',
]

const CATEGORIES = [
  { name: 'Electronics', icon: '⌁', hint: 'Phones, laptops, audio' },
  { name: 'Clothing & textiles', icon: '◌', hint: 'Apparel, bags, shoes' },
  { name: 'Home & kitchen', icon: '⌂', hint: 'Appliances, cookware' },
  { name: 'Furniture', icon: '▱', hint: 'Tables, chairs, storage' },
  { name: 'Other', icon: '✦', hint: 'Something else' },
]

const QUESTIONS = [
  { id: 'started', label: 'When did you first notice the problem?', options: ['Today', 'This week', 'A few weeks ago', 'I’m not sure'] },
  { id: 'changed', label: 'Did anything change before it started?', options: ['A drop or impact', 'Water or heat exposure', 'Normal use', 'Nothing I can remember'] },
  { id: 'tried', label: 'What have you tried so far?', options: ['Restarted or reset it', 'Cleaned or adjusted it', 'Looked for a manual', 'Nothing yet'] },
]

const INITIAL_FORM = {
  category: '',
  image: null,
  imageName: '',
  imageFile: null,
  name: '',
  brand: '',
  model: '',
  age: '',
  problem: '',
  answers: {},
}

export default function DiagnoseFlow() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState(INITIAL_FORM)
  const [errors, setErrors] = useState({})
  const [isDragging, setIsDragging] = useState(false)
  const [analysisError, setAnalysisError] = useState(false)
  const [diagnosis, setDiagnosis] = useState(null)
  const inputRef = useRef(null)

  const update = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }))
    setErrors((current) => ({ ...current, [key]: '' }))
  }

  const setAnswer = (id, value) => {
    setForm((current) => ({ ...current, answers: { ...current.answers, [id]: value } }))
    setErrors((current) => ({ ...current, answers: '' }))
  }

  const handleFile = (file) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setErrors({ image: 'Please choose an image file.' })
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setErrors({ image: 'That image is larger than 10MB.' })
      return
    }
    const reader = new FileReader()
    reader.onload = () => update('image', reader.result)
    reader.readAsDataURL(file)
    update('imageName', file.name)
    update('imageFile', file)
  }

  const validate = () => {
    const nextErrors = {}
    if (step === 1 && !form.category) nextErrors.category = 'Choose a category to continue.'
    if (step === 3) {
      if (!form.name.trim()) nextErrors.name = 'Add an item name.'
      if (!form.age) nextErrors.age = 'Choose an approximate age.'
    }
    if (step === 4 && form.problem.trim().length < 12) nextErrors.problem = 'Add a little more detail so we can help.'
    if (step === 5 && QUESTIONS.some((question) => !form.answers[question.id])) nextErrors.answers = 'Answer each question to continue.'
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const submitDiagnosis = async () => {
    const payload = new FormData()
    Object.entries(form).forEach(([key, value]) => {
      if (key === 'image' || key === 'imageFile' || key === 'answers') return
      payload.append(key, value)
    })
    payload.append('answers', JSON.stringify(form.answers))
    if (form.imageFile) payload.append('image', form.imageFile)
    try {
      const { data } = await api.post('/diagnoses', payload)
      setDiagnosis(data.diagnosis)
      setStep(7)
    } catch (error) {
      setAnalysisError(true)
      setErrors({ submit: getApiError(error, 'We could not save this diagnosis. Please try again.') })
    }
  }

  const next = () => {
    if (!validate()) return
    if (step === 5) {
      setAnalysisError(false)
      setStep(6)
      submitDiagnosis()
    } else setStep((current) => Math.min(current + 1, 7))
  }

  const back = () => {
    setErrors({})
    setStep((current) => Math.max(current - 1, 1))
  }

  const retryAnalysis = () => {
    setAnalysisError(false)
    setErrors({})
    setStep(6)
    submitDiagnosis()
  }

  return <AppShell><div className="mx-auto max-w-5xl px-5 py-8 lg:px-10 lg:py-12">
    <FlowHeader step={step} />
    <div className="mt-8 lg:mt-10">{step === 1 && <CategoryStep form={form} update={update} error={errors.category} />}
      {step === 2 && <PhotoStep form={form} update={update} handleFile={handleFile} inputRef={inputRef} isDragging={isDragging} setIsDragging={setIsDragging} error={errors.image} />}
      {step === 3 && <DetailsStep form={form} update={update} errors={errors} />}
      {step === 4 && <ProblemStep form={form} update={update} error={errors.problem} />}
      {step === 5 && <QuestionsStep form={form} setAnswer={setAnswer} error={errors.answers} />}
      {step === 6 && <AnalysisStep hasError={analysisError} retry={retryAnalysis} />}
      {step === 7 && <DiagnosisResult diagnosis={diagnosis} restart={() => { setForm(INITIAL_FORM); setDiagnosis(null); setErrors({}); setStep(1) }} />}</div>
    {step < 6 && <FlowActions step={step} back={back} next={next} />}
    {step === 6 && !analysisError && <p className="mt-8 text-center text-xs text-slate-400">You can leave this tab open while we work.</p>}
  </div></AppShell>
}

function FlowHeader({ step }) {
  return <div><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><p className="text-sm font-medium text-emerald-700">New diagnosis</p><h1 className="mt-2 font-display text-4xl font-semibold tracking-[-0.05em]">Let&apos;s take a closer look.</h1></div><span className="text-sm font-semibold text-slate-400">{step < 6 ? `Step ${step} of 5` : step === 6 ? 'Reviewing your answers' : 'Diagnosis complete'}</span></div>{step < 6 && <div className="mt-8 flex gap-1.5">{STEPS.slice(0, 5).map((label, index) => <div key={label} className="group flex min-w-0 flex-1 flex-col gap-2"><div className={`h-1.5 rounded-full transition ${step >= index + 1 ? 'bg-emerald-500' : 'bg-slate-200'}`} /><span className={`hidden truncate text-[10px] font-semibold uppercase tracking-wider sm:block ${step === index + 1 ? 'text-emerald-700' : 'text-slate-400'}`}>{label}</span></div>)}</div>}</div>
}

function CategoryStep({ form, update, error }) {
  return <div className="grid gap-6 lg:grid-cols-[1.1fr_.9fr]"><Panel><PanelHeading title="What kind of item is it?" tip="Pick the category that is closest. You can give us more detail next." /><div className="mt-6 grid gap-2 sm:grid-cols-2">{CATEGORIES.map((category) => <button key={category.name} onClick={() => update('category', category.name)} className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${form.category === category.name ? 'border-emerald-500 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-100' : 'border-slate-200 text-slate-700 hover:border-emerald-300'}`}><span className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100 font-display text-xl text-slate-600">{category.icon}</span><span><span className="block text-sm font-semibold">{category.name}</span><span className="mt-0.5 block text-xs text-slate-400">{category.hint}</span></span>{form.category === category.name && <Check size={16} className="ml-auto text-emerald-600" />}</button>)}</div>{error && <ErrorMessage>{error}</ErrorMessage>}</Panel><TipCard title="Start with the big picture" body="You don’t need to know the technical name. A broad category helps us ask the right follow-up questions." /></div>
}

function PhotoStep({ form, update, handleFile, inputRef, isDragging, setIsDragging, error }) {
  return <div className="grid gap-6 lg:grid-cols-[1.1fr_.9fr]"><Panel><PanelHeading title="Add a photo" tip="A clear photo of the full item is usually most helpful." /><input ref={inputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={(event) => handleFile(event.target.files?.[0])} />{form.image ? <div className="relative mt-6 overflow-hidden rounded-2xl bg-slate-100"><img src={form.image} alt="Selected item preview" className="max-h-80 w-full object-contain" /><button onClick={() => { inputRef.current.value = ''; update('image', null); update('imageName', '') }} className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white text-slate-600 shadow-lg" aria-label="Remove image"><X size={17} /></button><div className="absolute inset-x-3 bottom-3 flex items-center justify-between rounded-xl bg-slate-950/80 px-3 py-2 text-xs text-white"><span className="flex items-center gap-2"><FileImage size={14} />{form.imageName}</span><button onClick={() => inputRef.current?.click()} className="font-semibold text-emerald-300">Replace</button></div></div> : <div onDragOver={(event) => { event.preventDefault(); setIsDragging(true) }} onDragLeave={() => setIsDragging(false)} onDrop={(event) => { event.preventDefault(); setIsDragging(false); handleFile(event.dataTransfer.files?.[0]) }} onClick={() => inputRef.current?.click()} className={`mt-6 cursor-pointer rounded-2xl border-2 border-dashed px-6 py-14 text-center transition ${isDragging ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/40'}`}><div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-emerald-50 text-emerald-700"><ImagePlus size={23} /></div><p className="mt-4 text-sm font-semibold text-slate-700">Drop an image here, or browse</p><p className="mt-1 text-xs text-slate-400">PNG, JPG up to 10MB</p><span className="mt-5 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 shadow-sm"><Camera size={14} /> Use camera</span></div>}{error && <ErrorMessage>{error}</ErrorMessage>}<p className="mt-4 flex items-center gap-2 text-xs text-slate-400"><CircleHelp size={13} /> You can skip this step if you don&apos;t have a photo.</p></Panel><TipCard title="A good photo goes a long way" body="Include the whole item first. If there’s a specific damaged area, add a close-up after." /></div>
}

function DetailsStep({ form, update, errors }) {
  return <Panel><PanelHeading title="Tell us about the item" tip="These details help us find a more relevant repair path." /><div className="mt-7 grid gap-5 sm:grid-cols-2"><Field label="Item name" required value={form.name} onChange={(value) => update('name', value)} placeholder="e.g. Wireless headphones" error={errors.name} className="sm:col-span-2" /><Field label="Brand" value={form.brand} onChange={(value) => update('brand', value)} placeholder="e.g. Sony" /><Field label="Model" value={form.model} onChange={(value) => update('model', value)} placeholder="e.g. WH-1000XM4" /><label className="block text-sm font-semibold text-slate-700 sm:max-w-xs">Approximate age <span className="text-rose-500">*</span><select value={form.age} onChange={(event) => update('age', event.target.value)} className={`mt-2 w-full rounded-xl border bg-white px-4 py-3.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 ${errors.age ? 'border-rose-400' : 'border-slate-200'}`}><option value="">Select age</option><option>Less than 1 year</option><option>1–3 years</option><option>3–5 years</option><option>5+ years</option><option>Not sure</option></select>{errors.age && <ErrorMessage>{errors.age}</ErrorMessage>}</label></div></Panel>
}

function ProblemStep({ form, update, error }) { return <Panel><PanelHeading title="What&apos;s going wrong?" tip="Describe the symptoms, not the diagnosis. Tell us what you see, hear, or feel." /><label className="mt-7 block text-sm font-semibold text-slate-700">Describe the problem <span className="text-rose-500">*</span><textarea value={form.problem} onChange={(event) => update('problem', event.target.value)} rows="7" placeholder="For example: It turns on, but the left side is much quieter than the right. I noticed it after charging overnight..." className={`mt-2 w-full resize-none rounded-xl border bg-white px-4 py-3.5 text-sm leading-6 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 ${error ? 'border-rose-400' : 'border-slate-200'}`} /><div className="mt-2 flex justify-between text-xs text-slate-400"><span>{error || 'The more context you share, the more useful your result will be.'}</span><span>{form.problem.length}/500</span></div></label><div className="mt-7 rounded-xl bg-emerald-50 p-4 text-sm leading-6 text-emerald-900"><span className="font-semibold">Helpful prompts:</span> When did it start? What changed? Is the issue constant or occasional?</div></Panel> }

function QuestionsStep({ form, setAnswer, error }) { return <Panel><PanelHeading title="A few quick questions" tip="There are no wrong answers. These help us narrow down the likely cause." /><div className="mt-7 space-y-7">{QUESTIONS.map((question, index) => <div key={question.id}><p className="text-sm font-semibold text-slate-800"><span className="mr-2 text-emerald-600">0{index + 1}</span>{question.label}</p><div className="mt-3 grid gap-2 sm:grid-cols-2">{question.options.map((option) => <button key={option} onClick={() => setAnswer(question.id, option)} className={`rounded-xl border px-4 py-3 text-left text-sm transition ${form.answers[question.id] === option ? 'border-emerald-500 bg-emerald-50 font-semibold text-emerald-800' : 'border-slate-200 text-slate-600 hover:border-emerald-300'}`}>{option}</button>)}</div></div>)}</div>{error && <ErrorMessage>{error}</ErrorMessage>}</Panel> }

function AnalysisStep({ hasError, retry }) { return <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center sm:px-12">{hasError ? <><div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-rose-100 text-rose-600"><AlertCircle size={28} /></div><h2 className="mt-6 font-display text-2xl font-semibold">We hit a small snag.</h2><p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-500">Your answers are still here. Give the analysis another try and we&apos;ll pick up where we left off.</p><button onClick={retry} className="mt-7 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white"><RotateCcw size={16} /> Try again</button></> : <><div className="relative mx-auto grid h-20 w-20 place-items-center rounded-full bg-emerald-50 text-emerald-600"><Sparkles size={29} /><span className="absolute inset-0 animate-ping rounded-full border border-emerald-300 opacity-50" /></div><h2 className="mt-7 font-display text-2xl font-semibold">Reading the clues...</h2><p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-500">We&apos;re comparing your symptoms with repair patterns and looking for the simplest next step.</p><div className="mx-auto mt-8 flex max-w-xs items-center gap-3 text-left text-xs text-slate-500"><LoaderCircle size={15} className="animate-spin text-emerald-600" /><span>Checking likely causes</span><span className="ml-auto text-emerald-600">In progress</span></div><div className="mx-auto mt-3 flex max-w-xs items-center gap-3 text-left text-xs text-slate-400"><LoaderCircle size={15} /><span>Building your repair plan</span></div></>}</div> }

export function ResultStep({ form, restart }) { return <div className="grid gap-6 lg:grid-cols-[1.25fr_.75fr]"><Panel><div className="flex items-start justify-between gap-4"><div><span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700"><CheckCircle2 size={14} /> Diagnosis ready</span><h2 className="mt-4 font-display text-3xl font-semibold tracking-[-0.04em]">Likely loose connection</h2><p className="mt-2 text-sm text-slate-500">Based on your {form.name || 'item'} and the symptoms you described.</p></div><div className="hidden rounded-xl bg-emerald-100 px-3 py-2 text-center sm:block"><p className="font-display text-2xl font-semibold text-emerald-700">92%</p><p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-700">confidence</p></div></div><div className="mt-8 rounded-2xl bg-[#eef6ec] p-5"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-white text-emerald-700 shadow-sm"><Wrench size={19} /></span><div><p className="text-sm font-semibold text-slate-800">Good news: this looks repairable</p><p className="mt-1 text-xs text-slate-500">Estimated repair time: 10–20 minutes</p></div></div></div><div className="mt-8"><h3 className="font-display text-lg font-semibold">Your next best steps</h3><ol className="mt-4 space-y-4">{['Power the item off and disconnect it from its charger.', 'Check the connection for dust, lint, or visible movement.', 'If the issue persists, a local repair shop can reseat the connection.'].map((item, index) => <li key={item} className="flex gap-3 text-sm leading-6 text-slate-600"><span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-slate-950 text-xs font-bold text-white">{index + 1}</span>{item}</li>)}</ol></div><div className="mt-8 flex flex-col gap-3 sm:flex-row"><Button variant="green"><Sparkles size={16} /> Save repair plan</Button><button onClick={restart} className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50">Diagnose another item</button></div></Panel><div className="space-y-6"><div className="rounded-2xl bg-slate-950 p-6 text-white"><p className="text-xs font-bold uppercase tracking-widest text-emerald-300">Repair outlook</p><div className="mt-5 flex items-end gap-2"><span className="font-display text-4xl font-semibold">High</span><span className="mb-1 text-sm text-slate-400">likelihood</span></div><div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full w-[88%] rounded-full bg-emerald-400" /></div><p className="mt-4 text-sm leading-6 text-slate-400">Repairing this item could keep approximately 2.4 kg of material in use.</p></div><div className="rounded-2xl border border-slate-200 bg-white p-6"><p className="flex items-center gap-2 text-sm font-semibold"><Sparkles size={16} className="text-emerald-600" /> Remember</p><p className="mt-3 text-sm leading-6 text-slate-500">This is a decision-support result, not a professional guarantee. Stop if anything feels unsafe.</p></div></div></div> }

function Panel({ children }) { return <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">{children}</div> }
function PanelHeading({ title, tip }) { return <div className="flex items-center justify-between gap-4"><h2 className="font-display text-xl font-semibold tracking-tight" dangerouslySetInnerHTML={{ __html: title }} />{tip && <HelpTip>{tip}</HelpTip>}</div> }
function TipCard({ title, body }) { return <div className="rounded-2xl bg-[#eaf3e8] p-6"><div className="flex items-center gap-2 text-sm font-semibold text-emerald-800"><Sparkles size={17} /> {title}</div><p className="mt-4 text-sm leading-6 text-slate-600">{body}</p></div> }
function ErrorMessage({ children }) { return <p className="mt-3 flex items-center gap-2 text-xs font-medium text-rose-600"><AlertCircle size={14} />{children}</p> }
function Field({ label, value, onChange, placeholder, required, error, className = '' }) { return <label className={`block text-sm font-semibold text-slate-700 ${className}`}>{label} {required && <span className="text-rose-500">*</span>}<input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className={`mt-2 w-full rounded-xl border bg-white px-4 py-3.5 text-sm font-normal outline-none transition placeholder:text-slate-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 ${error ? 'border-rose-400' : 'border-slate-200'}`} />{error && <ErrorMessage>{error}</ErrorMessage>}</label> }
function FlowActions({ step, back, next }) { return <div className="mt-8 flex items-center justify-between"><button onClick={back} disabled={step === 1} className="inline-flex items-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold text-slate-500 transition hover:bg-white hover:text-slate-900 disabled:invisible"><ArrowLeft size={16} /> Back</button><button onClick={next} className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-300 transition hover:-translate-y-0.5 hover:bg-slate-800">{step === 5 ? 'Start diagnosis' : 'Continue'} <ArrowRight size={16} /></button></div> }
function AppShell({ children }) { return <div className="min-h-screen bg-[#f7f9f6] text-slate-950"><AppSidebar /><div className="lg:pl-60"><MobileAppHeader />{children}</div></div> }
