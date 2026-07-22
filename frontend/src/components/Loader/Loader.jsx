import React from 'react'

const Loader = ({ size = 'md', text }) => {
  const sizes = {
    sm: 'h-6 w-6 border-2',
    md: 'h-10 w-10 border-[3px]',
    lg: 'h-14 w-14 border-4'
  }

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={`${sizes[size]} animate-spin rounded-full border-slate-200 border-t-orange-500`}
      />
      {text && <p className="text-sm text-slate-500">{text}</p>}
    </div>
  )
}

export default Loader
