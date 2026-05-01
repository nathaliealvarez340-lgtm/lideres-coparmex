"use client";

import { useEffect, useState } from "react";

type Coordination = {
  emoji: string;
  name: string;
  description: string;
};

type CoordinationCarouselProps = {
  coordinations: Coordination[];
};

export function CoordinationCarousel({
  coordinations,
}: CoordinationCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const active = coordinations[activeIndex];
  const activeNumber = String(activeIndex + 1).padStart(2, "0");

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % coordinations.length);
      setIsExpanded(false);
    }, 4000);

    return () => window.clearInterval(interval);
  }, [coordinations.length]);

  function goToPrevious() {
    setActiveIndex(
      (current) => (current - 1 + coordinations.length) % coordinations.length,
    );
    setIsExpanded(false);
  }

  function goToNext() {
    setActiveIndex((current) => (current + 1) % coordinations.length);
    setIsExpanded(false);
  }

  function goToIndex(index: number) {
    setActiveIndex(index);
    setIsExpanded(false);
  }

  return (
    <div className="carousel-wrapper" aria-label="Coordinaciones">
      <button
        aria-expanded={isExpanded}
        className={`carousel-card coordination-feature-card ${
          isExpanded ? "is-expanded" : ""
        }`}
        key={active.name}
        onClick={() => setIsExpanded((current) => !current)}
        type="button"
      >
        <span className="coordination-ghost-number" aria-hidden="true">
          {activeNumber}
        </span>

        <div className="coordination-feature-topline">
          <span className="coordination-number" aria-hidden="true">
            {activeNumber}
          </span>
        </div>

        <h3>
          <span aria-hidden="true">{active.emoji}</span>{" "}
          {active.name.toUpperCase()}
        </h3>

        <div className="coordination-description" aria-hidden={!isExpanded}>
          <p>{active.description}</p>
        </div>
      </button>

      <div className="coordination-controls">
        <button
          aria-label="Coordinación anterior"
          onClick={goToPrevious}
          type="button"
        >
          ‹
        </button>

        <div className="coordination-dots" aria-label="Indicadores">
          {coordinations.map((coordination, index) => (
            <button
              aria-label={`Mostrar ${coordination.name}`}
              aria-current={index === activeIndex}
              className={index === activeIndex ? "is-active" : ""}
              key={coordination.name}
              onClick={() => goToIndex(index)}
              type="button"
            />
          ))}
        </div>

        <button
          aria-label="Siguiente coordinación"
          onClick={goToNext}
          type="button"
        >
          ›
        </button>
      </div>
    </div>
  );
}
