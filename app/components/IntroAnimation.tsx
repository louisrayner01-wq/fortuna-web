"use client"
import { useEffect, useRef, useState } from "react"
import Image from "next/image"

// Wheel centre in the SVG viewBox (500 × 520):
//   cx = 250 → 50%,  cy = 208 → 40%
const CX = 50
const CY = 40

type Phase = "hold" | "iris" | "zoom" | "fade" | "done"

export default function IntroAnimation({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<Phase>("hold")
  const overlayRef        = useRef<HTMLDivElement>(null)
  const rafRef            = useRef<number | null>(null)

  // ── Timing ────────────────────────────────────────────────────────────────
  useEffect(() => {
    const t1 = setTimeout(() => setPhase("iris"),  900)   // hold → open iris
    const t2 = setTimeout(() => setPhase("zoom"),  2000)  // iris done → fly through
    const t3 = setTimeout(() => setPhase("fade"),  3100)  // start fade
    const t4 = setTimeout(() => { setPhase("done"); onComplete() }, 4000)
    return () => [t1, t2, t3, t4].forEach(clearTimeout)
  }, [onComplete])

  // ── Iris: punch a growing hole through the overlay via CSS mask ───────────
  useEffect(() => {
    if (phase !== "iris") return

    const duration = 1000 // ms
    let startTime: number | null = null

    const tick = (now: number) => {
      if (!startTime) startTime = now
      const raw = Math.min((now - startTime) / duration, 1)
      // cubic ease-in-out
      const t   = raw < 0.5 ? 4 * raw ** 3 : 1 - (-2 * raw + 2) ** 3 / 2
      const r   = t * 120  // grow to 120% so it fully covers the screen

      if (overlayRef.current) {
        // Transparent hole at wheel centre; black everywhere else
        const mask = `radial-gradient(circle at ${CX}% ${CY}%, transparent ${r}%, #0a0a0a ${r + 2}%)`
        overlayRef.current.style.maskImage        = mask
        overlayRef.current.style.webkitMaskImage  = mask
      }

      if (raw < 1) rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [phase])

  if (phase === "done") return null

  return (
    <>
      {/* ── Dark overlay — the "door" that gets punched open ── */}
      <div
        ref={overlayRef}
        style={{
          position:      "fixed",
          inset:         0,
          zIndex:        9998,
          background:    "#0a0a0a",
          opacity:       phase === "fade" ? 0 : 1,
          transition:    phase === "fade" ? "opacity 0.9s ease-out" : "none",
          pointerEvents: phase === "fade" ? "none" : "auto",
        }}
      />

      {/* ── Logo — always on top, flies through the hole during zoom ── */}
      <div
        style={{
          position:       "fixed",
          inset:          0,
          zIndex:         9999,
          display:        "flex",
          alignItems:     "center",
          justifyContent: "center",
          pointerEvents:  "none",
          opacity:        phase === "fade" ? 0 : 1,
          transition:     phase === "fade" ? "opacity 0.9s ease-out" : "none",
        }}
      >
        <div
          style={{
            position:        "relative",
            width:           "min(70vw, 70vh)",
            height:          "min(70vw, 70vh)",
            transformOrigin: `${CX}% ${CY}%`,
            transform:       phase === "zoom" ? "scale(20)" : "scale(1)",
            transition:      phase === "zoom"
              ? "transform 1.1s cubic-bezier(0.4, 0, 1, 1)"
              : "none",
          }}
        >
          <Image
            src="/logo.svg"
            alt="Fortuna"
            fill
            style={{ objectFit: "contain" }}
            priority
          />
        </div>
      </div>
    </>
  )
}
