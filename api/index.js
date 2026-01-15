// index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Simple health check
app.get("/health", (req, res) => {
  res.json({ ok: true, service: "verified-study-api" });
});

// Generate study material
app.post("/generate", async (req, res) => {
  try {
    const { subject = "Physics", topic = "Work, Power, Energy" } = req.body;

    const prompt = `Create verified JEE notes for ${subject} on topic "${topic}".
    Use NCERT-aligned definitions and formulas. Avoid mistakes.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a verified study material generator." },
        { role: "user", content: prompt }
      ],
      temperature: 0.2
    });

    const content = completion.choices[0].message.content;
    res.json({ ok: true, notes: content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: "generation_failed" });
  }
});

const PORT = 4000;
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
