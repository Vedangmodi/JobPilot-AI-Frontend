import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../api/client'
import Spinner from '../components/Spinner'
import FormField from '../components/FormField'
import { SOURCE_OPTIONS, STATUS_OPTIONS } from '../utils/constants'
import { formatDate, formatDateTime } from '../utils/format'

function ApplicationDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [application, setApplication] = useState(null)
  const [applicationForm, setApplicationForm] = useState({
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
  })
  const [notes, setNotes] = useState([])
  const [reminders, setReminders] = useState([])
  const [noteText, setNoteText] = useState('')
  const [reminderForm, setReminderForm] = useState({ message: '', reminderDate: '' })
  const [loading, setLoading] = useState(true)
  const [savingApplication, setSavingApplication] = useState(false)
  const [deletingApplication, setDeletingApplication] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      setError('')
      try {
        const [appRes, notesRes, remindersRes] = await Promise.all([
          api.get(`/api/applications/${id}`),
          api.get(`/api/applications/${id}/notes`),
          api.get(`/api/applications/${id}/reminders`),
        ])
        setApplication(appRes.data)
        setApplicationForm({
          companyName: appRes.data.companyName || '',
          roleTitle: appRes.data.roleTitle || '',
          jobLink: appRes.data.jobLink || '',
          location: appRes.data.location || '',
          salary: appRes.data.salary ?? '',
          status: appRes.data.status || 'APPLIED',
          source: appRes.data.source || 'LINKEDIN',
          appliedDate: appRes.data.appliedDate || '',
          jobDescription: appRes.data.jobDescription || '',
          notesSummary: appRes.data.notesSummary || '',
        })
        setNotes(notesRes.data || [])
        setReminders(remindersRes.data || [])
      } catch (requestError) {
        setError(requestError.response?.data?.message || 'Failed to load application details.')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [id])

  const addNote = async (event) => {
    event.preventDefault()
    if (!noteText.trim()) return
    try {
      const { data } = await api.post(`/api/applications/${id}/notes`, { content: noteText })
      setNotes((prev) => [data, ...prev])
      setNoteText('')
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Failed to add note.')
    }
  }

  const deleteNote = async (noteId) => {
    try {
      await api.delete(`/api/notes/${noteId}`)
      setNotes((prev) => prev.filter((note) => note.id !== noteId))
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Failed to delete note.')
    }
  }

  const addReminder = async (event) => {
    event.preventDefault()
    if (!reminderForm.message.trim()) return
    try {
      const { data } = await api.post(`/api/applications/${id}/reminders`, reminderForm)
      setReminders((prev) => [data, ...prev])
      setReminderForm({ message: '', reminderDate: '' })
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Failed to add reminder.')
    }
  }

  const completeReminder = async (reminderId) => {
    try {
      const reminder = reminders.find((item) => item.id === reminderId)
      if (!reminder) return

      const { data } = await api.put(`/api/reminders/${reminderId}/complete`, {
        message: reminder.message,
        reminderDate: reminder.reminderDate || null,
        completed: true,
      })
      setReminders((prev) =>
        prev.map((reminder) =>
          reminder.id === reminderId ? data : reminder,
        ),
      )
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Failed to complete reminder.')
    }
  }

  const deleteReminder = async (reminderId) => {
    try {
      await api.delete(`/api/reminders/${reminderId}`)
      setReminders((prev) => prev.filter((reminder) => reminder.id !== reminderId))
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Failed to delete reminder.')
    }
  }

  const handleApplicationChange = (event) => {
    setApplicationForm((prev) => ({ ...prev, [event.target.name]: event.target.value }))
  }

  const updateApplication = async (event) => {
    event.preventDefault()
    setSavingApplication(true)
    setError('')
    try {
      const { data } = await api.put(`/api/applications/${id}`, applicationForm)
      setApplication(data)
      setApplicationForm({
        companyName: data.companyName || '',
        roleTitle: data.roleTitle || '',
        jobLink: data.jobLink || '',
        location: data.location || '',
        salary: data.salary ?? '',
        status: data.status || 'APPLIED',
        source: data.source || 'LINKEDIN',
        appliedDate: data.appliedDate || '',
        jobDescription: data.jobDescription || '',
        notesSummary: data.notesSummary || '',
      })
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Failed to update application.')
    } finally {
      setSavingApplication(false)
    }
  }

  const deleteApplication = async () => {
    const shouldDelete = window.confirm('Delete this application permanently?')
    if (!shouldDelete) return

    setDeletingApplication(true)
    setError('')
    try {
      await api.delete(`/api/applications/${id}`)
      navigate('/applications')
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Failed to delete application.')
    } finally {
      setDeletingApplication(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error && !application) {
    return <p className="rounded-xl bg-rose-500/15 p-4 text-rose-300">{error}</p>
  }

  return (
    <section className="space-y-6">
      <article className="rounded-xl border border-gray-800 bg-gray-900/70 p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold text-indigo-300">{application?.companyName}</h2>
            <p className="mt-1 text-gray-300">{application?.roleTitle}</p>
            <p className="mt-2 text-xs text-gray-500">
              Created {formatDateTime(application?.createdAt)} | Updated {formatDateTime(application?.updatedAt)}
            </p>
          </div>
          <button
            type="button"
            onClick={deleteApplication}
            disabled={deletingApplication}
            className="rounded-lg border border-rose-500/40 px-3 py-2 text-sm text-rose-300 transition hover:bg-rose-500/10 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {deletingApplication ? 'Deleting...' : 'Delete Application'}
          </button>
        </div>

        <form onSubmit={updateApplication} className="mt-5 grid gap-4 md:grid-cols-2">
          <FormField label="Company Name">
            <input name="companyName" required value={applicationForm.companyName} onChange={handleApplicationChange} className="input" />
          </FormField>
          <FormField label="Role Title">
            <input name="roleTitle" required value={applicationForm.roleTitle} onChange={handleApplicationChange} className="input" />
          </FormField>
          <FormField label="Job Link">
            <input name="jobLink" value={applicationForm.jobLink} onChange={handleApplicationChange} className="input" />
          </FormField>
          <FormField label="Location">
            <input name="location" value={applicationForm.location} onChange={handleApplicationChange} className="input" />
          </FormField>
          <FormField label="Salary">
            <input name="salary" value={applicationForm.salary} onChange={handleApplicationChange} className="input" />
          </FormField>
          <FormField label="Applied Date">
            <input
              name="appliedDate"
              type="date"
              value={applicationForm.appliedDate}
              onChange={handleApplicationChange}
              className="input"
            />
          </FormField>
          <FormField label="Status">
            <select name="status" value={applicationForm.status} onChange={handleApplicationChange} className="input">
              {STATUS_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="Source">
            <select name="source" value={applicationForm.source} onChange={handleApplicationChange} className="input">
              {SOURCE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </FormField>
          <div className="md:col-span-2">
            <FormField label="Job Description">
              <textarea
                name="jobDescription"
                rows="4"
                value={applicationForm.jobDescription}
                onChange={handleApplicationChange}
                className="input"
              />
            </FormField>
          </div>
          <div className="md:col-span-2">
            <FormField label="Notes Summary">
              <textarea
                name="notesSummary"
                rows="3"
                value={applicationForm.notesSummary}
                onChange={handleApplicationChange}
                className="input"
              />
            </FormField>
          </div>
          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={savingApplication}
              className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {savingApplication ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </article>

      {error ? <p className="rounded-xl bg-rose-500/15 p-4 text-rose-300">{error}</p> : null}

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-xl border border-gray-800 bg-gray-900/70 p-5">
          <h3 className="text-lg font-semibold text-gray-100">Notes</h3>
          <form onSubmit={addNote} className="mt-4 flex gap-2">
            <input
              value={noteText}
              onChange={(event) => setNoteText(event.target.value)}
              placeholder="Add a new note..."
              className="input"
            />
            <button className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium hover:bg-indigo-500">
              Add
            </button>
          </form>
          <div className="mt-4 space-y-3">
            {notes.map((note) => (
              <article key={note.id} className="rounded-lg border border-gray-800 bg-gray-950/60 p-3">
                <p className="text-sm text-gray-200">{note.content}</p>
                <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                  <span>{formatDateTime(note.createdAt)}</span>
                  <button onClick={() => deleteNote(note.id)} className="text-rose-400 hover:text-rose-300">
                    Delete
                  </button>
                </div>
              </article>
            ))}
            {notes.length === 0 ? <p className="text-sm text-gray-500">No notes yet.</p> : null}
          </div>
        </section>

        <section className="rounded-xl border border-gray-800 bg-gray-900/70 p-5">
          <h3 className="text-lg font-semibold text-gray-100">Reminders</h3>
          <form onSubmit={addReminder} className="mt-4 grid gap-2">
            <input
              value={reminderForm.message}
              onChange={(event) =>
                setReminderForm((prev) => ({ ...prev, message: event.target.value }))
              }
              placeholder="Reminder message..."
              className="input"
            />
            <input
              type="date"
              value={reminderForm.reminderDate}
              onChange={(event) =>
                setReminderForm((prev) => ({ ...prev, reminderDate: event.target.value }))
              }
              className="input"
            />
            <button className="justify-self-start rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium hover:bg-indigo-500">
              Add Reminder
            </button>
          </form>
          <div className="mt-4 space-y-3">
            {reminders.map((reminder) => (
              <article key={reminder.id} className="rounded-lg border border-gray-800 bg-gray-950/60 p-3">
                <p className={`text-sm ${reminder.completed ? 'text-gray-500 line-through' : 'text-gray-200'}`}>
                  {reminder.message}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Reminder: {formatDate(reminder.reminderDate)}
                </p>
                <div className="mt-2 flex gap-3 text-xs">
                  {!reminder.completed ? (
                    <button
                      onClick={() => completeReminder(reminder.id)}
                      className="text-emerald-400 hover:text-emerald-300"
                    >
                      Mark Complete
                    </button>
                  ) : null}
                  <button
                    onClick={() => deleteReminder(reminder.id)}
                    className="text-rose-400 hover:text-rose-300"
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
            {reminders.length === 0 ? <p className="text-sm text-gray-500">No reminders yet.</p> : null}
          </div>
        </section>
      </div>
    </section>
  )
}

export default ApplicationDetailPage
