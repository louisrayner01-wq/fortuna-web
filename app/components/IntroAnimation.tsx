"use client"
import { useEffect, useState } from "react"
import Image from "next/image"

// Full wheel in the SVG viewBox (500×520):
//   centre cx=250, cy=208, outer radius incl half-stroke = 94
//   viewBox "156 114 188 188" frames the entire wheel as a 1:1 square
type Phase = "hold" | "door" | "zoom" | "fade" | "done"

export default function IntroAnimation({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<Phase>("hold")

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("door"),  900)
    const t2 = setTimeout(() => setPhase("zoom"),  2200)
    const t3 = setTimeout(() => setPhase("fade"),  3300)
    const t4 = setTimeout(() => { setPhase("done"); onComplete() }, 4200)
    return () => [t1, t2, t3, t4].forEach(clearTimeout)
  }, [onComplete])

  if (phase === "done") return null

  const doorOpen = phase === "door" || phase === "zoom" || phase === "fade"

  return (
    <>
      {/* Dark background overlay */}
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
        {/* Logo container — zooms through on cue */}
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
          {/* Underlying logo — always visible, revealed as door swings open */}
          <Image
            src="/logo.svg"
            alt="Fortuna"
            fill
            style={{ objectFit: "contain" }}
            priority
          />

          {/* ── Perspective wrapper centred exactly on the wheel ── */}
          {/* 37% × 37% of the logo container covers the full wheel incl stroke */}
          <div style={{
            position:          "absolute",
            left:              "50%",
            top:               "40%",
            width:             "37%",
            height:            "37%",
            transform:         "translate(-50%, -50%)",
            perspective:       "500px",
            perspectiveOrigin: "0% 50%",  // vanishing point at hinge (left edge)
          }}>

            {/* ── The wheel door — one piece, hinge on left edge ── */}
            <div style={{
              width:              "100%",
              height:             "100%",
              borderRadius:       "50%",   // circular door
              overflow:           "hidden",
              transformOrigin:    "left center",  // hinge
              transform:          doorOpen ? "rotateY(-85deg)" : "rotateY(0deg)",
              transition:         phase === "door"
                ? "transform 1.1s cubic-bezier(0.4, 0, 0.2, 1)"
                : "none",
              backfaceVisibility: "hidden",
            }}>
              {/*
                Full wheel SVG — viewBox frames exactly the wheel area (1:1 square)
                Aspect matches the square container so no distortion.
                All spokes, rings, hub rendered identically to the logo.
              */}
              <svg
                viewBox="156 114 188 188"
                width="100%"
                height="100%"
                style={{ display: "block" }}
              >
                <defs>
                  <linearGradient id="wg" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%"   stopColor="#FFE566" />
                    <stop offset="100%" stopColor="#B8860B" />
                  </linearGradient>
                  <filter id="wglow">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Outer ring */}
                <circle cx="250" cy="208" r="90"
                  fill="#060606"
                  stroke="url(#wg)" strokeWidth="8"
                  filter="url(#wglow)"
                />
                {/* Inner ring */}
                <circle cx="250" cy="208" r="59"
                  fill="none"
                  stroke="url(#wg)" strokeWidth="3.5"
                />
                {/* Spokes */}
                <g stroke="#FFD700" strokeWidth="4.5" strokeLinecap="round">
                  <line x1="250" y1="118" x2="250" y2="298" />
                  <line x1="160" y1="208" x2="340" y2="208" />
                  <line x1="186" y1="144" x2="314" y2="272" />
                  <line x1="314" y1="144" x2="186" y2="272" />
                </g>
                {/* Hub */}
                <circle cx="250" cy="208" r="22" fill="url(#wg)" />
                <circle cx="250" cy="208" r="12" fill="#060606" />
                <circle cx="250" cy="208" r="5"  fill="#FFD700" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
