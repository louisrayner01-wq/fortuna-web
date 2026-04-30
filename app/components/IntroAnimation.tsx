"use client"
import { useEffect, useState } from "react"
import Image from "next/image"

// Wheel geometry derived from the SVG viewBox (500 × 520).
// Wheel centre: cx=250, cy=208. Outer radius incl half-stroke: 94px.
// Each door panel uses a viewBox that shows exactly one half of the wheel.
// ViewBox for left panel:  x=156, y=114, w=94, h=188  (156 = 250−94, 114 = 208−94)
// ViewBox for right panel: x=250, y=114, w=94, h=188
// Both viewBoxes are 1:2 ratio, matching the 50%×100% panel aspect ratio exactly.

type Phase = "hold" | "door" | "zoom" | "fade" | "done"

// Shared wheel SVG elements — same in both panels; the viewBox clips to each half
function WheelHalf({ side }: { side: "left" | "right" }) {
  const id    = side  // "left" | "right" — used to namespace gradient/filter IDs
  const viewBox = side === "left" ? "156 114 94 188" : "250 114 94 188"

  return (
    <svg
      viewBox={viewBox}
      width="100%"
      height="100%"
      preserveAspectRatio="none"
      style={{ display: "block" }}
    >
      <defs>
        <linearGradient id={`gold-${id}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#FFE566" />
          <stop offset="100%" stopColor="#B8860B" />
        </linearGradient>
        <filter id={`glow-${id}`}>
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Outer ring */}
      <circle
        cx="250" cy="208" r="90"
        fill="#060606"
        stroke={`url(#gold-${id})`}
        strokeWidth="8"
        filter={`url(#glow-${id})`}
      />

      {/* Inner ring */}
      <circle
        cx="250" cy="208" r="59"
        fill="none"
        stroke={`url(#gold-${id})`}
        strokeWidth="3.5"
      />

      {/* Spokes — viewBox naturally clips each to its half */}
      <g stroke="#FFD700" strokeWidth="4.5" strokeLinecap="round">
        <line x1="250" y1="118" x2="250" y2="298" />
        <line x1="160" y1="208" x2="340" y2="208" />
        <line x1="186" y1="144" x2="314" y2="272" />
        <line x1="314" y1="144" x2="186" y2="272" />
      </g>

      {/* Hub */}
      <circle cx="250" cy="208" r="22" fill={`url(#gold-${id})`} />
      <circle cx="250" cy="208" r="12" fill="#060606" />
      <circle cx="250" cy="208" r="5"  fill="#FFD700" />
    </svg>
  )
}

export default function IntroAnimation({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<Phase>("hold")

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("door"),  900)
    const t2 = setTimeout(() => setPhase("zoom"),  2100)
    const t3 = setTimeout(() => setPhase("fade"),  3200)
    const t4 = setTimeout(() => { setPhase("done"); onComplete() }, 4100)
    return () => [t1, t2, t3, t4].forEach(clearTimeout)
  }, [onComplete])

  if (phase === "done") return null

  const doorOpen  = phase === "door" || phase === "zoom" || phase === "fade"
  const doorTrans = phase === "door" ? "transform 1s cubic-bezier(0.4, 0, 0.2, 1)" : "none"

  // Shared panel styles
  const panelBase: React.CSSProperties = {
    position:           "absolute",
    top:                0,
    height:             "100%",
    width:              "50%",
    overflow:           "hidden",
    backfaceVisibility: "hidden",
    transition:         doorTrans,
  }

  return (
    <>
      {/* Dark overlay behind everything */}
      <div style={{
        position:      "fixed",
        inset:         0,
        zIndex:        9998,
        background:    "#0a0a0a",
        opacity:       phase === "fade" ? 0 : 1,
        transition:    phase === "fade" ? "opacity 0.9s ease-out" : "none",
        pointerEvents: phase === "fade" ? "none" : "auto",
      }} />

      {/* Logo + door */}
      <div style={{
        position:       "fixed",
        inset:          0,
        zIndex:         9999,
        display:        "flex",
        alignItems:     "center",
        justifyContent: "center",
        pointerEvents:  "none",
        opacity:        phase === "fade" ? 0 : 1,
        transition:     phase === "fade" ? "opacity 0.9s ease-out" : "none",
      }}>
        <div style={{
          position:        "relative",
          width:           "min(70vw, 70vh)",
          height:          "min(70vw, 70vh)",
          transformOrigin: "50% 40%",
          transform:       phase === "zoom" ? "scale(20)" : "scale(1)",
          transition:      phase === "zoom"
            ? "transform 1.1s cubic-bezier(0.4, 0, 1, 1)"
            : "none",
        }}>

          {/* Full logo beneath the door panels */}
          <Image
            src="/logo.svg"
            alt="Fortuna"
            fill
            style={{ objectFit: "contain" }}
            priority
          />

          {/* ── Door: perspective wrapper centred on the wheel ── */}
          {/* Wrapper is 37% × 37% of the logo container (covers wheel + stroke) */}
          {/* Each panel is a 1:2 rectangle matching the WheelHalf viewBox ratio  */}
          <div style={{
            position:          "absolute",
            left:              "50%",
            top:               "40%",
            width:             "37%",
            height:            "37%",
            transform:         "translate(-50%, -50%)",
            perspective:       "350px",
            perspectiveOrigin: "50% 50%",
          }}>

            {/* Left door panel — swings OUT to the left */}
            <div style={{
              ...panelBase,
              left:            0,
              borderRadius:    "100% 0 0 100% / 50% 0 0 50%",
              transformOrigin: "right center",
              transform:       doorOpen ? "rotateY(82deg)" : "rotateY(0deg)",
            }}>
              <WheelHalf side="left" />
            </div>

            {/* Right door panel — swings IN (pushed into the screen) */}
            <div style={{
              ...panelBase,
              right:           0,
              borderRadius:    "0 100% 100% 0 / 0 50% 50% 0",
              transformOrigin: "left center",
              transform:       doorOpen ? "rotateY(-82deg)" : "rotateY(0deg)",
            }}>
              <WheelHalf side="right" />
            </div>

          </div>
        </div>
      </div>
    </>
  )
}
