import { useEffect, useRef, useState } from "react";
import "../styles/PhotoCollage.css";
import tapeSrc from "../media/tape.svg";

// ── Foto placeholders — reemplazar con imports reales cuando estén listos
import foto1 from "../media/foto1.webp";
import foto2 from "../media/foto2.webp";
import foto3 from "../media/foto3.webp";
import foto4 from "../media/foto4.webp";
import foto5 from "../media/foto5.webp";
import foto6 from "../media/foto6.webp";
import foto7 from "../media/foto7.webp";
import foto41 from "../media/foto41.webp";
import foto42 from "../media/foto42.webp";
import foto43 from "../media/foto43.webp";

// ...

// Placeholder colorido mientras no hay fotos reales
const PLACEHOLDER_COLORS = [
  "#f5c2ce", "#f9d4bb", "#c8e6c9",
  "#bbdefb", "#e1bee7", "#ffe0b2", "#f8bbd0",
];

// ── Datos del collage ─────────────────────────────────────────────────
// Cuando tengas las fotos, reemplaza `src` con el import real:
// src: foto1, src: foto2, etc.
const PHOTOS = [
  { id: 1,  src: foto1, caption: "1. Una aventura en Arequipa" },
  { id: 2,  src: foto2, caption: "2. Las 3 con lentes" },
  { id: 3,  src: foto3, caption: "3. En la playita" },
  { id: 4,  src: foto4, caption: "4. Un corazón de 3" },
  { id: 5,  src: foto5, caption: "5. Con Ubitas" },
  { id: 6,  src: foto6, caption: "6. Con la vista del mar" },
  { id: 7,  src: foto7, caption: "7. Lupecita con los lobos de mar" },
  { id: 8,  src: foto41, caption: "8. Con sus hijitas" },
  { id: 9,  src: foto42, caption: "9. De vacaciones" },
  { id: 10,  src: foto43, caption: "10. Con la familia" },
];

// Rotaciones alternadas para el efecto collage
const ROTATIONS = ["-2.5deg", "2deg", "-1.5deg", "3deg", "-3deg", "1.5deg", "-2deg"];

// Posición del tape: qué cintas mostrar por foto (alterna el look)
const TAPE_CONFIG = [
  ["tl", "tr"],
  ["tl", "tr"],
  ["tl", "tr"],
  ["tl", "tr"],
  ["tl", "tr"],
  ["tl", "tr"],
  ["tl", "tr"],
    ["tl", "tr"],
  ["tl", "tr"],
  ["tl", "tr"],
];

// ── Componente Polaroid individual ────────────────────────────────────
function Polaroid({ photo, rotation, tapes, index }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`pc-polaroid ${visible ? "visible" : ""}`}
      style={{
        "--rot": `rotate(${rotation})`,
        transform: `rotate(${rotation})`,
        animationDelay: `${index * 0.08}s`,
      }}
    >
      {/* Tape pieces */}
      {tapes.includes("tl") && (
        <img src={tapeSrc} className="pc-tape pc-tape-tl" alt="" />
      )}
      {tapes.includes("tr") && (
        <img src={tapeSrc} className="pc-tape pc-tape-tr" alt="" />
      )}
      {tapes.includes("bl") && (
        <img src={tapeSrc} className="pc-tape pc-tape-bl" alt="" />
      )}

      {/* Foto o placeholder */}
      {photo.src ? (
        <img
          src={photo.src}
          alt={photo.caption || `Foto ${photo.id}`}
          className="pc-photo"
          loading="lazy"
        />
      ) : (
        <div
          className="pc-photo"
          style={{ background: PLACEHOLDER_COLORS[(photo.id - 1) % PLACEHOLDER_COLORS.length] }}
        />
      )}

      {/* Caption */}
      {photo.caption && (
        <p className="pc-caption">{photo.caption}</p>
      )}
    </div>
  );
}

// ── Componente principal ──────────────────────────────────────────────
export default function PhotoCollage({ onNext, onBack }) {
  return (
    <div className="pc-wrapper">

      {/* Título */}
      <div className="pc-title-wrap">
        <h2 className="pc-title">Lindos recuerdos</h2>
        <p className="pc-title-sub">🌸 momentos para siempre 🌸</p>
      </div>

      {/* Feed de polaroids */}
      <div className="pc-feed">
        {PHOTOS.map((photo, i) => (
          <Polaroid
            key={photo.id}
            photo={photo}
            rotation={ROTATIONS[i]}
            tapes={TAPE_CONFIG[i]}
            index={i}
          />
        ))}
      </div>

      {/* Nav */}
      <div className="pc-nav">
        {onBack && (
          <button className="pc-btn-back" onClick={onBack}>← Volver</button>
        )}
        <button className="pc-btn-next" onClick={onNext}>
          Continuar <span>→</span>
        </button>
      </div>

    </div>
  );
}
