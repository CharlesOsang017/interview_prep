import React, { useContext } from 'react'
import { UserContext } from '../../context/useContext'
import { useNavigate } from 'react-router-dom'

const ProfileInfoCard = () => {
  const { user, clearUser } = useContext(UserContext)
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.clear()
    clearUser()
    navigate('/')
  }

  return (
    <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white/90 px-2 py-2 shadow-sm">
      <img src={user?.profileImageUrl || 'https://ui-avatars.com/api/?name=User&background=ffedd5&color=9a2c2c'} alt="profile" className="h-10 w-10 rounded-full object-cover" />
      <div className="pr-1 text-left">
        <p className="text-sm font-semibold text-slate-900">{user?.name || 'Guest'}</p>
        <button className="text-sm font-medium text-orange-600 transition hover:text-orange-700" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  )
}

export default ProfileInfoCard
