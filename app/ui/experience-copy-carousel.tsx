"use client";

import { useEffect, useState } from "react";

const slides = [
  "La Mesa de Líderes COPARMEX reúne a estudiantes con iniciativa, visión y disciplina para transformar ideas en proyectos con estándar ejecutivo. No es un club de asistencia: es un punto de encuentro para quienes quieren aprender a operar, comunicar, negociar y representar con criterio.",
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
      <p className="experience-copy-slide" key={activeIndex}>
        {slides[activeIndex]}
      </p>
      <div className="experience-copy-controls">
        <button type="button" onClick={() => selectSlide("previous")}>
          Anterior
        </button>
        <button type="button" onClick={() => selectSlide("next")}>
          Siguiente
        </button>
      </div>
    </div>
  );
}
