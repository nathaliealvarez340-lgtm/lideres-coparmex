"use client";

import { useEffect, useState } from "react";
import { ClipboardList, Handshake, Megaphone, Route } from "lucide-react";

type Coordination = {
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
    <div className="coordination-carousel" aria-label="Coordinaciones">
      <button
        aria-expanded={isExpanded}
        className={`coordination-feature-card ${isExpanded ? "is-expanded" : ""}`}
        key={active.name}
        onClick={() => setIsExpanded((current) => !current)}
        type="button"
      >
        <div className="coordination-feature-topline">
          <span className="coordination-number">
            {String(activeIndex + 1).padStart(2, "0")}
          </span>
          <span className="coordination-icon" aria-hidden="true">
            <Icon index={activeIndex} />
          </span>
        </div>
        <h3>{active.name}</h3>
        <div className="coordination-description" aria-hidden={!isExpanded}>
          <p>{active.description}</p>
        </div>
      </button>

      <div className="coordination-controls">
        <button aria-label="Coordinación anterior" onClick={goToPrevious} type="button">
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
        <button aria-label="Siguiente coordinación" onClick={goToNext} type="button">
          ›
        </button>
      </div>
    </div>
  );
}

function Icon({ index }: { index: number }) {
  const icons = [
    <Megaphone key="marketing" size={34} strokeWidth={1.7} />,
    <Handshake key="sponsor" size={34} strokeWidth={1.7} />,
    <ClipboardList key="admin" size={34} strokeWidth={1.7} />,
    <Route key="logistics" size={34} strokeWidth={1.7} />,
  ];

  return icons[index];
}
