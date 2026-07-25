import React, { useContext, useEffect } from 'react'
import { UserContext } from '../../context/useContext'
import { useNavigate } from 'react-router-dom'
import { MdLogout } from "react-icons/md";

const ProfileInfoCard = () => {
  const { user, clearUser } = useContext(UserContext)
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.clear()
    clearUser()
    navigate('/')
  }

  useEffect(()=>{

    console.log("user", user)
  },[user])


  return (
    <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white/90 px-2 py-2 shadow-sm">
    <div className="pr-1 text-left flex items-center gap-2">
        {/* <p className="text-sm font-semibold text-slate-900">{user?.name || 'Guest'}</p> */}
        <button className="text-sm cursor-pointer hover:underline font-medium text-orange-600 transition hover:text-orange-700" onClick={handleLogout}>
          Logout
        </button>
        <div className='cursor-pointer'>
        <MdLogout />
        </div>
      </div>
    </div>
  )
}

export default ProfileInfoCard
