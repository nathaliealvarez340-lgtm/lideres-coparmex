"use client";

import { useState } from "react";
import { ApplicationForm, type ProfileTestResult } from "./application-form";

type ProfileType = "Estratégico" | "Creativo" | "Conector" | "Ejecutor";

type ProfileOption = {
  label: "A" | "B" | "C" | "D";
  text: string;
  profile: ProfileType;
};

type ActiveProfileQuestion = {
  id: string;
  status: "active";
  question: string;
  options: ProfileOption[];
};

type ReservedProfileQuestion = {
  id: "q6" | "q7";
  status: "reserved";
};

type ProfileQuestionSlot = ActiveProfileQuestion | ReservedProfileQuestion;

const profileQuestionSlots: ProfileQuestionSlot[] = [
  {
    id: "q1",
    status: "active",
    question: "Cuando trabajas en equipo, normalmente tú…",
    options: [
      {
        label: "A",
        text: "Organizas tareas y aseguras que todo avance correctamente.",
        profile: "Estratégico",
      },
      {
        label: "B",
        text: "Generas ideas y propones nuevas formas de hacer las cosas.",
        profile: "Creativo",
      },
      {
        label: "C",
        text: "Conectas y mantienes buena comunicación entre las personas.",
        profile: "Conector",
      },
      {
        label: "D",
        text: "Tomas iniciativa rápidamente cuando surge un problema.",
        profile: "Ejecutor",
      },
    ],
  },
  {
    id: "q2",
    status: "active",
    question: "En un evento importante, ¿qué rol disfrutas más?",
    options: [
      {
        label: "A",
        text: "Coordinar que todo funcione correctamente detrás de escena.",
        profile: "Estratégico",
      },
      {
        label: "B",
        text: "Hablar con personas, generar relaciones y representar al equipo.",
        profile: "Creativo",
      },
      {
        label: "C",
        text: "Diseñar experiencias y desarrollar estrategias para el evento.",
        profile: "Conector",
      },
      {
        label: "D",
        text: "Resolver imprevistos y tomar decisiones bajo presión.",
        profile: "Ejecutor",
      },
    ],
  },
  {
    id: "q3",
    status: "active",
    question: "Cuando algo no sale como esperabas, normalmente…",
    options: [
      {
        label: "A",
        text: "Analizas qué falló y lo compartes con el equipo.",
        profile: "Estratégico",
      },
      {
        label: "B",
        text: "Buscas una solución rápida y sigues avanzando.",
        profile: "Creativo",
      },
      {
        label: "C",
        text: "Intentas mantener al equipo motivado y unido.",
        profile: "Conector",
      },
      {
        label: "D",
        text: "Propones al equipo una manera de hacerlo mejor.",
        profile: "Ejecutor",
      },
    ],
  },
  {
    id: "q4",
    status: "active",
    question: "¿Qué consideras más importante dentro de una organización?",
    options: [
      {
        label: "A",
        text: "Las relaciones de la organización y trabajo en equipo.",
        profile: "Estratégico",
      },
      {
        label: "B",
        text: "La innovación y planteamiento de estrategias.",
        profile: "Creativo",
      },
      {
        label: "C",
        text: "La estructura, trabajo y organización de actividades.",
        profile: "Conector",
      },
      {
        label: "D",
        text: "La capacidad de ejecutar y generar resultados.",
        profile: "Ejecutor",
      },
    ],
  },
  {
    id: "q5",
    status: "active",
    question: "Si tuvieras que describir tu forma de trabajar, elegirías:",
    options: [
      {
        label: "A",
        text: "Estratégica y analítica.",
        profile: "Estratégico",
      },
      {
        label: "B",
        text: "Creativa y adaptable.",
        profile: "Creativo",
      },
      {
        label: "C",
        text: "Colaborativa y comunicativa.",
        profile: "Conector",
      },
      {
        label: "D",
        text: "Práctica y orientada a resultados.",
        profile: "Ejecutor",
      },
    ],
  },
  { id: "q6", status: "reserved" },
  { id: "q7", status: "reserved" },
];

