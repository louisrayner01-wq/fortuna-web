"use client"
import { useEffect, useState } from "react"
import Image from "next/image"

// Wheel geometry in the logo container
// SVG viewBox 500×520, object-fit:contain in square container scales by height
// Wheel centre: cx=250/500=50%, cy=208/520≈40% of container
// Wheel diameter incl stroke ≈ 37% of container width
const CX   = "50%"
const CY   = "40%"
const SIZE = "37%"

type Phase = "hold" | "door" | "zoom" | "fade" | "done"

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

  const doorOpen = phase === "door" || phase === "zoom" || phase === "fade"

  return (
    <>
      {/* ── Dark background overlay ── */}
      <div style={{
        position:      "fixed",
        inset:         0,
        zIndex:        9998,
        background:    "#0a0a0a",
        opacity:       phase === "fade" ? 0 : 1,
        transition:    phase === "fade" ? "opacity 0.9s ease-out" : "none",
        pointerEvents: phase === "fade" ? "none" : "auto",
      }} />

      {/* ── Logo + door panels ── */}
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
        {/* Logo — zooms through the open wheel on cue */}
        <div style={{
          position:        "relative",
          width:           "min(70vw, 70vh)",
          height:          "min(70vw, 70vh)",
          transformOrigin: `${CX} ${CY}`,
          transform:       phase === "zoom" ? "scale(20)" : "scale(1)",
          transition:      phase === "zoom"
            ? "transform 1.1s cubic-bezier(0.4, 0, 1, 1)"
            : "none",
        }}>
          <Image
            src="/logo.svg"
            alt="Fortuna"
            fill
            style={{ objectFit: "contain" }}
            priority
          />

          {/* ── Door panels — sit over the wheel, split & swing open ── */}
          <div style={{
            position:          "absolute",
            left:              CX,
            top:               CY,
            width:             SIZE,
            height:            SIZE,
            transform:         "translate(-50%, -50%)",
            display:           "flex",
            perspective:       "350px",
            perspectiveOrigin: "50% 50%",
            overflow:          "visible",
          }}>

            {/* Left panel — stays shut */}
            <div style={{
              width:        "50%",
              height:       "100%",
              flexShrink:   0,
              background:   "#050505",
              borderRadius: "100% 0 0 100% / 50% 0 0 50%",
              border:       "2.5px solid #FFD700",
              borderRight:  "1px solid rgba(255,215,0,0.3)",
              boxShadow:    "0 0 14px rgba(255,215,0,0.25)",
            }} />

            {/* Right panel — swings inward (away from viewer) */}
            <div style={{
              width:              "50%",
              height:             "100%",
              flexShrink:         0,
              background:         "#050505",
              borderRadius:       "0 100% 100% 0 / 0 50% 50% 0",
              border:             "2.5px solid #FFD700",
              borderLeft:         "none",
              boxShadow:          "0 0 14px rgba(255,215,0,0.25)",
              transformOrigin:    "left center",
              transform:          doorOpen
                ? "rotateY(-85deg)"
                : "rotateY(0deg)",
              transition:         phase === "door"
                ? "transform 1s cubic-bezier(0.4, 0, 0.2, 1)"
                : "none",
              backfaceVisibility: "hidden",
            }} />
          </div>
        </div>
      </div>
    </>
  )
}
