"use client";

import { FormEvent, KeyboardEvent, ReactNode, useRef, useState } from "react";

type ApplicationFormProps = {
  coordinations: string[];
};

type FormStatus = "idle" | "sending" | "success" | "error";
type AuthenticityStatus =
  | "Respuesta auténtica probable"
  | "Revisión recomendada"
  | "Riesgo alto de respuesta generada o pegada";

type WritingSignals = {
  backspaces: number;
  firstKeyAt: number | null;
  keyPresses: number;
  lastKeyAt: number | null;
  longPauses: number;
  pasteAttempts: number;
};

const acceptedTypes = ["application/pdf", "image/png"];
const minimumWords = 120;
const pasteWarning =
  "Para asegurar una respuesta auténtica, este campo debe escribirse manualmente.";
const successMessage =
  "Gracias por dar el primer paso para formar parte de la Mesa de Líderes COPARMEX.\n\nTu información será revisada por la mesa directiva. En caso de que tu perfil sea aprobado y avance a la siguiente fase, nos pondremos en contacto contigo por correo.\n\nMientras tanto, sigue preparándote: las oportunidades importantes también reconocen a quienes llegan con intención, criterio y compromiso.";

export function ApplicationForm({ coordinations }: ApplicationFormProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [message, setMessage] = useState("");
  const [fileName, setFileName] = useState("");
  const [authNotice, setAuthNotice] = useState("");
  const [signals, setSignals] = useState<WritingSignals>({
    backspaces: 0,
    firstKeyAt: null,
    keyPresses: 0,
    lastKeyAt: null,
    longPauses: 0,
    pasteAttempts: 0,
  });
  const [whyText, setWhyText] = useState("");

  const wordCount = countWords(whyText);
  const authenticity = analyzeAuthenticity(whyText, signals);

  function runCommand(command: string, value?: string) {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
    syncEditorText();
  }

  function syncEditorText() {
    setWhyText(editorRef.current?.innerText ?? "");
  }

  function registerPasteAttempt() {
    setSignals((current) => ({
      ...current,
      pasteAttempts: current.pasteAttempts + 1,
    }));
    setAuthNotice(pasteWarning);
  }

  function registerKeyPress(event: KeyboardEvent<HTMLDivElement>) {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "v") {
      event.preventDefault();
      registerPasteAttempt();
      return;
    }

    const isTypingKey = event.key.length === 1 || event.key === "Backspace";

    if (!isTypingKey) {
      return;
    }

    const now = performance.now();

    setSignals((current) => ({
      backspaces:
        current.backspaces + (event.key === "Backspace" ? 1 : 0),
      firstKeyAt: current.firstKeyAt ?? now,
      keyPresses: current.keyPresses + 1,
      lastKeyAt: now,
      longPauses:
        current.lastKeyAt && now - current.lastKeyAt > 5000
          ? current.longPauses + 1
          : current.longPauses,
      pasteAttempts: current.pasteAttempts,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setMessage("");

    const cleanWhy = normalizeText(whyText);
    const latestAuthenticity = analyzeAuthenticity(cleanWhy, signals);

    if (countWords(cleanWhy) < minimumWords) {
      setStatus("error");
      setMessage("Tu respuesta debe tener al menos 120 palabras reales.");
      return;
    }

    if (
      signals.pasteAttempts > 0 ||
      latestAuthenticity.isImpossibleFast ||
      latestAuthenticity.score >= 85
    ) {
      setStatus("error");
      setMessage(
        "Tu respuesta necesita ser escrita de forma más personal y auténtica antes de enviarse.",
      );
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);
    formData.set("why", cleanWhy);
    formData.set("authenticityResult", latestAuthenticity.status);
    formData.set("authenticityScore", String(latestAuthenticity.score));
    formData.set(
      "authenticityWritingTime",
      formatSeconds(latestAuthenticity.writingSeconds),
    );
    formData.set("authenticityPasteAttempts", String(signals.pasteAttempts));
    formData.set(
      "authenticityTypingSpeed",
      `${latestAuthenticity.wordsPerMinute} palabras/min aprox.`,
    );
    formData.set("authenticityWarning", latestAuthenticity.warning);
    const file = formData.get("cv");

    if (!(file instanceof File) || file.size === 0) {
      setStatus("error");
      setMessage("Sube tu CV en formato PDF o PNG.");
      return;
    }

    if (!acceptedTypes.includes(file.type)) {
      setStatus("error");
      setMessage("El CV debe ser PDF o PNG.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setStatus("error");
      setMessage("El archivo no puede pesar más de 5 MB.");
      return;
    }

    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        body: formData,
      });

      const payload = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(payload.message ?? "No pudimos enviar tu postulación.");
      }

      form.reset();
      if (editorRef.current) {
        editorRef.current.innerHTML = "";
      }
      setWhyText("");
      setAuthNotice("");
      setSignals({
        backspaces: 0,
        firstKeyAt: null,
        keyPresses: 0,
        lastKeyAt: null,
        longPauses: 0,
        pasteAttempts: 0,
      });
      setFileName("");
      setStatus("success");
      setMessage(successMessage);
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "No pudimos enviar tu postulación. Inténtalo de nuevo.",
      );
    }
  }

  if (status === "success") {
    return (
      <div className="success-panel">
        <div className="success-check" aria-hidden="true">
          <span />
        </div>
        <div className="mx-auto mt-7 h-px w-28 bg-gradient-to-r from-transparent via-[#c8a45d] to-transparent" />
        <h3 className="mt-8 text-center text-3xl font-semibold text-[#fff8e8] sm:text-4xl">
          Postulación recibida
        </h3>
        <p className="mx-auto mt-5 max-w-2xl text-center text-lg leading-8 text-[#e8dfcf]/78">
          {message.split("\n\n").map((paragraph) => (
            <span className="mt-4 block first:mt-0" key={paragraph}>
              {paragraph}
            </span>
          ))}
        </p>
      </div>
    );
  }

  return (
    <form className="form-panel" onSubmit={handleSubmit}>
      <div className="mb-8 flex flex-col gap-3 border-b border-white/10 pb-7 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#c8a45d]">
            Expediente de candidatura
          </p>
          <h3 className="mt-3 text-3xl font-semibold tracking-normal text-[#fff8e8]">
            Datos de postulación
          </h3>
        </div>
        <p className="max-w-xs text-sm leading-6 text-[#e8dfcf]/62">
          Todos los campos son obligatorios. Adjunta tu CV en PDF o PNG.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Nombre completo" name="fullName" type="text" />
        <Field label="Correo" name="email" type="email" />
        <Field label="Teléfono" name="phone" type="tel" />
        <Field label="Carrera" name="career" type="text" />

        <label className="field-shell sm:col-span-2">
          <span>Coordinación operativa a la que deseas postularte</span>
          <select
            className="field-control"
            name="coordination"
            required
            defaultValue=""
          >
            <option value="" disabled>
              Selecciona una coordinación
            </option>
            {coordinations.map((coordination) => (
              <option key={coordination} value={coordination}>
                {coordination}
              </option>
            ))}
          </select>
        </label>

        <div className="field-shell sm:col-span-2">
          <span>¿Por qué deberíamos considerarte?</span>
          <div className="rich-editor-shell">
            <div className="editor-toolbar" aria-label="Herramientas del editor">
              <ToolbarButton label="Negrita" onClick={() => runCommand("bold")}>
                B
              </ToolbarButton>
              <ToolbarButton label="Cursiva" onClick={() => runCommand("italic")}>
                I
              </ToolbarButton>
              <ToolbarButton
                label="Subrayado"
                onClick={() => runCommand("underline")}
              >
                U
              </ToolbarButton>
              <ToolbarButton
                label="Alinear izquierda"
                onClick={() => runCommand("justifyLeft")}
              >
                L
              </ToolbarButton>
              <ToolbarButton
                label="Alinear centro"
                onClick={() => runCommand("justifyCenter")}
              >
                C
              </ToolbarButton>
              <ToolbarButton
                label="Alinear derecha"
                onClick={() => runCommand("justifyRight")}
              >
                R
              </ToolbarButton>
              <ToolbarButton
                label="Lista con viñetas"
                onClick={() => runCommand("insertUnorderedList")}
              >
                •
              </ToolbarButton>
              <ToolbarButton
                label="Lista numerada"
                onClick={() => runCommand("insertOrderedList")}
              >
                1.
              </ToolbarButton>
              <span className="toolbar-select-wrap" data-tooltip="Tamaño de texto">
                <select
                  aria-label="Selector de tamaño"
                  className="toolbar-select"
                  defaultValue="3"
                  onChange={(event) =>
                    runCommand("fontSize", event.target.value)
                  }
                >
                  <option value="2">Pequeño</option>
                  <option value="3">Normal</option>
                  <option value="5">Grande</option>
                </select>
              </span>
              <span className="toolbar-select-wrap" data-tooltip="Tipo de letra">
                <select
                  aria-label="Selector de fuente"
                  className="toolbar-select"
                  defaultValue="Inter"
                  onChange={(event) =>
                    runCommand("fontName", event.target.value)
                  }
                >
                  <option value="Inter">Inter</option>
                  <option value="Sora">Sora</option>
                  <option value="Manrope">Manrope</option>
                </select>
              </span>
            </div>
            <div
              aria-label="Respuesta de postulación"
              className="rich-editor"
              contentEditable
              data-placeholder="Habla de tu criterio, experiencia, motivación y lo que puedes aportar a la mesa."
              onContextMenu={(event) => {
                event.preventDefault();
                setAuthNotice(pasteWarning);
              }}
              onDrop={(event) => {
                event.preventDefault();
                registerPasteAttempt();
              }}
              onInput={syncEditorText}
              onKeyDown={registerKeyPress}
              onPaste={(event) => {
                event.preventDefault();
                registerPasteAttempt();
              }}
              ref={editorRef}
              role="textbox"
              suppressContentEditableWarning
            />
          </div>
          <p className="text-sm text-[#e8dfcf]/62">
            {wordCount} / {minimumWords} palabras mínimas
          </p>
          {authNotice ? (
            <p className="authenticity-notice">{authNotice}</p>
          ) : null}
          {wordCount > 0 ? (
            <AuthenticityPanel
              authenticity={authenticity}
              isReady={wordCount >= minimumWords}
            />
          ) : null}
        </div>

        <label className="dropzone sm:col-span-2">
          <input
            className="sr-only"
            name="cv"
            type="file"
            accept="application/pdf,image/png,.pdf,.png"
            required
            onChange={(event) =>
              setFileName(event.currentTarget.files?.[0]?.name ?? "")
            }
          />
          <span className="dropzone-icon" aria-hidden="true" />
          <span className="min-w-0 flex-1 text-sm font-semibold text-[#fff8e8] sm:text-base">
            {fileName || "Sube tu CV PDF o PNG"}
          </span>
          <span className="hidden text-sm leading-6 text-[#e8dfcf]/62 sm:block">
            Máximo 5 MB
          </span>
        </label>
      </div>

      <button
        className="premium-button mt-8 w-full"
        disabled={status === "sending"}
        type="submit"
      >
        {status === "sending" ? "Enviando..." : "Enviar postulación"}
      </button>

      {message ? (
        <p
          className="mt-5 rounded-2xl border border-[#da3a3f]/35 bg-[#7a1119]/25 px-5 py-4 text-sm text-[#ffd7d7]"
          role="status"
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}

function ToolbarButton({
  children,
  label,
  onClick,
}: {
  children: ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      aria-label={label}
      className="toolbar-button"
      data-tooltip={label}
      onMouseDown={(event) => {
        event.preventDefault();
        onClick();
      }}
      type="button"
    >
      {children}
    </button>
  );
}

function Field({
  label,
  name,
  type,
}: {
  label: string;
  name: string;
  type: string;
}) {
  return (
    <label className="field-shell">
      <span>{label}</span>
      <input className="field-control" name={name} required type={type} />
    </label>
  );
}

function AuthenticityPanel({
  authenticity,
  isReady,
}: {
  authenticity: ReturnType<typeof analyzeAuthenticity>;
  isReady: boolean;
}) {
  return (
    <div
      className={`authenticity-panel ${authenticity.tone}`}
      aria-live="polite"
    >
      <div className="authenticity-row">
        <span className="authenticity-badge">
          {isReady ? authenticity.status : "Filtro de autenticidad en espera"}
        </span>
        <span className="authenticity-score">
          {isReady ? `${authenticity.score}/100 riesgo` : "120 palabras mín."}
        </span>
      </div>
      {isReady ? (
        <p className="authenticity-detail">
          {authenticity.summary}
        </p>
      ) : (
        <p className="authenticity-detail">
          El filtro se activará al llegar al mínimo de palabras.
        </p>
      )}
      <p className="authenticity-disclaimer">
        Este filtro no sustituye la revisión humana. Ayuda a identificar
        respuestas que requieren validación adicional.
      </p>
    </div>
  );
}

function normalizeText(text: string) {
  return text.replace(/\s+/g, " ").trim();
}

function countWords(text: string) {
  return (
    normalizeText(text).match(/[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu)
      ?.length ?? 0
  );
}

function analyzeAuthenticity(text: string, signals: WritingSignals) {
  const cleanText = normalizeText(text);
  const words = cleanText
    .toLowerCase()
    .match(/[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu) ?? [];
  const wordCount = words.length;
  const writingSeconds =
    signals.firstKeyAt && signals.lastKeyAt
      ? Math.max((signals.lastKeyAt - signals.firstKeyAt) / 1000, 1)
      : 0;
  const wordsPerMinute =
    writingSeconds > 0 ? Math.round((wordCount / writingSeconds) * 60) : 0;
  const repeatedWordRatio = calculateRepeatedWordRatio(words);
  const firstPersonCount = countMatches(cleanText, [
    "yo",
    "mi",
    "mis",
    "me",
    "conmigo",
    "aprendí",
    "trabajé",
    "participé",
    "organicé",
    "lideré",
  ]);
  const genericCount = countMatches(cleanText, [
    "soy una persona responsable",
    "trabajo en equipo",
    "me considero",
    "aportaría mucho",
    "gran oportunidad",
    "crecimiento personal",
    "desarrollo profesional",
    "habilidades de liderazgo",
    "compromiso y dedicación",
    "pasión por aprender",
  ]);
  const concreteSignals = countMatches(cleanText, [
    "cuando",
    "proyecto",
    "evento",
    "equipo",
    "semestre",
    "clase",
    "universidad",
    "campaña",
    "cliente",
    "resultado",
    "aprendí",
    "logré",
  ]);
  const hasNumbers = /\d/.test(cleanText);
  const correctionsRatio =
    signals.keyPresses > 0 ? signals.backspaces / signals.keyPresses : 0;
  const noCorrections = wordCount >= minimumWords && correctionsRatio < 0.01;
  const fewPauses = wordCount >= minimumWords && signals.longPauses === 0;
  const isImpossibleFast = wordCount >= minimumWords && writingSeconds < 45;
  const veryFast = wordCount >= minimumWords && wordsPerMinute > 95;
  const uniformText = wordCount >= minimumWords && repeatedWordRatio > 0.34;
  const lacksPersonalVoice = wordCount >= minimumWords && firstPersonCount < 3;
  const lacksConcreteExamples =
    wordCount >= minimumWords && concreteSignals < 4 && !hasNumbers;
  const corporateTone = wordCount >= minimumWords && genericCount >= 3;

  let score = 0;
  const reasons: string[] = [];

  addRisk(signals.pasteAttempts > 0, 45, "hubo intento de pegado");
  addRisk(isImpossibleFast, 40, "tiempo de escritura imposiblemente bajo");
  addRisk(veryFast, 22, "velocidad de escritura muy alta");
  addRisk(fewPauses, 12, "casi no hubo pausas largas");
  addRisk(noCorrections, 12, "casi no hubo correcciones");
  addRisk(uniformText, 14, "texto con patrones repetitivos");
  addRisk(lacksPersonalVoice, 12, "poca presencia de primera persona");
  addRisk(lacksConcreteExamples, 14, "faltan ejemplos concretos");
  addRisk(corporateTone, 12, "tono genérico o corporativo");

  score = Math.min(score, 100);

  const status: AuthenticityStatus =
    score >= 70
      ? "Riesgo alto de respuesta generada o pegada"
      : score >= 38
        ? "Revisión recomendada"
        : "Respuesta auténtica probable";
  const tone = score >= 70 ? "risk" : score >= 38 ? "review" : "probable";
  const summary =
    reasons.length > 0
      ? `Señales detectadas: ${reasons.slice(0, 3).join(", ")}.`
      : "No se detectan señales fuertes de riesgo; la respuesta mantiene un ritmo y contenido razonables.";

  return {
    isImpossibleFast,
    score,
    status,
    summary,
    tone,
    warning:
      "Este resultado es orientativo y debe revisarse manualmente.",
    wordsPerMinute,
    writingSeconds,
  };

  function addRisk(condition: boolean, points: number, reason: string) {
    if (!condition) {
      return;
    }

    score += points;
    reasons.push(reason);
  }
}

function countMatches(text: string, patterns: string[]) {
  const normalized = text.toLowerCase();

  return patterns.reduce(
    (total, pattern) => total + (normalized.includes(pattern) ? 1 : 0),
    0,
  );
}

function calculateRepeatedWordRatio(words: string[]) {
  const relevantWords = words.filter((word) => word.length > 4);

  if (relevantWords.length === 0) {
    return 0;
  }

  return 1 - new Set(relevantWords).size / relevantWords.length;
}

function formatSeconds(seconds: number) {
  return `${Math.round(seconds)} segundos`;
}
