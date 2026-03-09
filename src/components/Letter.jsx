import { useState } from "react";
import "../styles/Letter.css";
import envelopeSrc from "../media/heartletter.svg";

// ── Líneas del mensaje con delay escalonado ───────────────────────────
const MESSAGE_LINES = [
  { text: "Eres un ejemplo de mujer.",            highlight: true,  delay: 0.4 },
  { text: "",                                      spacer: true                 },
  { text: "Porque demuestras con acciones",        delay: 0.7  },
  { text: "tu amor.",                              delay: 0.95 },
  { text: "",                                      spacer: true                 },
  { text: "Porque eres alguien muy trabajadora,",  delay: 1.2  },
  { text: "que nos inspira.",                      delay: 1.4  },
  { text: "",                                      spacer: true                 },
  { text: "Porque estás para tu familia,",         delay: 1.65 },
  { text: "para tus amigos y para todos",          delay: 1.85 },
  { text: "cuando te necesitan.",                  delay: 2.0  },
  { text: "",                                      spacer: true                 },
  { text: "Porque aunque todos cometemos errores,",delay: 2.2  },
  { text: "siempre buscas lo mejor",               delay: 2.4  },
  { text: "para los demás.",                       delay: 2.55 },
  { text: "",                                      spacer: true                 },
  { text: "Porque motivas, con tu esfuerzo,",      delay: 2.75 },
  { text: "con tus palabras sinceras,",            delay: 2.95 },
  { text: "con tu amor y tu cariño.",              delay: 3.1  },
];

// ── Sparkle positions ─────────────────────────────────────────────────
const SPARKLES = [
  { top: "18%", left: "12%",  delay: "0s",    dur: "2.8s" },
  { top: "12%", left: "78%",  delay: "0.6s",  dur: "3.2s" },
  { top: "72%", left: "8%",   delay: "1.1s",  dur: "2.5s" },
  { top: "68%", left: "84%",  delay: "0.3s",  dur: "3.5s" },
  { top: "40%", left: "92%",  delay: "1.5s",  dur: "2.9s" },
];

// ── Vista 1: sobre con botón ──────────────────────────────────────────
function EnvelopeView({ onOpen }) {
  return (
    <div className="letter-wrapper">

      {/* Brillo radial de fondo */}
      <div className="letter-glow" />

      {/* Sparkles */}
      {SPARKLES.map((s, i) => (
        <span
          key={i}
          className="letter-sparkle"
          style={{
            top: s.top, left: s.left,
            animationDelay: s.delay,
            animationDuration: s.dur,
          }}
        >
          ✨
        </span>
      ))}

      {/* Sobre */}
      <div className="letter-envelope-wrap" onClick={onOpen}>
        <img
          src={envelopeSrc}
          alt="Carta para ti"
          className="letter-envelope-img"
          draggable={false}
        />
      </div>

      {/* Botón */}
      <button className="letter-open-btn" onClick={onOpen}>
        <span className="btn-icon">💌</span>
        Leer carta
      </button>

    </div>
  );
}

// ── Vista 2: carta desplegada ─────────────────────────────────────────
function LetterContent({ onNext, onBack }) {
  return (
    <div className="letter-content-wrapper entering">

      {/* Título */}
      <h1 className="letter-title">RECUERDA</h1>

      {/* Papel */}
      <div className="letter-paper">
        <div className="letter-lines">
          {MESSAGE_LINES.map((line, i) => {
            if (line.spacer) {
              return <div key={i} className="letter-line spacer" />;
            }
            return (
              <p
                key={i}
                className={`letter-line${line.highlight ? " highlight" : ""}`}
                style={{ animationDelay: `${line.delay}s` }}
              >
                {line.text}
              </p>
            );
          })}
        </div>

        {/* Firma */}
        <div className="letter-signature">
          <span>Con amor, Ubitas</span>
        </div>
      </div>

      {/* Nav */}
      <div className="letter-nav">
        {onBack && (
          <button className="letter-btn-back" onClick={onBack}>← Volver</button>
        )}
        <button className="letter-btn-next" onClick={onNext}>
          Continuar →
        </button>
      </div>

    </div>
  );
}

// ── Componente principal ──────────────────────────────────────────────
export default function Letter({ onNext, onBack }) {
  const [opened, setOpened] = useState(false);

  if (!opened) {
    return <EnvelopeView onOpen={() => setOpened(true)} />;
  }

  return (
    <LetterContent
      onNext={onNext}
      onBack={() => setOpened(false)} // volver al sobre, no al componente anterior
    />
  );
}
