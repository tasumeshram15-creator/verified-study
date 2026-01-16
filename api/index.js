"use client";
import { useState } from "react";

export default function Home() {
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [notes, setNotes] = useState("");

  const handleGenerate = async () => {
    try {
      const response = await fetch("http://localhost:4000/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, topic }),
      });
      const data = await response.json();
      setNotes(data.notes || "No notes received");
    } catch (error) {
      setNotes("Failed to fetch notes");
    }
  };

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold mb-4">Verified Study</h1>
      <input
        type="text"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        placeholder="Enter subject (e.g. Physics)"
        className="border p-2 mb-4 w-full max-w-md"
      />
      <input
        type="text"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        placeholder="Enter topic (e.g. Work, Power, Energy)"
        className="border p-2 mb-4 w-full max-w-md"
      />
      <button
        onClick={handleGenerate}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg"
      >
        Generate Notes
      </button>

      {notes && (
        <div className="mt-6 p-4 border rounded-lg bg-gray-50">
          <h2 className="text-xl font-semibold mb-2">Generated Notes:</h2>
          <p>{notes}</p>
        </div>
      )}
    </main>
  );
}
