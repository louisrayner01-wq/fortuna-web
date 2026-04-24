"use client"
import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { createCheckout } from "@/lib/api"

export default function Subscribe() {
  const router  = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState("")

  async function handleSubscribe() {
    setError("")
    setLoading(true)
    try {
      const { url } = await createCheckout()
      window.location.href = url
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">

        <div className="flex flex-col items-center mb-8">
          <Image src="/logo.svg" alt="Fortuna" width={72} height={75} className="mb-4" />
          <h1 className="text-3xl font-bold text-white">Fortuna Pro</h1>
          <p className="text-gray-400 text-sm mt-2 text-center">
            Automated trading on WEEX, powered by machine learning
          </p>
        </div>

        {/* Pricing card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
          <div className="flex items-end gap-1 mb-1">
            <span className="text-4xl font-bold text-white">£49</span>
            <span className="text-gray-400 mb-1">/month</span>
          </div>
          <p className="text-brand font-semibold text-sm mb-6">30-day free trial — no charge today</p>

          <ul className="flex flex-col gap-3 mb-6">
            {[
              "Fully automated trading on WEEX",
              "AI-powered entries and exits",
              "Stop loss and take profit on every trade",
              "Risk management built in",
              "Live dashboard and P&L tracking",
              "Cancel any time",
            ].map(item => (
              <li key={item} className="flex items-start gap-2 text-sm text-gray-300">
                <span className="text-brand mt-0.5">✓</span>
                {item}
              </li>
            ))}
          </ul>

          {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

          <button
            onClick={handleSubscribe}
            disabled={loading}
            className="w-full bg-brand hover:bg-brand-dark text-white font-semibold py-3 rounded-xl transition disabled:opacity-50"
          >
            {loading ? "Redirecting to payment..." : "Start free trial"}
          </button>

          <p className="text-gray-500 text-xs text-center mt-4">
            Card required to start trial. Cancel before day 30 and you won't be charged.
          </p>
        </div>

        <button
          onClick={() => router.push("/dashboard")}
          className="w-full text-gray-500 text-sm hover:text-gray-300 text-center"
        >
          Back to dashboard
        </button>

      </div>
    </main>
  )
}
