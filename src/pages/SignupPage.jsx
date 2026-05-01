import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../api/client'
import FormField from '../components/FormField'
import Spinner from '../components/Spinner'
import { useAuth } from '../context/useAuth'

function SignupPage() {
  const navigate = useNavigate()
  const { setAuth } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data } = await api.post('/api/auth/signup', form)
      setAuth(data)
      navigate('/dashboard')
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Signup failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950 px-4 text-gray-100">
      <div className="w-full max-w-md rounded-2xl border border-gray-800 bg-gray-900/70 p-8 shadow-2xl shadow-black/40">
        <h1 className="text-3xl font-bold text-indigo-400">Create account</h1>
        <p className="mt-2 text-sm text-gray-400">Join JobPilot AI and own your job hunt.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <FormField label="Full Name">
            <input
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2 outline-none ring-indigo-500 transition focus:ring-2"
              placeholder="John Doe"
            />
          </FormField>

          <FormField label="Email">
            <input
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2 outline-none ring-indigo-500 transition focus:ring-2"
              placeholder="you@example.com"
            />
          </FormField>

          <FormField label="Password">
            <input
              name="password"
              type="password"
              required
              value={form.password}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2 outline-none ring-indigo-500 transition focus:ring-2"
              placeholder="••••••••"
            />
          </FormField>

          {error ? <p className="rounded-lg bg-rose-500/15 p-3 text-sm text-rose-300">{error}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 font-semibold transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? <Spinner size="sm" /> : null}
            {loading ? 'Creating account...' : 'Sign up'}
          </button>
        </form>

        <p className="mt-5 text-sm text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-indigo-300 hover:text-indigo-200">
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}

export default SignupPage
