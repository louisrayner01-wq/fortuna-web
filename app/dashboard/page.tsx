"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { getMe, getTradeSummary, getTrades, startBot, stopBot, updateCapital, logout } from "@/lib/api"

export default function Dashboard() {
  const router  = useRouter()
  const [user, setUser]         = useState<any>(null)
  const [summary, setSummary]   = useState<any>(null)
  const [trades, setTrades]     = useState<any[]>([])
  const [capital, setCapital]   = useState("")
  const [loading, setLoading]   = useState(true)
  const [toggling, setToggling] = useState(false)
  const [error, setError]       = useState("")

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) { router.push("/login"); return }
    loadData()
  }, [])

  async function loadData() {
    try {
      const [me, sum, tr] = await Promise.all([getMe(), getTradeSummary(), getTrades()])
      setUser(me)
      setSummary(sum)
      setTrades(tr)
      setCapital(me.bot?.capital?.toString() || "")
    } catch {
      router.push("/login")
    } finally {
      setLoading(false)
    }
  }

  async function toggleBot() {
    setToggling(true)
    setError("")
    try {
      if (user.bot.is_active) {
        await stopBot()
      } else {
        await startBot()
      }
      await loadData()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setToggling(false)
    }
  }

  async function saveCapital() {
    setError("")
    try {
      await updateCapital(parseFloat(capital))
      await loadData()
    } catch (err: any) {
      setError(err.message)
    }
  }

  function handleLogout() {
    logout()
    router.push("/")
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Loading...</p>
      </main>
    )
  }

  const isActive = user?.bot?.is_active
  const pnl      = summary?.total_pnl ?? 0

  return (
    <main className="min-h-screen px-4 py-8 max-w-lg mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white">Fortuna</h1>
        <div className="flex items-center gap-4">
          <Link href="/settings" className="text-gray-400 text-sm hover:text-white">Settings</Link>
          <button onClick={handleLogout} className="text-gray-400 text-sm hover:text-white">
            Sign out
          </button>
        </div>
      </div>

      {/* Bot status card */}
      <div className={`rounded-2xl p-6 mb-4 ${isActive ? "bg-green-500/10 border border-green-500/30" : "bg-white/5"}`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-gray-400 text-sm">Bot Status</p>
            <p className={`text-xl font-bold ${isActive ? "text-green-400" : "text-gray-300"}`}>
              {isActive ? "Running" : "Stopped"}
            </p>
          </div>
          <button
            onClick={toggleBot}
            disabled={toggling}
            className={`px-5 py-2 rounded-xl font-semibold text-sm transition disabled:opacity-50 ${
              isActive
                ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                : "bg-brand text-white hover:bg-brand-dark"
            }`}>
            {toggling ? "..." : isActive ? "Stop" : "Start"}
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/5 rounded-xl p-3">
            <p className="text-gray-400 text-xs">Equity</p>
            <p className="text-white font-semibold">
              ${user?.bot?.equity?.toFixed(2) ?? user?.bot?.capital?.toFixed(2) ?? "—"}
            </p>
          </div>
          <div className="bg-white/5 rounded-xl p-3">
            <p className="text-gray-400 text-xs">High Water Mark</p>
            <p className="text-white font-semibold">
              ${user?.bot?.hwm?.toFixed(2) ?? "—"}
            </p>
          </div>
        </div>
      </div>

      {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

      {/* P&L summary */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-white/5 rounded-2xl p-4">
          <p className="text-gray-400 text-xs mb-1">Total P&L</p>
          <p className={`text-lg font-bold ${pnl >= 0 ? "text-green-400" : "text-red-400"}`}>
            {pnl >= 0 ? "+" : ""}${pnl.toFixed(2)}
          </p>
        </div>
        <div className="bg-white/5 rounded-2xl p-4">
          <p className="text-gray-400 text-xs mb-1">Trades</p>
          <p className="text-lg font-bold text-white">{summary?.total_trades ?? 0}</p>
        </div>
        <div className="bg-white/5 rounded-2xl p-4">
          <p className="text-gray-400 text-xs mb-1">Win Rate</p>
          <p className="text-lg font-bold text-white">{summary?.win_rate ?? 0}%</p>
        </div>
      </div>

      {/* Capital setting */}
      <div className="bg-white/5 rounded-2xl p-4 mb-4">
        <p className="text-gray-400 text-sm mb-3">Trading Capital ($)</p>
        <div className="flex gap-2">
          <input
            type="number" min="10" value={capital}
            onChange={e => setCapital(e.target.value)}
            className="flex-1 bg-white/10 text-white rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-brand"
          />
          <button onClick={saveCapital}
            className="bg-brand hover:bg-brand-dark text-white px-4 py-2 rounded-xl text-sm font-semibold transition">
            Save
          </button>
        </div>
      </div>

      {/* Recent trades */}
      <div className="bg-white/5 rounded-2xl p-4">
        <p className="text-gray-400 text-sm mb-3">Recent Trades</p>
        {trades.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-4">No trades yet</p>
        ) : (
          <div className="flex flex-col gap-2">
            {trades.slice(0, 10).map((t: any) => (
              <div key={t.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                <div>
                  <p className="text-white text-sm font-medium">{t.pair}</p>
                  <p className="text-gray-400 text-xs capitalize">{t.side} · {t.exit_reason}</p>
                </div>
                <p className={`font-semibold text-sm ${(t.pnl_usdt ?? 0) >= 0 ? "text-green-400" : "text-red-400"}`}>
                  {(t.pnl_usdt ?? 0) >= 0 ? "+" : ""}${(t.pnl_usdt ?? 0).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
