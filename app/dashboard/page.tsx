"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { getMe, getTradeSummary, getTrades, startBot, stopBot, updateCapital, logout } from "@/lib/api"

const PRESETS = [100, 500, 1_000, 5_000, 10_000]

export default function Dashboard() {
  const router  = useRouter()
  const [user, setUser]         = useState<any>(null)
  const [summary, setSummary]   = useState<any>(null)
  const [trades, setTrades]     = useState<any[]>([])
  const [capital, setCapital]   = useState("")
  const [botCapital, setBotCapital] = useState(100)
  const [viewCapital, setViewCapital] = useState<number | null>(null)
  const [loading, setLoading]   = useState(true)
  const [toggling, setToggling] = useState(false)
  const [error, setError]       = useState("")
  const [showWelcome, setShowWelcome] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) { router.push("/login"); return }
    if (!localStorage.getItem("welcome_dismissed")) setShowWelcome(true)
    loadData()
  }, [])

  async function loadData() {
    try {
      const [me, sum, tr] = await Promise.all([getMe(), getTradeSummary(), getTrades()])
      setUser(me)
      setSummary(sum)
      setTrades(tr)
      const cap = me.bot?.capital ?? 100
      setCapital(cap.toString())
      setBotCapital(cap)
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

  function dismissWelcome() {
    localStorage.setItem("welcome_dismissed", "1")
    setShowWelcome(false)
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Loading...</p>
      </main>
    )
  }

  const isActive = user?.bot?.is_active
  const simCap   = viewCapital ?? botCapital
  const scale    = botCapital > 0 ? simCap / botCapital : 1
  const pnl      = (summary?.total_pnl ?? 0) * scale
  const isScaled = scale !== 1

  return (
    <main className="min-h-screen px-4 py-8 max-w-lg mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Image src="/logo.svg" alt="Fortuna" width={48} height={50} />
        <div className="flex items-center gap-4">
          <Link href="/pnl" className="text-sm font-semibold bg-white/10 hover:bg-white/15 text-white px-3 py-1.5 rounded-lg transition">
            P&amp;L
          </Link>
          <Link href="/affiliates" className="text-sm font-semibold bg-white/10 hover:bg-white/15 text-white px-3 py-1.5 rounded-lg transition">
            Partners
          </Link>
          <Link href="/settings" className="text-gray-400 text-sm hover:text-white">Settings</Link>
          <button onClick={handleLogout} className="text-gray-400 text-sm hover:text-white">
            Sign out
          </button>
        </div>
      </div>

      {/* Welcome message — shown once, dismissed to localStorage */}
      {showWelcome && (
        <div className="rounded-2xl p-5 mb-6 border border-yellow-500/30 bg-yellow-500/5">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h2 className="text-white font-bold text-lg">Welcome to Fortuna</h2>
              <p className="text-gray-400 text-sm mt-1">A few things to know before you start.</p>
            </div>
            <button onClick={dismissWelcome} className="text-gray-500 hover:text-white text-xl leading-none mt-0.5">×</button>
          </div>
          <ul className="flex flex-col gap-3 mb-5">
            {[
              ["Trading is a long-term game", "Short-term variance is completely normal. The edge is statistical and needs volume to play out — we recommend giving it at least 30 trades before drawing any conclusions."],
              ["Compounding makes a big difference", "If you do take profits, consider leaving at least 50% of your monthly gains in the account. Compounding your returns over time is where the real growth happens."],
              ["Default risk per trade is 5%", "Risk is set to 5% of your account per trade by default. You can adjust this in settings, but we recommend keeping it at 5% or below."],
              ["Let the bot run consistently", "Try to keep the bot running through both good and bad periods. Stopping during a drawdown and missing the recovery is one of the most common mistakes in algo trading."],
            ].map(([title, body]) => (
              <li key={title} className="flex gap-3">
                <span className="text-yellow-500 mt-0.5 shrink-0">›</span>
                <span className="text-sm text-gray-300"><span className="text-white font-semibold">{title} — </span>{body}</span>
              </li>
            ))}
          </ul>
          <p className="text-gray-500 text-xs border-t border-white/10 pt-3">
            This is not financial advice. Trading involves risk and you may lose money. Only trade with capital you can afford to lose.
          </p>
          <button onClick={dismissWelcome}
            className="mt-4 w-full bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 font-semibold py-2.5 rounded-xl text-sm transition">
            Got it, let's go
          </button>
        </div>
      )}

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
                : "bg-brand text-black hover:bg-brand-dark"
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

      {/* Paper account size + P&L summary */}
      <div className="bg-white/5 rounded-2xl p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-gray-400 text-xs uppercase tracking-wide">Paper Account Size</p>
          {isScaled && (
            <span className="text-xs text-brand font-semibold">
              Scaled to ${simCap.toLocaleString()}
            </span>
          )}
        </div>
        <div className="flex gap-2 mb-4">
          {PRESETS.map(p => (
            <button
              key={p}
              onClick={() => setViewCapital(p === botCapital && !viewCapital ? null : p)}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${
                simCap === p
                  ? "bg-brand text-black"
                  : "bg-white/10 text-gray-300 hover:bg-white/20"
              }`}
            >
              ${p >= 1000 ? `${p / 1000}k` : p}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className={`rounded-xl p-3 ${isScaled ? "bg-brand/10 border border-brand/20" : "bg-white/5"}`}>
            <p className="text-gray-400 text-xs mb-1">Total P&amp;L</p>
            <p className={`text-lg font-bold ${pnl >= 0 ? "text-green-400" : "text-red-400"}`}>
              {pnl >= 0 ? "+" : ""}${pnl.toFixed(2)}
            </p>
          </div>
          <div className="bg-white/5 rounded-xl p-3">
            <p className="text-gray-400 text-xs mb-1">Trades</p>
            <p className="text-lg font-bold text-white">{summary?.total_trades ?? 0}</p>
          </div>
          <div className="bg-white/5 rounded-xl p-3">
            <p className="text-gray-400 text-xs mb-1">Win Rate</p>
            <p className="text-lg font-bold text-white">{summary?.win_rate ?? 0}%</p>
          </div>
        </div>

        {isScaled && (
          <p className="text-gray-500 text-xs mt-3">
            Actual bot capital: ${botCapital.toLocaleString()} — figures above are scaled proportionally.
            <button onClick={() => setViewCapital(null)} className="text-brand ml-2 hover:underline">Reset</button>
          </p>
        )}
      </div>

      {/* Capital setting */}
      <div className="bg-white/5 rounded-2xl p-4 mb-4">
        <p className="text-gray-400 text-xs uppercase tracking-wide mb-3">Set Bot Capital ($)</p>
        <div className="flex gap-2">
          <input
            type="number" min="10" value={capital}
            onChange={e => setCapital(e.target.value)}
            className="flex-1 bg-white/10 text-white rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-brand"
          />
          <button onClick={saveCapital}
            className="bg-brand hover:bg-brand-dark text-black px-4 py-2 rounded-xl text-sm font-semibold transition">
            Save
          </button>
        </div>
        <p className="text-gray-500 text-xs mt-2">This changes what the bot actually trades with. Use the buttons above just to preview P&L at different sizes.</p>
      </div>

      {/* Recent trades */}
      <div className="bg-white/5 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-gray-400 text-sm">Recent Trades</p>
          {isScaled && <p className="text-xs text-brand">scaled to ${simCap.toLocaleString()}</p>}
        </div>
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
                  {(t.pnl_usdt ?? 0) >= 0 ? "+" : ""}${((t.pnl_usdt ?? 0) * scale).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
