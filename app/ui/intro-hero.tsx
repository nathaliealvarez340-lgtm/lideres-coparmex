"use client";

import { useEffect, useState } from "react";

export function IntroHero() {
  const [count, setCount] = useState(5);
  const isUnlocked = count === 0;

  useEffect(() => {
    if (count === 0) {
      return;
    }

    const timer = window.setTimeout(() => {
      setCount((current) => Math.max(current - 1, 0));
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [count]);

  useEffect(() => {
    if (isUnlocked) {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
      return;
    }

    const preventScroll = (event: Event) => event.preventDefault();
    const preventKeyboardScroll = (event: KeyboardEvent) => {
      const blockedKeys = [
        " ",
        "ArrowDown",
        "ArrowUp",
        "End",
        "Home",
        "PageDown",
        "PageUp",
      ];

      if (blockedKeys.includes(event.key)) {
        event.preventDefault();
      }
    };

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";
    window.scrollTo(0, 0);
    window.addEventListener("wheel", preventScroll, { passive: false });
    window.addEventListener("touchmove", preventScroll, { passive: false });
    window.addEventListener("keydown", preventKeyboardScroll);

    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
      window.removeEventListener("wheel", preventScroll);
      window.removeEventListener("touchmove", preventScroll);
      window.removeEventListener("keydown", preventKeyboardScroll);
    };
  }, [isUnlocked]);

  function scrollToApplication() {
    document
      .getElementById("postulacion")
      ?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section className="relative flex min-h-screen items-center px-6 py-24 sm:px-10 lg:px-14">
      <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[minmax(0,1fr)_260px] lg:items-center xl:grid-cols-[minmax(0,1fr)_310px]">
        <div className="max-w-5xl text-center lg:text-left">
          <div className="mb-8 flex items-center justify-center gap-4 lg:justify-start">
            <span className="h-px w-14 bg-gradient-to-r from-[#5de0e6] to-transparent" />
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#d8bd7a]">
              Convocatoria
            </p>
          </div>

          <h1 className="max-w-5xl text-5xl font-semibold leading-[0.98] tracking-normal text-[#fff8e8] sm:text-7xl lg:text-8xl">
            Forma parte de la Mesa de Líderes COPARMEX
          </h1>

          <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-[#e8dfcf]/85 sm:text-2xl sm:leading-10 lg:mx-0">
            Entra a una comunidad selectiva donde el liderazgo joven se prueba
            en proyectos reales, alianzas estratégicas y decisiones que abren
            camino dentro del ecosistema empresarial.
          </p>

          {isUnlocked ? (
            <div className="intro-unlock mt-11">
              <button
                className="premium-button"
                onClick={scrollToApplication}
                type="button"
              >
                Postúlate ahora
              </button>
              <p className="mt-5 text-xs font-medium uppercase tracking-[0.24em] text-[#e8dfcf]/58">
                Desliza para continuar
              </p>
            </div>
          ) : null}
        </div>

        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#d8bd7a]/90">
            Acceso en
          </p>
          <div className="mt-4 min-h-[5.2rem] overflow-hidden sm:min-h-[6.4rem] lg:min-h-[7rem]">
            <span
              className="countdown-number block font-mono text-7xl font-semibold leading-none text-[#fff8e8] sm:text-8xl lg:text-7xl xl:text-8xl"
              key={count}
            >
              {String(count).padStart(2, "0")}
            </span>
          </div>
          <p className="mt-2 text-xs font-medium uppercase tracking-[0.28em] text-[#e8dfcf]/62">
            segundos
          </p>
        </div>
      </div>
    </section>
  );
}


