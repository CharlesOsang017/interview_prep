import React from 'react'

const Modal = ({ children, isOpen, onClose, title, hideHeader }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 px-3 py-4 backdrop-blur-sm">
      <div className="relative flex max-h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl">
        {!hideHeader && (
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          </div>
        )}

        <button
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-orange-100 hover:text-orange-600"
          type="button"
          onClick={onClose}
        >
          <svg className="h-5 w-5" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1l6 6M0 0l6 6M7 7l6-6M7 7l-6 6" />
          </svg>
        </button>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  )
}

export default Modal