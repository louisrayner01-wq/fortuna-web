"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { login } from "@/lib/api"

export default function Login() {
  const router = useRouter()
  const [email, setEmail]       = useState("")
  const [password, setPassword] = useState("")
  const [error, setError]       = useState("")
  const [loading, setLoading]   = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      await login(email, password)
      router.push("/dashboard")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h1 className="text-3xl font-bold text-white mb-2">Welcome back</h1>
        <p className="text-gray-400 mb-8">Sign in to your account</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email" placeholder="Email" required
            value={email} onChange={e => setEmail(e.target.value)}
            className="bg-white/10 text-white placeholder-gray-500 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-brand"
          />
          <input
            type="password" placeholder="Password" required
            value={password} onChange={e => setPassword(e.target.value)}
            className="bg-white/10 text-white placeholder-gray-500 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-brand"
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button type="submit" disabled={loading}
            className="bg-brand hover:bg-brand-dark text-white font-semibold py-3 rounded-xl transition disabled:opacity-50">
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-gray-400 text-sm text-center mt-6">
          No account?{" "}
          <Link href="/register" className="text-brand hover:underline">Create one</Link>
        </p>
      </div>
    </main>
  )
}
