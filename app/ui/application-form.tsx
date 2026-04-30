"use client";

import { FormEvent, useState } from "react";

type ApplicationFormProps = {
  coordinations: string[];
};

type FormStatus = "idle" | "sending" | "success" | "error";

const acceptedTypes = ["application/pdf", "image/png"];

export function ApplicationForm({ coordinations }: ApplicationFormProps) {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [message, setMessage] = useState("");
  const [fileName, setFileName] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);
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
      setFileName("");
      setStatus("success");
      setMessage(
        "Gracias por postularte a la Mesa de Líderes COPARMEX. Tus datos serán revisados por la mesa directiva. En caso de avanzar, recibirás información sobre la segunda fase del proceso.",
      );
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
          {message}
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
          <select className="field-control" name="coordination" required defaultValue="">
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

        <label className="field-shell sm:col-span-2">
          <span>¿Por qué deberíamos considerarte?</span>
          <textarea
            className="field-control min-h-40 resize-y py-4 leading-7"
            name="why"
            minLength={20}
            required
            placeholder="Habla de tu criterio, experiencia, motivación y lo que puedes aportar a la mesa."
          />
        </label>

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
          <span className="text-base font-semibold text-[#fff8e8]">
            {fileName || "Sube tu CV PDF o PNG"}
          </span>
          <span className="text-sm leading-6 text-[#e8dfcf]/62">
            Arrastra visualmente tu documento aquí o haz clic para elegirlo.
            Máximo 5 MB.
          </span>
        </label>
      </div>

      <button className="premium-button mt-8 w-full" disabled={status === "sending"} type="submit">
        {status === "sending" ? "Enviando..." : "Enviar postulación"}
      </button>

      {message ? (
        <p className="mt-5 rounded-2xl border border-[#da3a3f]/35 bg-[#7a1119]/25 px-5 py-4 text-sm text-[#ffd7d7]" role="status">
          {message}
        </p>
      ) : null}
    </form>
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
