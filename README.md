# Feedback Management App

A full-stack MERN application for managing student feedback, profiles, and courses with role-based authentication and an admin dashboard.

## Features
- User authentication (JWT-based)
- Student feedback submission & management
- Profile editing with avatar upload & password change
- Course management
- Admin dashboard (view feedback, manage students, export CSV)

## Tech Stack
- Frontend: React (Vite)
- Backend: Node.js, Express
- Database: MongoDB Atlas
- Authentication: JWT + bcrypt

## Local Setup

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas URI)

### 1. Clone repo
git clone https://github.com/<vibhaa12345>/<Posspole-Assignment>.git
cd <Posspole-Assignment>

### 2. Backend setup
cd backend
cp .env.example .env
# edit .env and set MONGO_URI (local or Atlas), JWT_SECRET
npm install
node scripts/seed.js   # seeds admin + sample courses
npm run dev            # runs at http://localhost:4000

### 3. Frontend setup
cd ../frontend
cp .env.example .env
# edit .env and set VITE_API_URL=http://localhost:4000/api
npm install
npm run dev            # runs at http://localhost:3000

## Environment Variables

### Backend (.env)
PORT=4000  
MONGO_URI=mongodb+srv://dbuser:password@cluster0.xxxxx.mongodb.net/fullstack_db?retryWrites=true&w=majority  
JWT_SECRET=your_jwt_secret  
CLOUDINARY_URL= (optional if using Cloudinary for images)

### Frontend (.env)
VITE_API_URL=http://localhost:4000/api

## Deployment
- Frontend (Vercel): https://your-frontend.vercel.app
- Backend (Render): https://posspole-assignment-round1-v2ry.onrender.com


## Sample Admin Login
email: admin@school.test  
password: Password@123

## Debugging Notes
- If backend fails to connect, check `MONGO_URI` (Atlas user/IP whitelist).
- If frontend cannot reach backend, update `VITE_API_URL` in frontend `.env`.
- If avatars don’t upload in Render, use Cloudinary integration.

