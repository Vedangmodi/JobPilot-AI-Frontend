import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'
import Spinner from '../components/Spinner'
import { STATUS_OPTIONS } from '../utils/constants'
import { formatDate } from '../utils/format'

const PAGE_SIZE = 10

function ApplicationsPage() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    const loadApplications = async () => {
      setLoading(true)
      setError('')
      try {
        const hasFilters = Boolean(status || search)

        if (hasFilters) {
          const { data } = await api.get('/api/applications/filter', {
            params: {
              applicationStatus: status || undefined,
              search: search || undefined,
            },
          })

          const allFiltered = data || []
          const start = page * PAGE_SIZE
          const end = start + PAGE_SIZE
          setApplications(allFiltered.slice(start, end))
          setTotalPages(Math.max(1, Math.ceil(allFiltered.length / PAGE_SIZE)))
          return
        }

        const { data } = await api.get('/api/applications/pagination', {
          params: { page, size: PAGE_SIZE },
        })

        setApplications(data.content || [])
        setTotalPages(data.totalPages || 1)
      } catch (requestError) {
        setError(requestError.response?.data?.message || 'Failed to load applications.')
      } finally {
        setLoading(false)
      }
    }

    loadApplications()
  }, [page, search, status])

  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-gray-100">Applications</h2>
          <p className="mt-1 text-sm text-gray-400">Manage all your job applications in one place.</p>
        </div>
        <Link
          to="/applications/new"
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500"
        >
          + Add Application
        </Link>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-2">
        <input
          value={search}
          onChange={(event) => {
            setPage(0)
            setSearch(event.target.value)
          }}
          placeholder="Search by company name..."
          className="rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm outline-none ring-indigo-500 focus:ring-2"
        />
        <select
          value={status}
          onChange={(event) => {
            setPage(0)
            setStatus(event.target.value)
          }}
          className="rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm outline-none ring-indigo-500 focus:ring-2"
        >
          <option value="">All Statuses</option>
          {STATUS_OPTIONS.map((statusOption) => (
            <option key={statusOption} value={statusOption}>
              {statusOption}
            </option>
          ))}
        </select>
      </div>

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
                  <th className="px-4 py-3">Company</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Source</th>
                  <th className="px-4 py-3">Applied Date</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.id} className="border-t border-gray-800 hover:bg-gray-800/50">
                    <td className="px-4 py-3 font-medium text-indigo-300">
                      <Link to={`/applications/${app.id}`}>{app.companyName}</Link>
                    </td>
                    <td className="px-4 py-3">{app.roleTitle}</td>
                    <td className="px-4 py-3">{app.status}</td>
                    <td className="px-4 py-3">{app.source || '-'}</td>
                    <td className="px-4 py-3">{formatDate(app.appliedDate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {applications.length === 0 ? (
            <p className="p-5 text-sm text-gray-400">No applications found for current filters.</p>
          ) : null}
        </div>
      ) : null}

      <div className="mt-5 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={() => setPage((prev) => Math.max(0, prev - 1))}
          disabled={page === 0}
          className="rounded-lg border border-gray-700 px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-sm text-gray-400">
          Page {page + 1} / {totalPages}
        </span>
        <button
          type="button"
          onClick={() => setPage((prev) => (prev + 1 < totalPages ? prev + 1 : prev))}
          disabled={page + 1 >= totalPages}
          className="rounded-lg border border-gray-700 px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </section>
  )
}

export default ApplicationsPage
