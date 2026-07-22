import { useCallback, useContext, useEffect, useState } from 'react'
import { LuArrowRight, LuBrain, LuClock3, LuSparkles, LuTrash2, LuPlus } from 'react-icons/lu'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import { UserContext } from '../../context/useContext'
import ProfileInfoCard from '../../components/Cards/ProfileInfoCard'
import NewSessionModal from './components/NewSessionModal'
import Loader from '../../components/Loader/Loader'
import moment from 'moment'
import toast from 'react-hot-toast'

const Dashboard = () => {
  const { user, clearUser } = useContext(UserContext)
  const navigate = useNavigate()
  const [sessions, setSessions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showNewSession, setShowNewSession] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  const fetchSessions = useCallback(async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.SESSION.GET_ALL)
      setSessions(response.data)
    } catch (error) {
      console.error('Failed to fetch sessions', error)
      if (error.response?.status === 401) {
        clearUser()
        navigate('/')
      }
    } finally {
      setIsLoading(false)
    }
  }, [clearUser, navigate])

  useEffect(() => {
    fetchSessions()
  }, [fetchSessions])

  const handleDeleteSession = async (sessionId, e) => {
    e.stopPropagation()
    if (!window.confirm('Delete this session and all its questions?')) return
    setDeletingId(sessionId)
    try {
      await axiosInstance.delete(API_PATHS.SESSION.DELETE(sessionId))
      setSessions((prev) => prev.filter((s) => s._id !== sessionId))
      toast.success('Session deleted')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete session')
    } finally {
      setDeletingId(null)
    }
  }

  const handleSessionCreated = (session) => {
    setSessions((prev) => [session, ...prev])
  }

  const handleLogout = () => {
    localStorage.clear()
    clearUser()
    navigate('/')
  }

  const stats = {
    total: sessions.length,
    pinned: sessions.reduce((acc, s) => acc + (s.questions?.filter((q) => q.isPinned).length || 0), 0),
    recent: sessions.length > 0 ? moment(sessions[0].createdAt).format('MMM D, YYYY') : '—'
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader size="lg" text="Loading your sessions..." />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(255,147,36,0.16),_transparent_30%)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        {/* Header */}
        <header className="flex flex-col gap-4 rounded-[2rem] border border-slate-200 bg-white/80 p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-7">
          <div className="flex items-start gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-orange-500">Dashboard</p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-900">
                Hey, {user?.name?.split(' ')[0] || 'there'} 👋
              </h1>
              <p className="mt-2 max-w-xl text-sm leading-7 text-slate-600">
                Jump into a mock interview, review your prep notes, and keep your confidence increasing.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 self-start sm:self-center">
            <ProfileInfoCard />
          </div>
        </header>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { label: 'Total Sessions', value: stats.total, icon: LuBrain, color: 'text-orange-600 bg-orange-50' },
            { label: 'Pinned Questions', value: stats.pinned, icon: LuSparkles, color: 'text-amber-600 bg-amber-50' },
            { label: 'Last Activity', value: stats.recent, icon: LuClock3, color: 'text-slate-600 bg-slate-100' }
          ].map((stat) => (
            <div key={stat.label} className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${stat.color}`}>
                <stat.icon size={22} />
              </div>
              <div>
                <p className="text-2xl font-semibold text-slate-900">{stat.value}</p>
                <p className="text-sm text-slate-500">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <button className="btn-small" onClick={() => setShowNewSession(true)}>
            <LuPlus size={18} /> New Session
          </button>
        </div>

        {/* Sessions */}
        <section>
          <h2 className="mb-4 text-xl font-semibold text-slate-900">Your Sessions</h2>
          {sessions.length === 0 ? (
            <div className="rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-sm">
              <LuBrain size={40} className="mx-auto text-slate-300" />
              <h3 className="mt-4 text-lg font-semibold text-slate-900">No sessions yet</h3>
              <p className="mt-2 text-sm text-slate-500">Create your first interview prep session to get started.</p>
              <button className="btn-small mt-5 !inline-flex" onClick={() => setShowNewSession(true)}>
                <LuPlus size={18} /> Create Session
              </button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {sessions.map((session) => (
                <div
                  key={session._id}
                  onClick={() => navigate(`/interview-prep/${session._id}`)}
                  className="group relative cursor-pointer rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex items-start justify-between">
                    <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-600">
                      {session.role}
                    </span>
                    <button
                      onClick={(e) => handleDeleteSession(session._id, e)}
                      disabled={deletingId === session._id}
                      className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 opacity-0 transition hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
                    >
                      {deletingId === session._id ? <Loader size="sm" /> : <LuTrash2 size={15} />}
                    </button>
                  </div>

                  <h3 className="mt-3 text-base font-semibold text-slate-900">
                    {session.description || `${session.role} Interview Prep`}
                  </h3>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {session.topicsToFocusOn?.slice(0, 3).map((topic) => (
                      <span key={topic} className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-600">
                        {topic}
                      </span>
                    ))}
                    {(session.topicsToFocusOn?.length || 0) > 3 && (
                      <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-400">
                        +{session.topicsToFocusOn.length - 3}
                      </span>
                    )}
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-400">
                    <span>{session.experience} {session.experience === '<1' ? 'yr' : 'yrs'} exp</span>
                    <span>{moment(session.createdAt).format('MMM D, YYYY')}</span>
                    <span>{session.questions?.length || 0} questions</span>
                  </div>

                  <div className="mt-3 flex items-center gap-1 text-sm font-semibold text-orange-600 opacity-0 transition group-hover:opacity-100">
                    Open session <LuArrowRight size={15} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <NewSessionModal
        isOpen={showNewSession}
        onClose={() => setShowNewSession(false)}
        onSessionCreated={handleSessionCreated}
      />
    </div>
  )
}

export default Dashboard
