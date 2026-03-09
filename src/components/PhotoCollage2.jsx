import { useState, useEffect } from "react";
import "../styles/PhotoCollage2.css";
import tapeSrc  from "../media/tape.svg";
import heartSrc from "../media/heart.svg";

// ── Fotos y mensajes ──────────────────────────────────────────────────
// Reemplaza src con el import real cuando tengas las fotos:
import foto8 from "../media/foto8.webp";
import foto9 from "../media/foto9.webp";
import foto10 from "../media/foto10.webp";
import foto11 from "../media/foto11.webp";
import foto12 from "../media/foto12.webp";
import foto13 from "../media/foto13.webp";
import foto14 from "../media/foto14.webp";
// Para ahora usamos colores placeholder.

const PLACEHOLDER_COLORS = ["#f5c2ce", "#f9d4bb", "#c8e6c9", "#bbdefb"];

const PHOTOS = [
  {
    id: 1,
    src: foto8,
    placeholderColor: PLACEHOLDER_COLORS[0],
    placeholderEmoji: "🌸",
    caption: "Siempre apoyándonos",
    message: "Recuerdas el baile de graduación?",
  },
  {
    id: 2,
    src: foto9,
    placeholderColor: PLACEHOLDER_COLORS[1],
    placeholderEmoji: "☕",
    caption: "Momentos únicos",
    message: "Estos instantes son los que hacen que la vida valga la pena. Te queremos mucho. 🌷",
  },
  {
    id: 3,
    src: foto10,
    placeholderColor: PLACEHOLDER_COLORS[2],
    placeholderEmoji: "🌺",
    caption: "Recuerdas esta foto?",
    message: "Gracias por apoyarnos desde que nacimos, por cuidarnos y pasar tiempo con nosotros.",
  },
  {
    id: 4,
    src: foto11,
    placeholderColor: PLACEHOLDER_COLORS[3],
    placeholderEmoji: "💐",
    caption: "Para siempre",
    message: "Este recuerdo, como todos los que compartimos contigo, vive en nuestros corazones. 💖",
  },
  {
    id: 5,
    src: foto12,
    placeholderColor: PLACEHOLDER_COLORS[3],
    placeholderEmoji: "💐",
    caption: "Para siempre",
    message: "Este recuerdo, como todos los que compartimos contigo, vive en nuestros corazones. 💖",
  },
  {
    id: 6,
    src: foto13,
    placeholderColor: PLACEHOLDER_COLORS[3],
    placeholderEmoji: "💐",
    caption: "Para siempre",
    message: "Este recuerdo, como todos los que compartimos contigo, vive en nuestros corazones. 💖",
  },
  {
    id: 7,
    src: foto14,
    placeholderColor: PLACEHOLDER_COLORS[3],
    placeholderEmoji: "💐",
    caption: "Para siempre",
    message: "Este recuerdo, como todos los que compartimos contigo, vive en nuestros corazones. 💖",
  },
];

// ── Rotaciones por foto ───────────────────────────────────────────────
const ROTATIONS = ["-1.5deg", "2deg", "-2.5deg", "1.5deg"];

export default function PhotoCollage2({ onNext, onBack }) {
  const [current, setCurrent]   = useState(0);
  const [animKey, setAnimKey]   = useState(0); // cambia para re-trigger animación

  const photo    = PHOTOS[current];
  const isLast   = current === PHOTOS.length - 1;
  const isFirst  = current === 0;

  function goTo(index) {
    if (index === current) return;
    setCurrent(index);
    setAnimKey(k => k + 1);
  }

  function goPrev() { if (!isFirst) goTo(current - 1); }
  function goNextPhoto() { if (!isLast)  goTo(current + 1); }

  return (
    <div className="pc2-wrapper">

      {/* Blobs de fondo difuminados */}
      <div className="pc2-blob pc2-blob-1" />
      <div className="pc2-blob pc2-blob-2" />

      {/* Corazones decorativos */}
      <div className="pc2-heart pc2-heart-1">
        <img src={heartSrc} alt="" draggable={false} />
      </div>
      <div className="pc2-heart pc2-heart-2">
        <img src={heartSrc} alt="" draggable={false} />
      </div>
      <div className="pc2-heart pc2-heart-3">
        <img src={heartSrc} alt="" draggable={false} />
      </div>

      {/* Título */}
      <div className="pc2-title-wrap">
        <div className="pc2-title-card">
          <h2 className="pc2-title">Algunos lindos<br />recuerdos</h2>
        </div>
      </div>

      {/* Polaroid */}
      <div className="pc2-polaroid-wrap" key={animKey}>
        <div
          className="pc2-polaroid pc2-slide-enter"
          style={{ transform: `rotate(${ROTATIONS[current]})` }}
        >
          {/* Tape */}
          <img src={tapeSrc} className="pc2-tape pc2-tape-tl" alt="" draggable={false} />
          <img src={tapeSrc} className="pc2-tape pc2-tape-tr" alt="" draggable={false} />

          {/* Foto */}
          {photo.src ? (
            <img
              src={photo.src}
              alt={photo.caption}
              className="pc2-photo"
              loading="lazy"
            />
          ) : (
            <div
              className="pc2-photo-placeholder"
              style={{ background: photo.placeholderColor }}
            >
              {photo.placeholderEmoji}
            </div>
          )}

          {/* Caption */}
          <p className="pc2-caption">{photo.caption}</p>
        </div>
      </div>

      {/* Mensaje inferior */}
      <div className="pc2-message" key={`msg-${animKey}`}>
        {photo.message}
      </div>

      {/* Dot indicators */}
      <div className="pc2-dots">
        {PHOTOS.map((_, i) => (
          <button
            key={i}
            className={`pc2-dot ${i === current ? "active" : ""}`}
            onClick={() => goTo(i)}
            aria-label={`Foto ${i + 1}`}
          />
        ))}
      </div>

      {/* Nav */}
      <div className="pc2-nav">
        {onBack && isFirst && (
          <button className="pc2-btn-back" onClick={onBack}>← Volver</button>
        )}
        {!isFirst && (
          <button className="pc2-btn-prev" onClick={goPrev} aria-label="Anterior">‹</button>
        )}
        {!isLast ? (
          <button className="pc2-btn-next-photo" onClick={goNextPhoto} aria-label="Siguiente foto">›</button>
        ) : (
          <button className="pc2-btn-continue" onClick={onNext}>
            Continuar →
          </button>
        )}
      </div>

    </div>
  );
}