const recommendedRoles: Record<ProfileType, string[]> = {
  Estratégico: ["Dirección Ejecutiva", "Planeación", "Estrategia"],
  Creativo: ["Marketing", "Diseño", "Comunicación"],
  Conector: ["Vinculación", "Relaciones", "Comunidad"],
  Ejecutor: ["Logística", "Operación", "Producción"],
};

const profileOrder: ProfileType[] = [
  "Estratégico",
  "Creativo",
  "Conector",
  "Ejecutor",
];

function isActiveQuestion(
  question: ProfileQuestionSlot,
): question is ActiveProfileQuestion {
  return question.status === "active";
}

const activeQuestions = profileQuestionSlots.filter(isActiveQuestion);

type ProfileAnswer = ProfileTestResult["answers"][number];

export function ProfileTestGate({
  coordinations,
}: {
  coordinations: string[];
}) {
  const [answers, setAnswers] = useState<ProfileAnswer[]>([]);
  const [showForm, setShowForm] = useState(false);
  const currentQuestion = activeQuestions[answers.length];
  const result = answers.length === activeQuestions.length
    ? getProfileResult(answers)
    : null;
  const progress = result
    ? 100
    : Math.round((answers.length / activeQuestions.length) * 100);

  if (!currentQuestion && !result) {
    return null;
  }

  if (showForm && result) {
    return (
      <div className="profile-test-flow">
        <div className="profile-test-summary">
          <span>Perfil detectado</span>
          <strong>{result.profile}</strong>
          <p>{result.recommendedRoles.join(" · ")}</p>
        </div>
        <ApplicationForm
          coordinations={coordinations}
          profileTestResult={result}
        />
      </div>
    );
  }

  return (
    <section className="profile-test-card" aria-label="Test rápido de perfil">
      <div className="profile-test-header">
        <p className="section-kicker">Evaluación rápida</p>
        <span>
          {result
            ? "Resultado listo"
            : `${answers.length + 1} / ${activeQuestions.length}`}
        </span>
      </div>
      <div className="profile-test-progress" aria-hidden="true">
        <i style={{ width: `${progress}%` }} />
      </div>

      {result ? (
        <div className="profile-test-result">
          <p>Tu perfil predominante es</p>
          <h3>{result.profile}</h3>
          <span>Cargos recomendados</span>
          <div className="profile-role-list">
            {result.recommendedRoles.map((role) => (
              <strong key={role}>{role}</strong>
            ))}
          </div>
          <button
            className="premium-button"
            onClick={() => setShowForm(true)}
            type="button"
          >
            Continuar postulación
          </button>
        </div>
      ) : (
        <div className="profile-test-question" key={currentQuestion.id}>
          <h3>{currentQuestion.question}</h3>
          <div className="profile-test-options">
            {currentQuestion.options.map((option) => (
              <button
                key={option.label}
                onClick={() =>
                  setAnswers((current) => [
                    ...current,
                    {
                      answer: option.text,
                      option: option.label,
                      profile: option.profile,
                      question: currentQuestion.question,
                      questionId: currentQuestion.id,
                    },
                  ])
                }
                type="button"
              >
                <span>{option.label}</span>
                {option.text}
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function getProfileResult(answers: ProfileAnswer[]): ProfileTestResult {
  const scores = profileOrder.reduce(
    (scoreMap, profile) => ({ ...scoreMap, [profile]: 0 }),
    {} as Record<ProfileType, number>,
  );

  answers.forEach((answer) => {
    scores[answer.profile] += 1;
  });

  const profile = profileOrder.reduce((currentTop, profile) =>
    scores[profile] > scores[currentTop] ? profile : currentTop,
  );

  return {
    answers,
    profile,
    recommendedRoles: recommendedRoles[profile],
  };
}
