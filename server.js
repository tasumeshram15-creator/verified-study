import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Dummy raw notes generator (replace with AI logic later)
async function generateNotes(subject, topic) {
  return `Raw notes on ${topic} in ${subject}`;
}

// 🔥 Fully upgraded polish function with difficulty levels
function polishNotes(subject, topic, rawNotes, difficulty = "Intermediate") {
  const lowerSub = subject.toLowerCase();
  let polished = "";

  // Difficulty-based practice problems
  const practiceProblems = {
    Beginner: `
## 📝 Practice Problems (Beginner)
1. Define ${topic} in simple words.
2. Solve a basic example related to ${topic}.
### ✔ Answers
1. ${topic} is explained simply.
2. Example solved step-by-step.
    `,
    Intermediate: `
## 📝 Practice Problems (Intermediate)
1. Apply ${topic} to a standard JEE-style problem.
2. Use formula to calculate a value.
### ✔ Answers
1. Worked solution with formula.
2. Numerical answer with explanation.
    `,
    Advanced: `
## 📝 Practice Problems (Advanced)
1. Derive ${topic} from first principles.
2. Solve a complex multi-step problem involving ${topic}.
### ✔ Answers
1. Full derivation shown.
2. Advanced solution with reasoning.
    `
  };

  if (lowerSub.includes("math")) {
    polished = `
# 📖 Math Notes on ${topic}

## Definition
${rawNotes} — explained with clarity and precision.

## 🔢 Formula
\

\[
c^2 = a^2 + b^2
\\]



## 🎯 Applications
- Geometry problem solving
- Distance formula
- Right triangle checks

${practiceProblems[difficulty]}
    `;
  } else if (lowerSub.includes("physics")) {
    polished = `
# ⚡ Physics Notes on ${topic}

## Concept
${rawNotes} — explained with physical meaning.

## 🔢 Formula
\

\[
F = ma
\\]



## 🎯 Applications
- Motion analysis
- Energy calculations
- Real-world problem solving

${practiceProblems[difficulty]}
    `;
  } else if (lowerSub.includes("chemistry")) {
    polished = `
# 🧪 Chemistry Notes on ${topic}

## Concept
${rawNotes} — explained with chemical context.

## 🔢 Equations
\

\[
2H_2 + O_2 \\rightarrow 2H_2O
\\]



## 🎯 Applications
- Reaction predictions
- Lab experiments
- Stoichiometry

${practiceProblems[difficulty]}
    `;
  } else {
    polished = `
# 📖 General Notes on ${topic}

## Concept
${rawNotes}

## Applications
- Useful for JEE/NEET preparation
- Strengthens conceptual clarity

${practiceProblems[difficulty]}
    `;
  }

  return polished;
}

// API endpoint
app.post("/generate", async (req, res) => {
  const { subject, topic, difficulty } = req.body;
  const rawNotes = await generateNotes(subject, topic);
  const polished = polishNotes(subject, topic, rawNotes, difficulty || "Intermediate");
  res.json({ notes: polished });
});

app.listen(4000, () => {
  console.log("✅ Backend running on http://localhost:4000");
});
