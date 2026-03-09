import { useState } from "react";
import "../styles/Intro2.css";

const PETAL_COLORS = ["#ffb8cb","#ffc5d5","#ff9eb5","#ffd6e2","#f4a0b8","#fce4ec"];

function usePetals(count = 14) {
  const [petals] = useState(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      left:     `${Math.random() * 100}%`,
      color:    PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
      duration: `${7 + Math.random() * 8}s`,
      delay:    `${Math.random() * 10}s`,
      size:     `${13 + Math.random() * 11}px`,
    }))
  );
  return petals;
}

export default function Intro2({ onNext, onBack }) {
  const petals = usePetals(14);

  return (
    <div className="intro2-wrapper">

      {/* Pétalos */}
      {petals.map((p) => (
        <div
          key={p.id}
          className="intro2-petal"
          style={{
            left:              p.left,
            width:             p.size,
            height:            p.size,
            background:        p.color,
            animationDuration: p.duration,
            animationDelay:    p.delay,
          }}
        />
      ))}

      <div className="intro2-card">

        {/* ── Texto curvo con SVG ── */}
        <svg className="intro2-curved-text" viewBox="25 -30 200 90" aria-label="Feliz día de la">
          <defs>
            <path
              id="arc"
              d="M 30,80 A 105,105 0 0,1 230,80"
            />
          </defs>
          <text>
            <textPath href="#arc" startOffset="50%" textAnchor="middle">
              Feliz día de la
            </textPath>
          </text>
        </svg>

        {/* ── Corazón SVG ── */}
        <div className="intro2-heart-wrap">
          <svg className="intro2-heart-svg" viewBox="0 0 100 90" fill="none">
            <path
              d="M50 82 C50 82 8 52 8 28 C8 14 18 4 30 4 C38 4 45 9 50 16 C55 9 62 4 70 4 C82 4 92 14 92 28 C92 52 50 82 50 82Z"
              fill="url(#heartGrad)"
            />
            {/* Brillo */}
            <ellipse cx="34" cy="24" rx="8" ry="5" fill="rgba(255,255,255,0.35)" transform="rotate(-30 34 24)" />
            <defs>
              <radialGradient id="heartGrad" cx="45%" cy="35%" r="60%">
                <stop offset="0%"   stopColor="#ff6b8a" />
                <stop offset="55%"  stopColor="#d63055" />
                <stop offset="100%" stopColor="#a01030" />
              </radialGradient>
            </defs>
          </svg>
        </div>

        {/* ── MUJER ── */}
        <h1 className="intro2-mujer">MUJER</h1>

        {/* ── Divider ── */}
        <div className="intro2-divider">
          <span className="line" />
          <span>🌸</span>
          <span className="line" />
        </div>

        {/* ── Subtítulo ── */}
        <p className="intro2-subtitle">
          Hoy celebramos la fuerza,<br />
          el amor y el poder que<br />
          reside dentro de ti
        </p>

        {/* ── Siguiente ── */}
        <button className="intro2-btn" onClick={onNext}>
          Continuar <span className="arrow">→</span>
        </button>

        {/* ── Volver ── */}
        {onBack && (
          <button className="intro2-back" onClick={onBack}>
            ← Volver
          </button>
        )}

      </div>
    </div>
  );
}
