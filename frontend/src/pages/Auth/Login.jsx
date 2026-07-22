import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Input from '../../components/Inputs/Input'
import { validateEmail } from '../../utils/helper'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import { UserContext } from '../../context/useContext'

const Login = ({ setCurrentPage }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  const { updateUser } = useContext(UserContext)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()

    if (!validateEmail(email)) {
      setError('Please enter a valid email address')
      return
    }

    if (!password) {
      setError('Please enter a password')
      return
    }

    setError('')

    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password
      })
      const { token } = response.data
      localStorage.setItem('token', token)
      updateUser(response.data)
      navigate('/dashboard')
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message)
      } else {
        setError('An error occurred. Please try again.')
      }
    }
  }

  return (
    <div className="w-full p-6 sm:p-8">
      <div className="mb-6 text-center sm:text-left">
        <h3 className="text-2xl font-semibold text-slate-900">Welcome back</h3>
        <p className="mt-1.25 text-sm text-slate-500">Sign in to continue your interview prep.</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-1">
        <Input value={email} label="Email address" onChange={(e) => setEmail(e.target.value)} placeholder="john@example.com" type="email" />
        <Input value={password} label="Password" onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" />

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button className="btn-primary mt-2" type="submit">
          Login
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-slate-500 sm:text-left">
        New here?{' '}
        <button className="font-semibold text-orange-600 underline" onClick={() => setCurrentPage('register')}>
          Create an account
        </button>
      </p>
    </div>
  )
}

export default Login