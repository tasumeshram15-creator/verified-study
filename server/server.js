// server.js
import express from "express"
import cors from "cors";
import monogoose from "mongoose";
import Note from "./models/Note.js";
import bodyParser from "body-parser";

const app = express();
const PORT = 4000;

app.use(cors());
app.use(bodyParser.json());

// ✅ Add MongoDB connection right after middleware
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

//you helper function (like buildpractice) stay here
function buildPractice(difficulty, subject, topic) {
  const sets = {
    Beginner: `
## 📝 Practice (Beginner)
1. Define ${topic} in your own words.
2. Solve a simple example related to ${topic}.
### ✔ Answers
1. ${topic} is introduced with a clear, simple definition.
2. Example solved step-by-step with basic reasoning.
`,
    Intermediate: `
## 📝 Practice (Intermediate)
1. Apply ${topic} to a standard JEE-style problem.
2. Use the core formula to compute a value with units.
### ✔ Answers
1. Worked solution with formula selection and justification.
2. Numerical answer with dimensional analysis and explanation.
`,
    Advanced: `
## 📝 Practice (Advanced)
1. Derive ${topic} from first principles or laws.
2. Solve a multi-step problem combining ${subject} subtopics.
### ✔ Answers
1. Full derivation with assumptions and boundary conditions.
2. Structured solution with checks, edge cases, and final validation.
`
  };
  return sets[difficulty] || sets.Intermediate;
}

function buildNotes(subject, topic, difficulty) {
  const lower = subject.toLowerCase();

  const commonHeader = `# 📚 ${subject} — ${topic}

## 🎯 Exam intent
- Focused for JEE/NEET style questions
- Emphasis on conceptual clarity + formula fluency
- Includes applications, pitfalls, and practice

`;

  const generalSections = `
## ✅ Key ideas
- Definitions with intuition
- Step-by-step worked examples
- Common mistakes and how to avoid them

## 🧠 Memory hooks
- Mnemonics for quick recall
- Visual cues and analogies

## 🧩 Applications
- Real-world or lab contexts
- Typical exam scenarios

`;

  let core = "";

  if (lower.includes("math")) {
    core = `
## 📖 Concept
${topic} is explained with geometric/algebraic intuition and precise definitions.

## 🔢 Core formulas
- Pythagorean relation: \\(c^2 = a^2 + b^2\\)
- Distance in coordinate plane: \\(d = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}\\)

## ✍️ Worked example
Given a right triangle with legs 3 and 4, the hypotenuse is:
\

\[
c = \\sqrt{3^2 + 4^2} = 5
\\]



## ⚠️ Pitfalls
- Mixing up legs vs hypotenuse
- Forgetting units or squaring errors
`;
  } else if (lower.includes("physics")) {
    core = `
## ⚡ Concept
${topic} is framed via Newtonian mechanics and energy perspectives.

## 🔢 Core relations
- Newton's second law: \\(F = ma\\)
- Work-energy: \\(W = \\Delta K\\)

## ✍️ Worked example
A 2 kg mass accelerates at 3 m/s². Net force:
\

\[
F = ma = 2 \\cdot 3 = 6\\ \\text{N}
\\]



## ⚠️ Pitfalls
- Confusing net vs individual forces
- Ignoring direction and sign conventions
`;
  } else if (lower.includes("chemistry")) {
    core = `
## 🧪 Concept
${topic} is treated with molecular/stoichiometric reasoning.

## 🔢 Balanced reaction
\

\[
2H_2 + O_2 \\rightarrow 2H_2O
\\]



## ✍️ Worked example
Moles of water from 4 mol H₂ (excess O₂):
\

\[
n_{H_2O} = 2 \\times n_{H_2} = 8\\ \\text{mol}
\\]



## ⚠️ Pitfalls
- Not balancing coefficients
- Unit conversion mistakes (mol, g, L)
`;
  } else {
    core = `
## 📖 Concept
${topic} is explained with definitions, examples, and exam framing.

## 🔢 Useful relations
- Summaries of key identities or laws
- When to apply each

## ✍️ Worked example
A typical exam-style problem is solved step-by-step with checks.

## ⚠️ Pitfalls
- Misreading the question
- Skipping validation of the final result
`;
  }

  const practice = buildPractice(difficulty, subject, topic);

  return `
${commonHeader}
${core}
${generalSections}
${practice}
## 🧭 Quick revision
- Re-derive one formula from memory
- Solve one fresh problem without notes
- Explain ${topic} to a friend in 60 seconds
`;
}

// ✅ Modify /generate route to also save notes
app.post("/generate", async (req, res) => {
  const { subject = "Math", topic = "Pythagorean Theorem", difficulty = "Intermediate" } = req.body || {};
  const notes = buildNotes(subject, topic, difficulty);

  // ✅ Save to MongoDB
  const newNote = new Note({ userId, subject, topic, difficulty, notes });
  await newNote.save();

  res.json({ notes });
});

app.get("/", (_req, res) => {
  res.send("✅ Verified Study backend is running");
});

app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});
