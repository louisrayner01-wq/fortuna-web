"use client"
import Link from "next/link"
import Image from "next/image"

export default function Landing() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <div className="mb-8">
        <Image src="/logo.svg" alt="Fortuna" width={120} height={125} className="mx-auto mb-4" />
        <p className="text-gray-400 text-lg">Automated trading bot for WEEX exchange</p>
      </div>

      <div className="grid grid-cols-1 gap-4 mb-12 max-w-md w-full text-left">
        {[
          { icon: "⚡", title: "Runs 24/7", desc: "Trades automatically while you sleep" },
          { icon: "🎯", title: "Smart Risk Management", desc: "Automatically scales to your capital" },
          { icon: "📊", title: "Live Dashboard", desc: "Track P&L and trades in real time" },
        ].map((f) => (
          <div key={f.title} className="flex gap-4 items-start bg-white/5 rounded-xl p-4">
            <span className="text-2xl">{f.icon}</span>
            <div>
              <p className="font-semibold text-white">{f.title}</p>
              <p className="text-gray-400 text-sm">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3 w-full max-w-xs">
        <Link href="/register"
          className="bg-brand hover:bg-brand-dark text-white font-semibold py-3 rounded-xl text-center transition">
          Get Started
        </Link>
        <Link href="/login"
          className="bg-white/10 hover:bg-white/20 text-white font-semibold py-3 rounded-xl text-center transition">
          Sign In
        </Link>
      </div>
    </main>
  )
}
