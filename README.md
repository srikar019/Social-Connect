# PostHub

PostHub is a modern, responsive, and full-stack social networking application built with **React (Vite)**, **Node.js (Express)**, and **MongoDB**. The platform features a premium, eye-catching design styled with Vanilla CSS using a custom **Royal Violet** color system, custom UI components, and rich animations.

---

## 🌟 Key Features

### 🎨 Design & Layout
*   **Royal Violet Theme**: Harmonious HSL-derived violet accents, sleek hover states, and premium glassmorphic elements.
*   **Floating Pill Header**: A floating sticky header containing brand title, notification tray, and user profile dropdown.
*   **Curved Bottom Navigation**: A responsive, 615px wide navigation bar with a smooth Bezier curved center cutout overlaying the Compose (`+`) button.
*   **Aesthetic Auth Forms**: Fully customized login and signup forms with fluid input styling, custom password visibility toggles, and oauth design placeholders.
*   **Standardized Icons**: Consistent visual cues using Lucide icons and rounded user avatars.

### 📱 Core Application Functions
*   **Timeline Feed & Filtering**: Sort posts seamlessly by **All Posts**, **Most Liked**, or **Most Commented**.
*   **Post Creation**: Upload base64 images, input post content, and enjoy automatic hashtag rendering/highlighting.
*   **Interactive Engagement**: Like posts, post comments, and view engagement statistics.
*   **Profile Management**: View detailed user stats (follower/following counts), edit profile details, and trigger follow/unfollow status.
*   **Embedded Notifications**: Receive real-time-like notification logs (e.g., when a user receives a follow) in a custom notched dropdown tray.

---

## 🛠️ Tech Stack

*   **Frontend**: React (Vite), Vanilla CSS, Lucide React (Icons)
*   **Backend**: Node.js, Express, JSON Web Tokens (JWT) for secure authentication
*   **Database**: MongoDB (Mongoose) with optimized two-collection schema design (User & Post, with Notifications embedded for high availability and performance)

---

## 🚀 Setup & Installation

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) and [MongoDB](https://www.mongodb.com/) installed on your machine.

---

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables. Create a `.env` file in the `backend` directory (using `.env.example` as a template):
   ```env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/posthub
   JWT_SECRET=your_jwt_secret_key_here
   ```
4. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The server runs by default on `http://localhost:5000`.*

---

### 2. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables. Create a `.env` file in the `frontend` directory:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
   *For production deployment, replace this URL with your live API server URL.*
4. Start the frontend development server:
   ```bash
   npm run dev
   ```
   *The web app runs by default on `http://localhost:5173`.*

---

## 🧪 Database Architecture

To maximize database read performance and keep the project minimal, data is structured within **two core collections**:
1.  **Users**: Stores credentials, profile info, follower/following relationships, and an array of embedded **Notifications**.
2.  **Posts**: Stores author info, post text/media, likes, and comment objects.

---

## 📁 Repository Structure

```text
assessment/
├── backend/
│   ├── middleware/     # Auth and validation middlewares
│   ├── models/         # Mongoose Schemas (User, Post)
│   ├── routes/         # Express API route endpoints
│   ├── .env.example    # Example environment variables
│   ├── server.js       # Main server entrypoint
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/ # Modular React UI components (Header, Auth, PostCard, BottomNavigation, etc.)
│   │   ├── App.jsx     # App shell, routing state, timeline controller
│   │   ├── index.css   # Centralized theme tokens and global layout CSS
│   │   └── main.jsx
│   ├── .env            # Frontend environment configuration
│   ├── vite.config.js
│   └── package.json
└── README.md
```

---

## 🌐 Deployed Links

*   **Frontend**: *https://posthub-frontend.vercel.app/*
*   **Backend API**: *https://social-connect-backend-gpgw.onrender.com*
