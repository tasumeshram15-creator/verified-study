"use client"; // ✅ needed for hooks in App Router

export default function Home() {
    async function generateNotes() {
        const response = await fetch("http://localhost:4000/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                subject: "Math",
                topic: "Integration",
                difficulty: "Intermediate",
                userId: "guest"
            }),
        });

        const data = await response.json();
        alert(data.notes); // shows notes in popup
    }

    return (
        <div>
            <h1>Verified Study</h1>
            <button onClick={generateNotes}>Generate Notes</button>
        </div>
    );
}
