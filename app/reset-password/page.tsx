"use client"
import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { resetPassword } from "@/lib/api"

function ResetForm() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const token        = searchParams.get("token") || ""

  const [password, setPassword]   = useState("")
  const [confirm, setConfirm]     = useState("")
  const [loading, setLoading]     = useState(false)
  const [done, setDone]           = useState(false)
  const [error, setError]         = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirm) { setError("Passwords don't match"); return }
    setError("")
    setLoading(true)
    try {
      await resetPassword(token, password)
      setDone(true)
      setTimeout(() => router.push("/login"), 2000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="text-center">
        <p className="text-red-400 mb-4">Invalid reset link.</p>
        <Link href="/forgot-password" className="text-brand hover:underline text-sm">Request a new one</Link>
      </div>
    )
  }

  return done ? (
    <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-5 text-center">
      <p className="text-green-400 font-semibold mb-1">Password updated!</p>
      <p className="text-gray-400 text-sm">Redirecting you to sign in…</p>
    </div>
  ) : (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input
        type="password" placeholder="New password" required minLength={8}
        value={password} onChange={e => setPassword(e.target.value)}
        className="bg-white/10 text-white placeholder-gray-500 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-brand"
      />
      <input
        type="password" placeholder="Confirm new password" required minLength={8}
        value={confirm} onChange={e => setConfirm(e.target.value)}
        className="bg-white/10 text-white placeholder-gray-500 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-brand"
      />
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <button type="submit" disabled={loading}
        className="bg-brand hover:bg-brand-dark text-black font-semibold py-3 rounded-xl transition disabled:opacity-50">
        {loading ? "Updating..." : "Set new password"}
      </button>
    </form>
  )
}

export default function ResetPassword() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <Image src="/logo.svg" alt="Fortuna" width={72} height={75} className="mb-4" />
        <h1 className="text-3xl font-bold text-white mb-2">Set new password</h1>
        <p className="text-gray-400 mb-8">Choose a new password for your account.</p>
        <Suspense fallback={null}>
          <ResetForm />
        </Suspense>
      </div>
    </main>
  )
}
