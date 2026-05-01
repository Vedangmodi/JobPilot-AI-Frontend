import { useEffect, useState } from 'react'
import { api } from '../api/client'
import Spinner from '../components/Spinner'

const statsConfig = [
  { key: 'totalApplications', label: 'Total Applications' },
  { key: 'applied', label: 'Applied' },
  { key: 'oa', label: 'OA' },
  { key: 'interview', label: 'Interview' },
  { key: 'offer', label: 'Offer' },
  { key: 'rejected', label: 'Rejected' },
  { key: 'ghosted', label: 'Ghosted' },
]

function DashboardPage() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true)
      setError('')
      try {
        const { data } = await api.get('/api/dashboard/stats')
        setStats(data)
      } catch (requestError) {
        setError(requestError.response?.data?.message || 'Failed to load dashboard stats.')
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [])

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-100">Dashboard</h2>
      <p className="mt-1 text-sm text-gray-400">Your current application pipeline snapshot.</p>

      {loading ? (
        <div className="mt-10 flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : null}

      {error ? <p className="mt-6 rounded-xl bg-rose-500/15 p-4 text-rose-300">{error}</p> : null}

      {!loading && !error ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {statsConfig.map((item) => (
            <article
              key={item.key}
              className="rounded-xl border border-gray-800 bg-gray-900/80 p-5 shadow-lg shadow-black/20"
            >
              <p className="text-sm text-gray-400">{item.label}</p>
              <p className="mt-3 text-3xl font-bold text-indigo-300">{stats?.[item.key] ?? 0}</p>
            </article>
          ))}
        </div>
      ) : null}
    </div>
  )
}

export default DashboardPage
