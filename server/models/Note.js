// server/models/Note.js
import mongoose from "mongoose";

const NoteSchema = new mongoose.Schema({
    userId: String,
    subject: String,
    topic: String,
    difficulty: String,
    notes: String,
    favorite: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Note", NoteSchema);
