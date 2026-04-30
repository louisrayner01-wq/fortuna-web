"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { connectExchange, getPaymentStatus } from "@/lib/api"

export default function Connect() {
  const router = useRouter()
  const [apiKey, setApiKey]         = useState("")
  const [apiSecret, setApiSecret]   = useState("")
  const [passphrase, setPassphrase] = useState("")
  const [error, setError]           = useState("")
  const [loading, setLoading]       = useState(false)
  const [checking, setChecking]     = useState(true)

  useEffect(() => {
    getPaymentStatus()
      .then((s: any) => {
        if (s.status !== "active" && s.status !== "trialing") {
          router.replace("/subscribe")
        } else {
          setChecking(false)
        }
      })
      .catch(() => router.replace("/login"))
  }, [router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      await connectExchange(apiKey, apiSecret, passphrase)
      router.push("/dashboard")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (checking) return null

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h1 className="text-3xl font-bold text-white mb-2">Connect WEEX</h1>
        <p className="text-gray-400 mb-6">Link your exchange account to start trading</p>

        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-6">
          <p className="text-yellow-400 text-sm font-semibold mb-1">Important</p>
          <p className="text-yellow-300/80 text-sm">
            When creating your WEEX API key, enable <strong>Trade permission only</strong>.
            Do not enable withdrawals — this keeps your funds safe.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-gray-400 text-sm mb-1 block">API Key</label>
            <input
              type="text" placeholder="Paste your WEEX API key" required
              value={apiKey} onChange={e => setApiKey(e.target.value)}
              className="w-full bg-white/10 text-white placeholder-gray-500 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-brand font-mono text-sm"
            />
          </div>
          <div>
            <label className="text-gray-400 text-sm mb-1 block">API Secret</label>
            <input
              type="password" placeholder="Paste your WEEX API secret" required
              value={apiSecret} onChange={e => setApiSecret(e.target.value)}
              className="w-full bg-white/10 text-white placeholder-gray-500 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-brand font-mono text-sm"
            />
          </div>
          <div>
            <label className="text-gray-400 text-sm mb-1 block">Passphrase</label>
            <input
              type="password" placeholder="Passphrase (if set)"
              value={passphrase} onChange={e => setPassphrase(e.target.value)}
              className="w-full bg-white/10 text-white placeholder-gray-500 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-brand"
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button type="submit" disabled={loading}
            className="bg-brand hover:bg-brand-dark text-black font-semibold py-3 rounded-xl transition disabled:opacity-50">
            {loading ? "Verifying keys..." : "Connect Exchange"}
          </button>
        </form>
      </div>
    </main>
  )
}
