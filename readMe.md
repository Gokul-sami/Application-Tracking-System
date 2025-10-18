# Application Tracking System (ATS)

A full-stack job application tracking system built with React (frontend) and Express.js (backend), using MongoDB as the database.

## Features
- **Admin:** Add/update/delete jobs, view applications, update status, view history  
- **Applicant:** View jobs, apply, track status, see application history  

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- npm
- MongoDB Atlas account

### Backend
1. Go to backend folder:
   ```bash
   cd backend/backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create `.env`:
   ```env
   PORT=5000
   MONGO_URI=<Your MongoDB URI>
   JWT_SECRET=<Your secret key>
   ```
4. Start server:
   ```bash
   npm start
   ```

### Frontend
1. Go to frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create `.env`:
   ```env
   VITE_BACKENDURL=http://localhost:5000
   ```
4. Start development server:
   ```bash
   npm run dev
   ```

## Build Frontend for Production
```bash
npm run build
```
Deploy `dist/` folder to Netlify, Vercel, or any static hosting.

## Usage
- Open frontend in browser
- Applicants browse jobs and apply
- Admins manage jobs and applications
