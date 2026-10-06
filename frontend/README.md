# Interview Prep

> AI-powered mock interview coaching — generate role-specific questions, refine your answers, and track your progress across sessions.

**Demo:** [`/interview-prep/demo`] — try a sample session without signing up.

![Tech Stack](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-B73BFE?logo=vite&logoColor=FFD62E)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white)
![Gemini AI](https://img.shields.io/badge/Gemini_AI-4285F4?logo=google-gemini&logoColor=white)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Clone & Install](#clone--install)
  - [Environment Variables](#environment-variables)
  - [Run Locally](#run-locally)
- [Project Structure](#project-structure)
- [API Reference](#api-reference)
  - [Authentication](#authentication)
  - [Sessions](#sessions)
  - [Questions](#questions)
  - [AI](#ai)
- [Frontend Routes](#frontend-routes)
- [Usage Guide](#usage-guide)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

**Interview Prep** is a full-stack web application that helps developers practice for technical interviews. You start a session by specifying a target role, experience level, and topics — the app uses Google Gemini AI to generate relevant questions with model answers. During review you can:

- Expand each question to read its suggested answer (rendered with Markdown, including code blocks).
- **Pin** important questions for quick access.
- **Ask the AI** to deep-dive into any concept for a more thorough explanation — results are persisted so each explanation costs tokens only once.
- **Get answer tips** for each question — actionable advice on structure, what interviewers look for, and common mistakes.
- Add personal **notes** to each question.
- **Generate more questions** mid-session without losing your place.
- Page through large question sets with a **Load More** button (10 at a time).
- Track all your sessions on the dashboard.

---

## Features

| Feature                     | Details                                                                                |
| --------------------------- | -------------------------------------------------------------------------------------- |
| **AI-generated questions**  | Powered by Google Gemini — tailored to role, experience, and topics.                   |
| **Generate more questions** | Add 7 more questions to any session with one click — no session recreation.            |
| **Load More pagination**    | Shows 10 questions at a time; reveals 10 more on each "Load More" click.               |
| **Persisted explanations**  | "Explain concept" generates once and saves to DB — subsequent visits cost zero tokens. |
| **Answer tips**             | Actionable coaching on how to structure your answer for each question.                 |
| **Session management**      | Create, review, and delete sessions. Each session stores its own question set.         |
| **Pin questions**           | Mark important questions so they appear first.                                         |
| **Personal notes**          | Attach notes to individual questions — saved to the backend.                           |
| **Markdown answers**        | Answers support markdown formatting and syntax-highlighted code blocks.                |
| **Demo mode**               | Explore the experience without registering at `/interview-prep/demo`.                  |
| **Auth**                    | JWT-based registration and login with protected routes.                                |
| **Responsive**              | Works on mobile and desktop with a warm, friendly UI.                                  |
| **Work Sans font**          | Clean, modern typography via Google Fonts.                                             |

---

## Tech Stack

### Frontend

| Library                                                                                          | Purpose                        |
| ------------------------------------------------------------------------------------------------ | ------------------------------ |
| [React 19](https://react.dev/)                                                                   | UI framework                   |
| [Vite 8](https://vite.dev/)                                                                      | Build tool and dev server      |
| [Tailwind CSS v4](https://tailwindcss.com/)                                                      | Utility-first styling          |
| [React Router v7](https://reactrouter.com/)                                                      | Client-side routing            |
| [Framer Motion](https://www.framer.com/motion/)                                                  | Animations                     |
| [Axios](https://axios-http.com/)                                                                 | HTTP client                    |
| [React Hot Toast](https://react-hot-toast.com/)                                                  | Toast notifications            |
| [React Icons](https://react-icons.github.io/react-icons/)                                        | Icon library (Lucide)          |
| [React Markdown](https://remarkjs.github.io/react-markdown/)                                     | Markdown rendering             |
| [react-syntax-highlighter](https://github.com/react-syntax-highlighter/react-syntax-highlighter) | Code block syntax highlighting |
| [Moment.js](https://momentjs.com/)                                                               | Date formatting                |

### Backend

| Library                                                      | Purpose                      |
| ------------------------------------------------------------ | ---------------------------- |
| [Express 5](https://expressjs.com/)                          | Web framework                |
| [Mongoose 9](https://mongoosejs.com/)                        | MongoDB ODM                  |
| [JWT](https://github.com/auth0/node-jsonwebtoken)            | Authentication tokens        |
| [bcryptjs](https://github.com/dcodeIO/bcrypt.js)             | Password hashing             |
| [@google/genai](https://www.npmjs.com/package/@google/genai) | Google Gemini AI SDK         |
| [Multer](https://github.com/expressjs/multer)                | File upload handling         |
| [dotenv](https://github.com/motdotla/dotenv)                 | Environment variable loading |

### Database

- **MongoDB** — primary data store (local or [MongoDB Atlas](https://www.mongodb.com/atlas))

---

## Getting Started

### Prerequisites

- **Node.js** >= 18 (LTS recommended)
- **npm** >= 9
- **MongoDB** — running locally on `mongodb://localhost:27017`, or a remote Atlas connection string
- **Google Gemini API key** — get one at [Google AI Studio](https://aistudio.google.com/)

### Clone & Install

```bash
git clone https://github.com/CharlesOsang017/interview_prep.git
cd interview_prep
```

#### Backend

```bash
cd backend
npm install
```

#### Frontend

```bash
cd frontend
npm install
```

### Environment Variables

The project ships with `.env.example` files in both `backend/` and `frontend/`. Copy each to `.env` and fill in the values.

#### `backend/.env`

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/interview-prep
JWT_SECRET=your_jwt_secret_key_here
GEMINI_API_KEY=your_google_gemini_api_key_here
```

| Variable         | Description                        |
| ---------------- | ---------------------------------- |
| `PORT`           | Port the Express server listens on |
| `MONGODB_URI`    | MongoDB connection string          |
| `JWT_SECRET`     | Secret key used to sign JWT tokens |
| `GEMINI_API_KEY` | API key for Google Gemini AI       |

#### `frontend/.env`

```env
VITE_API_BASE_URL=http://localhost:5000
```

> **Note:** The API base URL is also configurable in `src/utils/apiPaths.js` as `BASE_URL`. Update both if your backend runs on a different port or host.

### Run Locally

Start the **backend** first (starts on port 5000):

```bash
cd backend
npm run dev
```

Then in a separate terminal, start the **frontend**:

```bash
cd frontend
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

**Build for production:**

```bash
# Backend
cd backend
npm start

# Frontend
cd frontend
npm run build
npm run preview
```

---

## Project Structure

```
interview-prep/
├── backend/
│   ├── config/
│   │   └── db.js                    # MongoDB connection (cached for Vercel)
│   ├── controllers/
│   │   ├── ai.controller.js         # Gemini AI integration (questions, explanations)
│   │   ├── auth.controller.js       # Register / login / profile
│   │   ├── question.controller.js   # CRUD for questions + explain + answer-tip
│   │   └── session.controller.js    # CRUD for sessions
│   ├── middlewares/
│   │   ├── auth.middleware.js        # JWT verification
│   │   └── upload.middleware.js      # File upload handling
│   ├── models/
│   │   ├── question.model.js        # Question schema (includes explanation & answerTip)
│   │   ├── session.model.js         # Session schema
│   │   └── user.model.js            # User schema
│   ├── routes/
│   │   ├── auth.route.js
│   │   ├── question.route.js        # Includes /explain and /answer-tip endpoints
│   │   └── session.route.js
│   ├── utils/
│   │   └── prompts.js               # Gemini prompt templates (question, explain, answer tip)
│   ├── uploads/                     # Uploaded files (gitignored)
│   ├── .env.example
│   ├── server.js                    # Entry point with Vercel-compatible DB middleware
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   ├── favicon.svg
│   │   └── icons.svg
│   ├── src/
│   │   ├── assets/                  # Static images
│   │   ├── components/
│   │   │   ├── Cards/
│   │   │   │   └── ProfileInfoCard.jsx
│   │   │   ├── Inputs/
│   │   │   │   ├── Input.jsx
│   │   │   │   └── ProfilePhotoSelector.jsx
│   │   │   ├── Layouts/
│   │   │   ├── Loader/
│   │   │   │   └── Loader.jsx
│   │   │   └── Modal.jsx
│   │   ├── context/
│   │   │   └── useContext.jsx        # Auth/user context provider
│   │   ├── pages/
│   │   │   ├── Auth/
│   │   │   │   ├── Login.jsx
│   │   │   │   └── Register.jsx
│   │   │   ├── Home/
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   └── components/
│   │   │   │       └── NewSessionModal.jsx
│   │   │   └── InterviewPrep/
│   │   │       ├── InterviewPrep.jsx
│   │   │       └── components/
│   │   │           └── CodeBlock.jsx
│   │   ├── utils/
│   │   │   ├── apiPaths.js          # API route constants (including explain & answer-tip)
│   │   │   ├── axiosInstance.js     # Axios config with auth interceptor
│   │   │   ├── data.js             # Static app data
│   │   │   ├── helper.js           # Utility functions
│   │   │   └── uploadImage.js      # Image upload helper
│   │   ├── App.jsx                 # Root component & router
│   │   ├── index.css               # Global styles & Tailwind imports (Work Sans font)
│   │   └── main.jsx                # Entry point
│   ├── .env.example
│   ├── index.html                  # Work Sans font preload links
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

---

## API Reference

Base URL: `http://localhost:5000/api`

### Authentication

| Method | Endpoint         | Auth         | Description                          |
| ------ | ---------------- | ------------ | ------------------------------------ |
| `POST` | `/auth/register` | —            | Register a new user                  |
| `POST` | `/auth/login`    | —            | Log in and receive a JWT             |
| `GET`  | `/auth/profile`  | ✅ Protected | Get the authenticated user's profile |

**`POST /auth/register`**

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "securepassword123"
}
```

**`POST /auth/login`**

```json
{
  "email": "jane@example.com",
  "password": "securepassword123"
}
```

**Response** (register & login): returns `{ token, user }`. The token must be sent as `Authorization: Bearer <token>` for protected routes.

---

### Sessions

| Method   | Endpoint                | Auth | Description                                      |
| -------- | ----------------------- | ---- | ------------------------------------------------ |
| `POST`   | `/sessions/create`      | ✅   | Create a new session with AI-generated questions |
| `GET`    | `/sessions/my-sessions` | ✅   | List all sessions for the authenticated user     |
| `GET`    | `/sessions/:id`         | ✅   | Get a single session with populated questions    |
| `DELETE` | `/sessions/:id`         | ✅   | Delete a session and its questions               |

**`POST /sessions/create`**

```json
{
  "role": "Frontend Developer",
  "experience": "3",
  "topicsToFocusOn": ["React", "CSS", "Performance"],
  "description": "React interview prep",
  "questions": [{ "question": "...", "answer": "..." }]
}
```

---

### Questions

| Method | Endpoint                    | Auth | Description                                       |
| ------ | --------------------------- | ---- | ------------------------------------------------- |
| `POST` | `/questions/add`            | ✅   | Add questions to an existing session              |
| `POST` | `/questions/:id/pin`        | ✅   | Toggle pin/unpin a question                       |
| `POST` | `/questions/:id/note`       | ✅   | Update the personal note on a question            |
| `POST` | `/questions/:id/explain`    | ✅   | Generate & persist concept explanation (one-time) |
| `POST` | `/questions/:id/answer-tip` | ✅   | Generate & persist answer tips (one-time)         |

**`POST /questions/:id/pin`**

Toggles `isPinned` on the question. No request body needed.

**`POST /questions/:id/note`**

```json
{
  "note": "Remember to mention the STAR method here."
}
```

**`POST /questions/:id/explain`**

No request body. If an explanation already exists, returns it immediately (no AI call). Otherwise generates via Gemini and persists.

**`POST /questions/:id/answer-tip`**

No request body. Same one-time generation pattern — persisted to the question document.

---

### AI

| Method | Endpoint                   | Auth | Description                                 |
| ------ | -------------------------- | ---- | ------------------------------------------- |
| `POST` | `/ai/generate-questions`   | ✅   | Generate interview questions via Gemini     |
| `POST` | `/ai/generate-explanation` | ✅   | Generate a concept deep-dive for a question |

**`POST /ai/generate-questions`**

```json
{
  "role": "Backend Engineer",
  "experience": "5",
  "topicsToFocusOn": "Node.js, PostgreSQL, System Design",
  "numberOfQuestions": 5
}
```

**Response:** array of `{ question, answer }` objects.

**`POST /ai/generate-explanation`**

```json
{
  "question": "What is the event loop in Node.js?"
}
```

**Response:** `{ title, explanation }` — the `explanation` field contains Markdown with optional code blocks.

---

## Frontend Routes

| Path                         | Page                                                           | Auth Required |
| ---------------------------- | -------------------------------------------------------------- | ------------- |
| `/`                          | Landing page — hero, features, login/register modal            | No            |
| `/dashboard`                 | Dashboard — session list, stats, new session creation          | Yes           |
| `/interview-prep/:sessionId` | Session detail — expandable questions, pin, notes, AI features | Yes           |
| `/interview-prep/demo`       | Demo session — four sample questions, no login needed          | No            |

---

## Usage Guide

1. **Sign up** from the landing page or the login modal.
2. **Create a session** by clicking "New Session" on the dashboard — choose a role, experience level, and topics.
3. **Review AI-generated questions** — each comes with a model answer rendered in Markdown.
4. **Interact with questions:**
   - Click to expand/collapse the answer.
   - **Pin** important questions so they float to the top.
   - Click **Explain concept** for an AI deep-dive on that question's topic (generated once, persisted forever).
   - Click **Get answer tips** for coaching on how to structure your answer.
   - Write and save **personal notes** to each question.
5. **Generate more questions** mid-session by clicking the "Generate More Questions" button at the bottom — adds 7 new questions.
6. **Navigate large sessions** — only 10 questions show initially; click "Show N more questions" to reveal the rest.
7. **Manage sessions** — delete old sessions from the dashboard.
8. **Try the demo** at `/interview-prep/demo` without creating an account.

---

## Vercel Deployment Notes

The backend is deployed as a **serverless function** on Vercel. Unlike a traditional Express server, `app.listen()` never executes — requests are handled on-demand. The database connection is established via a global Express middleware that runs before every request, with smart caching:

- `config/db.js` checks `mongoose.connection.readyState` before opening a new connection.
- A global promise cache prevents duplicate connection attempts during concurrent requests.
- `connectDB()` is called in a middleware at the top of the stack, so all routes including authentication have a live connection.

---

## Contributing

1. Fork the repository.
2. Create a feature branch: `git checkout -b feat/my-feature`
3. Commit your changes: `git commit -m 'feat: add my feature'`
4. Push to the branch: `git push origin feat/my-feature`
5. Open a Pull Request.

**Code style:** ESLint + Prettier conventions. Run `npm run lint` before committing.

---

## License

MIT © [Charles Osango](https://github.com/CharlesOsang017)
