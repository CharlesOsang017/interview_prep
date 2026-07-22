import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { APP_FEATURES } from '../utils/data'
import HERO_IMG from '../assets/hero_image.jpg'
import { LuArrowRight, LuBookOpen, LuMic, LuSparkles } from 'react-icons/lu'
import Modal from '../components/Modal'
import Register from './Auth/Register'
import Login from './Auth/Login'
import { UserContext } from '../context/useContext'
import ProfileInfoCard from '../components/Cards/ProfileInfoCard'

const LandingPage = () => {
  const { user } = useContext(UserContext)
  const navigate = useNavigate()

  const [openAuthModal, setOpenAuthModal] = useState(false)
  const [currentPage, setCurrentPage] = useState('login')

  const handleCTA = () => {
    if (!user) {
      setOpenAuthModal(true)
    } else {
      navigate('/dashboard')
    }
  }

  return (
    <>
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(255,147,36,0.16),transparent_35%),radial-gradient(circle_at_80%_20%,rgba(251,191,36,0.18),transparent_30%)]" />
        <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-5 sm:px-6 lg:px-8">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-125 w-full bg-[radial-gradient(circle,_rgba(255,147,36,0.2),_transparent_55%)]" />
          <header className="flex items-center justify-between rounded-full border border-white/70 bg-white/70 px-4 py-3 shadow-sm backdrop-blur sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-amber-500 text-lg font-semibold text-white">
                IP
              </div>
              <div>
                <p className="text-base font-semibold text-slate-900">Interview Prep</p>
                <p className="text-xs text-slate-500">AI coaching, simplified</p>
              </div>
            </div>

            {user ? (
              <ProfileInfoCard />
            ) : (
              <button
                className="rounded-full border border-orange-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-orange-300 hover:text-orange-600 sm:px-5"
                onClick={() => setOpenAuthModal(true)}
              >
                Login / Register
              </button>
            )}
          </header>

          <main className="flex-1 pt-8 sm:pt-12 lg:pt-16">
            <section className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="max-w-2xl">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-sm font-semibold text-orange-700">
                  <LuSparkles size={16} /> AI-powered interview practice
                </div>
                <h1 className="text-4xl font-semibold leading-tight text-slate-900 sm:text-5xl lg:text-6xl">
                  Practice smarter,
                  <span className="mt-2 block bg-gradient-to-r from-orange-500 via-amber-500 to-orange-400 bg-clip-text text-transparent bg-size-[200%_200%] animate-text-shine">
                    interview stronger.
                  </span>
                </h1>
                <p className="mt-5 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
                  Get tailored questions, sharpen your answers, and build confidence with a calm, guided AI prep experience.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <button className="btn-small" onClick={handleCTA}>
                    Get started <LuArrowRight />
                  </button>
                  <a href="#features" className="flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-orange-200 hover:text-orange-600">
                    <LuBookOpen /> See what’s inside
                  </a>
                </div>

                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                  {[
                    ['4.9/5', 'Loved by prep learners'],
                    ['24/7', 'On-demand coaching'],
                    ['100%', 'Role-focused practice']
                  ].map(([value, label]) => (
                    <div key={label} className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
                      <p className="text-lg font-semibold text-slate-900">{value}</p>
                      <p className="mt-1 text-sm text-slate-500">{label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[2rem] border border-orange-100 bg-white/80 p-3 shadow-2xl shadow-orange-100 backdrop-blur sm:p-4">
                <img src={HERO_IMG} alt="Interview prep illustration" className="h-[320px] w-full rounded-[1.5rem] object-cover sm:h-[420px]" />
                <div className="mt-4 rounded-[1.25rem] border border-slate-200 bg-slate-950 p-4 text-white">
                  <div className="flex items-center gap-2 text-sm font-semibold text-orange-300">
                    <LuMic size={16} /> Live mock interview preview
                  </div>
                  <p className="mt-2 text-sm text-slate-300">
                    Practice with realistic prompts and receive structured feedback that helps you sound clear and confident.
                  </p>
                </div>
              </div>
            </section>

            <section id="features" className="pb-12 pt-16 sm:pt-20">
              <div className="mb-8 text-center">
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-orange-500">Features</p>
                <h2 className="mt-2 text-3xl font-semibold text-slate-900 sm:text-4xl">Everything you need to prepare with confidence</h2>
              </div>
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {APP_FEATURES.map((feature) => (
                  <div key={feature.id} className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                    <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-50 text-sm font-semibold text-orange-600">
                      {feature.id}
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">{feature.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-slate-600">{feature.description}</p>
                  </div>
                ))}
              </div>
            </section>
          </main>

          <footer className="border-t border-slate-200 py-6 text-center text-sm text-slate-500">
            Crafted with care for focused, modern interview prep.
          </footer>
        </div>
      </div>

      <Modal isOpen={openAuthModal} onClose={() => { setOpenAuthModal(false); setCurrentPage('login') }} hideHeader>
        <div>
          {currentPage === 'login' && <Login setCurrentPage={setCurrentPage} />}
          {currentPage === 'register' && <Register setCurrentPage={setCurrentPage} />}
        </div>
      </Modal>
    </>
  )
}

export default LandingPage