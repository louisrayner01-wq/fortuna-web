"use client"
import { Suspense, useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { register } from "@/lib/api"

function RegisterForm() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const [name, setName]         = useState("")
  const [email, setEmail]       = useState("")
  const [password, setPassword] = useState("")
  const [error, setError]       = useState("")
  const [loading, setLoading]   = useState(false)
  const [refCode, setRefCode]   = useState("")

  useEffect(() => {
    const ref = searchParams.get("ref") || sessionStorage.getItem("ref_code") || ""
    if (ref) {
      setRefCode(ref)
      sessionStorage.setItem("ref_code", ref)
    }
  }, [searchParams])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      await register(name, email, password, refCode)
      sessionStorage.removeItem("ref_code")
      router.push("/subscribe")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-sm">
      <Image src="/logo.svg" alt="Fortuna" width={72} height={75} className="mb-4" />
      <h1 className="text-3xl font-bold text-white mb-2">Create account</h1>
      <p className="text-gray-400 mb-8">Start trading with Fortuna</p>

      {refCode && (
        <div className="bg-brand/10 border border-brand/30 rounded-xl px-4 py-2.5 mb-4 text-sm text-brand">
          Referred by code <span className="font-mono font-bold">{refCode}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text" placeholder="Full name" required
          value={name} onChange={e => setName(e.target.value)}
          className="bg-white/10 text-white placeholder-gray-500 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-brand"
        />
        <input
          type="email" placeholder="Email" required
          value={email} onChange={e => setEmail(e.target.value)}
          className="bg-white/10 text-white placeholder-gray-500 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-brand"
        />
        <input
          type="password" placeholder="Password" required minLength={8}
          value={password} onChange={e => setPassword(e.target.value)}
          className="bg-white/10 text-white placeholder-gray-500 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-brand"
        />
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button type="submit" disabled={loading}
          className="bg-brand hover:bg-brand-dark text-black font-semibold py-3 rounded-xl transition disabled:opacity-50">
          {loading ? "Creating account..." : "Create Account"}
        </button>
      </form>

      <p className="text-gray-400 text-sm text-center mt-6">
        Already have an account?{" "}
        <Link href="/login" className="text-brand hover:underline">Sign in</Link>
      </p>
    </div>
  )
}

export default function Register() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6">
      <Suspense fallback={null}>
        <RegisterForm />
      </Suspense>
    </main>
  )
}
