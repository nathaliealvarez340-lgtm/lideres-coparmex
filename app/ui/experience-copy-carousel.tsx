"use client";

import { useEffect, useState } from "react";

const slides = [
  "Un espacio para estudiantes con iniciativa y algo que demostrar. En la Mesa Directiva trabajamos juntos con objetivos claros, roles definidos y proyectos reales. Si tienes una idea que quieres impulsar, un proyecto en mente o la determinación de construir algo antes de graduarte — aquí encontramos la red, los aliados y los espacios para hacerlo realidad. No venimos a observar: venimos a construir.",
  "El Capítulo Universitario de COPARMEX es una comunidad de estudiantes que busca desarrollar liderazgo, visión empresarial y capacidad de impacto a través de proyectos, eventos, alianzas y experiencias conectadas con el entorno profesional y empresarial real.",
];

export function ExperienceCopyCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [manualHoldUntil, setManualHoldUntil] = useState(0);

  useEffect(() => {
    if (manualHoldUntil) {
      const remainingHold = Math.max(manualHoldUntil - Date.now(), 0);
      const timeout = window.setTimeout(() => {
        setActiveIndex(0);
        setManualHoldUntil(0);
      }, remainingHold);

      return () => window.clearTimeout(timeout);
    }

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 5000);

    return () => window.clearInterval(interval);
  }, [manualHoldUntil]);

  function selectSlide(direction: "previous" | "next") {
    setActiveIndex((current) =>
      direction === "next"
        ? (current + 1) % slides.length
        : (current - 1 + slides.length) % slides.length,
    );
    setManualHoldUntil(Date.now() + 15000);
  }

  return (
    <div className="experience-copy-carousel">
      <div className="experience-copy-viewport">
        <p className="experience-copy-slide" key={activeIndex}>
          {slides[activeIndex]}
        </p>
      </div>
      <div className="experience-copy-controls">
        <button
          aria-label="Texto anterior"
          type="button"
          onClick={() => selectSlide("previous")}
        >
          {"<"}
        </button>
        <button
          aria-label="Texto siguiente"
          type="button"
          onClick={() => selectSlide("next")}
        >
          {">"}
        </button>
      </div>
    </div>
  );
}
