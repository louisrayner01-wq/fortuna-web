"use client"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import IntroAnimation from "./components/IntroAnimation"

const TELEGRAM = "https://t.me/+POGmexl_VjpkOTdk"

const features = [
  {
    icon: "⚡",
    title: "Fully Automated",
    desc: "Set it up once. Fortuna monitors the market and executes trades around the clock — no manual input ever required.",
  },
  {
    icon: "🧠",
    title: "No Psychology",
    desc: "Fear, greed, and FOMO destroy most traders. Fortuna runs on pure data — no emotions, no mistakes.",
  },
  {
    icon: "📊",
    title: "Trained on Years of Data",
    desc: "Our algorithm has been back-tested and refined across thousands of market conditions so you don't have to be.",
  },
  {
    icon: "🛡️",
    title: "Built-in Risk Management",
    desc: "Every trade has a stop loss and take profit. Your capital is protected automatically on every single position.",
  },
  {
    icon: "🕐",
    title: "Zero Time Required",
    desc: "Whether you're at work, asleep, or on holiday — Fortuna never stops working. Your portfolio trades without you.",
  },
  {
    icon: "📈",
    title: "Live Dashboard",
    desc: "Track every trade, your live equity, and full P&L history in a clean real-time dashboard built for clarity.",
  },
]

const steps = [
  { n: "01", title: "Create your account", desc: "Sign up in under a minute with just your name and email." },
  { n: "02", title: "Start your free trial", desc: "30 days completely free. No charge until your trial ends." },
  { n: "03", title: "Connect your exchange", desc: "Link your WEEX account with a read-and-trade API key. Withdrawals stay locked." },
  { n: "04", title: "Let Fortuna trade", desc: "The bot goes live immediately. Watch the trades roll in from your dashboard." },
]

const testimonials = [
  {
    name: "James T.",
    handle: "@jamest_crypto",
    text: "I've tried manual trading for two years and always lost to my own emotions. Fortuna just works. Consistent, calm, and completely automated.",
  },
  {
    name: "Sophie R.",
    handle: "@sophier_fx",
    text: "I had zero trading experience when I started. Honestly doesn't matter — you plug it in and it does everything. The dashboard is brilliant.",
  },
  {
    name: "Marcus D.",
    handle: "@marcus_dex",
    text: "The stop loss on every trade is what sold me. I'm not worried about losing everything overnight. It's disciplined in a way I never was.",
  },
  {
    name: "Aisha K.",
    handle: "@aishak_inv",
    text: "Been running it for two months. I don't even check it every day anymore — I just trust it. That peace of mind is worth the subscription alone.",
  },
]

const faqs = [
  {
    q: "Do I need any trading experience?",
    a: "None at all. Fortuna is designed for complete beginners and experienced traders alike. You connect your exchange and the bot handles everything.",
  },
  {
    q: "Is my money safe?",
    a: "Your funds stay on WEEX at all times — Fortuna never has access to them directly. We only use a trade-only API key. Withdrawals are always disabled.",
  },
  {
    q: "What exchange does it work with?",
    a: "Fortuna currently supports WEEX. You'll need a WEEX futures account to get started.",
  },
  {
    q: "How much capital do I need?",
    a: "Fortuna works with any capital size. You set the amount inside your dashboard, and the bot scales its position sizing accordingly.",
  },
  {
    q: "Can I cancel any time?",
    a: "Yes, absolutely. Cancel before day 30 and you won't be charged a penny. No contracts, no lock-in.",
  },
  {
    q: "How does the 30-day trial work?",
    a: "You enter your card details to start but nothing is charged until your trial ends. Cancel anytime before day 30 and pay nothing.",
  },
]

