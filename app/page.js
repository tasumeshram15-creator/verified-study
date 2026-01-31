"use client";
import { useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession();
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("Beginner");
  const [notes, setNotes] = useState("");

  // Function to call backend and generate notes
  async function generateNotes() {
    if (!session) {
      alert("Please login first!");
      return;
    }

    const response = await fetch("http://localhost:4000/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subject,
        topic,
        difficulty,
        userId: session.user.email, // ✅ tie notes to logged-in user
      }),
    });

    const data = await response.json();
    setNotes(data.notes);
  }

  // Show loading state while NextAuth checks session
  if (status === "loading") {
    return <div style={{ padding: 20 }}>Checking session…</div>;
  }

  // If user is not logged in → show login button
  if (!session) {
    return (
      <div style={{ padding: 20 }}>
        <h1>Verified Study</h1>
        <p>Please log in to generate and view your notes.</p>
        <button onClick={() => signIn("google")}>Login with Google</button>
      </div>
    );
  }

  // If user is logged in → show form + notes
  return (
    <div style={{ padding: 20 }}>
      <h1>Welcome, {session.user.name}</h1>
      <p>Email: {session.user.email}</p>
      <button onClick={() => signOut()}>Logout</button>

      <hr style={{ margin: "20px 0" }} />

      <h2>Generate Notes</h2>
      <input
        type="text"
        placeholder="Enter subject"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        style={{ display: "block", marginBottom: 10 }}
      />

      <input
        type="text"
        placeholder="Enter topic"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        style={{ display: "block", marginBottom: 10 }}
      />

      <select
        value={difficulty}
        onChange={(e) => setDifficulty(e.target.value)}
        style={{ display: "block", marginBottom: 10 }}
      >
        <option>Beginner</option>
        <option>Intermediate</option>
        <option>Advanced</option>
      </select>

      <button onClick={generateNotes}>Generate Notes</button>

      {notes && (
        <div style={{ marginTop: 20, whiteSpace: "pre-wrap" }}>
          <h2>Your Notes</h2>
          <p>{notes}</p>
        </div>
      )}
    </div>
  );
}

