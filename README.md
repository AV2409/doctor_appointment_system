# MediSync — Doctor Appointment Booking System

A production-ready, full-stack MERN web application where patients can browse doctors by speciality, book appointments, pay online, and manage their profile — backed by a robust REST API with JWT authentication, Razorpay payments, Cloudinary image uploads, and transactional email via Resend.

> **Status:** ✅ Backend · ✅ Patient Frontend · ✅ Admin & Doctor Panel — **Fully Complete**

---

## Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [API Reference](#api-reference)
- [Environment Variables](#environment-variables)
- [Setup & Installation](#setup--installation)
- [Running the Project](#running-the-project)
- [Author](#author)

---

## Project Overview

**MediSync** is a healthcare appointment platform connecting patients with doctors. It ships as three separate apps that share a single Express/MongoDB backend:

| App | Description | Default Port |
|---|---|---|
| `backend/` | REST API (Node.js + Express + MongoDB) | `4000` |
| `frontend/` | Patient-facing React app (Vite + Tailwind CSS) | `5173` |
| `admin/` | Admin & Doctor panel (Vite + Tailwind CSS) | `5174` |

Key highlights:
- **JWT-based auth** with short-lived access tokens (15 min) and rotating refresh tokens (7 days) stored in `httpOnly` cookies — per role (USER, DOCTOR, ADMIN)
- **Razorpay** payment integration with server-side order creation and HMAC-SHA256 signature verification
- **Cloudinary** image hosting for doctor and user profile photos
- **Resend** transactional email for appointment confirmations
- **Role-based middleware** (`authorize("USER" | "DOCTOR" | "ADMIN")`) — each role can only access its own resources
- Consistent error handling via a global `errorHandler` middleware and custom `ApiError` / `ApiResponse` utilities

---

## Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express | REST API server |
| MongoDB + Mongoose | Database + ODM |
| bcrypt | Password hashing |
| jsonwebtoken | Access & refresh token signing |
| Multer | Multipart file parsing |
| Cloudinary SDK | Cloud image storage |
| Razorpay SDK | Payment order creation & verification |
| Resend SDK | Transactional email |
| cookie-parser | httpOnly cookie handling |
| CORS | Cross-origin config for two frontends |
| dotenv | Environment variable loading |
| nodemon | Dev auto-restart |

### Frontend (Patient App)
| Technology | Purpose |
|---|---|
| React 19 | UI library |
| Vite 8 | Build tool + dev server |
| React Router v7 | Client-side routing |
| Tailwind CSS v3 | Utility-first styling |
| Axios | HTTP client |
| Context API | Global state (doctors, user, token) |
| React Toastify | Toast notifications |

### Admin / Doctor Panel
| Technology | Purpose |
|---|---|
| React 19 | UI library |
| Vite 8 | Build tool + dev server |
| React Router v7 | Routing (shared login + role-split pages) |
| Tailwind CSS v3 | Styling |
| Axios | HTTP client |
| Context API | Admin context + Doctor context |
| React Toastify | Notifications |

---

## Features

### Patient Frontend

- **Home** — Hero section, speciality menu, top-10 doctors grid, banner CTA
- **Doctors** — Browse all doctors; filter by speciality via URL params
- **Appointment Booking** — Doctor detail page, dynamic 7-day slot generation (30-min intervals, 10 AM – 9 PM), booked-slot exclusion, login guard
- **Authentication** — Single-page login / register toggle; JWT stored in `httpOnly` cookie; session managed via refresh-token flow
- **My Profile** — View & edit name, phone, address, gender, date of birth; profile photo upload to Cloudinary
- **My Appointments** — List of all appointments (newest-first) with status badges: Upcoming / Paid / Completed / Cancelled; cancel & pay actions
- **Razorpay Payment** — Client-side Razorpay modal wired to server-side order creation + signature verification
- **About & Contact** — Static informational pages

### Admin Panel

- **Login** — Credential-based admin login (env variables; no DB entry required)
- **Dashboard** — Overview stats: total doctors, total appointments, total patients; latest appointments list
- **Add Doctor** — Form with Cloudinary photo upload; speciality, degree, experience, fees, address
- **All Doctors** — Table of all registered doctors with availability toggle
- **All Appointments** — Full appointment list with cancel action

### Doctor Dashboard

- **Login** — Doctor credentials (email + password set by admin at registration)
- **Dashboard** — Earnings overview, appointment count, patient count; latest appointments list; availability toggle
- **My Appointments** — Full list with Complete / Cancel actions
- **My Profile** — View & edit fees, address, availability

### Backend API

- Unified JWT auth middleware reads the `accessToken` cookie and attaches `req.user` + `req.role`
- Role middleware (`authorize(...)`) enforces resource isolation between USER, DOCTOR, and ADMIN
- Refresh token endpoints for seamless session renewal without re-login
- Global async error handler eliminates boilerplate try/catch in controllers
- Cloudinary upload via Multer disk storage → cloud upload → delete local temp file
- Razorpay order creation + HMAC-SHA256 signature verification on payment callback
- Resend email triggered on successful appointment booking

---

## Project Structure

```
doctor_appointment_system/
├── backend/
│   └── src/
│       ├── app.js                   # Express app, CORS, route mounting
│       ├── index.js                 # DB connect + server start
│       ├── constants.js
│       ├── controllers/
│       │   ├── adminController.js
│       │   ├── doctorController.js
│       │   └── userController.js
│       ├── db/
│       │   └── index.js             # Mongoose connection
│       ├── middlewares/
│       │   ├── auth.middleware.js   # verifyJWT — reads httpOnly cookie
│       │   ├── role.middleware.js   # authorize("USER" | "DOCTOR" | "ADMIN")
│       │   └── multer.middleware.js
│       ├── models/
│       │   ├── appointmentModel.js
│       │   ├── doctorModel.js
│       │   └── userModel.js
│       ├── routes/
│       │   ├── adminRoute.js
│       │   ├── doctorRoute.js
│       │   └── userRoute.js
│       └── utils/
│           ├── ApiError.js
│           ├── ApiResponse.js
│           ├── asyncHandler.js
│           └── cloudinary.js
│
├── frontend/                        # Patient-facing React app
│   └── src/
│       ├── assets/
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── Footer.jsx
│       │   ├── Header.jsx
│       │   ├── SpecialityMenu.jsx
│       │   ├── TopDoctors.jsx
│       │   ├── Banner.jsx
│       │   └── RelatedDoctors.jsx
│       ├── context/
│       │   └── AppContext.jsx       # Doctors, user data, token, helpers
│       ├── pages/
│       │   ├── Home.jsx
│       │   ├── Doctors.jsx
│       │   ├── Appointment.jsx
│       │   ├── Login.jsx
│       │   ├── MyProfile.jsx
│       │   ├── MyAppointments.jsx
│       │   ├── About.jsx
│       │   └── Contact.jsx
│       └── utils/
│
└── admin/                           # Admin + Doctor panel React app
    └── src/
        ├── components/
        ├── context/
        │   ├── AdminContext.jsx
        │   └── DoctorContext.jsx
        ├── pages/
        │   ├── Login.jsx            # Shared login (admin + doctor)
        │   ├── admin/
        │   │   ├── Dashboard.jsx
        │   │   ├── AddDoctor.jsx
        │   │   ├── AllAppointments.jsx
        │   │   └── DoctorsList.jsx
        │   └── doctor/
        │       ├── DoctorDashboard.jsx
        │       ├── DoctorAppointments.jsx
        │       └── DoctorProfile.jsx
        └── utils/
```

---

## API Reference

All routes are prefixed with `/api`.

### User Routes — `/api/user`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/register` | Public | Register a new patient |
| POST | `/login` | Public | Login; sets `accessToken` + `refreshToken` cookies |
| POST | `/refresh-token` | Public | Rotate access token using refresh token |
| POST | `/logout` | USER | Clear auth cookies |
| GET | `/get-profile` | USER | Fetch own profile |
| POST | `/update-profile` | USER | Update profile + optional photo upload |
| POST | `/book-appointment` | USER | Book a doctor appointment |
| GET | `/appointments` | USER | List own appointments |
| POST | `/cancel-appointment` | USER | Cancel an appointment |
| POST | `/payment-razorpay` | USER | Create a Razorpay order |
| POST | `/verifyRazorpay` | USER | Verify payment signature |

### Doctor Routes — `/api/doctor`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/list` | Public | Get all available doctors |
| POST | `/login` | Public | Doctor login |
| POST | `/refresh-token` | Public | Rotate doctor access token |
| POST | `/logout` | DOCTOR | Logout |
| GET | `/appointments` | DOCTOR | List own appointments |
| POST | `/complete-appointment` | DOCTOR | Mark appointment as completed |
| POST | `/cancel-appointment` | DOCTOR | Cancel an appointment |
| GET | `/dashboard` | DOCTOR | Dashboard stats |
| GET | `/profile` | DOCTOR | Get own profile |
| POST | `/update-profile` | DOCTOR | Update fees, address, availability |
| POST | `/change-availability` | DOCTOR | Toggle availability |

### Admin Routes — `/api/admin`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/login` | Public | Admin login (env credentials) |
| POST | `/refresh-token` | Public | Rotate admin access token |
| POST | `/logout` | ADMIN | Logout |
| POST | `/add-doctor` | ADMIN | Add a new doctor (with photo) |
| GET | `/all-doctors` | ADMIN | List all doctors |
| GET | `/appointments` | ADMIN | List all appointments |
| POST | `/cancel-appointment` | ADMIN | Cancel any appointment |
| GET | `/dashboard` | ADMIN | Platform-wide stats |
| POST | `/change-availability` | ADMIN/DOCTOR | Toggle doctor availability |

---

## Environment Variables

### `backend/.env`

```env
PORT=4000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/?appName=Cluster0

# CORS — list both frontends
CORS_ORIGIN_USER=http://localhost:5173
CORS_ORIGIN_ADMIN=http://localhost:5174

# Admin credentials (no DB entry needed)
ADMIN_EMAIL=admin@medisync.com
ADMIN_PASSWORD=your_admin_password

# JWT
ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=7d

# Cloudinary
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_SECRET_KEY=your_api_secret

# Razorpay
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret
CURRENCY=INR

# Resend (transactional email)
RESEND_API_KEY=re_xxxxxxxxxxxx
EMAIL_FROM="MediSync <onboarding@resend.dev>"
```

### `frontend/.env`

```env
VITE_BACKEND_URL=http://localhost:4000
```

### `admin/.env`

```env
VITE_BACKEND_URL=http://localhost:4000
```

---

## Setup & Installation

### Prerequisites

- Node.js **v18+**
- npm **v9+**
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account
- Razorpay account (test keys work fine)
- Resend account (free tier is sufficient)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/doctor_appointment_system.git
cd doctor_appointment_system
```

### 2. Install dependencies

```bash
# Backend
cd backend && npm install

# Patient frontend
cd ../frontend && npm install

# Admin panel
cd ../admin && npm install
```

### 3. Configure environment variables

Create `.env` files in each app directory using the templates in the [Environment Variables](#environment-variables) section above and fill in your credentials.

---

## Running the Project

Open **three separate terminals**:

```bash
# Terminal 1 — Backend API
cd backend
npm run dev
# → http://localhost:4000

# Terminal 2 — Patient Frontend
cd frontend
npm run dev
# → http://localhost:5173

# Terminal 3 — Admin / Doctor Panel
cd admin
npm run dev
# → http://localhost:5174
```

> The backend must be running before using either frontend app.

---

## Author

Built as a full-stack MERN portfolio project demonstrating:

- **Three-app monorepo** — shared backend serving two independent React frontends
- **Role-based JWT auth** with httpOnly cookies and refresh token rotation
- **Third-party integrations** — Razorpay payments, Cloudinary media storage, Resend email
- **Clean architecture** — controllers / routes / models / middlewares / utils separation
- **Component-based React UI** with Context API state management
- **Responsive, mobile-first design** using Tailwind CSS

---

*MediSync — Full stack complete as of July 2026.*
