import express from "express";
import nodemailer from "nodemailer";
import type { Request, Response } from "express";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

app.post("/emails", async (req: Request, res: Response): Promise<void> => {
  const { to, subject, text } = req.body;

  if (!to || !subject || !text) {
    res.status(400).json({
      error: "Por favor, forneça 'to', 'subject', e 'text'.",
    });
    return;
  }

  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "E-mail enviado com sucesso!" });
  } catch (error) {
    console.error("Erro ao enviar e-mail:", error);
    res.status(500).json({ error: "Erro ao enviar e-mail." });
  }
});

app.listen(3004, () => {
  console.log(`Emails API rodando na porta 3004`);
});