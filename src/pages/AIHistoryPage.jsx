import { useEffect, useState } from 'react'
import { api } from '../api/client'
import Spinner from '../components/Spinner'
import { formatDateTime, truncateText } from '../utils/format'

function AIHistoryPage() {
  const [records, setRecords] = useState([])
  const [selectedRecord, setSelectedRecord] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadHistory = async () => {
      setLoading(true)
      setError('')
      try {
        const { data } = await api.get('/api/ai/history')
        setRecords(data || [])
      } catch (requestError) {
        setError(requestError.response?.data?.message || 'Failed to load AI history.')
      } finally {
        setLoading(false)
      }
    }

    loadHistory()
  }, [])

  return (
    <section>
      <h2 className="text-2xl font-semibold text-gray-100">AI History</h2>
      <p className="mt-1 text-sm text-gray-400">Recent AI feature usage across your applications.</p>

      {loading ? (
        <div className="mt-10 flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : null}

      {error ? <p className="mt-6 rounded-xl bg-rose-500/15 p-4 text-rose-300">{error}</p> : null}

      {!loading && !error ? (
        <div className="mt-6 overflow-hidden rounded-xl border border-gray-800">
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-900/70 text-left text-sm">
              <thead className="bg-gray-900 text-gray-300">
                <tr>
                  <th className="px-4 py-3">Feature Type</th>
                  <th className="px-4 py-3">Input Text</th>
                  <th className="px-4 py-3">Output Text</th>
                  <th className="px-4 py-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {records.map((record, index) => (
                  <tr key={`${record.createdAt}-${index}`} className="border-t border-gray-800">
                    <td className="px-4 py-3">{record.featureType}</td>
                    <td className="px-4 py-3 text-gray-300">
                      <button
                        type="button"
                        onClick={() => setSelectedRecord(record)}
                        className="max-w-[260px] text-left text-indigo-300 hover:text-indigo-200 hover:underline"
                        title="View full input and output"
                      >
                        {truncateText(record.inputText)}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-gray-300">
                      <button
                        type="button"
                        onClick={() => setSelectedRecord(record)}
                        className="max-w-[360px] text-left text-indigo-300 hover:text-indigo-200 hover:underline"
                        title="View full input and output"
                      >
                        {truncateText(record.outputText, 120)}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-gray-400">{formatDateTime(record.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {records.length === 0 ? <p className="p-5 text-sm text-gray-400">No AI calls yet.</p> : null}
        </div>
      ) : null}

      {selectedRecord ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setSelectedRecord(null)}
          role="button"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === 'Escape') setSelectedRecord(null)
          }}
        >
          <div
            className="max-h-[85vh] w-full max-w-4xl overflow-auto rounded-xl border border-gray-700 bg-gray-900 p-5"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-100">AI History Detail</h3>
                <p className="mt-1 text-sm text-gray-400">
                  {selectedRecord.featureType} • {formatDateTime(selectedRecord.createdAt)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
                className="rounded-lg border border-gray-700 px-3 py-1.5 text-sm text-gray-200 hover:bg-gray-800"
              >
                Close
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-300">Input Text</p>
                <pre className="mt-2 whitespace-pre-wrap rounded-lg border border-gray-800 bg-gray-950/60 p-3 text-sm text-gray-200">
                  {selectedRecord.inputText || '-'}
                </pre>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-300">Output Text</p>
                <pre className="mt-2 whitespace-pre-wrap rounded-lg border border-gray-800 bg-gray-950/60 p-3 text-sm text-gray-200">
                  {selectedRecord.outputText || '-'}
                </pre>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  )
}

export default AIHistoryPage
