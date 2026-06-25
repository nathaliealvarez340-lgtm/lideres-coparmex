"use client";

import { useEffect, useState } from "react";

type Coordination = {
  emoji: string;
  name: string;
  description: string;
  benefits: string[];
};

type CoordinationCarouselProps = {
  coordinations: Coordination[];
};

export function CoordinationCarousel({
  coordinations,
}: CoordinationCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCardHovered, setIsCardHovered] = useState(false);
  const active = coordinations[activeIndex];
  const activeNumber = String(activeIndex + 1).padStart(2, "0");

  useEffect(() => {
    if (isExpanded || isCardHovered) {
      return;
    }

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % coordinations.length);
      setIsExpanded(false);
    }, 6500);

    return () => window.clearInterval(interval);
  }, [coordinations.length, isCardHovered, isExpanded]);

  function goToPrevious() {
    setActiveIndex(
      (current) => (current - 1 + coordinations.length) % coordinations.length,
    );
    setIsExpanded(false);
    setIsCardHovered(false);
  }

  function goToNext() {
    setActiveIndex((current) => (current + 1) % coordinations.length);
    setIsExpanded(false);
    setIsCardHovered(false);
  }

  function goToIndex(index: number) {
    setActiveIndex(index);
    setIsExpanded(false);
    setIsCardHovered(false);
  }

  return (
    <div className="carousel-wrapper" aria-label="Áreas de trabajo">
      <button
        aria-expanded={isExpanded}
        className={`carousel-card coordination-feature-card ${
          isExpanded ? "is-expanded" : ""
        }`}
        key={active.name}
        onClick={() =>
          setIsExpanded((current) => {
            const next = !current;

            if (!next) {
              setIsCardHovered(false);
            }

            return next;
          })
        }
        onPointerEnter={() => setIsCardHovered(true)}
        onPointerLeave={() => setIsCardHovered(false)}
        type="button"
      >
        <span className="coordination-ghost-number" aria-hidden="true">
          {activeNumber}
        </span>

        <h3>
          <span aria-hidden="true">{active.emoji}</span>{" "}
          {active.name.toUpperCase()}
        </h3>

        <div className="coordination-description" aria-hidden={!isExpanded}>
          <div className="coordination-description-inner">
            <p>{active.description}</p>
            <span>Beneficios e importancia</span>
            <ul>
              {active.benefits.map((benefit) => (
                <li key={benefit}>{benefit}</li>
              ))}
            </ul>
          </div>
        </div>

        <span className="coordination-more-indicator">
          {isExpanded ? "- ver menos" : "+ ver mas"}
        </span>
      </button>

      <div className="coordination-controls">
        <button
          aria-label="Área anterior"
          onClick={goToPrevious}
          type="button"
        >
          {"<"}
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
          aria-label="Siguiente área"
          onClick={goToNext}
          type="button"
        >
          {">"}
        </button>
      </div>
    </div>
  );
}
