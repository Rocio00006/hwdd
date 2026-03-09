import { useState } from "react";
import "./styles/global.css";
import Intro from "./components/Intro";
import Intro2 from "./components/Intro2";
import FlowerBouquet from "./components/FlowerBouquet";
import PhotoCollage from "./components/PhotoCollage";
import Questions     from "./components/Questions";
import Letter from "./components/Letter"
import Crossword from "./components/Crossword";
import PhotoCollage2 from "./components/PhotoCollage2";
import Closing from "./components/Closing";

// scrollable: true → el shell crece con el contenido (no centra verticalmente)
const SCENES = [
  { id: "intro",        Component: Intro,         scrollable: false },
  { id: "intro2",       Component: Intro2,        scrollable: false },
  { id: "flowerBouquet",Component: FlowerBouquet, scrollable: false },
  { id: "photoCollage", Component: PhotoCollage,  scrollable: true  },
  { id: "questions",   Component: Questions,     scrollable: false },
  { id: "letter",      Component: Letter,        scrollable: false },
  { id: "crossword",   Component: Crossword,     scrollable: true  },
  { id: "photoCollage2",Component: PhotoCollage2,scrollable: true  },
  { id: "closing",     Component: Closing,       scrollable: false },
];

export default function App() {
  const [sceneIndex, setSceneIndex] = useState(0);

  const goNext  = () => setSceneIndex((i) => Math.min(i + 1, SCENES.length - 1));
  const goBack  = () => setSceneIndex((i) => Math.max(i - 1, 0));
  const restart = () => setSceneIndex(0);

  const { Component, scrollable } = SCENES[sceneIndex];

  return (
    <div className={`scene-shell${scrollable ? " scrollable" : ""}`}>
      <Component
        onNext={goNext}
        onBack={sceneIndex > 0 ? goBack : undefined}
        onRestart={restart}
        isFirst={sceneIndex === 0}
        isLast={sceneIndex === SCENES.length - 1}
      />
    </div>
  );
}
