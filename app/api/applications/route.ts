const requiredFields = [
  "fullName",
  "email",
  "phone",
  "career",
  "coordination",
  "why",
];

const allowedCoordinations = [
  "Comunicación y Marketing",
  "Patrocinios",
  "Administrativa",
  "Logística",
];

const allowedFileTypes = ["application/pdf", "image/png"];
const allowedFileExtensions = [".pdf", ".png"];
const maxFileSize = 15 * 1024 * 1024;

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
        { message: "El archivo no puede pesar más de 15 MB." },
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

    const attachment = Buffer.from(await cv.arrayBuffer()).toString("base64");
    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: ["nathaliealvarez340@gmail.com"],
        reply_to: values.email,
        subject: `Nueva postulación - ${values.fullName}`,
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
      throw new Error(
        `Resend error ${resendResponse.status}: ${resendError || resendResponse.statusText}`,
      );
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
      <p><strong>¿Por qué deberían considerarle?</strong></p>
      <p>${escapeHtml(values.why).replace(/\n/g, "<br />")}</p>
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
