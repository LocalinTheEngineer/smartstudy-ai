# 🤖 SmartStudy AI

An AI-powered study management platform that helps students organize courses,
upload study materials, generate quizzes, and create personalized study plans —
powered by Google's Gemini API.

**🔗 Live Demo:** [smartstudy-ai-delta.vercel.app](https://smartstudy-ai-delta.vercel.app)

## ✨ Features

- **Authentication** — secure register/login with JWT and hashed passwords (bcrypt)
- **Courses & Materials** — create courses, add text notes or upload `.pdf` / `.txt` files
- **AI Summarization** — summarize any note or uploaded file with Gemini
- **AI Quiz Generator** — generate multiple-choice quizzes on any topic, answer them
  in the browser, and get instantly scored
- **AI Study Planner** — generate a personalized study schedule based on your exam
  date, available time, and subjects

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
