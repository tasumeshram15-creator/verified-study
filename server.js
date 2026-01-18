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

// 🔥 Fully upgraded polish function
function polishNotes(subject, topic, rawNotes) {
  const lowerSub = subject.toLowerCase();
  let polished = "";

  if (lowerSub.includes("math")) {
    polished = `
# 📖 Math Notes on ${topic}

## Definition
${rawNotes} — explained with clarity and precision.

## 🔢 Formula
Key formula:
\

\[
c^2 = a^2 + b^2
\\]



## 🎯 Applications
- Solving geometry problems
- Deriving distance formula
- Checking right triangles

## 📝 Practice Problems
1. Find hypotenuse when legs = 6 cm, 8 cm.  
2. Check if sides 5 cm, 12 cm, 13 cm form a right triangle.  
3. Distance between points (1,2) and (4,6).

### ✔ Answers
1. \\(c = 10\\) cm  
2. Yes, it is a right triangle  
3. \\(d = 5\\) units
    `;
  } else if (lowerSub.includes("physics")) {
    polished = `
# ⚡ Physics Notes on ${topic}

## Concept
${rawNotes} — explained with physical meaning.

## 🔢 Formula
Example:
\

\[
F = ma
\\]


where \\(F\\) = force, \\(m\\) = mass, \\(a\\) = acceleration.

## 🎯 Applications
- Motion analysis
- Energy calculations
- Real-world problem solving

## 📝 Practice Problems
1. A 2 kg body accelerates at 3 m/s². Find force.  
2. A car moves with velocity 20 m/s for 5 s. Find displacement.

### ✔ Answers
1. \\(F = 6\\,N\\)  
2. \\(s = 100\\,m\\)
    `;
  } else if (lowerSub.includes("chemistry")) {
    polished = `
# 🧪 Chemistry Notes on ${topic}

## Concept
${rawNotes} — explained with chemical context.

## 🔢 Equations
Example balanced reaction:
\

\[
2H_2 + O_2 \\rightarrow 2H_2O
\\]



## 🎯 Applications
- Reaction predictions
- Lab experiments
- Stoichiometry

## 📝 Practice Problems
1. Balance: \\(C_3H_8 + O_2 \\rightarrow CO_2 + H_2O\\).  
2. Calculate moles of water from 4 moles of hydrogen reacting with oxygen.

### ✔ Answers
1. \\(C_3H_8 + 5O_2 \\rightarrow 3CO_2 + 4H_2O\\)  
2. 4 moles of \\(H_2\\) → 4 moles of \\(H_2O\\)
    `;
  } else {
    polished = `
# 📖 General Notes on ${topic}

## Concept
${rawNotes}

## Applications
- Useful for JEE/NEET preparation
- Strengthens conceptual clarity

## 📝 Practice Problems
1. Write a short note on ${topic}.  
2. Give one real-world application.
    `;
  }

  return polished;
}

// API endpoint
app.post("/generate", async (req, res) => {
  const { subject, topic } = req.body;
  const rawNotes = await generateNotes(subject, topic);
  const polished = polishNotes(subject, topic, rawNotes);
  res.json({ notes: polished });
});

app.listen(4000, () => {
  console.log("✅ Backend running on http://localhost:4000");
});