export default function Landing() {
  const [openFaq, setOpenFaq]       = useState<number | null>(null)
  const [showIntro, setShowIntro]   = useState(true)
  const [pageVisible, setPageVisible] = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem("fortuna_intro")) {
      setShowIntro(false)
      setPageVisible(true)
    } else {
      sessionStorage.setItem("fortuna_intro", "1")
    }
  }, [])

  function handleIntroComplete() {
    setShowIntro(false)
    // small delay so the intro overlay finishes fading before page snaps in
    setTimeout(() => setPageVisible(true), 100)
  }

  return (
    <main
      className="min-h-screen text-white"
      style={{
        background: "#0a0a0a",
        opacity:    pageVisible ? 1 : 0,
        transition: pageVisible ? "opacity 0.8s ease-out" : "none",
      }}
    >
      {showIntro && <IntroAnimation onComplete={handleIntroComplete} />}

      {/* ── Nav ── */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <Image src="/logo.svg" alt="Fortuna" width={36} height={38} />
          <span className="font-bold text-lg tracking-tight">Fortuna</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href={TELEGRAM} target="_blank"
            className="text-gray-400 hover:text-white text-sm transition hidden sm:block">
            Telegram
          </Link>
          <Link href="/login"
            className="text-gray-400 hover:text-white text-sm transition hidden sm:block">
            Sign in
          </Link>
          <Link href="/register"
            className="bg-brand hover:bg-brand-dark text-black text-sm font-semibold px-4 py-2 rounded-lg transition">
            Get Started
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="flex flex-col items-center text-center px-6 pt-16 pb-24 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-brand/10 border border-brand/20 rounded-full px-4 py-1.5 mb-8 text-sm text-brand font-medium">
          <span className="w-2 h-2 rounded-full bg-brand animate-pulse inline-block" />
          Bot is live and trading now
        </div>

        <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight tracking-tight mb-6">
          Trade smarter.<br />
          <span className="text-brand">Do nothing.</span>
        </h1>

        <p className="text-gray-400 text-lg sm:text-xl max-w-xl mb-10 leading-relaxed">
          Fortuna is a fully automated crypto trading bot. No experience needed,
          no time required, no emotions — just consistent, data-driven trading on autopilot.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Link href="/register"
            className="bg-brand hover:bg-brand-dark text-black font-semibold px-8 py-4 rounded-xl text-center transition text-lg">
            Start free trial — 30 days free
          </Link>
          <Link href={TELEGRAM} target="_blank"
            className="bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-xl text-center transition text-lg">
            Watch it trade live →
          </Link>
        </div>

        <p className="text-gray-500 text-sm mt-4">No charge for 30 days. Cancel any time.</p>
      </section>

      {/* ── Features ── */}
      <section className="px-6 pb-24 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-3">Everything handled for you</h2>
        <p className="text-gray-400 text-center mb-12 max-w-xl mx-auto">
          Fortuna removes every barrier that stops most people from trading successfully.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map(f => (
            <div key={f.title}
              className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 hover:border-brand/30 transition">
              <span className="text-3xl mb-4 block">{f.icon}</span>
              <h3 className="font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="px-6 pb-24 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-3">Up and running in minutes</h2>
        <p className="text-gray-400 text-center mb-12 max-w-lg mx-auto">
          Getting started is simple. Four steps and you're live.
        </p>
        <div className="flex flex-col gap-6">
          {steps.map((s, i) => (
            <div key={s.n} className="flex gap-5 items-start">
              <div className="shrink-0 w-12 h-12 rounded-xl bg-brand/10 border border-brand/20
                              flex items-center justify-center text-brand font-bold text-sm">
                {s.n}
              </div>
              <div className="pt-1">
                <h3 className="font-semibold text-white mb-1">{s.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
              </div>
              {i < steps.length - 1 && (
                <div className="absolute" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="px-6 pb-24 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-3">What our members say</h2>
        <p className="text-gray-400 text-center mb-12">Real people. Real results.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {testimonials.map(t => (
            <div key={t.name}
              className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
              <p className="text-gray-300 text-sm leading-relaxed mb-4">"{t.text}"</p>
              <div>
                <p className="text-white font-semibold text-sm">{t.name}</p>
                <p className="text-gray-500 text-xs">{t.handle}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Pricing ── */}
      <section className="px-6 pb-24 max-w-md mx-auto text-center">
        <h2 className="text-3xl font-bold mb-3">Simple pricing</h2>
        <p className="text-gray-400 mb-10">One plan. Everything included. Cancel any time.</p>

        <div className="bg-white/[0.03] border border-brand/30 rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand to-transparent" />

          <div className="flex items-end justify-center gap-1 mb-1">
            <span className="text-5xl font-extrabold text-white">£49</span>
            <span className="text-gray-400 mb-2">/month</span>
          </div>
          <p className="text-brand font-semibold text-sm mb-8">30-day free trial — no charge today</p>

          <ul className="flex flex-col gap-3 text-left mb-8">
            {[
              "Fully automated trading on WEEX",
              "AI-powered entries and exits",
              "Stop loss & take profit on every trade",
              "Built-in risk management",
              "Live P&L dashboard",
              "Telegram trade alerts",
              "Cancel any time",
            ].map(item => (
              <li key={item} className="flex items-center gap-3 text-sm text-gray-300">
                <span className="text-brand text-base">✓</span>
                {item}
              </li>
            ))}
          </ul>

          <Link href="/register"
            className="block w-full bg-brand hover:bg-brand-dark text-black font-semibold py-4 rounded-xl transition text-center text-lg">
            Start free trial
          </Link>
          <p className="text-gray-500 text-xs mt-4">
            Card required. Cancel before day 30 and pay nothing.
          </p>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="px-6 pb-24 max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Frequently asked questions</h2>
        <div className="flex flex-col gap-3">
          {faqs.map((f, i) => (
            <div key={i}
              className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-4 text-left">
                <span className="font-medium text-white text-sm">{f.q}</span>
                <span className="text-gray-400 text-lg shrink-0 ml-4">
                  {openFaq === i ? "−" : "+"}
                </span>
              </button>
              {openFaq === i && (
                <div className="px-6 pb-4">
                  <p className="text-gray-400 text-sm leading-relaxed">{f.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="px-6 pb-24 max-w-3xl mx-auto text-center">
        <div className="bg-brand/10 border border-brand/20 rounded-3xl p-12">
          <h2 className="text-3xl font-bold mb-4">Ready to let Fortuna trade for you?</h2>
          <p className="text-gray-400 mb-8">
            Join hundreds of members who've replaced manual trading with a bot that never sleeps,
            never panics, and never misses an entry.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/register"
              className="bg-brand hover:bg-brand-dark text-black font-semibold px-8 py-4 rounded-xl transition text-center">
              Start free trial
            </Link>
            <Link href={TELEGRAM} target="_blank"
              className="bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-xl transition text-center">
              Join the Telegram
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/10 px-6 py-8 max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Image src="/logo.svg" alt="Fortuna" width={24} height={25} />
            <span className="text-sm font-semibold">Fortuna</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <Link href={TELEGRAM} target="_blank" className="hover:text-white transition">Telegram</Link>
            <Link href="/affiliates" className="hover:text-white transition">Affiliates</Link>
            <Link href="/login" className="hover:text-white transition">Sign in</Link>
          </div>
          <p className="text-gray-600 text-xs">© 2025 Fortuna. All rights reserved.</p>
        </div>
      </footer>

    </main>
  )
}
