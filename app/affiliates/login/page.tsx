"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { affiliateLogin } from "@/lib/api"

export default function AffiliateLoginPage() {
  const router = useRouter()
  const [email, setEmail]       = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState("")

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const data = await affiliateLogin(email, password)
      if (data.status === "pending") {
        setError("Your application is still under review. We'll email you once approved.")
        return
      }
      router.push("/affiliates/dashboard")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <Image src="/logo.svg" alt="Fortuna" width={48} height={50} />
        </div>
        <h1 className="text-2xl font-bold text-white text-center mb-1">Affiliate login</h1>
        <p className="text-gray-400 text-sm text-center mb-8">
          Not an affiliate yet?{" "}
          <Link href="/affiliates" className="text-brand hover:underline">Apply here</Link>
        </p>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="email" required value={email} onChange={e => setEmail(e.target.value)}
            placeholder="Email"
            className="bg-white/10 text-white placeholder-gray-500 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-brand"
          />
          <input
            type="password" required value={password} onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            className="bg-white/10 text-white placeholder-gray-500 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-brand"
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            type="submit" disabled={loading}
            className="bg-brand hover:bg-brand-dark text-white font-semibold py-3 rounded-xl transition disabled:opacity-50"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </main>
  )
}
