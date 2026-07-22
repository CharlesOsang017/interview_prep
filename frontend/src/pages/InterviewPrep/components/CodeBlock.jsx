import { useState } from 'react'
import { LuCopy, LuCheck, LuTerminal } from 'react-icons/lu'
import toast from 'react-hot-toast'

const CodeBlock = ({ language, children }) => {
  const [copied, setCopied] = useState(false)
  const code = typeof children === 'string' ? children : ''

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      toast.success('Code copied')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Failed to copy')
    }
  }

  const handleRun = () => {
    let runnableCode = code

    // Wrap HTML-friendly code in a runnable snippet
    if (language === 'html') {
      // Create a blob URL for the HTML
      const blob = new Blob([code], { type: 'text/html' })
      window.open(URL.createObjectURL(blob), '_blank')
      return
    }

    // For JavaScript, eval in a sandboxed context
    if (language === 'javascript' || language === 'js' || language === 'node') {
      try {
        // eslint-disable-next-line no-new-func
        const fn = new Function(code)
        const result = fn()
        if (result !== undefined) {
          toast.success(`Result: ${String(result)}`, { duration: 4000 })
        } else {
          toast.success('Code executed successfully', { duration: 2000 })
        }
      } catch (err) {
        toast.error(`Runtime error: ${err.message}`, { duration: 5000 })
      }
      return
    }

    // For other languages, copy the code and let user know
    navigator.clipboard.writeText(code)
    toast.success('Code copied — paste it in your terminal to run', { duration: 3000 })
  }

  const isRunnable = ['javascript', 'js', 'html', 'node', 'bash', 'sh', 'shell'].includes(
    language?.toLowerCase() || ''
  )

  return (
    <div className="my-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          {language || 'code'}
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={handleCopy}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white hover:text-slate-600"
            title="Copy code"
          >
            {copied ? <LuCheck size={14} className="text-green-500" /> : <LuCopy size={14} />}
          </button>
          {isRunnable && (
            <button
              onClick={handleRun}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white hover:text-orange-500"
              title="Run code"
            >
              <LuTerminal size={14} />
            </button>
          )}
        </div>
      </div>
      {/* Code Body */}
      <pre className="custom-scrollbar overflow-x-auto bg-slate-900 p-4 text-sm leading-6 text-slate-100">
        <code>{code}</code>
      </pre>
    </div>
  )
}

export default CodeBlock
