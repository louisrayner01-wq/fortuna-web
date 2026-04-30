"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { affiliateRegister, affiliateLogin } from "@/lib/api"

export default function AffiliateLanding() {
  const router = useRouter()
  const [tab, setTab]           = useState<"info" | "apply">("info")
  const [name, setName]         = useState("")
  const [email, setEmail]       = useState("")
  const [password, setPassword] = useState("")
  const [payout, setPayout]     = useState("")
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState("")
  const [done, setDone]         = useState(false)

  async function handleApply(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      await affiliateRegister(name, email, password, payout)
      setDone(true)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen px-4 py-10 max-w-lg mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <Image src="/logo.svg" alt="Fortuna" width={44} height={46} />
        <Link href="/affiliates/login" className="text-sm text-gray-400 hover:text-white">
          Affiliate login →
        </Link>
      </div>

      {/* Hero */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-3">Earn with Fortuna</h1>
        <p className="text-gray-400 text-base leading-relaxed">
          Share your unique link. Every member who signs up through it earns you a commission on each monthly payment — automatically tracked, no admin required.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {[
          ["20%", "Commission per payment"],
          ["Monthly", "Recurring income"],
          ["Real-time", "Earnings tracking"],
        ].map(([val, label]) => (
          <div key={label} className="bg-white/5 rounded-2xl p-4 text-center">
            <p className="text-white font-bold text-lg">{val}</p>
            <p className="text-gray-500 text-xs mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* How it works */}
      <div className="bg-white/5 rounded-2xl p-5 mb-8">
        <p className="text-white font-semibold mb-4">How it works</p>
        <ol className="flex flex-col gap-3">
          {[
            ["Apply below", "Fill in your details and submit your application."],
            ["Get approved", "We'll review and activate your account, usually within 24 hours."],
            ["Share your link", "You get a unique link like fortuna.app/register?ref=YOURCODE"],
            ["Earn commission", "Every subscriber you refer pays you 20% of their monthly fee, every month they stay."],
          ].map(([title, body], i) => (
            <li key={i} className="flex gap-3">
              <span className="w-5 h-5 rounded-full bg-brand text-black text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
              <span className="text-sm text-gray-300"><span className="text-white font-semibold">{title} — </span>{body}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setTab("info")}
          className={`flex-1 py-2 rounded-xl text-sm font-semibold transition ${tab === "info" ? "bg-brand text-black" : "bg-white/10 text-gray-400 hover:text-white"}`}
        >
          Learn more
        </button>
        <button
          onClick={() => setTab("apply")}
          className={`flex-1 py-2 rounded-xl text-sm font-semibold transition ${tab === "apply" ? "bg-brand text-black" : "bg-white/10 text-gray-400 hover:text-white"}`}
        >
          Apply now
        </button>
      </div>

      {tab === "info" && (
        <div className="bg-white/5 rounded-2xl p-5">
          <p className="text-white font-semibold mb-3">Frequently asked questions</p>
          <div className="flex flex-col gap-4">
            {[
              ["Who can apply?", "Anyone — influencers, content creators, trading communities, or anyone with an audience interested in automated trading."],
              ["When do I get paid?", "We pay out monthly via PayPal or bank transfer. You'll see a full breakdown in your affiliate dashboard."],
              ["Is there a minimum payout?", "£20 minimum. Anything below rolls over to the next month."],
              ["How long do referrals last?", "Forever. Once someone signs up through your link, they're attributed to you for the lifetime of their subscription."],
            ].map(([q, a]) => (
              <div key={q as string}>
                <p className="text-white text-sm font-semibold mb-1">{q}</p>
                <p className="text-gray-400 text-sm">{a}</p>
              </div>
            ))}
          </div>
          <button
            onClick={() => setTab("apply")}
            className="mt-6 w-full bg-brand hover:bg-brand-dark text-black font-semibold py-3 rounded-xl transition text-sm"
          >
            Apply to become an affiliate
          </button>
        </div>
      )}

      {tab === "apply" && (
        <div className="bg-white/5 rounded-2xl p-5">
          {done ? (
            <div className="text-center py-6">
              <p className="text-2xl mb-3">✅</p>
              <p className="text-white font-bold text-lg mb-2">Application submitted!</p>
              <p className="text-gray-400 text-sm">We'll review your application and email you within 24 hours. Once approved you can log in and get your link.</p>
              <Link href="/affiliates/login" className="mt-6 inline-block bg-white/10 hover:bg-white/15 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition">
                Go to affiliate login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleApply} className="flex flex-col gap-4">
              <div>
                <label className="text-gray-400 text-xs mb-1.5 block">Full name</label>
                <input
                  required value={name} onChange={e => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full bg-white/10 text-white placeholder-gray-500 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-brand"
                />
              </div>
              <div>
                <label className="text-gray-400 text-xs mb-1.5 block">Email</label>
                <input
                  type="email" required value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-white/10 text-white placeholder-gray-500 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-brand"
                />
              </div>
              <div>
                <label className="text-gray-400 text-xs mb-1.5 block">Password</label>
                <input
                  type="password" required value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="Choose a password"
                  className="w-full bg-white/10 text-white placeholder-gray-500 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-brand"
                />
              </div>
              <div>
                <label className="text-gray-400 text-xs mb-1.5 block">PayPal email for payouts <span className="text-gray-600">(optional — can add later)</span></label>
                <input
                  type="email" value={payout} onChange={e => setPayout(e.target.value)}
                  placeholder="paypal@example.com"
                  className="w-full bg-white/10 text-white placeholder-gray-500 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-brand"
                />
              </div>
              {error && <p className="text-red-400 text-sm">{error}</p>}
              <button
                type="submit" disabled={loading}
                className="bg-brand hover:bg-brand-dark text-black font-semibold py-3 rounded-xl transition disabled:opacity-50"
              >
                {loading ? "Submitting…" : "Submit application"}
              </button>
            </form>
          )}
        </div>
      )}
    </main>
  )
}
