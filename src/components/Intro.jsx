import { useEffect, useState, useRef } from "react";
import "../styles/Intro.css";

// ── Petal colours matching the sakura palette ──────────────────────────
const PETAL_COLORS = [
  "#ffb8cb", "#ffc5d5", "#ff9eb5", "#ffd6e2",
  "#f4a0b8", "#fce4ec", "#f8bbd0",
];

function generatePetals(count = 18) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    color: PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
    duration: `${6 + Math.random() * 8}s`,
    delay: `${Math.random() * 10}s`,
    size: `${14 + Math.random() * 12}px`,
    rotate: `${Math.random() * 360}deg`,
  }));
}

const BG_CIRCLES = [
  { size: 340, top: "-10%", left: "-12%", dur: "7s" },
  { size: 260, top: "60%",  left: "72%",  dur: "9s" },
  { size: 180, top: "30%",  left: "85%",  dur: "6s" },
  { size: 200, top: "75%",  left: "-8%",  dur: "8s" },
];

// ── Typewriter hook ────────────────────────────────────────────────────
function useTypewriter(text, speed = 42, startDelay = 1800) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    let timeout;
    let i = 0;
    setDisplayed("");
    setDone(false);

    timeout = setTimeout(() => {
      const interval = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) {
          clearInterval(interval);
          setDone(true);
        }
      }, speed);
      return () => clearInterval(interval);
    }, startDelay);

    return () => clearTimeout(timeout);
  }, [text, speed, startDelay]);

  return { displayed, done };
}

// ── Component ──────────────────────────────────────────────────────────
export default function Intro({ onNext }) {
  const [petals] = useState(() => generatePetals(18));

  const message =
    "Hay personas que llegan a tu vida\ny la iluminan para siempre.\nHoy, ese alguien eres tú. 🌸";

  const { displayed, done } = useTypewriter(message, 38, 1600);

  // Format line breaks
  const lines = displayed.split("\n");

  return (
    <div className="intro-wrapper">

      {/* Background soft circles */}
      {BG_CIRCLES.map((c, i) => (
        <div
          key={i}
          className="bg-circle"
          style={{
            width: c.size,
            height: c.size,
            top: c.top,
            left: c.left,
            animationDuration: c.dur,
            animationDelay: `${i * 0.8}s`,
          }}
        />
      ))}

      {/* Falling petals */}
      {petals.map((p) => (
        <div
          key={p.id}
          className="petal"
          style={{
            left: p.left,
            top: `-${20 + Math.random() * 30}px`,
            width: p.size,
            height: p.size,
            background: p.color,
            animationDuration: p.duration,
            animationDelay: p.delay,
            transform: `rotate(${p.rotate})`,
          }}
        />
      ))}

      {/* Card */}
      <div className="intro-card">

        {/* Heart */}
        <div className="intro-heart">💗</div>

        {/* Date badge */}
        <div className="intro-date">8 de Marzo · Día de la Mujer</div>

        {/* Title */}
        <h1 className="intro-title">Para ti,<br />que lo mereces todo</h1>

        {/* Divider */}
        <div className="intro-divider">
          <span />
          <span className="flower"></span>
          <span />
        </div>

        {/* Typewriter */}
        <div className="intro-typewriter-wrap">
          <p className="intro-subtitle">
            {lines.map((line, i) => (
              <span key={i}>
                {line}
                {i < lines.length - 1 && <br />}
              </span>
            ))}
            {!done && <span className="cursor" />}
          </p>
        </div>

        {/* CTA */}
        {done && (
          <button className="intro-btn" onClick={onNext}>
            Comenzar la sorpresa
            <span className="btn-arrow">→</span>
          </button>
        )}

        {/* Bottom flowers */}
        <div className="intro-flowers-bottom">🌸 🌺 🌸</div>

      </div>
    </div>
  );
}
