"use client"
import { useEffect, useState } from "react"
import Image from "next/image"

// Wheel geometry in SVG viewBox (500×520):
//   centre cx=250, cy=208  |  outer radius incl half-stroke = 94
//   Full wheel viewBox: "156 114 188 188" — 1:1 square, matches the square door container
type Phase = "hold" | "door" | "zoom" | "fade" | "done"

export default function IntroAnimation({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<Phase>("hold")

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("door"),  900)
    const t2 = setTimeout(() => setPhase("zoom"),  2200)
    const t3 = setTimeout(() => setPhase("fade"),  3300)
    const t4 = setTimeout(() => { setPhase("done"); onComplete() }, 4300)
    return () => [t1, t2, t3, t4].forEach(clearTimeout)
  }, [onComplete])

  if (phase === "done") return null

  const doorOpen   = phase === "door" || phase === "zoom" || phase === "fade"
  // Keep scale(20) through both zoom AND fade — clearing it causes the visible jump
  const zoomed     = phase === "zoom" || phase === "fade"

  return (
    <>
      {/* Dark overlay — fades out last, smoothly revealing the page beneath */}
      <div style={{
        position:      "fixed",
        inset:         0,
        zIndex:        9998,
        background:    "#0a0a0a",
        opacity:       phase === "fade" ? 0 : 1,
        transition:    phase === "fade" ? "opacity 1s ease-out" : "none",
        pointerEvents: phase === "fade" ? "none" : "auto",
      }} />

      {/* Logo layer */}
      <div style={{
        position:       "fixed",
        inset:          0,
        zIndex:         9999,
        display:        "flex",
        alignItems:     "center",
        justifyContent: "center",
        pointerEvents:  "none",
        opacity:        phase === "fade" ? 0 : 1,
        transition:     phase === "fade" ? "opacity 1s ease-out" : "none",
      }}>
        {/* Container — zooms from wheel centre; scale held at 20 through fade */}
        <div style={{
          position:        "relative",
          width:           "min(70vw, 70vh)",
          height:          "min(70vw, 70vh)",
          transformOrigin: "50% 40%",
          transform:       zoomed ? "scale(20)" : "scale(1)",
          transition:      phase === "zoom"
            ? "transform 1.1s cubic-bezier(0.4, 0, 1, 1)"
            : "none",
        }}>

          {/* Full logo SVG — always visible beneath the door */}
          <Image
            src="/logo.svg"
            alt="Fortuna"
            fill
            style={{ objectFit: "contain" }}
            priority
          />

          {/*
            Dark mask — sits between the logo SVG and the door panel.
            Hides the logo's own wheel so only the door's wheel face is visible.
            Same size and position as the door; when the door swings open,
            the camera sees darkness (matching bg colour) through the aperture.
          */}
          <div style={{
            position:     "absolute",
            left:         "50%",
            top:          "40%",
            width:        "37%",
            height:       "37%",
            transform:    "translate(-50%, -50%)",
            borderRadius: "50%",
            background:   "#0a0a0a",
            zIndex:       1,
          }} />

          {/* Perspective wrapper — centred on wheel, enables 3-D for child */}
          <div style={{
            position:          "absolute",
            left:              "50%",
            top:               "40%",
            width:             "37%",
            height:            "37%",
            transform:         "translate(-50%, -50%)",
            perspective:       "500px",
            perspectiveOrigin: "0% 50%",  // vanishing point at hinge
            zIndex:            2,
          }}>
            {/* Single circular door — hinge on left, right side pushed inward */}
            <div style={{
              width:              "100%",
              height:             "100%",
              borderRadius:       "50%",
              overflow:           "hidden",
              transformOrigin:    "left center",
              transform:          doorOpen ? "rotateY(-85deg)" : "rotateY(0deg)",
              transition:         phase === "door"
                ? "transform 1.1s cubic-bezier(0.4, 0, 0.2, 1)"
                : "none",
              backfaceVisibility: "hidden",
            }}>
              {/* Wheel texture — reproduces logo wheel elements exactly */}
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
                <circle cx="250" cy="208" r="90"
                  fill="#060606" stroke="url(#wg)" strokeWidth="8"
                  filter="url(#wglow)" />
                <circle cx="250" cy="208" r="59"
                  fill="none" stroke="url(#wg)" strokeWidth="3.5" />
                <g stroke="#FFD700" strokeWidth="4.5" strokeLinecap="round">
                  <line x1="250" y1="118" x2="250" y2="298" />
                  <line x1="160" y1="208" x2="340" y2="208" />
                  <line x1="186" y1="144" x2="314" y2="272" />
                  <line x1="314" y1="144" x2="186" y2="272" />
                </g>
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
