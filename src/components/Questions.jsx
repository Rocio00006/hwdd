import { useState } from "react";
import "../styles/Questions.css";

// ── Preguntas ─────────────────────────────────────────────────────────
// correct: índices de las opciones correctas (puede ser una o todas)
const QUESTIONS = [
  {
    id: 1,
    question: "¿Qué significa ser mujer?",
    hint: "Puedes elegir más de una",
    options: ["Resiliencia y valentía", "Conformismo", "Nada"],
    correct: [0], // todas correctas
    allCorrect: true,
  },
  {
    id: 2,
    question: "¿Cuál es es tu mayor fortaleza?",
    hint: "Solo una respuesta correcta",
    options: ["Tu familia", "Tus amigos", "Tu trabajo"],
    correct: [0, 1, 2], // trampa: todas son válidas
    allCorrect: true,
  },
  {
    id: 3,
    question: "¿A dónde te gustaría viajar?",
    hint: "Puedes elegir más de una",
    options: ["Lima", "Cusco", "Otro"],
    correct: [0, 1, 2], // todas correctas
    allCorrect: true,
  },
];

const LETTERS = ["A", "B", "C"];

// ── Banner de intro ───────────────────────────────────────────────────
function Banner({ onStart }) {
  return (
    <div className="q-banner-overlay">
      <div className="q-banner-card">
        <div className="q-banner-icon">🌟</div>
        <h2 className="q-banner-title">Ronda de<br />preguntas</h2>
        <p className="q-banner-sub">
          3 preguntas sobre el poder<br />y la magia que llevas dentro
        </p>
        <button className="q-banner-btn" onClick={onStart}>
          ¡Comenzar!
        </button>
      </div>
    </div>
  );
}

// ── Pantalla de celebración ───────────────────────────────────────────
function Celebration({ score, total, onNext, onBack }) {
  const perfect = score === total;
  return (
    <div className="q-celebration">
      <div className="q-celebration-card">
        <div className="q-celebration-emoji">
          {perfect ? "🏆" : "🌸"}
        </div>
        <h2 className="q-celebration-title">
          {perfect ? "¡Perfecta!" : "¡Lo lograste!"}
        </h2>
        <div className="q-score-badge">
          {score} / {total} respuestas correctas
        </div>
        <div className="q-celebration-divider" />
        <p className="q-celebration-body">
          {perfect
            ? "¡Sabías todo! Eso demuestra que eres exactamente tan brillante como todos pensamos. 💫"
            : "Nunca olvides lo increíble que eres. Sigue brillando siempre."}
        </p>
        <div className="q-confetti-row">🎀 🌸 💐 🌷 🎀</div>
        <button className="q-cel-btn" onClick={onNext}>
          Continuar →
        </button>
        {onBack && (
          <button className="q-cel-back" onClick={onBack}>← Volver</button>
        )}
      </div>
    </div>
  );
}

// ── Componente principal ──────────────────────────────────────────────
export default function Questions({ onNext, onBack }) {
  const [showBanner, setShowBanner] = useState(true);
  const [qIndex, setQIndex]         = useState(0);
  const [selected, setSelected]     = useState(null);   // índice clickeado
  const [answered, setAnswered]     = useState(false);
  const [score, setScore]           = useState(0);
  const [done, setDone]             = useState(false);

  const q = QUESTIONS[qIndex];

  function handleSelect(optIndex) {
    if (answered) return;
    setSelected(optIndex);
    setAnswered(true);
    const isCorrect = q.correct.includes(optIndex);
    if (isCorrect) setScore((s) => s + 1);
  }

  function handleNext() {
    if (qIndex + 1 >= QUESTIONS.length) {
      setDone(true);
    } else {
      setQIndex((i) => i + 1);
      setSelected(null);
      setAnswered(false);
    }
  }

  function getOptionState(optIndex) {
    if (!answered) return "";
    const isCorrect = q.correct.includes(optIndex);
    if (optIndex === selected) {
      return isCorrect ? "correct" : "wrong";
    }
    // Si todas son correctas, muéstralas todas en verde
    if (q.allCorrect && isCorrect) return "correct";
    // Si no fue seleccionada y no es correcta → atenuar
    return "dimmed";
  }

  function getFeedback() {
    if (!answered) return null;
    const isCorrect = q.correct.includes(selected);
    if (isCorrect) {
      return q.allCorrect
        ? "¡Exacto!"
        : " Bien! ";
    }
    return "¡Casi! La respuesta era otra 🌸";
  }

  const feedbackText = getFeedback();
  const isWrongFb = answered && !q.correct.includes(selected);

  // ── Render ──────────────────────────────────────────────────────────
  if (showBanner) return <Banner onStart={() => setShowBanner(false)} />;

  if (done) return (
    <Celebration
      score={score}
      total={QUESTIONS.length}
      onNext={onNext}
      onBack={onBack}
    />
  );

  const progress = ((qIndex) / QUESTIONS.length) * 100;

  return (
    <div className="q-wrapper">

      {/* Progress */}
      <div className="q-progress-wrap">
        <span className="q-progress-label">
          {qIndex + 1} de {QUESTIONS.length}
        </span>
        <div className="q-progress-track">
          <div
            className="q-progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Card */}
      <div className="q-card" key={qIndex}>

        <span className="q-number">Pregunta {qIndex + 1}</span>

        <h2 className="q-question">{q.question}</h2>

        <span className="q-hint">
          {q.allCorrect ? "Tómate tu tiempo" : "💡 " + q.hint}
        </span>

        {/* Opciones */}
        <div className="q-options">
          {q.options.map((opt, i) => {
            const state = getOptionState(i);
            return (
              <button
                key={i}
                className={`q-option ${state}`}
                onClick={() => handleSelect(i)}
                disabled={answered}
              >
                <span className="q-option-letter">{LETTERS[i]}</span>
                {opt}
                <span className="q-option-icon">
                  {state === "correct" ? "✓" : state === "wrong" ? "✗" : ""}
                </span>
              </button>
            );
          })}
        </div>

        {/* Feedback */}
        {answered && (
          <p className={`q-feedback ${isWrongFb ? "wrong-fb" : ""}`}>
            {feedbackText}
          </p>
        )}

        {/* Siguiente */}
        {answered && (
          <button className="q-next-btn" onClick={handleNext}>
            {qIndex + 1 < QUESTIONS.length ? "Siguiente pregunta →" : "Ver resultado"}
          </button>
        )}

      </div>

      {/* Volver */}
      {onBack && !answered && (
        <button
          style={{
            background: "transparent", border: "none",
            color: "var(--color-text)", fontFamily: "var(--font-body)",
            fontSize: "13px", fontWeight: 600, cursor: "pointer", opacity: 0.6,
          }}
          onClick={onBack}
        >
          ← Volver
        </button>
      )}

    </div>
  );
}
