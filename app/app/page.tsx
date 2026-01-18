"use client";

import { useState } from "react";

export default function Home() {
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setNotes("");
    try {
      const response = await fetch("http://localhost:4000/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, topic }),
      });

      const data = await response.json();
      setNotes(data.notes || "No notes received");
    } catch (error) {
      console.error("Error fetching notes:", error);
      setNotes("Failed to fetch notes from backend");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 font-sans dark:bg-black p-10">
      <h1 className="text-4xl font-bold text-black dark:text-zinc-50 mb-6">
        Verified Study
      </h1>
      <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-4">
        Generate AI-powered study notes for JEE/NEET.
      </p>

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
        placeholder="Enter topic (e.g. Pythagorean Theorem)"
        className="border p-2 mb-4 w-full max-w-md"
      />

      <button
        onClick={handleGenerate}
        disabled={loading}
        className={`px-6 py-3 rounded-lg text-white transition ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
      >
        {loading ? (
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Generating...</span>
          </div>
        ) : (
          "Generate Notes"
        )}
      </button>

      {notes && (
        <div className="mt-8 p-4 border rounded-lg bg-white dark:bg-zinc-800 w-full max-w-xl fade-in">
          <h2 className="text-xl font-semibold mb-2">Generated Notes:</h2>
          <div className="prose prose-zinc dark:prose-invert whitespace-pre-line">
            {notes}
          </div>
        </div>
      )}
    </main>
  );
}

