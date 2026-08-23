# TaskFlow - MERN Stack Task Management System

![TaskFlow UI Preview](https://img.shields.io/badge/UI-Material_UI_v6-7C3AED?style=for-the-badge)
![MERN Stack](https://img.shields.io/badge/Stack-MERN-4CAF50?style=for-the-badge)

A full-stack, enterprise-grade Task Management application built with the MERN stack (MongoDB, Express, React, Node.js). This project was developed with a strong focus on secure authentication, robust error handling, scalable architecture, and a premium, responsive UI/UX.

## ✨ Key Features & Architectural Decisions

### Frontend (React + Vite + Material UI v6)

- **Modern SaaS UI/UX:** Custom Material UI theme featuring glassmorphism, soft shadows, outside labels, and dynamic color-coded status/priority tags (inspired by Linear/Notion).
- **Optimized Performance:** Implemented a **500ms debounced search** to prevent excessive API calls while typing, reducing server load.
- **Seamless Authentication:** Utilizes React Context API for global auth state and **Axios Interceptors** to automatically inject JWT Bearer tokens into every outgoing request.
- **Optimistic UI Updates:** Task CRUD operations update the local state instantly without requiring full page reloads, making the app feel lightning fast.
- **Client-Side Protections:** Protected routes via `react-router-dom` and native browser date-picker protections preventing past-date selections.
- **Polished Feedback:** Toast notifications (`react-hot-toast`) and custom MUI Dialogs for all interactions, including a safe-guard modal for destructive actions (Delete Task).

### Backend (Node.js + Express + MongoDB)

- **RESTful Architecture:** Strict adherence to REST principles, including utilizing `PATCH` for partial task updates instead of `PUT`.
- **Advanced Error Handling:** Global error handling middleware utilizing a custom `AppError` class to catch and format async errors, Mongoose validation errors, and JWT expiration errors uniformly.
- **Secure Authentication:** JWT-based stateless authentication with `bcryptjs` password hashing.
- **Data Integrity:** Mongoose model-level validations (e.g., custom validator preventing due dates in the past at the database level).
- **Security & Authorization:** Strict ownership validation ensures users can only fetch, modify, or delete their own tasks.

## 🛠️ Tech Stack

- **Client:** React 18, Vite, Material UI (MUI v6+), Axios, React Router v6, React Hot Toast
- **Server:** Node.js, Express.js, CORS, Dotenv
- **Database:** MongoDB, Mongoose
- **Authentication:** JSON Web Tokens (JWT), bcryptjs

## 📁 Project Structure

```text
task-manager-assessment/
├── client/                 # React Frontend (Vite)
│   ├── src/
│   │   ├── components/     # Reusable UI components (ProtectedRoute, etc.)
│   │   ├── context/        # AuthContext for global state
│   │   ├── pages/          # Dashboard, Login, Register
│   │   ├── services/       # Axios instance with interceptors
│   │   └── App.jsx         # Routing and Theme setup
│   └── package.json
├── server/                 # Node.js/Express Backend
│   ├── controllers/        # Route logic (authController, taskController)
│   ├── models/             # Mongoose schemas (User, Task)
│   ├── routes/             # Express routers
│   ├── middleware/         # Auth guards and global error handlers
│   ├── utils/              # Custom AppError class
│   ├── server.js           # Entry point
│   └── .env.example        # Environment variables template
└── README.md
```
