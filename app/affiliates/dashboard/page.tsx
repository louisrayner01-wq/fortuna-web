"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { getAffiliateMe, getAffiliateReferrals, getAffiliateEarnings, updateAffiliatePayout, affiliateLogout } from "@/lib/api"

export default function AffiliateDashboard() {
  const router = useRouter()
  const [me, setMe]               = useState<any>(null)
  const [referrals, setReferrals] = useState<any[]>([])
  const [earnings, setEarnings]   = useState<any[]>([])
  const [loading, setLoading]     = useState(true)
  const [tab, setTab]             = useState<"referrals" | "earnings">("referrals")
  const [payout, setPayout]       = useState("")
  const [payoutMsg, setPayoutMsg] = useState("")
  const [copied, setCopied]       = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("affiliate_token")
    if (!token) { router.push("/affiliates/login"); return }
    load()
  }, [])

  async function load() {
    try {
      const [m, r, e] = await Promise.all([getAffiliateMe(), getAffiliateReferrals(), getAffiliateEarnings()])
      setMe(m)
      setReferrals(r)
      setEarnings(e)
      setPayout(m.payout_email || "")
    } catch {
      router.push("/affiliates/login")
    } finally {
      setLoading(false)
    }
  }

  async function savePayout(e: React.FormEvent) {
    e.preventDefault()
    try {
      await updateAffiliatePayout(payout)
      setPayoutMsg("Saved!")
      setTimeout(() => setPayoutMsg(""), 2000)
    } catch (err: any) {
      setPayoutMsg(err.message)
    }
  }

  function copyLink() {
    navigator.clipboard.writeText(me.link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleLogout() {
    affiliateLogout()
    router.push("/affiliates/login")
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Loading…</p>
      </main>
    )
  }

  const stats = me?.stats ?? {}

  return (
    <main className="min-h-screen px-4 py-8 max-w-lg mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Image src="/logo.svg" alt="Fortuna" width={44} height={46} />
        <div className="flex items-center gap-4">
          <p className="text-gray-400 text-sm">{me?.name}</p>
          <button onClick={handleLogout} className="text-gray-400 text-sm hover:text-white">Sign out</button>
        </div>
      </div>

      {/* Affiliate link */}
      <div className="bg-brand/10 border border-brand/30 rounded-2xl p-5 mb-4">
        <p className="text-gray-400 text-xs mb-2 uppercase tracking-wide">Your referral link</p>
        <div className="flex items-center gap-2">
          <p className="text-white text-sm font-mono flex-1 truncate">{me?.link}</p>
          <button
            onClick={copyLink}
            className="bg-brand hover:bg-brand-dark text-black text-xs font-semibold px-3 py-1.5 rounded-lg transition shrink-0"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
        <p className="text-gray-500 text-xs mt-2">Code: <span className="text-white font-mono font-bold">{me?.code}</span> · Commission: <span className="text-white font-bold">{((me?.commission_rate ?? 0) * 100).toFixed(0)}%</span></p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-white/5 rounded-2xl p-4">
          <p className="text-gray-400 text-xs mb-1">Total referred</p>
          <p className="text-white text-2xl font-bold">{stats.total_referrals ?? 0}</p>
          <p className="text-gray-500 text-xs">{stats.converted ?? 0} paying</p>
        </div>
        <div className="bg-white/5 rounded-2xl p-4">
          <p className="text-gray-400 text-xs mb-1">Total earned</p>
          <p className="text-green-400 text-2xl font-bold">£{(stats.total_earned_gbp ?? 0).toFixed(2)}</p>
          <p className="text-gray-500 text-xs">£{(stats.pending_gbp ?? 0).toFixed(2)} pending · £{(stats.paid_gbp ?? 0).toFixed(2)} paid</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        {(["referrals", "earnings"] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 rounded-xl text-sm font-semibold capitalize transition ${tab === t ? "bg-brand text-black" : "bg-white/10 text-gray-400 hover:text-white"}`}
          >
            {t} {t === "referrals" ? `(${referrals.length})` : `(${earnings.length})`}
          </button>
        ))}
      </div>

      {/* Referrals tab */}
      {tab === "referrals" && (
        <div className="bg-white/5 rounded-2xl p-4 mb-4">
          {referrals.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-6">No referrals yet — share your link to get started.</p>
          ) : (
            <div className="flex flex-col gap-0">
              <div className="grid grid-cols-4 gap-2 pb-2 border-b border-white/10 mb-1">
                {["Email", "Status", "Sub", "Earned"].map(h => (
                  <p key={h} className="text-gray-500 text-xs font-semibold uppercase tracking-wide">{h}</p>
                ))}
              </div>
              {referrals.map((r: any) => (
                <div key={r.referral_id} className="grid grid-cols-4 gap-2 py-2.5 border-b border-white/5 last:border-0 items-center">
                  <p className="text-white text-xs truncate">{r.user_email}</p>
                  <p className={`text-xs font-semibold ${r.converted ? "text-green-400" : "text-gray-400"}`}>
                    {r.converted ? "Paying" : "Trial"}
                  </p>
                  <p className="text-xs text-gray-400 capitalize">{r.sub_status}</p>
                  <p className="text-xs text-green-400 font-semibold">£{r.total_earned.toFixed(2)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Earnings tab */}
      {tab === "earnings" && (
        <div className="bg-white/5 rounded-2xl p-4 mb-4">
          {earnings.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-6">No earnings yet.</p>
          ) : (
            <div className="flex flex-col gap-0">
              <div className="grid grid-cols-4 gap-2 pb-2 border-b border-white/10 mb-1">
                {["Date", "Payment", "Commission", "Status"].map(h => (
                  <p key={h} className="text-gray-500 text-xs font-semibold uppercase tracking-wide">{h}</p>
                ))}
              </div>
              {earnings.map((e: any) => (
                <div key={e.id} className="grid grid-cols-4 gap-2 py-2.5 border-b border-white/5 last:border-0 items-center">
                  <p className="text-gray-400 text-xs">{e.date.slice(0, 10)}</p>
                  <p className="text-white text-xs">£{e.amount_gbp.toFixed(2)}</p>
                  <p className="text-green-400 text-xs font-semibold">£{e.commission_gbp.toFixed(2)}</p>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full w-fit ${e.status === "paid" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}`}>
                    {e.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Payout settings */}
      <div className="bg-white/5 rounded-2xl p-4">
        <p className="text-gray-400 text-xs uppercase tracking-wide mb-3">Payout email (PayPal)</p>
        <form onSubmit={savePayout} className="flex gap-2">
          <input
            type="email" value={payout} onChange={e => setPayout(e.target.value)}
            placeholder="paypal@example.com"
            className="flex-1 bg-white/10 text-white placeholder-gray-500 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-brand text-sm"
          />
          <button type="submit" className="bg-brand hover:bg-brand-dark text-black px-4 py-2 rounded-xl text-sm font-semibold transition">
            Save
          </button>
        </form>
        {payoutMsg && <p className="text-green-400 text-xs mt-2">{payoutMsg}</p>}
        <p className="text-gray-600 text-xs mt-2">Payouts processed monthly. Minimum £20.</p>
      </div>
    </main>
  )
}
