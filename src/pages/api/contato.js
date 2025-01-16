// pages/api/contato.js
import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { nome, email, motivo, mensagem } = req.body;

    // Configuração do transporte para o envio do e-mail
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "seuemail@gmail.com", // Substitua pelo seu e-mail
        pass: "suasenha", // Substitua pela sua senha ou senha de app
      },
    });

    // Configuração do e-mail que será enviado
    const mailOptions = {
      from: email, // E-mail do remetente (do formulário)
      to: "contato@cameo.fun", // E-mail para onde a mensagem será enviada
      subject: `Novo contato - Motivo: ${motivo}`, // Assunto do e-mail
      text: `
        Nome: ${nome}
        E-mail: ${email}
        Motivo: ${motivo}
        Mensagem: ${mensagem}
      `, // Corpo do e-mail com os dados do formulário
    };

    try {
      // Envia o e-mail
      await transporter.sendMail(mailOptions);
      res.status(200).json({ message: "Formulário enviado com sucesso!" });
    } catch (error) {
      console.error("Erro ao enviar o e-mail:", error);
      res.status(500).json({ message: "Erro ao enviar o e-mail." });
    }
  } else {
    // Método não permitido
    res.status(405).json({ message: "Método não permitido" });
  }
}
