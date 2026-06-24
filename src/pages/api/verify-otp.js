import { db } from "@/services/firebaseConection";
import { doc, getDoc, updateDoc, deleteField } from "firebase/firestore";
import crypto from "crypto";

function hashOtp(otp) {
  return crypto.createHash("sha256").update(otp).digest("hex");
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { uid, code } = req.body;

  if (!uid || !code) {
    return res.status(400).json({ error: "uid e code são obrigatórios" });
  }

  try {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    const userData = userSnap.data();

    if (userData.emailVerified) {
      return res.status(400).json({ error: "E-mail já verificado" });
    }

    const otpData = userData.otp;

    if (!otpData) {
      return res.status(400).json({ error: "Nenhum código pendente. Solicite um novo." });
    }

    // Verifica expiração
    const expiresAt = otpData.expiresAt.toDate();
    if (new Date() > expiresAt) {
      return res.status(400).json({ error: "Código expirado.", expired: true });
    }

    // Verifica limite de tentativas
    if (otpData.attempts >= 5) {
      return res.status(400).json({
        error: "Muitas tentativas incorretas. Solicite um novo código.",
        tooManyAttempts: true,
      });
    }

    const hash = hashOtp(code.trim());

    if (hash !== otpData.hash) {
      await updateDoc(userRef, { "otp.attempts": otpData.attempts + 1 });
      const restantes = 4 - otpData.attempts;
      return res.status(400).json({
        error: `Código incorreto. ${restantes} tentativa${restantes !== 1 ? "s" : ""} restante${restantes !== 1 ? "s" : ""}.`,
      });
    }

    // Código válido — marca e-mail como verificado e remove o OTP
    await updateDoc(userRef, {
      emailVerified: true,
      otp: deleteField(),
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Erro ao verificar OTP:", error);
    return res.status(500).json({ error: "Erro ao verificar código" });
  }
}