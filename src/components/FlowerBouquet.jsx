import { useState } from "react";
import "../styles/FlowerBouquet.css";
import bouquetSrc from "../media/flowerbouquet.svg";

const PETAL_COLORS = ["#ffb8cb","#ffc5d5","#ff9eb5","#ffd6e2","#f4a0b8","#fce4ec"];

function usePetals(count = 12) {
  const [petals] = useState(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      left:     `${Math.random() * 100}%`,
      color:    PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
      duration: `${7 + Math.random() * 9}s`,
      delay:    `${Math.random() * 12}s`,
      size:     `${12 + Math.random() * 10}px`,
    }))
  );
  return petals;
}

export default function FlowerBouquet({ onNext, onBack }) {
  const petals = usePetals(12);
  const [showMessage, setShowMessage] = useState(false);

  return (
    <div className="fb-wrapper">

      {/* Pétalos de fondo */}
      {petals.map((p) => (
        <div
          key={p.id}
          className="fb-petal"
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

      {/* Texto superior */}
      <div className="fb-text-top">
        <p>Recibe este ramo y prepárate.</p>
        <p>Es el comienzo de esta mini-sorpresa<br />hecha solo para ti!</p>
      </div>

      {/* Ramo — clickeable */}
      <div
        className="fb-bouquet-wrap"
        onClick={() => setShowMessage(true)}
        role="button"
        aria-label="Abre el ramo para ver tu mensaje"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && setShowMessage(true)}
      >
        <img
          src={bouquetSrc}
          alt="Ramo de tulipanes"
          className="fb-bouquet-svg"
          draggable={false}
        />
      </div>

      {/* Click hint */}
      <p className="fb-hint">toca el ramo</p>

      {/* Nav */}
      <div className="fb-nav">
        {onBack && (
          <button className="fb-btn-back" onClick={onBack}>← Volver</button>
        )}
        <button className="fb-btn-next" onClick={onNext}>
          Continuar <span>→</span>
        </button>
      </div>

      {/* ── Mensaje popup ── */}
      {showMessage && (
        <div
          className="fb-message-overlay"
          onClick={(e) => e.target === e.currentTarget && setShowMessage(false)}
        >
          <div className="fb-message-card">

            <div className="fb-msg-flowers">🌷🌸🌺</div>

            <h2 className="fb-msg-title">
              Feliz Día<br />de la Mujer
            </h2>

            <div className="fb-msg-divider" />

            <p className="fb-msg-body">
              Te celebramos con mucha alegría.<br />
              Hoy y siempre, gracias por existir<br />
              y por ser quien eres. ✨
            </p>

            <div className="fb-confetti">
              🎀 🌸 💐 🌷 🎀
            </div>

            <button
              className="fb-msg-close"
              onClick={() => setShowMessage(false)}
            >
              Cerrar 🌸
            </button>

          </div>
        </div>
      )}

    </div>
  );
}
