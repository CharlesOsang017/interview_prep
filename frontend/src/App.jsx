import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Home/Dashboard'
import InterviewPrep from './pages/InterviewPrep/InterviewPrep'
import { Toaster } from 'react-hot-toast'
import UserProvider from './context/useContext'

const App = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <UserProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/interview-prep/:sessionId" element={<InterviewPrep />} />
          </Routes>
        </Router>
        <Toaster
          toastOptions={{
            className: '',
            style: {
              fontSize: '13px',
              borderRadius: '999px',
              padding: '12px 14px'
            }
          }}
        />
      </UserProvider>
    </div>
  )
}

export default App