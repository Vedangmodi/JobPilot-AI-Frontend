import { useState } from 'react'
import { api } from '../api/client'
import Spinner from '../components/Spinner'
import { AI_FEATURES } from '../utils/constants'

function AIToolsPage() {
  const [activeTab, setActiveTab] = useState(AI_FEATURES[0].key)
  const [inputText, setInputText] = useState('')
  const [applicationId, setApplicationId] = useState('')
  const [outputText, setOutputText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const feature = AI_FEATURES.find((item) => item.key === activeTab)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    setOutputText('')
    try {
      const { data } = await api.post(feature.endpoint, {
        inputText,
        applicationId: applicationId || undefined,
      })
      setOutputText(data.outputText || '')
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'AI request failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section>
      <h2 className="text-2xl font-semibold text-gray-100">AI Tools</h2>
      <p className="mt-1 text-sm text-gray-400">Use AI to improve your job application workflow.</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {AI_FEATURES.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => {
              setActiveTab(item.key)
              setOutputText('')
              setError('')
            }}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              activeTab === item.key
                ? 'bg-indigo-600 text-white'
                : 'border border-gray-700 bg-gray-900 text-gray-300 hover:bg-gray-800'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4 rounded-xl border border-gray-800 bg-gray-900/70 p-5">
        <label className="block text-sm text-gray-300">
          Optional Application ID
          <input
            value={applicationId}
            onChange={(event) => setApplicationId(event.target.value)}
            className="input mt-2"
            placeholder="Enter application id (optional)"
          />
        </label>

        <label className="block text-sm text-gray-300">
          Input Text
          <textarea
            required
            rows="8"
            value={inputText}
            onChange={(event) => setInputText(event.target.value)}
            className="input mt-2"
            placeholder="Paste resume/JD/context here..."
          />
        </label>

        {error ? <p className="rounded-lg bg-rose-500/15 p-3 text-sm text-rose-300">{error}</p> : null}

        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? <Spinner size="sm" /> : null}
          {loading ? 'Generating...' : `Run ${feature.label}`}
        </button>
      </form>

      <div className="mt-6 rounded-xl border border-gray-800 bg-gray-900/70 p-5">
        <h3 className="text-lg font-semibold text-gray-100">Output</h3>
        <pre className="mt-3 whitespace-pre-wrap text-sm text-gray-300">
          {outputText || 'AI output will appear here after submission.'}
        </pre>
      </div>
    </section>
  )
}

export default AIToolsPage
