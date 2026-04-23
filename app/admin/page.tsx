"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { getAdminStats, getAdminUsers, grantAccess, revokeAccess } from "@/lib/api"

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats]   = useState<any>(null)
  const [users, setUsers]   = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState("")
  const [actionUserId, setActionUserId] = useState("")

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) { router.push("/login"); return }
    loadData()
  }, [])

  async function loadData() {
    try {
      const [s, u] = await Promise.all([getAdminStats(), getAdminUsers()])
      setStats(s)
      setUsers(u)
    } catch (err: any) {
      if (err.message?.includes("Admin")) {
        setError("You do not have admin access.")
      } else {
        router.push("/login")
      }
    } finally {
      setLoading(false)
    }
  }

  async function toggleAccess(user_id: string, currentStatus: string) {
    setActionUserId(user_id)
    try {
      if (currentStatus === "active") {
        await revokeAccess(user_id)
      } else {
        await grantAccess(user_id)
      }
      await loadData()
    } catch (err: any) {
      alert(err.message)
    } finally {
      setActionUserId("")
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Loading...</p>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <Link href="/dashboard" className="text-brand hover:underline">Back to dashboard</Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen px-4 py-8 max-w-4xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Admin</h1>
          <p className="text-gray-400 text-sm">Fortuna control panel</p>
        </div>
        <Link href="/dashboard" className="text-gray-400 text-sm hover:text-white">
          ← Dashboard
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-8 sm:grid-cols-5">
        {[
          { label: "Total Users",   value: stats?.total_users  ?? 0 },
          { label: "Active Subs",   value: stats?.active_subs  ?? 0 },
          { label: "Bots Running",  value: stats?.bots_running ?? 0 },
          { label: "Total Trades",  value: stats?.total_trades ?? 0 },
          { label: "Total P&L",     value: `$${(stats?.total_pnl ?? 0).toFixed(2)}`,
            color: (stats?.total_pnl ?? 0) >= 0 ? "text-green-400" : "text-red-400" },
        ].map((s) => (
          <div key={s.label} className="bg-white/5 rounded-2xl p-4">
            <p className="text-gray-400 text-xs mb-1">{s.label}</p>
            <p className={`text-xl font-bold ${s.color ?? "text-white"}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Users table */}
      <div className="bg-white/5 rounded-2xl overflow-hidden">
        <div className="px-4 py-3 border-b border-white/10">
          <p className="text-white font-semibold">Users ({users.length})</p>
        </div>

        {users.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-8">No users yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-400 text-xs border-b border-white/10">
                  <th className="text-left px-4 py-3">Email</th>
                  <th className="text-right px-4 py-3">Capital</th>
                  <th className="text-right px-4 py-3">Equity</th>
                  <th className="text-right px-4 py-3">P&L</th>
                  <th className="text-right px-4 py-3">Trades</th>
                  <th className="text-center px-4 py-3">Bot</th>
                  <th className="text-center px-4 py-3">Access</th>
                  <th className="text-center px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u: any) => {
                  const isActive = u.subscription?.status === "active"
                  const botOn    = u.bot?.is_active
                  const pnl      = u.total_pnl ?? 0

                  return (
                    <tr key={u.id} className="border-b border-white/5 last:border-0 hover:bg-white/5">
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-white">{u.email}</p>
                          <p className="text-gray-500 text-xs">
                            {new Date(u.created_at).toLocaleDateString()}
                            {u.is_admin && " · admin"}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right text-white">
                        {u.bot?.capital ? `$${u.bot.capital.toFixed(0)}` : "—"}
                      </td>
                      <td className="px-4 py-3 text-right text-white">
                        {u.bot?.equity ? `$${u.bot.equity.toFixed(2)}` : "—"}
                      </td>
                      <td className={`px-4 py-3 text-right font-medium ${pnl >= 0 ? "text-green-400" : "text-red-400"}`}>
                        {pnl >= 0 ? "+" : ""}${pnl.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-300">
                        {u.total_trades}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-block w-2 h-2 rounded-full ${botOn ? "bg-green-400" : "bg-gray-600"}`} />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                          isActive
                            ? "bg-green-500/20 text-green-400"
                            : "bg-gray-500/20 text-gray-400"
                        }`}>
                          {isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {!u.is_admin && (
                          <button
                            onClick={() => toggleAccess(u.id, u.subscription?.status)}
                            disabled={actionUserId === u.id}
                            className={`text-xs px-3 py-1 rounded-lg font-medium transition disabled:opacity-50 ${
                              isActive
                                ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                                : "bg-brand/20 text-brand hover:bg-brand/30"
                            }`}>
                            {actionUserId === u.id ? "..." : isActive ? "Revoke" : "Grant"}
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  )
}
