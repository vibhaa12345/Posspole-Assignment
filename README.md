# Fullstack Feedback App (Ready-to-run scaffold)

This repo contains a minimal, ready-to-run full-stack web app:
- **Backend**: Node.js + Express + Mongoose (MongoDB)
- **Frontend**: React + Vite

It includes:
- Authentication (signup/login) with bcrypt + JWT
- Student feedback submission (ratings + message)
- Simple admin endpoints (seed creates admin)
- Course management endpoints
- CSV export endpoint for admin

## Quickstart (local)

1. Install Node and MongoDB locally (or use Docker Compose).
2. Backend:
   - `cd backend`
   - copy `.env.example` to `.env` and set `MONGO_URI` and `JWT_SECRET`
   - `npm install`
   - Seed sample admin and courses: `node scripts/seed.js`
   - `npm run dev` (requires nodemon) or `npm start`
3. Frontend:
   - `cd frontend`
   - `npm install`
   - create `.env` in frontend if you want: `VITE_API_URL=http://localhost:4000/api`
   - `npm run dev`
4. Open http://localhost:3000

## Example admin login
- email: `admin@school.test`
- password: `Password@123`

## Notes
- This is a scaffold focusing on the core features requested. You can extend:
  - Profile update endpoints
  - File uploads (Cloudinary) for avatar
  - Better front-end UX and pagination
  - Unit tests

