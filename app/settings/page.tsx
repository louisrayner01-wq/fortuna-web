"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { getMe, getExchangeStatus, updateCapital, connectExchange, logout, getBillingPortal } from "@/lib/api"

export default function Settings() {
  const router = useRouter()

  const [user, setUser]               = useState<any>(null)
  const [exchangeStatus, setExchangeStatus] = useState<any>(null)
  const [loading, setLoading]         = useState(true)

  // Capital form
  const [capital, setCapital]         = useState("")
  const [capitalSaving, setCapitalSaving] = useState(false)
  const [capitalMsg, setCapitalMsg]   = useState("")

  // Exchange key form
  const [showKeyForm, setShowKeyForm] = useState(false)
  const [apiKey, setApiKey]           = useState("")
  const [apiSecret, setApiSecret]     = useState("")
  const [passphrase, setPassphrase]   = useState("")
  const [keySaving, setKeySaving]     = useState(false)
  const [keyMsg, setKeyMsg]           = useState("")

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) { router.push("/login"); return }
    loadData()
  }, [])

  async function loadData() {
    try {
      const [me, ex] = await Promise.all([getMe(), getExchangeStatus()])
      setUser(me)
      setExchangeStatus(ex)
      setCapital(me.bot?.capital?.toString() || "")
    } catch {
      router.push("/login")
    } finally {
      setLoading(false)
    }
  }

  async function saveCapital(e: React.FormEvent) {
    e.preventDefault()
    setCapitalMsg("")
    setCapitalSaving(true)
    try {
      await updateCapital(parseFloat(capital))
      setCapitalMsg("Saved successfully")
      await loadData()
    } catch (err: any) {
      setCapitalMsg(err.message)
    } finally {
      setCapitalSaving(false)
    }
  }

  async function saveKeys(e: React.FormEvent) {
    e.preventDefault()
    setKeyMsg("")
    setKeySaving(true)
    try {
      await connectExchange(apiKey, apiSecret, passphrase)
      setKeyMsg("Keys connected and verified")
      setShowKeyForm(false)
      setApiKey(""); setApiSecret(""); setPassphrase("")
      await loadData()
    } catch (err: any) {
      setKeyMsg(err.message)
    } finally {
      setKeySaving(false)
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

  return (
    <main className="min-h-screen px-4 py-8 max-w-lg mx-auto">

      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Link href="/dashboard" className="text-gray-400 hover:text-white text-sm">
          ← Dashboard
        </Link>
        <h1 className="text-2xl font-bold text-white ml-auto">Settings</h1>
      </div>

      {/* Account info */}
      <div className="bg-white/5 rounded-2xl p-4 mb-4">
        <p className="text-gray-400 text-xs mb-3 uppercase tracking-wide">Account</p>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-white font-medium">{user?.email}</p>
          </div>
          <button onClick={handleLogout} className="text-red-400 text-sm hover:text-red-300">
            Sign out
          </button>
        </div>

        {/* Subscription status */}
        {(() => {
          const sub = user?.subscription
          const status = sub?.status || "none"
          const isActive = status === "active" || status === "trialing"

          return (
            <div className={`rounded-xl p-3 flex items-center justify-between ${
              isActive ? "bg-green-500/10 border border-green-500/20" : "bg-white/5 border border-white/10"
            }`}>
              <div>
                <p className={`text-sm font-semibold ${isActive ? "text-green-400" : "text-gray-400"}`}>
                  {status === "trialing" ? "Free trial" :
                   status === "active"   ? "Fortuna Pro" :
                   status === "past_due" ? "Payment failed" :
                   status === "cancelled" ? "Cancelled" : "No subscription"}
                </p>
                <p className="text-gray-500 text-xs mt-0.5">
                  {status === "trialing" ? "Trial active — £49/mo after" :
                   status === "active"   ? "£49/month" :
                   status === "past_due" ? "Please update your payment method" :
                   "Start your free 30-day trial"}
                </p>
              </div>
              {isActive ? (
                <button
                  onClick={async () => {
                    const { url } = await getBillingPortal()
                    window.location.href = url
                  }}
                  className="text-brand text-sm hover:underline">
                  Manage
                </button>
              ) : (
                <a href="/subscribe" className="bg-brand hover:bg-brand-dark text-black text-xs font-semibold px-3 py-1.5 rounded-lg transition">
                  Subscribe
                </a>
              )}
            </div>
          )
        })()}
      </div>

      {/* Trading capital */}
      <div className="bg-white/5 rounded-2xl p-4 mb-4">
        <p className="text-gray-400 text-xs mb-1 uppercase tracking-wide">Trading Capital</p>
        <p className="text-gray-400 text-sm mb-4">
          The bot sizes every position as a percentage of this amount. Change it any time — takes effect on the next trade.
        </p>
        <form onSubmit={saveCapital} className="flex flex-col gap-3">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
            <input
              type="number" min="10" step="any" required
              value={capital} onChange={e => setCapital(e.target.value)}
              className="w-full bg-white/10 text-white rounded-xl pl-8 pr-4 py-3 outline-none focus:ring-2 focus:ring-brand"
            />
          </div>
          {capitalMsg && (
            <p className={`text-sm ${capitalMsg.includes("Saved") ? "text-green-400" : "text-red-400"}`}>
              {capitalMsg}
            </p>
          )}
          <button type="submit" disabled={capitalSaving}
            className="bg-brand hover:bg-brand-dark text-black font-semibold py-3 rounded-xl transition disabled:opacity-50">
            {capitalSaving ? "Saving..." : "Save Capital"}
          </button>
        </form>
      </div>

      {/* Exchange connection */}
      <div className="bg-white/5 rounded-2xl p-4 mb-4">
        <p className="text-gray-400 text-xs mb-3 uppercase tracking-wide">Exchange</p>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${exchangeStatus?.verified ? "bg-green-400" : "bg-red-400"}`} />
            <div>
              <p className="text-white font-medium">WEEX</p>
              <p className="text-gray-400 text-sm">
                {exchangeStatus?.verified ? "Connected and verified" : "Not connected"}
              </p>
            </div>
          </div>
          <button onClick={() => { setShowKeyForm(!showKeyForm); setKeyMsg("") }}
            className="text-brand text-sm hover:underline">
            {exchangeStatus?.verified ? "Update keys" : "Connect"}
          </button>
        </div>

        {showKeyForm && (
          <form onSubmit={saveKeys} className="flex flex-col gap-3 border-t border-white/10 pt-4">
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-3">
              <p className="text-yellow-300/80 text-xs">
                Enable <strong>Trade permission only</strong> on your WEEX API key. Do not enable withdrawals.
              </p>
            </div>
            <input
              type="text" placeholder="API Key" required
              value={apiKey} onChange={e => setApiKey(e.target.value)}
              className="bg-white/10 text-white placeholder-gray-500 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-brand font-mono text-sm"
            />
            <input
              type="password" placeholder="API Secret" required
              value={apiSecret} onChange={e => setApiSecret(e.target.value)}
              className="bg-white/10 text-white placeholder-gray-500 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-brand font-mono text-sm"
            />
            <input
              type="password" placeholder="Passphrase (if set)"
              value={passphrase} onChange={e => setPassphrase(e.target.value)}
              className="bg-white/10 text-white placeholder-gray-500 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-brand"
            />
            {keyMsg && (
              <p className={`text-sm ${keyMsg.includes("verified") ? "text-green-400" : "text-red-400"}`}>
                {keyMsg}
              </p>
            )}
            <button type="submit" disabled={keySaving}
              className="bg-brand hover:bg-brand-dark text-black font-semibold py-3 rounded-xl transition disabled:opacity-50">
              {keySaving ? "Verifying..." : "Save Keys"}
            </button>
          </form>
        )}
      </div>

      {/* Risk info */}
      <div className="bg-white/5 rounded-2xl p-4">
        <p className="text-gray-400 text-xs mb-3 uppercase tracking-wide">Risk Management</p>
        <div className="flex flex-col gap-2 text-sm">
          {[
            ["Position sizing",   "% of capital per trade, adjusted by day of week"],
            ["Stop loss",         "ATR-based, calibrated from 2,000+ backtested trades"],
            ["Take profit",       "Full position closed at target — no partial closes"],
            ["Daily loss limit",  "10% of equity — bot pauses for the day if hit"],
            ["Max positions",     "5 open at once across BTC, ETH, SOL"],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between gap-4 py-2 border-b border-white/5 last:border-0">
              <p className="text-gray-400">{label}</p>
              <p className="text-white text-right">{value}</p>
            </div>
          ))}
        </div>
      </div>

    </main>
  )
}
