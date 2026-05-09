"use client"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { forgotPassword } from "@/lib/api"

export default function ForgotPassword() {
  const [email, setEmail]   = useState("")
  const [loading, setLoading] = useState(false)
  const [done, setDone]     = useState(false)
  const [error, setError]   = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      await forgotPassword(email)
      setDone(true)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <Image src="/logo.svg" alt="Fortuna" width={72} height={75} className="mb-4" />
        <h1 className="text-3xl font-bold text-white mb-2">Reset password</h1>
        <p className="text-gray-400 mb-8">Enter your email and we'll send you a reset link.</p>

        {done ? (
          <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-5 text-center">
            <p className="text-green-400 font-semibold mb-1">Check your email</p>
            <p className="text-gray-400 text-sm">If that address is registered, a reset link is on its way.</p>
            <Link href="/login" className="mt-4 inline-block text-brand text-sm hover:underline">
              Back to sign in
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="email" placeholder="Email" required
              value={email} onChange={e => setEmail(e.target.value)}
              className="bg-white/10 text-white placeholder-gray-500 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-brand"
            />
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button type="submit" disabled={loading}
              className="bg-brand hover:bg-brand-dark text-black font-semibold py-3 rounded-xl transition disabled:opacity-50">
              {loading ? "Sending..." : "Send reset link"}
            </button>
            <Link href="/login" className="text-gray-500 text-sm text-center hover:text-gray-300">
              Back to sign in
            </Link>
          </form>
        )}
      </div>
    </main>
  )
}
