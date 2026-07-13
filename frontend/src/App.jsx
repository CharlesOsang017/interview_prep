import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Home/Dashboard'
import InterviewPrep from './pages/InterviewPrep/InterviewPrep'
import { Toaster } from 'react-hot-toast'

const App = () => {
  return (
    <div>

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
            fontSize: "13px"
          },
        }}
      />
    </div>
  )
}

export default App