import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-950 px-4 text-gray-100">
      <h1 className="text-4xl font-bold text-indigo-400">404</h1>
      <p className="mt-2 text-gray-400">Page not found.</p>
      <Link
        to="/dashboard"
        className="mt-6 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold hover:bg-indigo-500"
      >
        Back to Dashboard
      </Link>
    </div>
  )
}

export default NotFoundPage
