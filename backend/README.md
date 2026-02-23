# Note Taking App - Backend

This directory contains the Express/TypeScript API that powers the note taking application.
It provides user authentication, note management, tagging, and archiving. The server
uses MongoDB for persistence and issues JWT tokens for authentication.

---

## 🛠 Prerequisites

- Node.js v16 or later
- MongoDB instance (local or Atlas) – provide connection string via environment variable

## ⚙️ Setup & Configuration

1. **Install dependencies**
   ```bash
   cd backend
   npm install
   ```
2. **Environment variables**
   Create a `.env` file in `backend/` (see `.env.example` if available) with values such as:
   ```ini
   PORT=5500
   MONGO_URI=mongodb://localhost:27017/notesdb
   JWT_SECRET=some-super-secret-key
   ```
3. **Seed data (optional)**
   ```bash
   npm run seed
   ```
   This will insert a few example notes for testing purposes.

## 🚀 Running the Server

- Development (hot‑reload using ts-node):

  ```bash
  npm run dev
  ```

- Build & Production:
  ```bash
  npm run build    # compiles TypeScript into dist/
  npm start        # runs the compiled output
  ```

The API will listen on `http://localhost:5500` by default.

## 📡 API Endpoints

| Route                | Method | Description                            |
| -------------------- | ------ | -------------------------------------- |
| `/api/health`        | GET    | Server health check                    |
| `/api/auth/register` | POST   | Create new user                        |
| `/api/auth/login`    | POST   | Authenticate and receive JWT           |
| `/api/notes`         | GET    | Fetch all notes for authenticated user |
| `/api/notes`         | POST   | Create a new note                      |
| `/api/notes/:id`     | PATCH  | Update a note                          |
| `/api/notes/:id`     | DELETE | Delete a note                          |
| `/api/tags`          | GET    | Retrieve available tags                |

> **Note:** All routes under `/api/notes` and `/api/tags` require a valid `Authorization: Bearer <token>` header.

## 🧪 Testing & Linting

- Lint: `npm run lint`
- Format: `npm run format`
- (Add any unit test instructions if applicable.)

## 📦 Deployment

Copy `dist/` contents to your server or containerize the application. Ensure the
`MONGO_URI` and `JWT_SECRET` environment variables are set in the deployment
environment.

---

## 💡 Tips

- Use Postman or curl to interact with the API during development.
- The frontend is configured to communicate with this backend at `http://localhost:5500/api` by default.
