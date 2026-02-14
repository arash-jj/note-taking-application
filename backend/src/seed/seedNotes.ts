import connectTODatabase from "../database/mongoDB";
import { Note } from "../models/note.model.js"

async function seedNotes() {
  try {
    await connectTODatabase()
    console.log("🌱 Seeding notes...")
    // ⚠️ Replace with a real userId from your DB
    const userId = '698eefab6c670a666eab79ec'
    const notes = [
        {
            userId,
            title: "Welcome to Notes App",
            content: "<p>This is your first note ✨</p>",
            tags: ["getting-started"],
        },
        {
            userId,
            title: "System Design Ideas",
            content: "<p>Learn caching, queues, load balancing.</p>",
            tags: ["system-design", "backend"],
        },
        {
            userId,
            title: "Startup Brain Dump",
            content: "<p>Idea: build something useful for students in Iran.</p>",
            tags: ["startup"],
        },
        {
            userId,
            title: "Todo List",
            content: "<ul><li>Finish notes UI</li><li>Add autosave</li></ul>",
            tags: ["tasks"],
        },
    ]
    await Note.deleteMany({ userId })
    await Note.insertMany(notes)
    console.log("✅ Notes seeded successfully!")
    process.exit(0)
  } catch (error) {
    console.error("❌ Seeding failed:", error)
    process.exit(1)
  }
}

seedNotes()
