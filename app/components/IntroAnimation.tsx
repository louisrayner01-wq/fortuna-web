"use client"
import { useEffect, useState } from "react"
import Image from "next/image"

// SVG geometry constants — wheel center is at (50%, 40%) of the 500×520 viewBox
// Wheel outer radius = 90/500 = 18% of width → diameter 36%
const WHEEL_CENTER_X = "50%"
const WHEEL_CENTER_Y = "40%"
const IRIS_SIZE      = "37%"   // slightly overshoots wheel edge

type Phase = "hold" | "iris" | "zoom" | "fade" | "done"

export default function IntroAnimation({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<Phase>("hold")

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("iris"),  700)   // pause, then open iris
    const t2 = setTimeout(() => setPhase("zoom"),  1600)  // iris open → fly through
    const t3 = setTimeout(() => setPhase("fade"),  2900)  // start fading overlay
    const t4 = setTimeout(() => { setPhase("done"); onComplete() }, 3400)
    return () => [t1, t2, t3, t4].forEach(clearTimeout)
  }, [onComplete])

  if (phase === "done") return null

  return (
    <div
      style={{
        position:       "fixed",
        inset:          0,
        zIndex:         9999,
        background:     "#0a0a0a",
        display:        "flex",
        alignItems:     "center",
        justifyContent: "center",
        overflow:       "hidden",
        opacity:        phase === "fade" ? 0 : 1,
        transition:     phase === "fade" ? "opacity 0.5s ease-out" : "none",
        pointerEvents:  phase === "fade" ? "none" : "auto",
      }}
    >
      {/* Logo — scales up with transform-origin at wheel centre to simulate fly-through */}
      <div
        style={{
          position:        "relative",
          width:           "min(72vw, 72vh)",
          height:          "min(72vw, 72vh)",
          transformOrigin: `${WHEEL_CENTER_X} ${WHEEL_CENTER_Y}`,
          transform:       phase === "zoom" ? "scale(22)" : "scale(1)",
          transition:      phase === "zoom"
            ? "transform 1.3s cubic-bezier(0.55, 0, 1, 1)"
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

        {/* Iris — dark disc that sits over the wheel and shrinks away to "open the door" */}
        <div
          style={{
            position:     "absolute",
            left:         WHEEL_CENTER_X,
            top:          WHEEL_CENTER_Y,
            width:        IRIS_SIZE,
            aspectRatio:  "1 / 1",
            borderRadius: "50%",
            background:   "#0a0a0a",
            transform:    `translate(-50%, -50%) scale(${phase === "hold" ? 1.3 : 0})`,
            transition:   phase === "iris"
              ? "transform 0.9s cubic-bezier(0.4, 0, 0.2, 1)"
              : "none",
            zIndex:       1,
          }}
        />
      </div>
    </div>
  )
}
