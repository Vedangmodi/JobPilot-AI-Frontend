import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

const navItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/applications', label: 'Applications' },
  { to: '/ai-tools', label: 'AI Tools' },
  { to: '/ai-history', label: 'AI History' },
]

function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="mx-auto flex min-h-screen max-w-7xl">
        <aside className="hidden w-72 flex-col border-r border-gray-800 bg-gray-900/50 p-6 lg:flex">
          <h1 className="text-2xl font-bold tracking-tight text-indigo-400">JobPilot AI</h1>
          <p className="mt-1 text-sm text-gray-400">Track smarter. Interview stronger.</p>

          <nav className="mt-10 space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `block rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                    isActive
                      ? 'bg-indigo-600/20 text-indigo-300 ring-1 ring-indigo-500/40'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-auto rounded-xl border border-gray-800 bg-gray-900 p-4">
            <p className="text-xs uppercase tracking-wide text-gray-400">Logged in as</p>
            <p className="mt-1 truncate text-sm font-semibold text-gray-200">
              {user?.name || 'User'}
            </p>
            <button
              type="button"
              onClick={handleLogout}
              className="mt-4 w-full rounded-lg bg-rose-500/90 px-4 py-2 text-sm font-medium text-white transition hover:bg-rose-500"
            >
              Logout
            </button>
          </div>
        </aside>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mb-6 flex items-center justify-between lg:hidden">
            <h1 className="text-xl font-bold text-indigo-400">JobPilot AI</h1>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg bg-rose-500/90 px-3 py-1.5 text-sm font-medium"
            >
              Logout
            </button>
          </div>

          <div className="mb-5 flex flex-wrap gap-2 lg:hidden">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 text-sm ${
                    isActive ? 'bg-indigo-600/20 text-indigo-300' : 'bg-gray-900 text-gray-300'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>

          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout
