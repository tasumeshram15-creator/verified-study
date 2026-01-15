import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post("/generate", async (req, res) => {
  const { exam, subject, topic } = req.body;

  const prompt = `Generate study material for ${exam} ${subject} on topic "${topic}".
  Include:
  - Notes (bullet points)
  - Formulas (with units)
  - 3 MCQs with answers`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
    });

    const draft = response.choices[0].message.content;

    res.json({
      notes: draft,
      formulas: "Formulas will go here",
      mcqs: "MCQs will go here",
      verification: { issues: [], corrections: [], confidence: "medium" },
    });
  } catch (err) {
    console.error("Error from OpenAI:", err);
    res.status(500).json({ error: "Failed to generate study material" });
  }
});

app.listen(8080, () => console.log("Backend running on http://localhost:8080"));
