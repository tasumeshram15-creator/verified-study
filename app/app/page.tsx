"use client";

import { useState } from "react";
import jsPDF from "jspdf";

function Chatbot() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "👋 Hi! I’m your study assistant. Ask me anything!" }
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;

    const newMessages = [...messages, { sender: "user", text }];
    // Instant reply—no artificial delay
    const reply = `🤖 You asked: "${text}". Here’s a concise, exam-focused explanation:\n- Define the concept\n- Show one formula\n- Give a quick example\n- Mention a common pitfall`;

    setMessages([...newMessages, { sender: "bot", text: reply }]);
    setInput("");
  };

  return (
    <div className="w-80 bg-white dark:bg-zinc-800 shadow-lg rounded-lg border border-zinc-300 dark:border-zinc-700">
      <div className="p-2 bg-blue-600 text-white rounded-t-lg font-bold">Study Chatbot</div>
      <div className="p-3 h-64 overflow-y-auto text-sm">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`mb-2 ${msg.sender === "user" ? "text-right text-blue-600" : "text-left text-zinc-700 dark:text-zinc-300"}`}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <div className="flex border-t border-zinc-300 dark:border-zinc-700">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a question..."
          className="flex-1 p-2 text-sm border-none outline-none dark:bg-zinc-800 dark:text-white"
        />
        <button onClick={handleSend} className="px-3 bg-blue-600 text-white text-sm rounded-r-lg hover:bg-blue-700">
          Send
        </button>
      </div>
    </div>
  );
}

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
    setShareLink("");
    try {
      const response = await fetch("http://localhost:4000/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, topic, difficulty })
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

  const handleDownloadTXT = () => {
    const blob = new Blob([notes], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${subject}-${topic || "topic"}-notes.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica");
    doc.setFontSize(12);
    const lines = doc.splitTextToSize(notes, 180);
    doc.text(lines, 10, 10);
    doc.save(`${subject}-${topic || "topic"}-notes.pdf`);
  };

  const handleShare = () => {
    const blob = new Blob([notes], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    setShareLink(url);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(notes);
    alert("✅ Notes copied to clipboard!");
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 font-sans dark:bg-black p-10">
      <h1 className="text-4xl font-bold text-black dark:text-zinc-50 mb-6">Verified Study</h1>
      <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-4">Generate exam-focused study notes for JEE/NEET.</p>

      <select value={subject} onChange={(e) => setSubject(e.target.value)} className="border p-2 mb-4 w-full max-w-md">
        <option value="Math">📖 Math</option>
        <option value="Physics">⚡ Physics</option>
        <option value="Chemistry">🧪 Chemistry</option>
      </select>

      <input
        type="text"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        placeholder="Enter topic (e.g. Pythagorean Theorem)"
        className="border p-2 mb-4 w-full max-w-md"
      />

      <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="border p-2 mb-4 w-full max-w-md">
        <option value="Beginner">Beginner</option>
        <option value="Intermediate">Intermediate</option>
        <option value="Advanced">Advanced</option>
      </select>

      <button
        onClick={handleGenerate}
        disabled={loading}
        className={`px-6 py-3 rounded-lg text-white transition ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
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
          <div className="prose prose-zinc dark:prose-invert whitespace-pre-line mb-4">{notes}</div>

          <div className="flex flex-wrap gap-3">
            <button onClick={handleDownloadTXT} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
              ⬇ Download TXT
            </button>
            <button onClick={handleDownloadPDF} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
              ⬇ Download PDF
            </button>
            <button onClick={handleShare} className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
              🔗 Share Notes
            </button>
            <button onClick={handleCopy} className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600">
              📋 Copy Notes
            </button>
          </div>

          {shareLink && (
            <div className="mt-4">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Share this link with friends:</p>
              <a href={shareLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 underline">
                {shareLink}
              </a>
            </div>
          )}
        </div>
      )}

      <div className="fixed bottom-4 right-4">
        {showChatbot ? (
          <div>
            <Chatbot />
            <button onClick={() => setShowChatbot(false)} className="mt-2 px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700">
              Close Chat
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowChatbot(true)}
            className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg hover:bg-blue-700"
          >
            💬
          </button>
        )}
      </div>
    </main>
  );
}
