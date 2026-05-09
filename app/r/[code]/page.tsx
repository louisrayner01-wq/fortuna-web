"use client"
import { useEffect } from "react"
import { useRouter, useParams } from "next/navigation"

export default function ReferralRedirect() {
  const router = useRouter()
  const params = useParams()

  useEffect(() => {
    const code = (params?.code as string || "").toUpperCase()
    if (code) sessionStorage.setItem("ref_code", code)
    router.replace(`/register?ref=${code}`)
  }, [])

  return (
    <main className="min-h-screen flex items-center justify-center">
      <p className="text-gray-400">Redirecting…</p>
    </main>
  )
}
