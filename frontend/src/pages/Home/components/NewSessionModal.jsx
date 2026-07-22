import { useContext, useState } from 'react'
import axiosInstance from '../../../utils/axiosInstance'
import { API_PATHS } from '../../../utils/apiPaths'
import { UserContext } from '../../../context/useContext'
import toast from 'react-hot-toast'
import Loader from '../../../components/Loader/Loader'

const roles = [
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'DevOps Engineer',
  'Data Scientist',
  'Product Manager',
  'Software Engineer',
  'Mobile Developer',
  'QA Engineer',
  'Other'
]

const experiences = ['<1', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10+']

const topicsList = [
  'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'System Design',
  'Algorithms', 'Data Structures', 'CSS', 'HTML', 'Databases', 'SQL',
  'AWS', 'Docker', 'Kubernetes', 'Git', 'Testing', 'Agile/Scrum',
  'Behavioral', 'Leadership', 'OOP', 'REST APIs', 'GraphQL', 'Security'
]

const NewSessionModal = ({ isOpen, onClose, onSessionCreated }) => {
  const { user } = useContext(UserContext)

  const [step, setStep] = useState(1)
  const [role, setRole] = useState('')
  const [customRole, setCustomRole] = useState('')
  const [experience, setExperience] = useState('')
  const [selectedTopics, setSelectedTopics] = useState([])
  const [customTopic, setCustomTopic] = useState('')
  const [numQuestions, setNumQuestions] = useState(5)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedQuestions, setGeneratedQuestions] = useState([])
  const [description, setDescription] = useState('')

  const reset = () => {
    setStep(1)
    setRole('')
    setCustomRole('')
    setExperience('')
    setSelectedTopics([])
    setCustomTopic('')
    setNumQuestions(5)
    setIsGenerating(false)
    setGeneratedQuestions([])
    setDescription('')
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  const toggleTopic = (topic) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    )
  }

  const addCustomTopic = () => {
    const trimmed = customTopic.trim()
    if (trimmed && !selectedTopics.includes(trimmed)) {
      setSelectedTopics((prev) => [...prev, trimmed])
      setCustomTopic('')
    }
  }

  const canProceedToGenerate = role && experience && selectedTopics.length > 0

  const handleGenerateQuestions = async () => {
    if (!canProceedToGenerate) return

    setIsGenerating(true)
    const finalRole = role === 'Other' ? customRole : role

    try {
      const response = await axiosInstance.post(API_PATHS.AI.GENERATE_QUESTIONS, {
        role: finalRole,
        experience,
        topicsToFocusOn: selectedTopics,
        numberOfQuestions: numQuestions,
      })
      setGeneratedQuestions(response.data)
      setStep(2)
      toast.success(`Generated ${response.data.length} questions!`)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to generate questions')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCreateSession = async () => {
    if (generatedQuestions.length === 0) {
      toast.error('No questions generated yet')
      return
    }

    setIsGenerating(true)
    const finalRole = role === 'Other' ? customRole : role

    try {
      const response = await axiosInstance.post(API_PATHS.SESSION.CREATE, {
        role: finalRole,
        experience,
        topicsToFocusOn: selectedTopics,
        questions: generatedQuestions,
        description: description || `Interview prep for ${finalRole}`,
      })
      toast.success('Session created!')
      reset()
      if (onSessionCreated) onSessionCreated(response.data.session)
      onClose()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create session')
    } finally {
      setIsGenerating(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 px-3 py-4 backdrop-blur-sm">
      <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h3 className="text-lg font-semibold text-slate-900">
            {step === 1 ? 'New Interview Session' : 'Review Questions'}
          </h3>
          <button
            className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-orange-100 hover:text-orange-600"
            type="button"
            onClick={handleClose}
          >
            <svg className="h-5 w-5" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1l6 6M0 0l6 6M7 7l6-6M7 7l-6 6" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-5">
          {step === 1 && (
            <div className="space-y-5">
              {/* Role */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Target Role</label>
                <div className="flex flex-wrap gap-2">
                  {roles.map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                        role === r
                          ? 'bg-slate-900 text-white'
                          : 'border border-slate-200 bg-white text-slate-600 hover:border-orange-300 hover:text-orange-600'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
                {role === 'Other' && (
                  <input
                    type="text"
                    value={customRole}
                    onChange={(e) => setCustomRole(e.target.value)}
                    placeholder="Enter your role"
                    className="mt-3 w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm outline-none focus:border-orange-300 focus:ring-2 focus:ring-orange-100"
                  />
                )}
              </div>

              {/* Experience */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Experience (years)</label>
                <div className="flex flex-wrap gap-2">
                  {experiences.map((exp) => (
                    <button
                      key={exp}
                      type="button"
                      onClick={() => setExperience(exp)}
                      className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                        experience === exp
                          ? 'bg-slate-900 text-white'
                          : 'border border-slate-200 bg-white text-slate-600 hover:border-orange-300 hover:text-orange-600'
                      }`}
                    >
                      {exp} {exp === '<1' ? 'year' : exp === '10+' ? 'years' : 'yr'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Topics */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Topics to Focus On</label>
                <div className="flex flex-wrap gap-2">
                  {topicsList.map((topic) => (
                    <button
                      key={topic}
                      type="button"
                      onClick={() => toggleTopic(topic)}
                      className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                        selectedTopics.includes(topic)
                          ? 'bg-orange-500 text-white'
                          : 'border border-slate-200 bg-white text-slate-600 hover:border-orange-300 hover:text-orange-600'
                      }`}
                    >
                      {topic}
                    </button>
                  ))}
                </div>
                <div className="mt-3 flex gap-2">
                  <input
                    type="text"
                    value={customTopic}
                    onChange={(e) => setCustomTopic(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomTopic())}
                    placeholder="Add custom topic"
                    className="flex-1 rounded-2xl border border-slate-200 bg-white/90 px-4 py-2.5 text-sm outline-none focus:border-orange-300 focus:ring-2 focus:ring-orange-100"
                  />
                  <button
                    type="button"
                    onClick={addCustomTopic}
                    className="rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-500"
                  >
                    Add
                  </button>
                </div>
                {selectedTopics.length > 0 && (
                  <p className="mt-2 text-xs text-slate-500">{selectedTopics.length} topic{selectedTopics.length > 1 ? 's' : ''} selected</p>
                )}
              </div>

              {/* Number of questions */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Number of Questions</label>
                <input
                  type="range"
                  min="3"
                  max="15"
                  value={numQuestions}
                  onChange={(e) => setNumQuestions(Number(e.target.value))}
                  className="w-full accent-orange-500"
                />
                <p className="text-sm text-slate-500">{numQuestions} questions</p>
              </div>

              {/* Description */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Description (optional)</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g., React focused warm-up"
                  className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm outline-none focus:border-orange-300 focus:ring-2 focus:ring-orange-100"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <p className="text-sm text-slate-500">
                Review the generated questions. You can save them or go back to adjust settings.
              </p>
              {generatedQuestions.map((q, idx) => (
                <div key={idx} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-900">
                    {idx + 1}. {q.question}
                  </p>
                  <p className="mt-2 text-sm text-slate-600 leading-7">{q.answer}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-200 px-5 py-4">
          {step === 2 && (
            <button
              type="button"
              onClick={() => setStep(1)}
              className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-orange-200 hover:text-orange-600"
            >
              Back
            </button>
          )}
          {step === 1 && <div />}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-orange-200 hover:text-orange-600"
            >
              Cancel
            </button>
            {step === 1 ? (
              <button
                type="button"
                onClick={handleGenerateQuestions}
                disabled={!canProceedToGenerate || isGenerating}
                className="btn-small !w-auto disabled:opacity-50"
              >
                {isGenerating ? <Loader size="sm" /> : 'Generate Questions'}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleCreateSession}
                disabled={isGenerating}
                className="btn-small !w-auto disabled:opacity-50"
              >
                {isGenerating ? <Loader size="sm" /> : 'Save Session'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewSessionModal
