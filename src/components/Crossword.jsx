import { useState, useRef, useCallback } from "react";
import "../styles/Crossword.css";

const ROWS = 9;
const COLS = 9;

const WORDS = [
  { id: "MARINO_H",  word: "MARINO",  row: 1, col: 2, dir: "H", num: 4 },
  { id: "MARIELA_V", word: "MARIELA", row: 1, col: 2, dir: "V", num: 2 },
  { id: "GELY_H",    word: "GELY",    row: 5, col: 1, dir: "H", num: 1 },
  { id: "CHIO_V",    word: "CHIO",    row: 4, col: 7, dir: "V", num: 3 },
  { id: "AGOSTO_H",  word: "AGOSTO",  row: 7, col: 2, dir: "H", num: 5 },
];

const CLUES = [
  { num: 1, text: "Cuál es tu nombre",              wordId: "GELY_H"    },
  { num: 2, text: "Nombre de tu primera hija",       wordId: "MARIELA_V" },
  { num: 3, text: "Apodo de tu segunda hija",        wordId: "CHIO_V"    },
  { num: 4, text: "Qué color de azul te gusta más",  wordId: "MARINO_H"  },
  { num: 5, text: "En qué mes nació Ubitas",         wordId: "AGOSTO_H"  },
];

function buildCellMap() {
  const map = Array.from({ length: ROWS }, () => Array.from({ length: COLS }, () => null));
  WORDS.forEach(({ id, word, row, col, dir }) => {
    word.split("").forEach((letter, i) => {
      const r = dir === "H" ? row     : row + i;
      const c = dir === "H" ? col + i : col;
      if (!map[r][c]) map[r][c] = { wordIds: [], letter };
      if (!map[r][c].wordIds.includes(id)) map[r][c].wordIds.push(id);
      map[r][c].letter = letter;
    });
  });
  return map;
}
const CELL_MAP = buildCellMap();

// Number badge positions — placed just outside first cell of each word
const NUMBER_LABELS = WORDS.map(({ num, row, col, dir }) => ({
  num, dir,
  // H: badge left of first col, same row center
  // V: badge above first row, same col center
  labelRow: dir === "H" ? row     : row - 1,
  labelCol: dir === "H" ? col - 1 : col,
}));

function getWordCells(wordId) {
  const w = WORDS.find(x => x.id === wordId);
  return w.word.split("").map((_, i) => ({
    r: w.dir === "H" ? w.row     : w.row + i,
    c: w.dir === "H" ? w.col + i : w.col,
  }));
}

export default function Crossword({ onNext, onBack }) {
  const CELL = 36;
  const GAP  = 3;
  const STEP = CELL + GAP;

  const [inputs,      setInputs]      = useState(() => Array.from({ length: ROWS }, () => Array(COLS).fill("")));
  const [cellState,   setCellState]   = useState(() => Array.from({ length: ROWS }, () => Array(COLS).fill("")));
  const [solvedWords, setSolvedWords] = useState(new Set());
  const [feedback,    setFeedback]    = useState("");
  const [allSolved,   setAllSolved]   = useState(false);
  const [revealed,    setRevealed]    = useState(false);
  const inputRefs = useRef({});

  const handleInput = useCallback((r, c, value) => {
    const letter = value.slice(-1).toUpperCase();
    setInputs(prev => { const n = prev.map(row => [...row]); n[r][c] = letter; return n; });
    setCellState(prev => { const n = prev.map(row => [...row]); n[r][c] = ""; return n; });
    setFeedback("");
    if (letter) {
      const cell = CELL_MAP[r][c];
      if (!cell) return;
      const w = WORDS.find(x => x.id === cell.wordIds[0]);
      const nr = w.dir === "H" ? r : r + 1;
      const nc = w.dir === "H" ? c + 1 : c;
      if (nr < ROWS && nc < COLS && CELL_MAP[nr][nc]) inputRefs.current[`${nr}-${nc}`]?.focus();
    }
  }, []);

  const handleKeyDown = useCallback((e, r, c) => {
    if (e.key === "Backspace" && !inputs[r][c]) {
      const cell = CELL_MAP[r][c];
      if (!cell) return;
      const w = WORDS.find(x => x.id === cell.wordIds[0]);
      const pr = w.dir === "H" ? r : r - 1;
      const pc = w.dir === "H" ? c - 1 : c;
      if (pr >= 0 && pc >= 0 && CELL_MAP[pr][pc]) inputRefs.current[`${pr}-${pc}`]?.focus();
    }
  }, [inputs]);

  const checkAnswers = useCallback(() => {
    const newState  = Array.from({ length: ROWS }, () => Array(COLS).fill(""));
    const newSolved = new Set(solvedWords);
    let anyFilled = false, allCorrect = true;
    WORDS.forEach(({ id, word }) => {
      const cells    = getWordCells(id);
      const userWord = cells.map(({ r, c }) => inputs[r][c]).join("").toUpperCase();
      if (!userWord.trim()) return;
      anyFilled = true;
      if (userWord === word) {
        newSolved.add(id);
        cells.forEach(({ r, c }) => { newState[r][c] = "correct"; });
      } else {
        allCorrect = false;
        cells.forEach(({ r, c }) => {
          if (inputs[r][c]) newState[r][c] = inputs[r][c].toUpperCase() === CELL_MAP[r][c]?.letter ? "correct" : "wrong";
        });
      }
    });
    setCellState(newState);
    setSolvedWords(newSolved);
    if (newSolved.size === WORDS.length)   { setFeedback("¡Perfecto! ¡Lo resolviste todo! 🎉"); setAllSolved(true); }
    else if (!anyFilled)                    setFeedback("¡Escribe algunas letras primero! ✏️");
    else if (allCorrect)                    setFeedback("¡Correcto hasta aquí! Sigue completando 🌸");
    else                                    setFeedback("Algunas respuestas no son correctas, ¡sigue intentando! 💪");
  }, [inputs, solvedWords]);

  const revealAll = useCallback(() => {
    const ni = Array.from({ length: ROWS }, () => Array(COLS).fill(""));
    const ns = Array.from({ length: ROWS }, () => Array(COLS).fill(""));
    CELL_MAP.forEach((row, r) => row.forEach((cell, c) => { if (cell) { ni[r][c] = cell.letter; ns[r][c] = "correct"; } }));
    setInputs(ni); setCellState(ns);
    setSolvedWords(new Set(WORDS.map(w => w.id)));
    setAllSolved(true); setRevealed(true);
    setFeedback("¡Aquí está la solución completa! 🌸");
  }, []);

  const gridW = COLS * STEP - GAP;
  const gridH = ROWS * STEP - GAP;

  return (
    <div className="cw-wrapper">
      <div className="cw-banner"><p>Descubre la palabra correcta.</p></div>

      <div className="cw-grid-outer" style={{ position: "relative", width: gridW, height: gridH }}>
        {/* Cells */}
        <div className="cw-grid" style={{
          gridTemplateColumns: `repeat(${COLS}, ${CELL}px)`,
          gridTemplateRows:    `repeat(${ROWS}, ${CELL}px)`,
          gap: GAP,
        }}>
          {Array.from({ length: ROWS }, (_, r) =>
            Array.from({ length: COLS }, (_, c) => {
              const cell  = CELL_MAP[r][c];
              const key   = `${r}-${c}`;
              const state = cellState[r][c];
              if (!cell) return <div key={key} className="cw-cell empty" />;
              return (
                <div key={key} className={[
                  "cw-cell active",
                  cell.wordIds.length > 1 ? "intersection" : "",
                  state === "correct" ? "correct-cell" : "",
                  state === "wrong"   ? "wrong-cell"   : "",
                ].join(" ")}>
                  <input
                    ref={el => { inputRefs.current[key] = el; }}
                    type="text" maxLength={1}
                    value={inputs[r][c]}
                    onChange={e => handleInput(r, c, e.target.value)}
                    onKeyDown={e => handleKeyDown(e, r, c)}
                    readOnly={revealed && state === "correct"}
                    aria-label={`Celda ${r},${c}`}
                  />
                </div>
              );
            })
          )}
        </div>

        {/* Number badges outside cells */}
        {NUMBER_LABELS.map(({ num, dir, labelRow, labelCol }) => {
          const top  = labelRow * STEP + (dir === "V" ? 0 : STEP / 2 - 13);
          const left = labelCol * STEP + (dir === "H" ? 0 : STEP / 2 - 13);
          return (
            <div key={num} className="cw-num-badge" style={{ top, left }}>
              {dir === "V"
                ? <><span className="cw-arrow cw-arrow-v">▼</span><span className="cw-num-circle">{num}</span></>
                : <><span className="cw-arrow cw-arrow-h">▶</span><span className="cw-num-circle">{num}</span></>
              }
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div className="cw-actions">
        {!allSolved && <button className="cw-btn-check" onClick={checkAnswers}>Verificar respuestas ✓</button>}
        {feedback && <p className={`cw-feedback ${feedback.includes("no son") ? "error" : ""}`}>{feedback}</p>}
        {!revealed && <button className="cw-btn-reveal" onClick={revealAll}>Ver solución</button>}
      </div>

      {/* Clues */}
      <div className="cw-clues">
        <p className="cw-clues-title">Pistas</p>
        {CLUES.map(clue => (
          <div key={clue.num} className={`cw-clue ${solvedWords.has(clue.wordId) ? "solved-clue" : ""}`}>
            <span className="cw-clue-num">{clue.num}</span>
            <span>{clue.text}</span>
          </div>
        ))}
      </div>

      {/* Nav */}
      <div className="cw-nav">
        {onBack && <button className="cw-btn-back" onClick={onBack}>← Volver</button>}
        {allSolved && <button className="cw-btn-next" onClick={onNext}>Continuar →</button>}
      </div>
    </div>
  );
}
