"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import {
  ResponsiveContainer,
  BarChart, Bar,
  LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ReferenceLine, Cell,
} from "recharts"
import { getPnlChart, getMe } from "@/lib/api"

type DayRow     = { date: string;  pnl: number; trades: number }
type WeekRow    = { week: string;  pnl: number; trades: number }
type MonthRow   = { month: string; pnl: number; trades: number }
type EquityRow  = { date: string;  equity: number }

function pnlColor(v: number) { return v >= 0 ? "#68d391" : "#fc8181" }

const TOOLTIP_STYLE = {
  contentStyle: { background: "#1a1d2e", border: "1px solid #2d3148", borderRadius: 8, fontSize: 12 },
  labelStyle: { color: "#90cdf4" },
  itemStyle: { color: "#e2e8f0" },
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">{children}</p>
  )
}

function StatPill({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="bg-white/5 rounded-xl p-3 flex flex-col gap-1">
      <p className="text-gray-400 text-xs">{label}</p>
      <p className={`font-bold text-base ${color ?? "text-white"}`}>{value}</p>
    </div>
  )
}

export default function PnlPage() {
  const router = useRouter()
  const [loading, setLoading]     = useState(true)
  const [capital, setCapital]     = useState<number>(100)
  const [daily, setDaily]         = useState<DayRow[]>([])
  const [weekly, setWeekly]       = useState<WeekRow[]>([])
  const [monthly, setMonthly]     = useState<MonthRow[]>([])
  const [equity, setEquity]       = useState<EquityRow[]>([])
  const [monthIdx, setMonthIdx]   = useState(0)   // which month to show in daily chart

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) { router.push("/login"); return }
    load()
  }, [])

  async function load() {
    try {
      const [chart, me] = await Promise.all([getPnlChart(), getMe()])
      setDaily(chart.daily   ?? [])
      setWeekly((chart.weekly  ?? []).slice(-12))
      setMonthly((chart.monthly ?? []).slice(-12))
      setEquity(chart.equity_series ?? [])
      setCapital(me.bot?.capital ?? 100)
    } catch {
      router.push("/login")
    } finally {
      setLoading(false)
    }
  }

  // All months present in daily data
  const months = Array.from(new Set(daily.map(d => d.date.slice(0, 7)))).sort()
  const currentMonth = months[months.length - 1 - monthIdx] ?? ""
  const monthDays = daily.filter(d => d.date.startsWith(currentMonth))

  // Monthly summary stats
  const monthPnl    = monthDays.reduce((s, d) => s + d.pnl, 0)
  const monthTrades = monthDays.reduce((s, d) => s + d.trades, 0)
  const greenDays   = monthDays.filter(d => d.pnl > 0).length
  const redDays     = monthDays.filter(d => d.pnl < 0).length

  // Weekly stats for current week
  const totalPnl   = monthly.reduce((s, m) => s + m.pnl, 0)

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Loading...</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen px-4 py-8 max-w-lg mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Image src="/logo.svg" alt="Fortuna" width={48} height={50} />
        <Link href="/dashboard" className="text-gray-400 text-sm hover:text-white">
          ← Dashboard
        </Link>
      </div>

      <h1 className="text-2xl font-bold text-white mb-6">Performance</h1>

      {/* All-time summary pills */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        <StatPill
          label="All-time P&L"
          value={`${totalPnl >= 0 ? "+" : ""}$${totalPnl.toFixed(2)}`}
          color={totalPnl >= 0 ? "text-green-400" : "text-red-400"}
        />
        <StatPill
          label="Monthly trades"
          value={String(monthTrades)}
        />
        <StatPill
          label="Win days"
          value={`${greenDays} / ${greenDays + redDays}`}
          color="text-green-400"
        />
      </div>

      {/* ── Daily PnL for selected month ── */}
      <div className="bg-white/5 rounded-2xl p-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <SectionTitle>Daily P&L — {currentMonth || "—"}</SectionTitle>
          <div className="flex items-center gap-2">
            <button
              disabled={monthIdx >= months.length - 1}
              onClick={() => setMonthIdx(i => i + 1)}
              className="text-gray-400 hover:text-white disabled:opacity-30 text-lg leading-none px-1"
            >‹</button>
            <button
              disabled={monthIdx === 0}
              onClick={() => setMonthIdx(i => i - 1)}
              className="text-gray-400 hover:text-white disabled:opacity-30 text-lg leading-none px-1"
            >›</button>
          </div>
        </div>

        {/* Month summary row */}
        <div className="flex gap-4 mb-4">
          <div>
            <p className="text-gray-500 text-xs">Month P&L</p>
            <p className={`font-bold text-sm ${monthPnl >= 0 ? "text-green-400" : "text-red-400"}`}>
              {monthPnl >= 0 ? "+" : ""}${monthPnl.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-gray-500 text-xs">Trades</p>
            <p className="font-bold text-sm text-white">{monthTrades}</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs">Green days</p>
            <p className="font-bold text-sm text-green-400">{greenDays}</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs">Red days</p>
            <p className="font-bold text-sm text-red-400">{redDays}</p>
          </div>
        </div>

        {monthDays.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-8">No trades this month</p>
        ) : (
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={monthDays} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2d3148" vertical={false} />
              <XAxis
                dataKey="date"
                tickFormatter={d => d.slice(8)}
                tick={{ fill: "#718096", fontSize: 10 }}
                axisLine={false} tickLine={false}
              />
              <YAxis tick={{ fill: "#718096", fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip
                {...TOOLTIP_STYLE}
                formatter={(v: any, _: any, props: any) => [
                  `$${Number(v).toFixed(2)} (${props.payload.trades} trade${props.payload.trades !== 1 ? "s" : ""})`,
                  "P&L",
                ]}
                labelFormatter={l => `Day ${l.slice(8)}`}
              />
              <ReferenceLine y={0} stroke="#4a5568" />
              <Bar dataKey="pnl" radius={[3, 3, 0, 0]}>
                {monthDays.map((d, i) => (
                  <Cell key={i} fill={pnlColor(d.pnl)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* ── Weekly PnL ── */}
      <div className="bg-white/5 rounded-2xl p-4 mb-6">
        <SectionTitle>Weekly P&L</SectionTitle>
        {weekly.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-8">No data yet</p>
        ) : (
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={weekly} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2d3148" vertical={false} />
              <XAxis
                dataKey="week"
                tickFormatter={w => w.split("-W")[1] ? `W${w.split("-W")[1]}` : w}
                tick={{ fill: "#718096", fontSize: 10 }}
                axisLine={false} tickLine={false}
              />
              <YAxis tick={{ fill: "#718096", fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip
                {...TOOLTIP_STYLE}
                formatter={(v: any, _: any, props: any) => [
                  `$${Number(v).toFixed(2)} (${props.payload.trades} trades)`,
                  "P&L",
                ]}
                labelFormatter={l => `Week ${l.split("-W")[1] ?? l}`}
              />
              <ReferenceLine y={0} stroke="#4a5568" />
              <Bar dataKey="pnl" radius={[3, 3, 0, 0]}>
                {weekly.map((w, i) => (
                  <Cell key={i} fill={pnlColor(w.pnl)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* ── Monthly PnL ── */}
      <div className="bg-white/5 rounded-2xl p-4 mb-6">
        <SectionTitle>Monthly P&L</SectionTitle>
        {monthly.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-8">No data yet</p>
        ) : (
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={monthly} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2d3148" vertical={false} />
              <XAxis
                dataKey="month"
                tickFormatter={m => {
                  const [y, mo] = m.split("-")
                  return new Date(+y, +mo - 1).toLocaleString("en", { month: "short" })
                }}
                tick={{ fill: "#718096", fontSize: 10 }}
                axisLine={false} tickLine={false}
              />
              <YAxis tick={{ fill: "#718096", fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip
                {...TOOLTIP_STYLE}
                formatter={(v: any, _: any, props: any) => [
                  `$${Number(v).toFixed(2)} (${props.payload.trades} trades)`,
                  "P&L",
                ]}
                labelFormatter={l => {
                  const [y, mo] = l.split("-")
                  return new Date(+y, +mo - 1).toLocaleString("en", { month: "long", year: "numeric" })
                }}
              />
              <ReferenceLine y={0} stroke="#4a5568" />
              <Bar dataKey="pnl" radius={[3, 3, 0, 0]}>
                {monthly.map((m, i) => (
                  <Cell key={i} fill={pnlColor(m.pnl)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* ── Equity curve ── */}
      <div className="bg-white/5 rounded-2xl p-4 mb-6">
        <SectionTitle>Equity Curve</SectionTitle>
        {equity.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-8">No data yet</p>
        ) : (
          <ResponsiveContainer width="100%" height={180}>
            <LineChart
              data={equity}
              margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#2d3148" vertical={false} />
              <XAxis
                dataKey="date"
                tickFormatter={d => d.slice(5)}
                tick={{ fill: "#718096", fontSize: 10 }}
                axisLine={false} tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fill: "#718096", fontSize: 10 }}
                axisLine={false} tickLine={false}
                domain={["auto", "auto"]}
              />
              <Tooltip
                {...TOOLTIP_STYLE}
                formatter={(v: any) => [`$${Number(v).toFixed(2)}`, "Equity"]}
              />
              <ReferenceLine y={capital} stroke="#4a5568" strokeDasharray="4 2" label={{ value: "Start", fill: "#4a5568", fontSize: 10 }} />
              <Line
                type="monotone"
                dataKey="equity"
                stroke="#6366f1"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: "#6366f1" }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

    </main>
  )
}
