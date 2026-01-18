import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Dummy raw notes generator (replace with your AI logic)
async function generateNotes(subject, topic) {
  return `Notes on ${topic} in ${subject}`;
}

// Polish function
function polishNotes(subject, topic, rawNotes) {
  return `
# 📖 JEE Notes on ${topic}

## Definition
${rawNotes} — explained with clarity and structure.

## 🔢 Formula
For a right triangle with legs \\(a\\), \\(b\\) and hypotenuse \\(c\\):

\

\[
c^2 = a^2 + b^2
\\]



## 🎯 Applications
1. **Finding a Side**: Example with values.
2. **Distance Formula**: Derived from the theorem.
3. **Checking Right Triangles**: Verify using \\(c^2 = a^2 + b^2\\).

## 📐 Special Right Triangles
- 45°‑45°‑90°: Hypotenuse = \\(x\\sqrt{2}\\).
- 30°‑60°‑90°: Sides = \\(x, x\\sqrt{3}, 2x\\).

## 🧩 Proof
Area rearrangement method showing \\(c^2 = a^2 + b^2\\).

## ✅ Conclusion
The theorem is essential for geometry, trigonometry, and coordinate geometry.  
It underpins distance calculations and problem‑solving in JEE.

## 📝 Practice Problems
1. Find hypotenuse when legs = 6 cm, 8 cm.  
2. Check if sides 5 cm, 12 cm, 13 cm form a right triangle.  
3. Distance between points (1,2) and (4,6).

### ✔ Answers
1. \\(c = 10\\) cm  
2. Yes, it is a right triangle  
3. \\(d = 5\\) units
  `;
}

app.post("/generate", async (req, res) => {
  const { subject, topic } = req.body;
  const rawNotes = await generateNotes(subject, topic);
  const polished = polishNotes(subject, topic, rawNotes);
  res.json({ notes: polished });
});

app.listen(4000, () => {
  console.log("Backend running on http://localhost:4000");
});
