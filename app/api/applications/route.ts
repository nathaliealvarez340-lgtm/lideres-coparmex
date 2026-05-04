import { createCandidateApplication } from "@/app/lib/application-store";

const requiredFields = [
  "fullName",
  "email",
  "phone",
  "career",
  "coordination",
  "why",
  "progress",
];

const allowedCoordinations = [
  "Comunicación y Marketing",
  "Patrocinios",
  "Administrativa",
  "Logística",
];

const allowedFileTypes = ["application/pdf", "image/png"];
const allowedFileExtensions = [".pdf", ".png"];
const maxFileSize = 4.4 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const values = Object.fromEntries(
      requiredFields.map((field) => [
        field,
        String(formData.get(field) ?? "").trim(),
      ]),
    );
    const cv = formData.get("cv");
    const projectLink = String(formData.get("projectLink") ?? "").trim();
    values.projectLink = projectLink;

    const missingField = requiredFields.find((field) => !values[field]);

    if (missingField) {
      return Response.json(
        { message: "Todos los campos son obligatorios." },
        { status: 400 },
      );
    }

    if (!isValidEmail(values.email)) {
      return Response.json(
        { message: "Ingresa un correo válido." },
        { status: 400 },
      );
    }

    if (!allowedCoordinations.includes(values.coordination)) {
      return Response.json(
        { message: "Selecciona una coordinación válida." },
        { status: 400 },
      );
    }

    if (values.why.length < 20) {
      return Response.json(
        { message: "Cuéntanos un poco más sobre tu perfil." },
        { status: 400 },
      );
    }

    if (countWords(values.progress) < 40) {
      return Response.json(
        {
          message:
            "Tu respuesta sobre avances debe tener al menos 40 palabras mínimas.",
        },
        { status: 400 },
      );
    }

    if (!(cv instanceof File) || cv.size === 0) {
      return Response.json(
        { message: "Sube tu CV en formato PDF o PNG." },
        { status: 400 },
      );
    }

    if (!isAllowedFile(cv)) {
      return Response.json(
        { message: "El CV debe ser PDF o PNG." },
        { status: 400 },
      );
    }

    if (cv.size > maxFileSize) {
      return Response.json(
        { message: "El archivo no puede pesar más de 4.4 MB." },
        { status: 400 },
      );
    }

    const apiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL;

    if (!apiKey) {
      throw new Error("Missing RESEND_API_KEY");
    }

    if (!fromEmail) {
      throw new Error("Missing RESEND_FROM_EMAIL");
    }

    const cvBuffer = Buffer.from(await cv.arrayBuffer());
    const attachment = cvBuffer.toString("base64");
    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [
          "nathaliealvarez340@gmail.com",
          "rpolancomaldonado@gmail.com",
        ],
        reply_to: values.email,
        subject: "Nueva postulación | Mesa de Líderes COPARMEX",
        html: buildEmailHtml(values),
        attachments: [
          {
            filename: cv.name || "cv-postulante",
            content: attachment,
            content_type: cv.type || getContentTypeFromName(cv.name),
          },
        ],
        tags: [
          {
            name: "source",
            value: "lideres_coparmex_landing",
          },
        ],
      }),
    });

    if (!resendResponse.ok) {
  const resendError = await resendResponse.text();
  console.error("Resend submit error:", {
    status: resendResponse.status,
    error: resendError,
  });

  throw new Error(
    `Resend error ${resendResponse.status}: ${
      resendError || resendResponse.statusText
    }`,
  );
}
    try {
      await createCandidateApplication({
        career: values.career,
        coordination: values.coordination,
        currentProjectAnswer: values.why,
        cvBuffer,
        cvFileName: cv.name || "cv-postulante",
        email: values.email,
        fullName: values.fullName,
        phone: values.phone,
        progressAnswer: values.progress,
        projectLink: values.projectLink,
      });
    } catch (error) {
      console.error("Application store error:", error);
    }

    return Response.json({ message: "Gracias por postularte…" });
  } catch (error) {
    console.error("Application submit error:", error);

    return Response.json(
      { message: "No pudimos enviar tu postulación. Inténtalo de nuevo." },
      { status: 500 },
    );
  }
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isAllowedFile(file: File) {
  const fileName = file.name.toLowerCase();

  return (
    allowedFileTypes.includes(file.type) ||
    allowedFileExtensions.some((extension) => fileName.endsWith(extension))
  );
}

function countWords(text: string) {
  return text.match(/[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu)?.length ?? 0;
}

function getContentTypeFromName(fileName: string) {
  return fileName.toLowerCase().endsWith(".png") ? "image/png" : "application/pdf";
}

function buildEmailHtml(values: Record<string, string>) {
  return `
    <div style="font-family: Arial, sans-serif; color: #111; line-height: 1.6;">
      <h1>Nueva postulación a la Mesa de Líderes COPARMEX</h1>
      <p><strong>Nombre completo:</strong> ${escapeHtml(values.fullName)}</p>
      <p><strong>Correo:</strong> ${escapeHtml(values.email)}</p>
      <p><strong>Teléfono:</strong> ${escapeHtml(values.phone)}</p>
      <p><strong>Carrera:</strong> ${escapeHtml(values.career)}</p>
      <p><strong>Coordinación:</strong> ${escapeHtml(values.coordination)}</p>
      <p><strong>¿Qué está construyendo actualmente?</strong></p>
      <p>${escapeHtml(values.why).replace(/\n/g, "<br />")}</p>
      <p><strong>¿Qué avances o resultados ha logrado hasta ahora?</strong></p>
      <p>${escapeHtml(values.progress).replace(/\n/g, "<br />")}</p>
      ${
        values.projectLink
          ? `<p><strong>Link a proyecto, portafolio o avance:</strong> <a href="${escapeHtml(values.projectLink)}">${escapeHtml(values.projectLink)}</a></p>`
          : ""
      }
    </div>
  `;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
