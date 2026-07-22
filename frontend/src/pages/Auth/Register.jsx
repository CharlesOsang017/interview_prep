import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Input from '../../components/Inputs/Input'
import ProfilePhotoSelector from '../../components/Inputs/ProfilePhotoSelector'
import { validateEmail } from '../../utils/helper'
import { UserContext } from '../../context/useContext'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import toast from 'react-hot-toast'
import Loader from '../../components/Loader/Loader'

const Register = ({ setCurrentPage }) => {
  const [profilePic, setProfilePic] = useState(null)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const { updateUser } = useContext(UserContext)
  const navigate = useNavigate()

  const handleRegister = async (e) => {
    e.preventDefault()

    if (!fullName) {
      setError('Please enter your full name')
      return
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address')
      return
    }

    if (!password) {
      setError('Please enter a password')
      return
    }

    setError('')
    setIsLoading(true)

    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        name: fullName,
        email,
        password,
      })
      const { token } = response.data
      localStorage.setItem('token', token)
      updateUser(response.data)
      toast.success('Account created successfully!')
      navigate('/dashboard')
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message)
      } else {
        setError('An error occurred. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full p-6 sm:p-8">
      <div className="mb-4 text-center sm:text-left">
        <h3 className="text-2xl font-semibold text-slate-900">Create your account</h3>
        <p className="mt-1 text-sm text-slate-500">Join the platform and start practising today.</p>
      </div>

      <form onSubmit={handleRegister} className="space-y-1">
        <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />
        <Input value={fullName} label="Full name" onChange={(e) => setFullName(e.target.value)} placeholder="John Doe" type="text" />
        <Input value={email} label="Email address" onChange={(e) => setEmail(e.target.value)} placeholder="john@example.com" type="email" />
        <Input value={password} label="Password" onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" />

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button className="btn-primary mt-2" type="submit" disabled={isLoading}>
          {isLoading ? <Loader size="sm" /> : 'Register'}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-slate-500 sm:text-left">
        Already have an account?{' '}
        <button className="font-semibold text-orange-600 underline" onClick={() => setCurrentPage('login')}>
          Sign in
        </button>
      </p>
    </div>
  )
}

export default Register
