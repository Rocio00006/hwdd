import { useState, useEffect } from "react";
import "../styles/Closing.css";
import flowerSrc from "../media/endingflower.svg";
import heartSrc  from "../media/heart.svg";

// ── Typewriter hook ────────────────────────────────────────────────────
function useTypewriter(text, speed = 40, startDelay = 600) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone]           = useState(false);

  useEffect(() => {
    setDisplayed(""); setDone(false);
    let i = 0;
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) { clearInterval(interval); setDone(true); }
      }, speed);
      return () => clearInterval(interval);
    }, startDelay);
    return () => clearTimeout(timeout);
  }, [text, speed, startDelay]);

  return { displayed, done };
}

// ── Petals ────────────────────────────────────────────────────────────
const PETAL_COLORS = ["#ffb8cb","#ffc5d5","#ff9eb5","#ffd6e2","#f4a0b8"];
function usePetals(n = 12) {
  const [p] = useState(() => Array.from({ length: n }, (_, i) => ({
    id: i,
    left:     `${Math.random() * 100}%`,
    color:    PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
    duration: `${7 + Math.random() * 8}s`,
    delay:    `${Math.random() * 10}s`,
    size:     `${12 + Math.random() * 10}px`,
  })));
  return p;
}

const HEART_MESSAGE = "Espero que\nesta pequeña\nsorpresa te\nhaya gustado.";

// ── Pantalla 1: Flor ──────────────────────────────────────────────────
function FlowerScreen({ onNext }) {
  return (
    <div className="cl-wrapper">
      {/* Título */}
      <div className="cl-title-card">
        <p className="cl-title-text">
          Gracias por ser la<br />
          mejor mujer que<br />
          conozco, te quiero<br />
          un montón!
        </p>
      </div>

      {/* Flor */}
      <div className="cl-flower-wrap">
        <img src={flowerSrc} alt="Flor" className="cl-flower-img" draggable={false} />
      </div>

      {/* Botón */}
      <button className="cl-btn-next" onClick={onNext}>
        Un mensaje más para ti 💌
      </button>
    </div>
  );
}

// ── Pantalla 2: Corazón con typewriter ────────────────────────────────
function HeartScreen({ onRestart, onBack }) {
  const petals = usePetals(12);
  const { displayed, done } = useTypewriter(HEART_MESSAGE, 42, 700);

  // Format line breaks
  const lines = displayed.split("\n");

  return (
    <div className="cl-wrapper">

      {/* Pétalos */}
      {petals.map(p => (
        <div key={p.id} className="cl-petal" style={{
          left: p.left, width: p.size, height: p.size,
          background: p.color, animationDuration: p.duration, animationDelay: p.delay,
        }} />
      ))}

      {/* Corazón + texto typewriter */}
      <div className="cl-heart-scene">
        <div className="cl-heart-wrap">
          <img src={heartSrc} alt="" className="cl-heart-svg-img" draggable={false} />
          <div className="cl-heart-text">
            <p className="cl-heart-message">
              {lines.map((line, i) => (
                <span key={i}>
                  {line}
                  {i < lines.length - 1 && <br />}
                </span>
              ))}
              {!done && <span className="cl-cursor" />}
            </p>
          </div>
        </div>

        {/* Firma — aparece cuando termina el typewriter */}
        {done && (
          <div className="cl-signature-card" style={{ animation: "clFadeUp 0.6s ease both" }}>
            <p className="cl-signature">Con amor, Ubitas. 🌸</p>
          </div>
        )}
      </div>

      {/* Reiniciar */}
      {done && (
        <div className="cl-restart-wrap" style={{ animationDelay: "0.3s" }}>
          <button className="cl-btn-restart" onClick={onRestart}>
            🔁 Volver al inicio
          </button>
          <span className="cl-restart-hint">¿Quieres revivirlo todo?</span>
        </div>
      )}

    </div>
  );
}

// ── Componente principal ──────────────────────────────────────────────
export default function Closing({ onRestart, onBack }) {
  const [screen, setScreen] = useState(1); // 1 = flor, 2 = corazón

  if (screen === 1) {
    return <FlowerScreen onNext={() => setScreen(2)} />;
  }

  return (
    <HeartScreen
      onRestart={onRestart}
      onBack={() => setScreen(1)}
    />
  );
}
