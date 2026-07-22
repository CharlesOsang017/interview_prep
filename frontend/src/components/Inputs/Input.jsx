import { useState } from 'react'
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa'

const Input = ({ value, onChange, placeholder, type, label }) => {
  const [showPassword, setShowPassword] = useState(false)

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev)
  }

  return (
    <div className="mb-3">
      <label className="mb-2 block text-sm font-medium text-slate-700">{label}</label>
      <div className="input-box">
        <input
          type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
          value={value}
          onChange={(e) => onChange(e)}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm text-slate-700 outline-none"
        />

        {type === 'password' && (
          <>
            {showPassword ? (
              <FaRegEye size={18} className="cursor-pointer text-orange-500" onClick={toggleShowPassword} />
            ) : (
              <FaRegEyeSlash size={18} className="cursor-pointer text-slate-400" onClick={toggleShowPassword} />
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Input