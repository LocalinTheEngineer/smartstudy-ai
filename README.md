# 🤖 SmartStudy AI

**Turn your study materials into a personalized study plan — automatically.**

SmartStudy AI is an AI-powered study management platform built around one flow:

**📚 Upload study materials → 🧠 AI summarizes them → ❓ AI generates a quiz → 📈 AI builds you a personalized study plan based on how you actually performed.**

It's not just "a project that calls an AI API" — it tracks your quiz results over time,
detects the topics you're weak in, and feeds that straight back into your study plan.

**🔗 Live Demo:** [smartstudy-ai-delta.vercel.app](https://smartstudy-ai-delta.vercel.app)

<br>

## 📸 Screenshots

<table>
  <tr>
    <td align="center"><b>Dashboard</b></td>
    <td align="center"><b>AI Quiz — instantly scored</b></td>
  </tr>
  <tr>
    <td><img src="docs/screenshots/dashboard.png" width="420"/></td>
    <td><img src="docs/screenshots/quiz-result.png" width="420"/></td>
  </tr>
  <tr>
    <td align="center"><b>Course materials + AI summarization</b></td>
    <td align="center"><b>Personalized study plan</b></td>
  </tr>
  <tr>
    <td><img src="docs/screenshots/course-details.png" width="420"/></td>
    <td><img src="docs/screenshots/study-planner.png" width="420"/></td>
  </tr>
</table>

<br>

## 🔄 How it works

1. **Add a course and upload materials** — paste lecture notes or upload a `.pdf` / `.txt` file.
2. **Summarize with AI** — get a short Gemini-generated summary of any material in seconds.
3. **Take an AI-generated quiz** — Gemini writes multiple-choice questions on any topic, you answer them in the browser, and get scored instantly.
4. **Get a personalized study plan** — tell it your exam date and available study time, and Gemini builds a week-by-week schedule.
5. **Track your progress** — every quiz attempt is saved. The **Stats** page shows your overall accuracy and a topic-by-topic breakdown, and automatically flags weak topics (<60% accuracy) so you know exactly what to focus on next — with one click to add them straight into your next study plan.

## ✨ Features

- **Authentication** — secure register/login with JWT and hashed passwords (bcrypt)
- **Courses & Materials** — create courses, add text notes or upload `.pdf` / `.txt` files
- **AI Summarization** — summarize any note or uploaded file with Gemini
- **AI Quiz Generator** — generate multiple-choice quizzes on any topic, answer them
  in the browser, and get instantly scored
- **AI Study Planner** — generate a personalized study schedule based on your exam
  date, available time, and subjects
- **Quiz History & Weak-Topic Detection** — every quiz attempt is saved and analyzed
  per topic, automatically surfacing the topics you're struggling with
- **Stats Dashboard** — overall accuracy, quiz count, and a color-coded topic-by-topic
  performance chart

## 🧱 Tech Stack

**Frontend:** React, Vite, React Router, Axios
**Backend:** Node.js, Express
**Database:** MongoDB (Atlas), Mongoose
**AI:** Google Gemini API (`@google/genai`)
**Other:** JWT authentication, bcryptjs, Multer (file uploads), pdf-parse

## 📁 Project Structure

```
smartstudy-ai
├── client            React frontend (Vite)
│   └── src
│       ├── components
│       ├── pages
│       ├── services
│       ├── hooks
│       └── context
├── server            Express backend
│   └── src
│       ├── controllers
│       ├── services
│       ├── routes
│       ├── middleware
│       └── models
└── docs
    └── screenshots
```

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/LocalinTheEngineer/smartstudy-ai.git
cd smartstudy-ai
```

### 2. Set up the backend

```bash
cd server
npm install
```

Create a `.env` file in `server/` (see `.env.example`) with:

```
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=any_long_random_string
GEMINI_API_KEY=your_google_gemini_api_key
```

Then run:

```bash
npm run dev
```

### 3. Set up the frontend

In a new terminal:

```bash
cd client
npm install
npm run dev
```

The app will be available at `http://localhost:5173` (backend at `http://localhost:5000`).

## 📝 Status

🚧 Actively being built, step by step, as a learning/portfolio project.

## 📄 License

This project is for educational/portfolio purposes.
