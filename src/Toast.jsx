import { useState } from 'react'
import { Check, X } from 'lucide-react'
import { ToastContext } from './toast-context'

export function ToastProvider({ children }) {
  const [messages, setMessages] = useState([])
  const toast = (message, type = 'success') => {
    const id = Date.now() + Math.random()
    setMessages((current) => [...current, { id, message, type }])
    window.setTimeout(() => setMessages((current) => current.filter((item) => item.id !== id)), 3500)
  }
  return <ToastContext.Provider value={{ toast }}><>{children}</><div className="pointer-events-none fixed inset-x-4 bottom-4 z-50 flex flex-col items-end gap-2 sm:left-auto sm:right-5 sm:w-96">{messages.map((item) => <div key={item.id} role="status" className={`pointer-events-auto flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-sm font-semibold shadow-xl ${item.type === 'error' ? 'border-rose-200 bg-rose-50 text-rose-800' : 'border-emerald-200 bg-white text-slate-800'}`}><span className={`grid h-6 w-6 place-items-center rounded-full ${item.type === 'error' ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-700'}`}>{item.type === 'error' ? <X size={13} /> : <Check size={13} />}</span>{item.message}</div>)}</div></ToastContext.Provider>
}

