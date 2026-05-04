"use client";

import { FormEvent, KeyboardEvent, ReactNode, useRef, useState } from "react";

type ApplicationFormProps = {
  coordinations: string[];
};

type FormStatus = "idle" | "sending" | "success" | "error";

const acceptedTypes = ["application/pdf", "image/png"];
const acceptedExtensions = [".pdf", ".png"];
const maxFileSize = 4.4 * 1024 * 1024;
const minimumWords = 100;
const progressMinimumWords = 40;
const pasteWarning =
  "Para asegurar una respuesta auténtica, este campo debe escribirse manualmente.";
const successMessage =
  "Gracias por dar el primer paso para formar parte de la Mesa de Líderes COPARMEX.\n\nTu información será revisada por la mesa directiva. Este proceso prioriza perfiles con iniciativa real, dirección clara y evidencia de construcción.\n\nEn caso de que tu perfil avance a la siguiente fase, nos pondremos en contacto contigo por correo.\n\nMientras tanto, sigue construyendo. Eso también habla por ti.";

export function ApplicationForm({ coordinations }: ApplicationFormProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [message, setMessage] = useState("");
  const [fileName, setFileName] = useState("");
  const [pasteNotice, setPasteNotice] = useState("");
  const [progressText, setProgressText] = useState("");
  const [whyText, setWhyText] = useState("");

  const wordCount = countWords(whyText);
  const progressWordCount = countWords(progressText);

  function runCommand(command: string, value?: string) {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
    syncEditorText();
  }

  function syncEditorText() {
    setWhyText(editorRef.current?.innerText ?? "");
  }

  function registerPasteAttempt() {
    setPasteNotice(pasteWarning);
  }

  function blockPasteShortcut(event: KeyboardEvent<HTMLDivElement>) {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "v") {
      event.preventDefault();
      registerPasteAttempt();
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setMessage("");

    const cleanWhy = normalizeText(whyText);

    if (countWords(cleanWhy) < minimumWords) {
      setStatus("error");
      setMessage("Tu respuesta debe tener al menos 100 palabras mínimas.");
      return;
    }

    if (countWords(progressText) < progressMinimumWords) {
      setStatus("error");
      setMessage(
        "Tu respuesta sobre avances debe tener al menos 40 palabras mínimas.",
      );
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);
    formData.set("why", cleanWhy);
    formData.set("progress", normalizeText(progressText));
    const file = formData.get("cv");

    if (!(file instanceof File) || file.size === 0) {
      setStatus("error");
      setMessage("Sube tu CV en formato PDF o PNG.");
      return;
    }

    if (!isAllowedFile(file)) {
      setStatus("error");
      setMessage("El CV debe ser PDF o PNG.");
      return;
    }

    if (file.size > maxFileSize) {
      setStatus("error");
      setMessage("El archivo no puede pesar más de 4.4 MB.");
      return;
    }

    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        body: formData,
      });

      const contentType = response.headers.get("content-type") || "";
      const payload = contentType.includes("application/json")
        ? ((await response.json()) as { error?: string; message?: string })
        : { error: await response.text() };

      if (!response.ok) {
        throw new Error(
          payload.error ||
            payload.message ||
            "No pudimos enviar tu postulación. Inténtalo de nuevo.",
        );
      }

      form.reset();
      if (editorRef.current) {
        editorRef.current.innerHTML = "";
      }
      setWhyText("");
      setProgressText("");
      setPasteNotice("");
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
          Postulación recibida.
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
          <span>¿Qué estás construyendo actualmente?</span>
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
              data-placeholder="Describe un proyecto, emprendimiento, iniciativa o idea que ya estés desarrollando. Sé concreto."
              onContextMenu={(event) => {
                event.preventDefault();
                setPasteNotice(pasteWarning);
              }}
              onDrop={(event) => {
                event.preventDefault();
                registerPasteAttempt();
              }}
              onInput={syncEditorText}
              onKeyDown={blockPasteShortcut}
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
          {pasteNotice ? <p className="paste-notice">{pasteNotice}</p> : null}
        </div>

        <label className="field-shell sm:col-span-2">
          <span>¿Qué avances o resultados has logrado hasta ahora?</span>
          <textarea
            className="field-control simple-textarea"
            name="progress"
            onChange={(event) => setProgressText(event.currentTarget.value)}
            placeholder="Comparte avances, aprendizajes, validaciones, métricas, clientes, comunidad, prototipos, eventos, publicaciones o cualquier evidencia de progreso."
            required
            value={progressText}
          />
          <p className="text-sm text-[#e8dfcf]/62">
            {progressWordCount} / {progressMinimumWords} palabras mínimas
          </p>
        </label>

        <Field
          className="sm:col-span-2"
          label="Link a tu proyecto, portafolio o avance"
          name="projectLink"
          placeholder="Notion, Drive, LinkedIn, Instagram, sitio web, pitch, portafolio o cualquier evidencia de lo que estás construyendo."
          type="text"
        />

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
            Máximo 4.4 MB
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
  className = "",
  label,
  name,
  placeholder,
  type,
}: {
  className?: string;
  label: string;
  name: string;
  placeholder?: string;
  type: string;
}) {
  return (
    <label className={`field-shell ${className}`}>
      <span>{label}</span>
      <input
        className="field-control"
        name={name}
        placeholder={placeholder}
        required={!placeholder}
        type={type}
      />
    </label>
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

function isAllowedFile(file: File) {
  const fileName = file.name.toLowerCase();

  return (
    acceptedTypes.includes(file.type) ||
    acceptedExtensions.some((extension) => fileName.endsWith(extension))
  );
}
