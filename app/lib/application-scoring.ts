export type CandidateScores = {
  classification: string;
  scoreClarity: number;
  scoreCommitment: number;
  scoreCommunication: number;
  scoreEvidence: number;
  scoreFit: number;
  scoreInitiative: number;
  scoreTotal: number;
};

const coordinationSignals: Record<string, string[]> = {
  Administrativa: ["organice", "organizo", "documentacion", "presupuesto", "registro", "proceso", "orden"],
  "Comunicacion y Marketing": ["contenido", "marca", "campana", "redes", "comunicacion", "marketing", "audiencia"],
  Logistica: ["evento", "operacion", "agenda", "proveedor", "sede", "tiempos", "recursos"],
  Patrocinios: ["aliado", "patrocinio", "venta", "cliente", "propuesta", "negociacion", "empresa"],
};

export function scoreCandidate(input: {
  coordination: string;
  currentProjectAnswer: string;
  progressAnswer: string;
  projectLink?: string;
}): CandidateScores {
  const projectText = normalize(input.currentProjectAnswer);
  const progressText = normalize(input.progressAnswer);
  const allText = `${projectText} ${progressText}`;
  const projectWords = countWords(projectText);
  const progressWords = countWords(progressText);

  const scoreClarity = clampScore(
    6 +
      scoreSignals(projectText, ["proyecto", "iniciativa", "emprendimiento", "objetivo", "problema", "solucion"], 2) +
      (projectWords >= 100 ? 6 : projectWords >= 70 ? 4 : 2),
    20,
  );
  const scoreInitiative = clampScore(
    5 +
      scoreSignals(allText, ["desarrolle", "cree", "inicie", "organice", "publique", "lance", "coordine"], 2.5) +
      (input.projectLink ? 4 : 0),
    20,
  );
  const scoreEvidence = clampScore(
    4 +
      scoreSignals(progressText, ["metricas", "clientes", "comunidad", "prototipo", "evento", "validacion", "resultados", "aprendizajes"], 2) +
      (/\d/.test(progressText) ? 4 : 0) +
      (progressWords >= 60 ? 4 : 2),
    20,
  );
  const scoreCommunication = clampScore(
    5 +
      (projectWords >= 100 ? 4 : 2) +
      (progressWords >= 40 ? 3 : 1) +
      (averageSentenceLength(allText) >= 10 ? 3 : 1),
    15,
  );
  const normalizedCoordination = normalize(input.coordination);
  const fitSignals =
    coordinationSignals[Object.keys(coordinationSignals).find((key) => normalize(key) === normalizedCoordination) ?? ""] ?? [];
  const scoreFit = clampScore(5 + scoreSignals(allText, fitSignals, 2.5), 15);
  const scoreCommitment = clampScore(
    3 + scoreSignals(allText, ["responsabilidad", "compromiso", "criterio", "constancia", "equipo", "seguimiento"], 1.5),
    10,
  );
  const scoreTotal =
    scoreClarity +
    scoreInitiative +
    scoreEvidence +
    scoreCommunication +
    scoreFit +
    scoreCommitment;

  return {
    classification: classify(scoreTotal),
    scoreClarity,
    scoreCommitment,
    scoreCommunication,
    scoreEvidence,
    scoreFit,
    scoreInitiative,
    scoreTotal,
  };
}

export function countWords(text: string) {
  return normalize(text).match(/[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu)?.length ?? 0;
}

function scoreSignals(text: string, signals: string[], points: number) {
  return signals.reduce(
    (score, signal) => score + (text.includes(normalize(signal)) ? points : 0),
    0,
  );
}

function averageSentenceLength(text: string) {
  const sentences = text.split(/[.!?]+/).filter(Boolean);

  if (sentences.length === 0) {
    return 0;
  }

  return countWords(text) / sentences.length;
}

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function clampScore(value: number, max: number) {
  return Math.max(0, Math.min(max, Math.round(value)));
}

function classify(score: number) {
  if (score >= 85) {
    return "Perfil prioritario";
  }

  if (score >= 70) {
    return "Buen perfil";
  }

  if (score >= 50) {
    return "Revisión manual";
  }

  return "Bajo ajuste";
}
