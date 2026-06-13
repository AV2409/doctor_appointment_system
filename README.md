# Doctor Appointment Booking System

A full-stack MERN web application that allows patients to browse doctors by speciality, book appointments, manage their profile, and handle payments — all from a clean, responsive interface.

> **Current Status:** Frontend complete · Backend development in progress

---

## Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Features Implemented](#features-implemented)
- [Project Structure](#project-structure)
- [Available Routes](#available-routes)
- [Development Progress](#development-progress)
- [Setup Instructions](#setup-instructions)
- [Mock Data Notice](#mock-data-notice)
- [Roadmap](#roadmap)

---

## Project Overview

Prescripto is a doctor appointment booking platform that connects patients with healthcare professionals. Patients can filter doctors by speciality, view doctor details, select available time slots, and book appointments — with a full profile management experience and integrated payment flow.

The project follows a MERN architecture (MongoDB, Express, React, Node.js) with a separate frontend client and backend server. **The frontend is fully built and production-ready.** Backend integration is the next development phase.

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 | UI library |
| Vite | Build tool and dev server |
| React Router v6 | Client-side routing |
| Tailwind CSS | Utility-first styling |
| Axios | HTTP client for API calls |
| Context API | Global state management |
| React Toastify | Toast notifications |

### Backend *(planned)*
| Technology | Purpose |
|---|---|
| Node.js + Express | REST API server |
| MongoDB + Mongoose | Database and ODM |
| JWT | Authentication |
| Razorpay | Payment gateway |
| Multer + Cloudinary | File/image uploads |

---

## Features Implemented

### Home Page
- Hero section with call-to-action
- Speciality menu with icon grid (navigate to filtered doctors)
- Top Doctors section (displays top 10)
- Banner CTA to appointment booking

### Navigation
- Responsive navbar with mobile hamburger menu
- Active route highlighting
- Auth-aware: shows profile dropdown when logged in, "Create account" when not
- Sticky footer with company links and contact info

### Doctors
- All doctors listing page
- Real-time speciality filtering (URL-based with `useParams`)
- Responsive doctor cards with availability badge (Available / Not Available)
- Smooth filter UI with active state highlighting

### Appointment Booking
- Individual doctor detail page with profile, qualifications, fees
- Dynamic 7-day slot generation (10 AM – 9 PM, 30-min intervals)
- Day selector and time slot picker with interactive state
- Booked slots filtered out of available options
- Booking API wiring (POST `/api/user/book-appointment`)
- Login guard — redirects unauthenticated users to login
- Related doctors section at the bottom of the page

### Authentication
- Login and Registration on a single toggled page
- Form validation and error handling via toast
- JWT token stored in `localStorage` and synced to Context
- Auth state drives UI across all components

### User Features
- My Profile page — displays user info with edit mode toggle
- Editable fields: name, phone, address (2 lines), gender, date of birth
- Profile image upload UI with hover overlay
- My Appointments page — lists all appointments newest-first
- Appointment status badges: Upcoming / Paid / Completed / Cancelled
- Cancel appointment with confirmation
- Razorpay payment flow wiring (initiates order, opens Razorpay modal)

### Information Pages
- About page — two-column layout with vision statement and "Why Choose Us" columns
- Contact page — office address, phone, email, and careers section

---

## Project Structure

```
doctor_appointment_system/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   │   └── assets.js          # All image URLs, icons, and mock data
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── SpecialityMenu.jsx
│   │   │   ├── TopDoctors.jsx
│   │   │   ├── Banner.jsx
│   │   │   └── RelatedDoctors.jsx
│   │   ├── context/
│   │   │   └── AppContext.jsx      # Global state: doctors, user, token, helpers
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Doctors.jsx
│   │   │   ├── Appointment.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── MyProfile.jsx
│   │   │   ├── MyAppointments.jsx
│   │   │   ├── About.jsx
│   │   │   └── Contact.jsx
│   │   ├── App.jsx                 # Route definitions
│   │   ├── main.jsx
│   │   └── index.css               # Tailwind base + custom tokens
│   ├── .env                        # VITE_BACKEND_URL (see setup)
│   ├── index.html
│   ├── tailwind.config.js
│   └── vite.config.js
├── .gitignore
└── README.md
```

---

## Available Routes

| Route | Page | Auth Required |
|---|---|---|
| `/` | Home | No |
| `/doctors` | All Doctors | No |
| `/doctors/:speciality` | Filtered Doctors | No |
| `/appointment/:docId` | Book Appointment | Yes (redirects to login) |
| `/login` | Login / Register | No |
| `/my-profile` | User Profile | Yes |
| `/my-appointments` | Appointment History | Yes |
| `/about` | About Us | No |
| `/contact` | Contact Us | No |

---

## Development Progress

### Frontend
- [x] Project setup (Vite + React + Tailwind CSS)
- [x] Folder structure and routing
- [x] Global state with Context API
- [x] Mock data (15 doctors across 6 specialities)
- [x] Navbar, Footer
- [x] Home page (Hero, Speciality Menu, Top Doctors, Banner)
- [x] Doctors page with speciality filtering
- [x] Appointment booking page with slot generation
- [x] Related doctors component
- [x] Login / Registration page
- [x] My Profile page
- [x] My Appointments page
- [x] About page
- [x] Contact page
- [x] Razorpay payment UI wiring
- [x] Auth-aware navigation state

### Backend *(next phase)*
- [ ] Node.js + Express project setup
- [ ] MongoDB connection and Mongoose models
- [ ] User registration and login (JWT)
- [ ] Doctor data API
- [ ] Appointment booking API
- [ ] User profile API (get, update)
- [ ] Payment order creation (Razorpay)
- [ ] Payment verification endpoint
- [ ] Admin panel backend
- [ ] Doctor dashboard backend
- [ ] Cloudinary image upload integration

---

## Setup Instructions

### Prerequisites
- Node.js v18+
- npm v9+

### 1. Clone the repository

```bash
git clone https://github.com/your-username/doctor_appointment_system.git
cd doctor_appointment_system
```

### 2. Install frontend dependencies

```bash
cd frontend
npm install
```

### 3. Configure environment variables

Create a `.env` file inside the `frontend/` directory:

```env
VITE_BACKEND_URL=http://localhost:4000
```

> This URL points to the backend server. The frontend will work with mock data even without a running backend — API calls will simply fail gracefully until the backend is set up.

### 4. Start the development server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## Mock Data Notice

> **The frontend currently uses mock data defined in `src/assets/assets.js`.**

Until the backend API is live, the following data is served from the frontend:

- **Doctor listings** — 15 doctors across 6 specialities (General Physician, Gynecologist, Dermatologist, Pediatrician, Neurologist, Gastroenterologist)
- **Speciality menu** — icons and labels defined locally
- **User profile** — loaded from a placeholder API call (returns empty until backend is wired)
- **Appointments** — empty list until backend returns real data

The `AppContext` is already designed to replace mock data with live API responses once `VITE_BACKEND_URL` points to a running backend server.

---

## Roadmap

### Phase 2 — Backend API (Node.js + Express + MongoDB)
- REST API for all user, doctor, and appointment operations
- JWT-based authentication middleware
- Razorpay order creation and payment verification
- Multer + Cloudinary for profile image uploads

### Phase 3 — Admin Panel
- Separate admin dashboard at a different route or subdomain
- Manage doctors (add, edit, remove)
- View and manage all appointments
- Dashboard statistics

### Phase 4 — Doctor Dashboard
- Doctor-specific login and dashboard
- View scheduled appointments
- Mark appointments as completed or cancelled
- Earnings overview

### Phase 5 — Deployment
- Frontend deployed to Vercel
- Backend deployed to Render or Railway
- MongoDB Atlas for the database
- Environment variables secured

---

## Author

Built as a full-stack MERN resume project demonstrating:
- Component-based UI architecture
- Client-side routing with protected routes
- Global state management with Context API
- RESTful API integration patterns
- Payment gateway integration (Razorpay)
- Responsive, mobile-first design

---

*Frontend complete as of June 2026. Backend integration in progress.*
