"use client";

import { useState } from "react";
import jsPDF from "jspdf";

/* ---------------- CHATBOT ---------------- */
function Chatbot() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "👋 Hi! I’m your study assistant. Ask me anything!" }
  ]);
  const [input, setInput] = useState("");

  const handleSend = async () => {
    const text = input.trim();
    if (!text) return;

    const newMessages = [...messages, { sender: "user", text }];
    setMessages(newMessages);
    setInput("");

    try {
      const response = await fetch("http://localhost:4000/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: "Math",
          topic: text,
          difficulty: "Intermediate"
        }),
      });

      const data = await response.json();
      setMessages([...newMessages, { sender: "bot", text: data.notes }]);
    } catch {
      setMessages([...newMessages, { sender: "bot", text: "❌ Failed to fetch notes" }]);
    }
  };

  return (
    <div className="w-80 bg-white dark:bg-zinc-800 shadow-lg rounded-lg border">
      <div className="p-2 bg-blue-600 text-white rounded-t-lg font-bold">
        Study Chatbot
      </div>

      <div className="p-3 h-64 overflow-y-auto text-sm">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`mb-2 ${msg.sender === "user"
                ? "text-right text-blue-600"
                : "text-left text-zinc-700 dark:text-zinc-300"
              }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <div className="flex border-t">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-2 text-sm outline-none dark:bg-zinc-800"
          placeholder="Type a question..."
        />
        <button
          onClick={handleSend}
          className="px-3 bg-blue-600 text-white text-sm hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
  );
}

/* ---------------- HOME ---------------- */
export default function Home() {
  const [subject, setSubject] = useState("Math");
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("Intermediate");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [showChatbot, setShowChatbot] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setNotes("");

    try {
      const res = await fetch("http://localhost:4000/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, topic, difficulty })
      });
      const data = await res.json();
      setNotes(data.notes || "No notes received");
    } catch {
      setNotes("Failed to fetch notes");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const lines = doc.splitTextToSize(notes, 180);
    doc.text(lines, 10, 10);
    doc.save("notes.pdf");
  };

  return (
    <main className="min-h-screen p-10 bg-zinc-50 dark:bg-black">
      <h1 className="text-4xl font-bold mb-6">Verified Study</h1>

      <input
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        className="border p-2 mb-4 w-full max-w-md"
        placeholder="Enter topic"
      />

      <button
        onClick={handleGenerate}
        className="px-6 py-3 bg-blue-600 text-white rounded"
      >
        {loading ? "Generating..." : "Generate Notes"}
      </button>

      {notes && (
        <div className="mt-6 bg-white p-4 rounded">
          <pre className="whitespace-pre-wrap">{notes}</pre>
          <button
            onClick={handleDownloadPDF}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded"
          >
            Download PDF
          </button>
        </div>
      )}

      {/* CHATBOT TOGGLE */}
      <div className="fixed bottom-4 right-4">
        {showChatbot ? (
          <div>
            <Chatbot />
            <button
              onClick={() => setShowChatbot(false)}
              className="mt-2 px-3 py-1 bg-gray-600 text-white rounded w-full"
            >
              Close Chat
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowChatbot(true)}
            className="w-12 h-12 rounded-full bg-blue-600 text-white shadow-lg"
          >
            💬
          </button>
        )}
      </div>
    </main>
  );
}
