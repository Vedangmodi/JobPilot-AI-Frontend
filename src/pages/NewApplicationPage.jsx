import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/client'
import FormField from '../components/FormField'
import Spinner from '../components/Spinner'
import { SOURCE_OPTIONS, STATUS_OPTIONS } from '../utils/constants'

const defaultForm = {
  companyName: '',
  roleTitle: '',
  jobLink: '',
  location: '',
  salary: '',
  status: 'APPLIED',
  source: 'LINKEDIN',
  appliedDate: '',
  jobDescription: '',
  notesSummary: '',
}

function NewApplicationPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState(defaultForm)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    try {
      await api.post('/api/applications', form)
      navigate('/applications')
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Failed to create application.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section>
      <h2 className="text-2xl font-semibold text-gray-100">New Application</h2>
      <p className="mt-1 text-sm text-gray-400">Add a new role and keep your pipeline updated.</p>

      <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
        <FormField label="Company Name">
          <input name="companyName" required value={form.companyName} onChange={handleChange} className="input" />
        </FormField>
        <FormField label="Role Title">
          <input name="roleTitle" required value={form.roleTitle} onChange={handleChange} className="input" />
        </FormField>
        <FormField label="Job Link">
          <input name="jobLink" value={form.jobLink} onChange={handleChange} className="input" />
        </FormField>
        <FormField label="Location">
          <input name="location" value={form.location} onChange={handleChange} className="input" />
        </FormField>
        <FormField label="Salary">
          <input name="salary" value={form.salary} onChange={handleChange} className="input" />
        </FormField>
        <FormField label="Status">
          <select name="status" value={form.status} onChange={handleChange} className="input">
            {STATUS_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label="Source">
          <select name="source" value={form.source} onChange={handleChange} className="input">
            {SOURCE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label="Applied Date">
          <input
            name="appliedDate"
            type="date"
            value={form.appliedDate}
            onChange={handleChange}
            className="input"
          />
        </FormField>

        <div className="md:col-span-2">
          <FormField label="Job Description">
            <textarea
              name="jobDescription"
              rows="5"
              value={form.jobDescription}
              onChange={handleChange}
              className="input"
            />
          </FormField>
        </div>

        <div className="md:col-span-2">
          <FormField label="Notes Summary">
            <textarea
              name="notesSummary"
              rows="4"
              value={form.notesSummary}
              onChange={handleChange}
              className="input"
            />
          </FormField>
        </div>

        {error ? <p className="md:col-span-2 rounded-xl bg-rose-500/15 p-4 text-rose-300">{error}</p> : null}

        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? <Spinner size="sm" /> : null}
            {loading ? 'Creating...' : 'Create Application'}
          </button>
        </div>
      </form>
    </section>
  )
}

export default NewApplicationPage
