import { adminDb } from "@/lib/firebaseAdmin";
import { Resend } from "resend";
import crypto from "crypto";

const resend = new Resend(process.env.RESEND_API_KEY);

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function hashOtp(otp) {
  return crypto.createHash("sha256").update(otp).digest("hex");
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { uid, email, nome } = req.body;

  if (!uid || !email) {
    return res.status(400).json({ error: "uid e email são obrigatórios" });
  }

  try {
    const userRef = adminDb.doc(`users/${uid}`);
    const userSnap = await userRef.get();

    if (!userSnap.exists) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    if (userSnap.data().emailVerified) {
      return res.status(400).json({ error: "E-mail já verificado" });
    }

    // Verifica cooldown de reenvio (mínimo 60s entre envios)
    const otpAtual = userSnap.data().otp;
    if (otpAtual?.expiresAt) {
      const criado = otpAtual.expiresAt.toDate().getTime() - 10 * 60 * 1000;
      const segundosDesde = (Date.now() - criado) / 1000;
      if (segundosDesde < 60) {
        return res.status(429).json({ error: "Aguarde antes de reenviar o código." });
      }
    }

    const otp = generateOtp();
    const hash = hashOtp(otp);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await userRef.update({
      otp: { hash, expiresAt, attempts: 0 },
    });

    await resend.emails.send({
      from: "Cameo <noreply@cameo.fun>",
      to: email,
      subject: "Seu código de verificação — Cameo",
      html: `
        <div style="background:#0d0d0d;padding:48px 32px;font-family:sans-serif;max-width:480px;margin:0 auto;">
          <h1 style="color:#ffffff;font-size:24px;margin:0 0 8px;">
            Bem-vindo à Cameo${nome ? `, ${nome}` : ""}!
          </h1>
          <p style="color:#888888;font-size:15px;margin:0 0 32px;">
            Use o código abaixo para confirmar seu e-mail e ativar sua conta.
          </p>
          <div style="background:#1a1a1a;border:1px solid #2a2a2a;border-radius:12px;padding:32px;text-align:center;margin:0 0 32px;">
            <span style="font-size:40px;font-weight:bold;letter-spacing:12px;color:#ffffff;">
              ${otp}
            </span>
          </div>
          <p style="color:#555555;font-size:13px;margin:0;">
            Este código expira em 10 minutos. Se você não criou uma conta na Cameo, ignore este e-mail.
          </p>
        </div>
      `,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Erro em send-otp:", error);
    return res.status(500).json({ error: "Erro ao enviar código de verificação" });
  }
}
