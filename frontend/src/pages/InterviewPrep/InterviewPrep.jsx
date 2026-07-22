import { useCallback, useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  LuArrowLeft, LuBrain, LuPin, LuPinOff, LuSparkles, LuBookOpen,
  LuSend, LuChevronDown, LuChevronUp, LuCopy, LuCheck, LuFileText
} from 'react-icons/lu'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import { UserContext } from '../../context/useContext'
import ProfileInfoCard from '../../components/Cards/ProfileInfoCard'
import Loader from '../../components/Loader/Loader'
import CodeBlock from './components/CodeBlock'
import toast from 'react-hot-toast'

// Custom renderers for ReactMarkdown — maps code blocks to our CodeBlock component
const markdownRenderers = {
  code: ({ className, children, ...props }) => {
    const match = /language-(\w+)/.exec(className || '')
    const language = match ? match[1] : ''
    return (
      <CodeBlock language={language}>
        {String(children).replace(/\n$/, '')}
      </CodeBlock>
    )
  },
}

const InterviewPrep = () => {
  const { sessionId } = useParams()
  const navigate = useNavigate()
  const { user, clearUser } = useContext(UserContext)

  const [session, setSession] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [expandedQuestion, setExpandedQuestion] = useState(null)
  const [noteText, setNoteText] = useState({})
  const [savingNote, setSavingNote] = useState(null)
  const [pinningId, setPinningId] = useState(null)
  const [explanation, setExplanation] = useState(null)
  const [isLoadingExplanation, setIsLoadingExplanation] = useState(false)
  const [explainingId, setExplainingId] = useState(null)
  const [copiedId, setCopiedId] = useState(null)

  const fetchSession = useCallback(async () => {
    if (!sessionId || sessionId === 'demo') {
      setIsLoading(false)
      return
    }
    try {
      const response = await axiosInstance.get(API_PATHS.SESSION.GET_ONE(sessionId))
      setSession(response.data.session)
    } catch (error) {
      console.error('Failed to fetch session', error)
      if (error.response?.status === 401) {
        clearUser()
        navigate('/')
      } else {
        toast.error('Session not found')
        navigate('/dashboard')
      }
    } finally {
      setIsLoading(false)
    }
  }, [sessionId, clearUser, navigate])

  useEffect(() => {
    fetchSession()
  }, [fetchSession])

  const handleTogglePin = async (questionId) => {
    setPinningId(questionId)
    try {
      const response = await axiosInstance.post(API_PATHS.QUESTION.PIN(questionId))
      setSession((prev) => ({
        ...prev,
        questions: prev.questions.map((q) =>
          q._id === questionId ? response.data.question : q
        )
      }))
      toast.success(response.data.question.isPinned ? 'Question pinned' : 'Question unpinned')
    } catch (error) {
      toast.error('Failed to toggle pin')
    } finally {
      setPinningId(null)
    }
  }

  const handleSaveNote = async (questionId) => {
    setSavingNote(questionId)
    try {
      const response = await axiosInstance.post(API_PATHS.QUESTION.UPDATE_NOTE(questionId), {
        note: noteText[questionId] || ''
      })
      setSession((prev) => ({
        ...prev,
        questions: prev.questions.map((q) =>
          q._id === questionId ? response.data.question : q
        )
      }))
      toast.success('Note saved')
    } catch (error) {
      toast.error('Failed to save note')
    } finally {
      setSavingNote(null)
    }
  }

  const handleExplainConcept = async (question) => {
    setIsLoadingExplanation(true)
    setExplainingId(question._id)
    setExplanation(null)
    try {
      const response = await axiosInstance.post(API_PATHS.AI.GENERATE_EXPLANATION, {
        question: question.question
      })
      setExplanation({ ...response.data, questionId: question._id })
    } catch (error) {
      toast.error('Failed to generate explanation')
    } finally {
      setIsLoadingExplanation(false)
      setExplainingId(null)
    }
  }

  const handleCopyQuestion = (text, id) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const sortedQuestions = session?.questions
    ? [...session.questions].sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1
        if (!a.isPinned && b.isPinned) return 1
        return 0
      })
    : []

  const pinnedCount = sortedQuestions.filter((q) => q.isPinned).length

  if (sessionId === 'demo') {
    return <DemoView navigate={navigate} />
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader size="lg" text="Loading session..." />
      </div>
    )
  }

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <LuBrain size={48} className="mx-auto text-slate-300" />
          <h2 className="mt-4 text-xl font-semibold text-slate-900">Session not found</h2>
          <button className="btn-small mt-6 !inline-flex" onClick={() => navigate('/dashboard')}>
            <LuArrowLeft size={16} /> Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(255,147,36,0.16),transparent_30%)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        {/* Back + Profile */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-orange-200 hover:text-orange-600"
          >
            <LuArrowLeft /> Dashboard
          </button>
          <ProfileInfoCard />
        </div>

        {/* Session Header */}
        <section className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-orange-500">
                Interview Prep
              </p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-900">
                {session.description || `${session.role} Interview Prep`}
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-600">
                  {session.role}
                </span>
                <span>{session.experience} {session.experience === '<1' ? 'yr' : 'yrs'} experience</span>
                <span>{session.questions?.length || 0} questions</span>
                {pinnedCount > 0 && <span>{pinnedCount} pinned</span>}
              </div>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-2 text-sm font-semibold text-orange-700">
              <LuSparkles size={16} /> AI coaching ready
            </div>
          </div>

          {/* Topics */}
          {session.topicsToFocusOn?.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {session.topicsToFocusOn.map((topic) => (
                <span key={topic} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                  {topic}
                </span>
              ))}
            </div>
          )}
        </section>

        {/* AI Explanation Panel */}
        {explanation && (
          <section className="rounded-4xl border border-amber-200 bg-amber-50/80 p-6 shadow-sm sm:p-8">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold text-amber-700">
                <LuBookOpen size={16} /> Concept Deep Dive
              </div>
              <button
                onClick={() => setExplanation(null)}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-white/70 text-slate-400 hover:bg-white hover:text-slate-600"
              >
                ✕
              </button>
            </div>
            <h3 className="mt-3 text-xl font-semibold text-slate-900">{explanation.title}</h3>
            <div className="mt-4 leading-7 text-slate-700">
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownRenderers}>
                {explanation.explanation}
              </ReactMarkdown>
            </div>
          </section>
        )}

        {/* Questions List */}
        <section className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900">Questions</h2>
            <span className="text-sm text-slate-500">
              {sortedQuestions.length} total • {pinnedCount} pinned
            </span>
          </div>

          {sortedQuestions.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center">
              <p className="text-slate-500">No questions in this session yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedQuestions.map((q, idx) => (
                <div key={q._id} className="rounded-2xl border border-slate-200 bg-slate-50 transition hover:border-slate-300">
                  {/* Question Header */}
                  <div
                    className="flex cursor-pointer items-start justify-between gap-4 p-4 sm:p-5"
                    onClick={() => setExpandedQuestion(expandedQuestion === q._id ? null : q._id)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        {q.isPinned && (
                          <LuPin size={14} className="shrink-0 text-amber-500" />
                        )}
                        <p className="text-sm font-semibold text-slate-900">
                          {idx + 1}. {q.question}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleCopyQuestion(q.question, `copy-${q._id}`) }}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-white hover:text-slate-600"
                        title="Copy question"
                      >
                        {copiedId === `copy-${q._id}` ? <LuCheck size={14} className="text-green-500" /> : <LuCopy size={14} />}
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleTogglePin(q._id) }}
                        disabled={pinningId === q._id}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-white hover:text-amber-500"
                        title={q.isPinned ? 'Unpin' : 'Pin'}
                      >
                        {pinningId === q._id ? (
                          <Loader size="sm" />
                        ) : q.isPinned ? (
                          <LuPinOff size={14} />
                        ) : (
                          <LuPin size={14} />
                        )}
                      </button>
                      <div className="text-slate-400">
                        {expandedQuestion === q._id ? <LuChevronUp size={16} /> : <LuChevronDown size={16} />}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {expandedQuestion === q._id && (
                    <div className="border-t border-slate-200 px-4 pb-5 pt-4 sm:px-5">
                      {/* Answer */}
                      <div className="rounded-2xl border border-slate-200 bg-white p-4">
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Answer</p>
                        <div className="leading-7 text-slate-700">
                          <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownRenderers}>
                            {q.answer}
                          </ReactMarkdown>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="mt-3 flex flex-wrap gap-2">
                        <button
                          onClick={() => handleExplainConcept(q)}
                          disabled={isLoadingExplanation && explainingId === q._id}
                          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 transition hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700"
                        >
                          {isLoadingExplanation && explainingId === q._id ? (
                            <Loader size="sm" />
                          ) : (
                            <LuSparkles size={14} />
                          )}
                          Explain concept
                        </button>
                      </div>

                      {/* Notes */}
                      <div className="mt-4">
                        <label className="mb-2 flex items-center gap-2 text-xs font-semibold text-slate-500">
                          <LuFileText size={14} /> Notes
                        </label>
                        <div className="flex gap-2">
                          <textarea
                            value={noteText[q._id] ?? q.note ?? ''}
                            onChange={(e) =>
                              setNoteText((prev) => ({ ...prev, [q._id]: e.target.value }))
                            }
                            placeholder="Add your notes here..."
                            rows={3}
                            className="flex-1 rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm outline-none transition focus:border-orange-300 focus:ring-2 focus:ring-orange-100"
                          />
                          <button
                            onClick={() => handleSaveNote(q._id)}
                            disabled={savingNote === q._id}
                            className="self-end rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-500 disabled:opacity-50"
                          >
                            {savingNote === q._id ? <Loader size="sm" /> : <LuSend size={16} />}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

// Demo view for /interview-prep/demo
const DemoView = ({ navigate }) => {
  const demoQuestions = [
    {
      _id: 'demo1',
      question: 'Describe a time you had to lead through ambiguity. How did you structure your thinking?',
      answer: 'When leading through ambiguity, I start by gathering available information, identifying what is known vs unknown, then creating a lightweight plan with clear checkpoints.\n\n**My approach:**\n1. **Clarify the goal** – Define what "done" looks like\n2. **Map dependencies** – Identify who needs to be involved\n3. **Set short feedback loops** – Quick iterations to validate direction\n4. **Communicate transparently** – Share what is known and what is being explored',
      isPinned: false,
      note: ''
    },
    {
      _id: 'demo2',
      question: 'How do you stay updated with industry trends and new technologies?',
      answer: 'I maintain a structured learning routine:\n\n- **Newsletters** – TLDR, Bytes, and industry-specific digests\n- **Podcasts** – Listen during commute for high-level awareness\n- **Hands-on** – Build small side projects to experiment with new tools\n- **Community** – Follow thought leaders and participate in relevant discussions',
      isPinned: true,
      note: 'Great follow-up question to demonstrate growth mindset.'
    },
    {
      _id: 'demo3',
      question: 'Walk me through how you would debug a production issue.',
      answer: 'My debugging process follows a systematic approach:\n\n1. **Reproduce** – Confirm the issue and gather error details\n2. **Isolate** – Narrow down which component/service is failing\n3. **Check recent changes** – Review recent deployments or code changes\n4. **Add logging** – If needed, add targeted logging\n5. **Fix & verify** – Implement fix, test, and monitor post-deployment',
      isPinned: false,
      note: ''
    },
    {
      _id: 'demo4',
      question: 'Tell me about a project you are most proud of.',
      answer: 'One project I am particularly proud of was rebuilding our team\'s deployment pipeline...\n\n**Impact:**\n- Reduced deployment time from 45 minutes to 8 minutes\n- Eliminated manual steps that were error-prone\n- Improved team velocity by enabling multiple deployments per day',
      isPinned: true,
      note: 'Prepare a structured STAR answer with specific metrics.'
    }
  ]

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(255,147,36,0.16),transparent_30%)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-orange-200 hover:text-orange-600"
        >
          <LuArrowLeft /> Dashboard
        </button>

        <section className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-orange-500">Interview Prep</p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-900">Practice your next answer</h1>
              <p className="mt-2 text-sm text-slate-500">Sample session with demo questions</p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-2 text-sm font-semibold text-orange-700">
              <LuSparkles size={16} /> AI coaching ready
            </div>
          </div>

          <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <LuBrain size={16} className="text-orange-500" /> Quick tips
            </div>
            <ul className="mt-3 space-y-2 text-sm leading-7 text-slate-600">
              <li>• Answer with a clear opening and key examples.</li>
              <li>• Highlight your decision-making process.</li>
              <li>• Ask for feedback on clarity, confidence, and structure.</li>
            </ul>
          </div>
        </section>

        {/* Demo Questions */}
        <section className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="mb-6 text-xl font-semibold text-slate-900">Sample Questions</h2>
          <div className="space-y-4">
            {demoQuestions.map((q, idx) => (
              <DemoQuestionCard key={q._id} q={q} idx={idx} />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

const DemoQuestionCard = ({ q, idx }) => {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 transition hover:border-slate-300">
      <div
        className="flex cursor-pointer items-start justify-between gap-4 p-4 sm:p-5"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex-1">
          <div className="flex items-center gap-2">
            {q.isPinned && <LuPin size={14} className="shrink-0 text-amber-500" />}
            <p className="text-sm font-semibold text-slate-900">{idx + 1}. {q.question}</p>
          </div>
        </div>
        <div className="shrink-0 text-slate-400">
          {expanded ? <LuChevronUp size={16} /> : <LuChevronDown size={16} />}
        </div>
      </div>
      {expanded && (
        <div className="border-t border-slate-200 px-4 pb-5 pt-4 sm:px-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Answer</p>
            <div className="leading-7 text-slate-700">
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownRenderers}>{q.answer}</ReactMarkdown>
            </div>
          </div>
          {q.note && (
            <div className="mt-3 rounded-2xl bg-amber-50 p-3 text-sm text-amber-800">
              <span className="font-semibold">Prep note:</span> {q.note}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default InterviewPrep
