# Prescripto — Full Stack Doctor Appointment Booking System
## Complete Step-by-Step Build Guide (MERN Stack)

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack & Dependencies](#2-tech-stack--dependencies)
3. [Folder Structure](#3-folder-structure)
4. [Part 1 — Frontend (Patient Website)](#part-1--frontend-patient-website)
   - [4. Project Setup](#4-project-setup)
   - [5. Tailwind CSS Configuration](#5-tailwind-css-configuration)
   - [6. Assets & Data Setup](#6-assets--data-setup)
   - [7. Routing Setup](#7-routing-setup)
   - [8. Context API Setup](#8-context-api-setup)
   - [9. Navbar Component](#9-navbar-component)
   - [10. Header Component](#10-header-component)
   - [11. Speciality Menu Component](#11-speciality-menu-component)
   - [12. Top Doctors Component](#12-top-doctors-component)
   - [13. Banner Component](#13-banner-component)
   - [14. Footer Component](#14-footer-component)
   - [15. Home Page](#15-home-page)
   - [16. All Doctors Page](#16-all-doctors-page)
   - [17. Appointment Page](#17-appointment-page)
   - [18. Related Doctors Component](#18-related-doctors-component)
   - [19. Login Page](#19-login-page)
   - [20. My Profile Page](#20-my-profile-page)
   - [21. My Appointments Page](#21-my-appointments-page)
   - [22. About Page](#22-about-page)
   - [23. Contact Page](#23-contact-page)
5. [Part 2 — Backend (Node.js + Express + MongoDB)](#part-2--backend-nodejs--express--mongodb)
   - [24. Backend Project Setup](#24-backend-project-setup)
   - [25. Environment Variables](#25-environment-variables)
   - [26. MongoDB Connection](#26-mongodb-connection)
   - [27. Cloudinary Configuration](#27-cloudinary-configuration)
   - [28. Database Models](#28-database-models)
   - [29. Multer Middleware](#29-multer-middleware)
   - [30. Auth Middlewares](#30-auth-middlewares)
   - [31. Admin Controller & Routes](#31-admin-controller--routes)
   - [32. Doctor Controller & Routes](#32-doctor-controller--routes)
   - [33. User Controller & Routes](#33-user-controller--routes)
   - [34. Server Entry Point](#34-server-entry-point)
6. [Part 3 — Admin Panel (Separate React App)](#part-3--admin-panel-separate-react-app)
   - [35. Admin Panel Setup](#35-admin-panel-setup)
   - [36. Admin Context](#36-admin-context)
   - [37. Doctor Context (Admin App)](#37-doctor-context-admin-app)
   - [38. App Context (Admin App)](#38-app-context-admin-app)
   - [39. Admin Login Page](#39-admin-login-page)
   - [40. Admin Navbar](#40-admin-navbar)
   - [41. Sidebar Component](#41-sidebar-component)
   - [42. Add Doctor Page](#42-add-doctor-page)
   - [43. Doctor List Page](#43-doctor-list-page)
   - [44. All Appointments Page (Admin)](#44-all-appointments-page-admin)
   - [45. Admin Dashboard Page](#45-admin-dashboard-page)
   - [46. Doctor Dashboard Page](#46-doctor-dashboard-page)
   - [47. Doctor Appointments Page](#47-doctor-appointments-page)
   - [48. Doctor Profile Page](#48-doctor-profile-page)
   - [49. App.jsx (Admin)](#49-appjsx-admin)
7. [Payment Integration — Razorpay](#7-payment-integration--razorpay)
8. [Frontend API Integration Summary](#8-frontend-api-integration-summary)
9. [Complete API Reference](#9-complete-api-reference)

---

## 1. Project Overview

**App Name:** Prescripto

A full-stack doctor appointment booking platform with three levels of login:

| Role | Capabilities |
|------|-------------|
| **Patient** | Register/login, browse doctors by speciality, book appointments, pay online, manage profile, cancel appointments |
| **Doctor** | View their appointments, mark appointments complete/cancel, update profile (fee, address, availability) |
| **Admin** | Add/manage doctors, view all appointments, cancel any appointment, view dashboard analytics |

**Three separate applications:**
- `frontend/` — Patient-facing React app (port `5173`)
- `admin/` — Admin + Doctor panel React app (port `5174`)
- `backend/` — Express REST API (port `4000`)

---

## 2. Tech Stack & Dependencies

### Frontend (`frontend/`)
```
npm create vite@latest frontend -- --template react
```
Dependencies to install:
```
npm install axios react-router-dom react-toastify
```

### Admin Panel (`admin/`)
```
npm create vite@latest admin -- --template react
```
Dependencies to install:
```
npm install axios react-router-dom react-toastify
```

### Backend (`backend/`)
```
npm init
```
Dependencies to install:
```
npm install express mongoose multer bcrypt cloudinary cors dotenv jsonwebtoken nodemon validator razorpay
```

---

## 3. Folder Structure

```
prescripto/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   │   └── assets.js          ← exports assets object + specialityData + doctors array
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── SpecialityMenu.jsx
│   │   │   ├── TopDoctors.jsx
│   │   │   ├── Banner.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── RelatedDoctors.jsx
│   │   ├── context/
│   │   │   └── AppContext.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Doctors.jsx
│   │   │   ├── Appointment.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── About.jsx
│   │   │   ├── Contact.jsx
│   │   │   ├── MyProfile.jsx
│   │   │   └── MyAppointments.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── .env
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── admin/
│   ├── src/
│   │   ├── assets/
│   │   │   └── assets.js
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   └── Sidebar.jsx
│   │   ├── context/
│   │   │   ├── AdminContext.jsx
│   │   │   ├── DoctorContext.jsx
│   │   │   └── AppContext.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── admin/
│   │   │   │   ├── AddDoctor.jsx
│   │   │   │   ├── AllAppointments.jsx
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   └── DoctorsList.jsx
│   │   │   └── doctor/
│   │   │       ├── DoctorAppointments.jsx
│   │   │       ├── DoctorDashboard.jsx
│   │   │       └── DoctorProfile.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env
│   ├── tailwind.config.js
│   └── vite.config.js
│
└── backend/
    ├── config/
    │   ├── mongodb.js
    │   └── cloudinary.js
    ├── controllers/
    │   ├── adminController.js
    │   ├── doctorController.js
    │   └── userController.js
    ├── middleware/
    │   ├── multer.js
    │   ├── authAdmin.js
    │   ├── authDoctor.js
    │   └── authUser.js
    ├── models/
    │   ├── doctorModel.js
    │   ├── userModel.js
    │   └── appointmentModel.js
    ├── routes/
    │   ├── adminRoute.js
    │   ├── doctorRoute.js
    │   └── userRoute.js
    ├── server.js
    ├── .env
    └── package.json
```

---

# Part 1 — Frontend (Patient Website)

## 4. Project Setup

### `vite.config.js` (frontend)
```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173
  }
})
```

### `index.html`
- Set `<title>Prescripto</title>`
- Add Razorpay script before closing body:
```html
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
```

### `src/main.jsx`
```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import AppContextProvider from './context/AppContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AppContextProvider>
      <App />
    </AppContextProvider>
  </BrowserRouter>
)
```

### `src/index.css`
```css
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

* {
  font-family: 'Outfit', sans-serif;
}

html {
  scroll-behavior: smooth;
}

::-webkit-scrollbar {
  display: none;
}

.active hr {
  @apply block;
}

@media (max-width: 740px) {
  .active p {
    @apply text-white bg-primary;
  }
}
```

### `src/App.jsx`
```jsx
import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Doctors from './pages/Doctors'
import Login from './pages/Login'
import About from './pages/About'
import Contact from './pages/Contact'
import MyProfile from './pages/MyProfile'
import MyAppointments from './pages/MyAppointments'
import Appointment from './pages/Appointment'

const App = () => {
  return (
    <div className='mx-4 sm:mx-[10%]'>
      <ToastContainer />
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/doctors' element={<Doctors />} />
        <Route path='/doctors/:speciality' element={<Doctors />} />
        <Route path='/login' element={<Login />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/my-profile' element={<MyProfile />} />
        <Route path='/my-appointments' element={<MyAppointments />} />
        <Route path='/appointment/:docId' element={<Appointment />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App
```

---

## 5. Tailwind CSS Configuration

Install Tailwind:
```
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### `tailwind.config.js` (frontend)
```js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#5F6FFF",
      },
      gridTemplateColumns: {
        auto: 'repeat(auto-fill, minmax(200px, 1fr))'
      }
    },
  },
  plugins: [],
}
```

---

## 6. Assets & Data Setup

Place all images and icons in `src/assets/`. Create `src/assets/assets.js`:

```js
// Import all images/icons
import appointment_img from './appointment_img.png'
import header_img from './header_img.png'
import group_profiles from './group_profiles.png'
import profile_pic from './profile_pic.png'
import contact_image from './contact_image.png'
import about_image from './about_image.png'
import logo from './logo.svg'
import dropdown_icon from './dropdown_icon.svg'
import menu_icon from './menu_icon.svg'
import cross_icon from './cross_icon.png'
import chats_icon from './chats_icon.svg'
import verified_icon from './verified_icon.svg'
import arrow_icon from './arrow_icon.svg'
import info_icon from './info_icon.svg'
import upload_icon from './upload_icon.png'
import stripe_logo from './stripe_logo.png'
import razorpay_logo from './razorpay_logo.png'
// doctor images: doc1.png ... doc15.png
import doc1 from './doc1.png'
// ... import doc2 through doc15

export const assets = {
  appointment_img,
  header_img,
  group_profiles,
  logo,
  chats_icon,
  verified_icon,
  info_icon,
  profile_pic,
  arrow_icon,
  contact_image,
  about_image,
  menu_icon,
  cross_icon,
  dropdown_icon,
  upload_icon,
  stripe_logo,
  razorpay_logo,
}

export const specialityData = [
  { speciality: 'General physician', image: /* general physician icon */ },
  { speciality: 'Gynecologist', image: /* gynecologist icon */ },
  { speciality: 'Dermatologist', image: /* dermatologist icon */ },
  { speciality: 'Pediatricians', image: /* pediatricians icon */ },
  { speciality: 'Neurologist', image: /* neurologist icon */ },
  { speciality: 'Gastroenterologist', image: /* gastroenterologist icon */ },
]

// doctors array — 15 doctors total, used only on the frontend before backend is connected
export const doctors = [
  {
    _id: 'doc1',
    name: 'Dr. Richard James',
    image: doc1,
    speciality: 'General physician',
    degree: 'MBBS',
    experience: '4 Years',
    about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care...',
    fees: 50,
    address: { line1: '17th Cross, Richmond', line2: 'Circle, Ring Road, London' }
  },
  // ... doc2 through doc15 with same structure
]
```

> **Note:** The `doctors` array is only used locally during early frontend development. Once the backend is live, doctors data is fetched from the API and stored in context.

---

## 7. Routing Setup

Already configured in `App.jsx` above. Routes summary:

| Path | Component |
|------|-----------|
| `/` | Home |
| `/doctors` | Doctors (all) |
| `/doctors/:speciality` | Doctors (filtered) |
| `/login` | Login |
| `/about` | About |
| `/contact` | Contact |
| `/my-profile` | MyProfile |
| `/my-appointments` | MyAppointments |
| `/appointment/:docId` | Appointment |

---

## 8. Context API Setup

### `src/context/AppContext.jsx`

```jsx
import { createContext, useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

export const AppContext = createContext()

const AppContextProvider = (props) => {
  const currencySymbol = '$'
  const backendUrl = import.meta.env.VITE_BACKEND_URL

  const [doctors, setDoctors] = useState([])
  const [token, setToken] = useState(
    localStorage.getItem('token') ? localStorage.getItem('token') : false
  )
  const [userData, setUserData] = useState(false)

  const months = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split('_')
    return dateArray[0] + ' ' + months[Number(dateArray[1])] + ' ' + dateArray[2]
  }

  const calculateAge = (dob) => {
    const today = new Date()
    const birthDate = new Date(dob)
    let age = today.getFullYear() - birthDate.getFullYear()
    return age
  }

  const getDoctorsData = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/doctor/list')
      if (data.success) {
        setDoctors(data.doctors)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const loadUserProfileData = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/user/get-profile', {
        headers: { token }
      })
      if (data.success) {
        setUserData(data.userData)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  useEffect(() => {
    getDoctorsData()
  }, [])

  useEffect(() => {
    if (token) {
      loadUserProfileData()
    } else {
      setUserData(false)
    }
  }, [token])

  const value = {
    doctors,
    getDoctorsData,
    currencySymbol,
    backendUrl,
    token,
    setToken,
    userData,
    setUserData,
    loadUserProfileData,
    slotDateFormat,
    calculateAge,
  }

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  )
}

export default AppContextProvider
```

### `src/.env`
```
VITE_BACKEND_URL=http://localhost:4000
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

---

## 9. Navbar Component

### `src/components/Navbar.jsx`

**Structure:**
- Logo image (click → navigate to `/`) 
- UL with NavLinks: Home `/`, All Doctors `/doctors`, About `/about`, Contact `/contact`
- Each NavLink wraps an `<li>` text and an `<hr>` for the underline active indicator
- Right side: ternary — if `token` → show profile dropdown, else → show "Create account" button
- Profile dropdown contains: My Profile, My Appointments, Logout
- Mobile: hamburger `menu_icon` → slide-in panel with logo, cross icon, same nav links

**State variables:**
```jsx
const [showMenu, setShowMenu] = useState(false)
const { token, setToken, userData } = useContext(AppContext)
const navigate = useNavigate()
```

**Logout function:**
```jsx
const logout = () => {
  setToken(false)
  localStorage.removeItem('token')
}
```

**Active underline logic:**
- NavLink provides `isActive` prop in its `className` function
- When active: show `hr` with `border-r-4 border-primary` and BG primary on mobile

**Mobile menu:**
- Controlled by `showMenu` state
- Fixed overlay, full width, white background
- Each NavLink's `onClick` calls `setShowMenu(false)`

**CSS notes:**
- Nav UL: `hidden md:flex items-start gap-5 font-medium`
- Create account button: `hidden md:block bg-primary text-white px-8 py-3 rounded-full`
- Profile image: `w-8 rounded-full cursor-pointer`
- Dropdown: `absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block`
- Mobile panel: `md:hidden right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all`

---

## 10. Header Component

### `src/components/Header.jsx`

**Structure (two-column flex):**

Left side:
- `<p>` — "Book Appointment" + `<br>` + "With Trusted Doctors" (large, white, semibold)
- `<div>` — group profiles image + "Simply browse through our extensive list of trusted doctors..." text
- `<a href="#speciality">` — "Book appointment" text + arrow icon

Right side:
- `<img src={assets.header_img}` — positioned absolutely at bottom

**CSS notes:**
- Outer div: `flex flex-col md:flex-row flex-wrap bg-primary rounded-lg px-6 md:px-10 lg:px-20`
- Left div: `md:w-1/2 flex flex-col items-start justify-center gap-4 py-10 m-auto md:py-[10vw] md:mb-[-30px]`
- Header text: `text-3xl md:text-4xl lg:text-5xl text-white font-semibold leading-tight md:leading-tight lg:leading-tight`
- Group profiles image: `w-28`
- CTA button: `flex items-center gap-2 bg-white px-8 py-3 rounded-full text-gray-600 text-sm m-auto md:m-0 hover:scale-105 transition-all duration-300`
- Right div: `md:w-1/2 relative`
- Right image: `w-full absolute bottom-0 h-auto rounded-lg`

---

## 11. Speciality Menu Component

### `src/components/SpecialityMenu.jsx`

**Structure:**
- Outer `<div id="speciality">` (scroll target)
- `<h1>` — "Find by Speciality"
- `<p>` — description text
- `<div>` — horizontal scrollable row of Link cards

**Each card (Link):**
```jsx
<Link
  onClick={() => scrollTo(0, 0)}
  to={`/doctors/${item.speciality}`}
  key={index}
  className='flex flex-col items-center text-xs cursor-pointer flex-shrink-0 hover:-translate-y-[10px] transition-all duration-500'
>
  <img src={item.image} className='w-16 sm:w-24 mb-2' />
  <p>{item.speciality}</p>
</Link>
```

**Data source:** `specialityData` imported from `assets.js`

**CSS notes:**
- Container: `flex flex-col items-center gap-4 py-16 text-gray-800`
- H1: `text-3xl font-medium`
- Description p: `text-center text-sm text-gray-600 w-1/3`
- Cards row: `flex sm:justify-center gap-4 pt-5 w-full overflow-scroll`

---

## 12. Top Doctors Component

### `src/components/TopDoctors.jsx`

**Structure:**
- `<h1>` — "Top Doctors to Book"
- `<p>` — description
- Grid of doctor cards (first 10 from `doctors` context)
- "More" button → navigate to `/doctors` + `scrollTo(0,0)`

**Each doctor card (div with onClick):**
```jsx
<div
  onClick={() => { navigate(`/appointment/${item._id}`); scrollTo(0, 0) }}
  className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:-translate-y-[10px] transition-all duration-500'
  key={index}
>
  <img className='bg-blue-50' src={item.image} />
  <div className='p-4'>
    <div className='flex items-center gap-2 text-sm text-center text-green-500'>
      <p className={`w-2 h-2 rounded-full ${item.available ? 'bg-green-500' : 'bg-gray-500'}`}></p>
      <p>{item.available ? 'Available' : 'Not Available'}</p>
    </div>
    <p className='text-gray-900 text-lg font-medium'>{item.name}</p>
    <p className='text-gray-600 text-sm'>{item.speciality}</p>
  </div>
</div>
```

**CSS notes:**
- Grid: `w-full grid grid-cols-auto gap-4 pt-5 gap-y-6 px-3 sm:px-0`
- More button: `bg-blue-50 text-gray-600 px-12 py-3 rounded-full mt-10`

**Context usage:**
```jsx
const { doctors } = useContext(AppContext)
const navigate = useNavigate()
```

---

## 13. Banner Component

### `src/components/Banner.jsx`

**Structure (two-column flex):**

Left side:
- `<p>` — "Book Appointment"
- `<p>` — "With 100+ Trusted Doctors"
- `<button>` — "Create account" → navigate to `/login` + `scrollTo(0,0)`

Right side:
- `<img src={assets.appointment_img}` — absolutely positioned

**CSS notes:**
- Outer: `flex bg-primary rounded-lg px-6 sm:px-10 md:px-14 lg:px-12 my-20 md:mx-10`
- Left: `flex-1 py-8 sm:py-10 md:py-16 lg:py-24 lg:pl-5`
- Right: `hidden md:block w-full md:w-1/2 lg:w-[370px] relative`
- Right image: `w-full absolute bottom-0 right-0 max-w-md`
- Button: `bg-white text-sm sm:text-base text-gray-600 px-8 py-3 rounded-full mt-6 hover:scale-105 transition-all`

---

## 14. Footer Component

### `src/components/Footer.jsx`

**Structure (three-column grid):**

Left section:
- Logo image
- Description paragraph

Center section:
- "COMPANY" heading
- UL: Home, About us, Contact us, Privacy policy

Right section:
- "GET IN TOUCH" heading
- UL: phone number, email address

Bottom:
- `<hr>`
- Copyright paragraph

**CSS notes:**
- Grid: `md:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm`
- Logo: `mb-5 w-40`
- Description p: `w-full md:w-2/3 text-gray-600 leading-6`
- Section headings: `text-xl font-medium mb-5`
- Links UL: `flex flex-col gap-2 text-gray-600`
- Copyright: `py-5 text-sm text-center`

---

## 15. Home Page

### `src/pages/Home.jsx`

```jsx
import Header from '../components/Header'
import SpecialityMenu from '../components/SpecialityMenu'
import TopDoctors from '../components/TopDoctors'
import Banner from '../components/Banner'

const Home = () => {
  return (
    <div>
      <Header />
      <SpecialityMenu />
      <TopDoctors />
      <Banner />
    </div>
  )
}
export default Home
```

---

## 16. All Doctors Page

### `src/pages/Doctors.jsx`

**State variables:**
```jsx
const { speciality } = useParams()
const [filterDoc, setFilterDoc] = useState([])
const [showFilter, setShowFilter] = useState(false)
const { doctors } = useContext(AppContext)
const navigate = useNavigate()
```

**Filter logic:**
```jsx
const applyFilter = () => {
  if (speciality) {
    setFilterDoc(doctors.filter(doc => doc.speciality === speciality))
  } else {
    setFilterDoc(doctors)
  }
}

useEffect(() => {
  applyFilter()
}, [doctors, speciality])
```

**Structure:**
- Filter button (mobile only) — toggles `showFilter`
- Left sidebar: 6 `<p>` tags for each speciality, each with:
  - `onClick` — toggle: if already selected → navigate to `/doctors`, else → navigate to `/doctors/${speciality}`
  - Dynamic background: `${speciality === item ? 'bg-indigo-100 text-black' : ''}`
- Right grid: `filterDoc.map(...)` → doctor cards same as TopDoctors

**Speciality list:**
```
General physician | Gynecologist | Dermatologist
Pediatricians | Neurologist | Gastroenterologist
```

**CSS notes:**
- Outer: `flex flex-col sm:flex-row items-start gap-5 mt-5`
- Filter sidebar: `flex flex-col gap-4 text-sm text-gray-600`
- Sidebar p: `` `w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === 'General physician' ? 'bg-indigo-100 text-black' : ''}` ``
- Doctor grid: `w-full grid grid-cols-auto gap-4`

---

## 17. Appointment Page

### `src/pages/Appointment.jsx`

**State variables:**
```jsx
const { docId } = useParams()
const { doctors, currencySymbol, backendUrl, token, getDoctorsData } = useContext(AppContext)
const navigate = useNavigate()

const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

const [docInfo, setDocInfo] = useState(null)
const [docSlots, setDocSlots] = useState([])
const [slotIndex, setSlotIndex] = useState(0)
const [slotTime, setSlotTime] = useState('')
```

**Fetch doctor info:**
```jsx
const fetchDocInfo = async () => {
  const docInfo = doctors.find(doc => doc._id === docId)
  setDocInfo(docInfo)
}

useEffect(() => {
  fetchDocInfo()
}, [doctors, docId])
```

**Generate available slots (next 7 days, 10am–9pm, 30-minute intervals):**
```jsx
const getAvailableSlots = async () => {
  setDocSlots([])
  let today = new Date()

  for (let i = 0; i < 7; i++) {
    let currentDate = new Date(today)
    currentDate.setDate(today.getDate() + i)

    let endTime = new Date()
    endTime.setDate(today.getDate() + i)
    endTime.setHours(21, 0, 0, 0)

    if (today.getDate() === currentDate.getDate()) {
      currentDate.setHours(
        currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10
      )
      currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0)
    } else {
      currentDate.setHours(10)
      currentDate.setMinutes(0)
    }

    let timeSlots = []

    while (currentDate < endTime) {
      let formattedTime = currentDate.toLocaleTimeString([], {
        hour: '2-digit', minute: '2-digit'
      })

      let day = currentDate.getDate()
      let month = currentDate.getMonth() + 1
      let year = currentDate.getFullYear()
      const slotDate = day + '_' + month + '_' + year
      const slotTime = formattedTime

      // Check if slot is already booked
      const isSlotAvailable = docInfo.slots_booked[slotDate] &&
        docInfo.slots_booked[slotDate].includes(slotTime) ? false : true

      if (isSlotAvailable) {
        timeSlots.push({ datetime: new Date(currentDate), time: formattedTime })
      }

      currentDate.setMinutes(currentDate.getMinutes() + 30)
    }

    setDocSlots(prev => ([...prev, timeSlots]))
  }
}

useEffect(() => {
  getAvailableSlots()
}, [docInfo])
```

**Book appointment function:**
```jsx
const bookAppointment = async () => {
  if (!token) {
    toast.warn('Login to book appointment')
    return navigate('/login')
  }

  try {
    const date = docSlots[slotIndex][0].datetime

    let day = date.getDate()
    let month = date.getMonth() + 1
    let year = date.getFullYear()
    const slotDate = day + '_' + month + '_' + year

    const { data } = await axios.post(
      backendUrl + '/api/user/book-appointment',
      { docId, slotDate, slotTime },
      { headers: { token } }
    )

    if (data.success) {
      toast.success(data.message)
      getDoctorsData()
      navigate('/my-appointments')
    } else {
      toast.error(data.message)
    }
  } catch (error) {
    console.log(error)
    toast.error(error.message)
  }
}
```

**Structure:**
- Doctor image (left) + Doctor details (right):
  - Name + verified icon
  - Degree — Speciality | Experience button
  - About section with info icon
  - Appointment fee with currency symbol
- Booking slots section:
  - Horizontal scroll of date buttons (day name + date number)
  - Horizontal scroll of time buttons
  - "Book an Appointment" button
- RelatedDoctors component

**CSS notes:**
- Doctor card: `flex flex-col sm:flex-row gap-4`
- Doctor image: `bg-primary w-full sm:max-w-72 rounded-lg`
- Details box: `flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white`
- Name: `flex items-center gap-2 text-2xl font-medium text-gray-900`
- Verified icon: `w-5`
- Degree/spec div: `flex items-center gap-2 text-sm mt-1 text-gray-600`
- Experience button: `py-0.5 px-2 border text-xs rounded-full`
- Appointment fee: `text-gray-500 font-medium mt-4`
- Booking slots section: `sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700`
- Date buttons: `flex gap-3 items-center w-full overflow-x-scroll mt-4`
- Time buttons: `flex items-center gap-3 w-full overflow-x-scroll mt-4`
- Book button: `bg-primary text-white text-sm font-light px-14 py-3 rounded-full my-6`

---

## 18. Related Doctors Component

### `src/components/RelatedDoctors.jsx`

**Props:** `docId`, `speciality`

**Logic:**
```jsx
const { doctors } = useContext(AppContext)
const [relDoc, setRelDoc] = useState([])
const navigate = useNavigate()

useEffect(() => {
  if (doctors.length > 0 && speciality) {
    const doctorsData = doctors.filter(
      doc => doc.speciality === speciality && doc._id !== docId
    )
    setRelDoc(doctorsData)
  }
}, [doctors, docId])
```

**Structure:** Same card grid as TopDoctors, limited to 5 doctors (`.slice(0, 5)`), each card `onClick` → navigate + `scrollTo(0,0)`

---

## 19. Login Page

### `src/pages/Login.jsx`

**State variables:**
```jsx
const [state, setState] = useState('Sign Up')
const [email, setEmail] = useState('')
const [password, setPassword] = useState('')
const [name, setName] = useState('')

const { token, setToken, backendUrl } = useContext(AppContext)
const navigate = useNavigate()
```

**Redirect when logged in:**
```jsx
useEffect(() => {
  if (token) navigate('/')
}, [token])
```

**Submit handler:**
```jsx
const onSubmitHandler = async (event) => {
  event.preventDefault()
  try {
    if (state === 'Sign Up') {
      const { data } = await axios.post(backendUrl + '/api/user/register', { name, email, password })
      if (data.success) {
        localStorage.setItem('token', data.token)
        setToken(data.token)
      } else {
        toast.error(data.message)
      }
    } else {
      const { data } = await axios.post(backendUrl + '/api/user/login', { email, password })
      if (data.success) {
        localStorage.setItem('token', data.token)
        setToken(data.token)
      } else {
        toast.error(data.message)
      }
    }
  } catch (error) {
    toast.error(error.message)
  }
}
```

**Structure:**
- `<form onSubmit={onSubmitHandler}>`
- Title: "Create Account" or "Login" (ternary on `state`)
- Subtitle: "Please sign up / sign in to book appointment"
- Name input (only when `state === 'Sign Up'`)
- Email input (type="email", required)
- Password input (type="password", required)
- Submit button: "Create account" or "Login"
- Toggle link: "Already have an account? Login here" / "Create a new account? Click here"

**CSS notes:**
- Form: `min-h-[80vh] flex items-center`
- Container div: `flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-gray-600 text-sm shadow-lg`
- Button: `bg-primary text-white w-full py-2 rounded-md text-base`

---

## 20. My Profile Page

### `src/pages/MyProfile.jsx`

**State variables:**
```jsx
const { userData, setUserData, backendUrl, token, loadUserProfileData } = useContext(AppContext)
const [isEdit, setIsEdit] = useState(false)
const [image, setImage] = useState(false)
```

**Update profile function:**
```jsx
const updateUserProfileData = async () => {
  try {
    const formData = new FormData()
    formData.append('name', userData.name)
    formData.append('phone', userData.phone)
    formData.append('address', JSON.stringify(userData.address))
    formData.append('dob', userData.dob)
    formData.append('gender', userData.gender)
    image && formData.append('image', image)

    const { data } = await axios.post(
      backendUrl + '/api/user/update-profile',
      formData,
      { headers: { token } }
    )

    if (data.success) {
      toast.success(data.message)
      await loadUserProfileData()
      setIsEdit(false)
      setImage(false)
    } else {
      toast.error(data.message)
    }
  } catch (error) {
    console.log(error)
    toast.error(error.message)
  }
}
```

**Structure:**
- Profile image with edit overlay (label + hidden file input)
  - When `isEdit`: show `image` preview OR `userData.image`, overlay upload icon
  - When not editing: show `userData.image`
- Name: input (edit mode) or `<p>`
- `<hr>`
- Contact Information section:
  - Email (read-only display)
  - Phone: input (edit mode) or `<p>`
  - Address: two inputs (edit mode) or two `<p>`
- Basic Information section:
  - Gender: `<select>` (edit mode) or `<p>` — options: Male, Female
  - Date of Birth: `<input type="date">` (edit mode) or `<p>`
- Edit / Save buttons

**State update pattern for nested address:**
```jsx
setUserData(prev => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))
```

---

## 21. My Appointments Page

### `src/pages/MyAppointments.jsx`

**State variables:**
```jsx
const { backendUrl, token, getDoctorsData } = useContext(AppContext)
const { slotDateFormat, currencySymbol } = useContext(AppContext)
const [appointments, setAppointments] = useState([])
const navigate = useNavigate()
```

**Get appointments:**
```jsx
const getUserAppointments = async () => {
  try {
    const { data } = await axios.get(backendUrl + '/api/user/appointments', {
      headers: { token }
    })
    if (data.success) {
      setAppointments(data.appointments.reverse())
    }
  } catch (error) {
    toast.error(error.message)
  }
}

useEffect(() => {
  if (token) getUserAppointments()
}, [token])
```

**Cancel appointment:**
```jsx
const cancelAppointment = async (appointmentId) => {
  try {
    const { data } = await axios.post(
      backendUrl + '/api/user/cancel-appointment',
      { appointmentId },
      { headers: { token } }
    )
    if (data.success) {
      toast.success(data.message)
      getUserAppointments()
      getDoctorsData()
    } else {
      toast.error(data.message)
    }
  } catch (error) {
    toast.error(error.message)
  }
}
```

**Razorpay payment:**
```jsx
const initPay = (order) => {
  const options = {
    key: import.meta.env.VITE_RAZORPAY_KEY_ID,
    amount: order.amount,
    currency: order.currency,
    name: 'Appointment Payment',
    description: 'Appointment Payment',
    order_id: order.id,
    receipt: order.receipt,
    handler: async (response) => {
      try {
        const { data } = await axios.post(
          backendUrl + '/api/user/verifyRazorpay',
          response,
          { headers: { token } }
        )
        if (data.success) {
          getUserAppointments()
          navigate('/my-appointments')
        }
      } catch (error) {
        toast.error(error.message)
      }
    }
  }
  const rzp = new window.Razorpay(options)
  rzp.open()
}

const appointmentRazorpay = async (appointmentId) => {
  try {
    const { data } = await axios.post(
      backendUrl + '/api/user/payment-razorpay',
      { appointmentId },
      { headers: { token } }
    )
    if (data.success) {
      initPay(data.order)
    }
  } catch (error) {
    toast.error(error.message)
  }
}
```

**Each appointment card displays:**
- Doctor image (`item.docData.image`)
- Doctor name, speciality
- Address line1, line2
- Slot date (formatted) + slot time
- Buttons (conditional):
  - If `!item.cancelled && !item.isCompleted && !item.payment` → "Pay Online" button
  - If `!item.cancelled && !item.isCompleted && item.payment` → "Paid" badge
  - If `!item.cancelled && !item.isCompleted` → "Cancel Appointment" button
  - If `item.cancelled` → "Appointment Cancelled" badge (red)
  - If `item.isCompleted` → "Completed" badge (green)

---

## 22. About Page

### `src/pages/About.jsx`

**Sections:**
1. Title: "ABOUT `<span>US</span>`"
2. Two-column: about image (left) + 3 paragraphs + "Our Vision" bold heading (right)
3. "WHY CHOOSE `<span>US</span>`" section
4. Three columns: Efficiency, Convenience, Personalization — each with title + description + hover effect (bg changes to primary)

**CSS notes:**
- Image: `w-full max-w-[360px]`
- Right div: `flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600`
- Three columns: `flex flex-col md:flex-row mb-20`
- Each column: `border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer`

---

## 23. Contact Page

### `src/pages/Contact.jsx`

**Sections:**
1. Title: "CONTACT `<span>US</span>`"
2. Two-column: contact image (left) + details (right):
   - "Our Office" heading
   - Address (two lines with `<br>`)
   - Phone number
   - Email
   - "Careers at Prescripto" heading + description
   - "Explore Jobs" button (hover: bg-black text-white)

---

# Part 2 — Backend (Node.js + Express + MongoDB)

## 24. Backend Project Setup

```
mkdir backend && cd backend
npm init
```

### `package.json` — add scripts:
```json
{
  "type": "module",
  "scripts": {
    "start": "node server.js",
    "server": "nodemon server.js"
  }
}
```

Run dev server: `npm run server`

---

## 25. Environment Variables

### `backend/.env`
```
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_SECRET_KEY=your_secret_key
ADMIN_EMAIL=admin@prescripto.com
ADMIN_PASSWORD=greatstack123
JWT_SECRET=greatstack
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
CURRENCY=INR
PORT=4000
```

---

## 26. MongoDB Connection

### `backend/config/mongodb.js`
```js
import mongoose from 'mongoose'

const connectDB = async () => {
  mongoose.connection.on('connected', () => console.log('Database Connected'))
  await mongoose.connect(`${process.env.MONGODB_URI}/prescripto`)
}

export default connectDB
```

---

## 27. Cloudinary Configuration

### `backend/config/cloudinary.js`
```js
import { v2 as cloudinary } from 'cloudinary'

const connectCloudinary = async () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY,
  })
}

export default connectCloudinary
```

---

## 28. Database Models

### `backend/models/doctorModel.js`
```js
import mongoose from 'mongoose'

const doctorSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  email:       { type: String, required: true, unique: true },
  password:    { type: String, required: true },
  image:       { type: String, required: true },
  speciality:  { type: String, required: true },
  degree:      { type: String, required: true },
  experience:  { type: String, required: true },
  about:       { type: String, required: true },
  available:   { type: Boolean, default: true },
  fees:        { type: Number, required: true },
  address:     { type: Object, required: true },
  date:        { type: Number, required: true },
  slots_booked: { type: Object, default: {}, minimize: false }
})

const doctorModel = mongoose.models.doctor || mongoose.model('doctor', doctorSchema)
export default doctorModel
```

### `backend/models/userModel.js`
```js
import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  image:    { type: String, default: '<base64 default profile image string>' },
  address:  { type: Object, default: { line1: '', line2: '' } },
  gender:   { type: String, default: 'Not Selected' },
  dob:      { type: String, default: 'Not Selected' },
  phone:    { type: String, default: '0000000000' }
})

const userModel = mongoose.models.user || mongoose.model('user', userSchema)
export default userModel
```

> **Note:** For the default `image` value, use a base64-encoded default profile picture string (data URI format starting with `data:image/png;base64,...`)

### `backend/models/appointmentModel.js`
```js
import mongoose from 'mongoose'

const appointmentSchema = new mongoose.Schema({
  userId:      { type: String, required: true },
  docId:       { type: String, required: true },
  slotDate:    { type: String, required: true },
  slotTime:    { type: String, required: true },
  userData:    { type: Object, required: true },
  docData:     { type: Object, required: true },
  amount:      { type: Number, required: true },
  date:        { type: Number, required: true },
  cancelled:   { type: Boolean, default: false },
  payment:     { type: Boolean, default: false },
  isCompleted: { type: Boolean, default: false }
})

const appointmentModel = mongoose.models.appointment ||
  mongoose.model('appointment', appointmentSchema)
export default appointmentModel
```

---

## 29. Multer Middleware

### `backend/middleware/multer.js`
```js
import multer from 'multer'

const storage = multer.diskStorage({
  filename: function (req, file, callback) {
    callback(null, file.originalname)
  }
})

const upload = multer({ storage })
export default upload
```

---

## 30. Auth Middlewares

### `backend/middleware/authAdmin.js`
```js
import jwt from 'jsonwebtoken'

const authAdmin = async (req, res, next) => {
  try {
    const { atoken } = req.headers
    if (!atoken) {
      return res.json({ success: false, message: 'Not Authorized, Login Again' })
    }
    const tokenDecode = jwt.verify(atoken, process.env.JWT_SECRET)
    if (tokenDecode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
      return res.json({ success: false, message: 'Not Authorized, Login Again' })
    }
    next()
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

export default authAdmin
```

### `backend/middleware/authUser.js`
```js
import jwt from 'jsonwebtoken'

const authUser = async (req, res, next) => {
  try {
    const { token } = req.headers
    if (!token) {
      return res.json({ success: false, message: 'Not Authorized, Login Again' })
    }
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET)
    req.body.userId = tokenDecode.id
    next()
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

export default authUser
```

### `backend/middleware/authDoctor.js`
```js
import jwt from 'jsonwebtoken'

const authDoctor = async (req, res, next) => {
  try {
    const { dtoken } = req.headers
    if (!dtoken) {
      return res.json({ success: false, message: 'Not Authorized, Login Again' })
    }
    const tokenDecode = jwt.verify(dtoken, process.env.JWT_SECRET)
    req.body.docId = tokenDecode.id
    next()
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

export default authDoctor
```

**Token header key names:**
| Role | Header key |
|------|-----------|
| Admin | `atoken` |
| User/Patient | `token` |
| Doctor | `dtoken` |

---

## 31. Admin Controller & Routes

### `backend/controllers/adminController.js`

**1. addDoctor**
- Receives via `form-data`: `name, email, password, speciality, degree, experience, about, fees, address` (address as JSON string), `image` (file)
- Validates all fields present
- Validates email format with `validator`
- Validates password length >= 8
- Hashes password with `bcrypt` (salt rounds: 10)
- Uploads image to Cloudinary (`resource_type: 'image'`)
- Creates doctor document with: `name, email, image: imageUrl, password: hashedPassword, speciality, degree, experience, about, available: true, fees: Number(fees), address: JSON.parse(address), date: Date.now()`
- Saves to DB → responds `{ success: true, message: 'Doctor Added' }`

**2. loginAdmin**
- Receives: `{ email, password }` from body
- Checks against `process.env.ADMIN_EMAIL` and `process.env.ADMIN_PASSWORD`
- If match → create JWT: `jwt.sign(email + password, process.env.JWT_SECRET)`
- Responds: `{ success: true, token }`
- If no match → `{ success: false, message: 'Invalid credentials' }`

**3. allDoctors**
- `doctorModel.find({}).select('-password')`
- Responds: `{ success: true, doctors }`

**4. appointmentsAdmin**
- `appointmentModel.find({})`
- Responds: `{ success: true, appointments }`

**5. appointmentCancel**
- Receives: `{ appointmentId }` from body
- `appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })`
- Get `docId, slotDate, slotTime` from appointment
- Remove the slot from doctor's `slots_booked`
- Responds: `{ success: true, message: 'Appointment Cancelled' }`

**6. adminDashboard**
- Fetch all doctors, users, appointments
- Compute:
  - `doctors: doctors.length`
  - `appointments: appointments.length`
  - `patients: users.length`
  - `latestAppointments: appointments.reverse().slice(0, 5)`
- Responds: `{ success: true, dashData }`

### `backend/routes/adminRoute.js`
```js
import express from 'express'
import { addDoctor, loginAdmin, allDoctors, appointmentsAdmin,
  appointmentCancel, adminDashboard } from '../controllers/adminController.js'
import { changeAvailablity } from '../controllers/doctorController.js'
import authAdmin from '../middleware/authAdmin.js'
import upload from '../middleware/multer.js'

const adminRouter = express.Router()

adminRouter.post('/add-doctor', authAdmin, upload.single('image'), addDoctor)
adminRouter.post('/login', loginAdmin)
adminRouter.post('/all-doctors', authAdmin, allDoctors)
adminRouter.post('/change-availability', authAdmin, changeAvailablity)
adminRouter.get('/appointments', authAdmin, appointmentsAdmin)
adminRouter.post('/cancel-appointment', authAdmin, appointmentCancel)
adminRouter.get('/dashboard', authAdmin, adminDashboard)

export default adminRouter
```

---

## 32. Doctor Controller & Routes

### `backend/controllers/doctorController.js`

**1. changeAvailablity**
- Receives: `{ docId }` from body
- Find doctor by ID
- Toggle: `available: !docData.available`
- Responds: `{ success: true, message: 'Availability Changed' }`

**2. doctorList**
- `doctorModel.find({}).select(['-password', '-email'])`
- Responds: `{ success: true, doctors }`

**3. loginDoctor**
- Receives: `{ email, password }` from body
- Find doctor by email
- If not found → `{ success: false, message: 'Invalid Credentials' }`
- `bcrypt.compare(password, doctor.password)`
- If match → `jwt.sign({ id: doctor._id }, JWT_SECRET)` → `{ success: true, token }`
- If no match → `{ success: false, message: 'Invalid Credentials' }`

**4. appointmentsDoctor**
- Gets `docId` from `req.body` (set by `authDoctor` middleware)
- `appointmentModel.find({ docId })`
- Responds: `{ success: true, appointments }`

**5. appointmentComplete**
- Receives: `{ docId, appointmentId }` from body
- Find appointment by `appointmentId`
- Verify `appointmentData.docId === docId`
- `appointmentModel.findByIdAndUpdate(appointmentId, { isCompleted: true })`
- Responds: `{ success: true, message: 'Appointment Completed' }`
- If mismatch → `{ success: false, message: 'Mark Failed' }`

**6. appointmentCancel** (doctor version)
- Same as admin cancel but verifies `appointmentData.docId === docId`
- Cancels and releases slot
- Responds: `{ success: true, message: 'Appointment Cancelled' }`

**7. doctorDashboard**
- Gets `docId` from middleware
- `appointmentModel.find({ docId })`
- Earnings: sum `item.amount` for each appointment where `item.isCompleted || item.payment`
- Patients: collect unique `userId` values
- `dashData = { earnings, appointments: appointments.length, patients: patients.length, latestAppointments: appointments.reverse().slice(0, 5) }`
- Responds: `{ success: true, dashData }`

**8. doctorProfile**
- Gets `docId` from middleware
- `doctorModel.findById(docId).select('-password')`
- Responds: `{ success: true, profileData }`

**9. updateDoctorProfile**
- Receives: `{ docId, fees, address, available }` from body
- `doctorModel.findByIdAndUpdate(docId, { fees, address, available })`
- Responds: `{ success: true, message: 'Profile Updated' }`

### `backend/routes/doctorRoute.js`
```js
import express from 'express'
import { changeAvailablity, doctorList, loginDoctor, appointmentsDoctor,
  appointmentComplete, appointmentCancel, doctorDashboard,
  doctorProfile, updateDoctorProfile } from '../controllers/doctorController.js'
import authDoctor from '../middleware/authDoctor.js'

const doctorRouter = express.Router()

doctorRouter.get('/list', doctorList)
doctorRouter.post('/login', loginDoctor)
doctorRouter.get('/appointments', authDoctor, appointmentsDoctor)
doctorRouter.post('/complete-appointment', authDoctor, appointmentComplete)
doctorRouter.post('/cancel-appointment', authDoctor, appointmentCancel)
doctorRouter.get('/dashboard', authDoctor, doctorDashboard)
doctorRouter.get('/profile', authDoctor, doctorProfile)
doctorRouter.post('/update-profile', authDoctor, updateDoctorProfile)

export default doctorRouter
```

---

## 33. User Controller & Routes

### `backend/controllers/userController.js`

**1. registerUser**
- Receives: `{ name, email, password }` from body
- Validate all fields present
- `validator.isEmail(email)` — if not valid → error
- `password.length < 8` → error
- `bcrypt.genSalt(10)` + `bcrypt.hash(password, salt)`
- Save new user with `{ name, email, password: hashedPassword }`
- `jwt.sign({ id: newUser._id }, JWT_SECRET)` → respond `{ success: true, token }`

**2. loginUser**
- Receives: `{ email, password }` from body
- `userModel.findOne({ email })`
- If not found → `{ success: false, message: 'User does not exist' }`
- `bcrypt.compare(password, user.password)`
- If match → `jwt.sign({ id: user._id }, JWT_SECRET)` → `{ success: true, token }`
- If no match → `{ success: false, message: 'Invalid Credentials' }`

**3. getProfile**
- Gets `userId` from `authUser` middleware (`req.body.userId`)
- `userModel.findById(userId).select('-password')`
- Responds: `{ success: true, userData }`

**4. updateProfile**
- Receives: `{ userId, name, phone, address, dob, gender }` from body; `image` file optionally from multer
- Validates `name, phone, dob, gender` all present
- `userModel.findByIdAndUpdate(userId, { name, phone, address: JSON.parse(address), dob, gender })`
- If `imageFile` present → `cloudinary.uploader.upload(imageFile.path, { resource_type: 'image' })` → update `image: imageUrl`
- Responds: `{ success: true, message: 'Profile Updated' }`

**5. bookAppointment**
- Receives: `{ userId, docId, slotDate, slotTime }` from body
- `doctorModel.findById(docId).select('-password')`
- If `!docData.available` → `{ success: false, message: 'Doctor Not Available' }`
- Check `slots_booked[slotDate]` — if includes `slotTime` → `{ success: false, message: 'Slot Not Available' }`
- Else: push `slotTime` into `slots_booked[slotDate]` (create array if not exists)
- Get `userData = userModel.findById(userId).select('-password')`
- `delete docData.slots_booked`
- Create appointment: `{ userId, docId, userData, docData, amount: docData.fees, slotTime, slotDate, date: Date.now() }`
- Save appointment → update doctor's `slots_booked`
- Responds: `{ success: true, message: 'Appointment Booked' }`

**6. listAppointments**
- Gets `userId` from middleware
- `appointmentModel.find({ userId })`
- Responds: `{ success: true, appointments }`

**7. cancelAppointment**
- Receives: `{ userId, appointmentId }` from body
- Find appointment → verify `appointmentData.userId === userId`
- If mismatch → `{ success: false, message: 'Unauthorized Action' }`
- `appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })`
- Get `docId, slotDate, slotTime` from appointment
- Find doctor, remove `slotTime` from `slots_booked[slotDate]` using `.filter(e => e !== slotTime)`
- Update doctor
- Responds: `{ success: true, message: 'Appointment Cancelled' }`

**8. paymentRazorpay**
- Initialise: `const razorpayInstance = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET })`
- Receives: `{ appointmentId }` from body
- `appointmentModel.findById(appointmentId)`
- If not found or `cancelled` → `{ success: false, message: 'Appointment Cancelled or not found' }`
- Create options: `{ amount: appointmentData.amount * 100, currency: process.env.CURRENCY, receipt: appointmentId }`
- `await razorpayInstance.orders.create(options)`
- Responds: `{ success: true, order }`

**9. verifyRazorpay**
- Receives: `{ razorpay_order_id }` (the full response object from Razorpay handler)
- `await razorpayInstance.orders.fetch(razorpay_order_id)`
- If `orderInfo.status === 'paid'`:
  - `appointmentModel.findByIdAndUpdate(orderInfo.receipt, { payment: true })`
  - Responds: `{ success: true, message: 'Payment Successful' }`
- Else: `{ success: false, message: 'Payment Failed' }`

### `backend/routes/userRoute.js`
```js
import express from 'express'
import { registerUser, loginUser, getProfile, updateProfile,
  bookAppointment, listAppointments, cancelAppointment,
  paymentRazorpay, verifyRazorpay } from '../controllers/userController.js'
import authUser from '../middleware/authUser.js'
import upload from '../middleware/multer.js'

const userRouter = express.Router()

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.get('/get-profile', authUser, getProfile)
userRouter.post('/update-profile', upload.single('image'), authUser, updateProfile)
userRouter.post('/book-appointment', authUser, bookAppointment)
userRouter.get('/appointments', authUser, listAppointments)
userRouter.post('/cancel-appointment', authUser, cancelAppointment)
userRouter.post('/payment-razorpay', authUser, paymentRazorpay)
userRouter.post('/verifyRazorpay', authUser, verifyRazorpay)

export default userRouter
```

---

## 34. Server Entry Point

### `backend/server.js`
```js
import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import adminRouter from './routes/adminRoute.js'
import doctorRouter from './routes/doctorRoute.js'
import userRouter from './routes/userRoute.js'

// App config
const app = express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()

// Middlewares
app.use(express.json())
app.use(cors())

// API endpoints
app.use('/api/admin', adminRouter)
app.use('/api/doctor', doctorRouter)
app.use('/api/user', userRouter)

app.get('/', (req, res) => res.send('API Working'))

app.listen(port, () => console.log(`Server started on port ${port}`))
```

---

# Part 3 — Admin Panel (Separate React App)

## 35. Admin Panel Setup

```
npm create vite@latest admin -- --template react
cd admin
npm install axios react-router-dom react-toastify
```

### `vite.config.js` (admin)
```js
export default {
  plugins: [react()],
  server: { port: 5174 }
}
```

### `tailwind.config.js` (admin)
```js
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: { primary: "#5F6FFF" }
    }
  },
  plugins: [],
}
```

### `admin/src/index.css`
```css
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

* {
  font-family: 'Outfit', sans-serif;
}

::-webkit-scrollbar {
  display: none;
}
```

### `admin/.env`
```
VITE_BACKEND_URL=http://localhost:4000
```

### `admin/src/main.jsx`
```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import AdminContextProvider from './context/AdminContext.jsx'
import DoctorContextProvider from './context/DoctorContext.jsx'
import AppContextProvider from './context/AppContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AdminContextProvider>
      <DoctorContextProvider>
        <AppContextProvider>
          <App />
        </AppContextProvider>
      </DoctorContextProvider>
    </AdminContextProvider>
  </BrowserRouter>
)
```

---

## 36. Admin Context

### `admin/src/context/AdminContext.jsx`

**State variables:**
```jsx
const [aToken, setAToken] = useState(
  localStorage.getItem('aToken') ? localStorage.getItem('aToken') : ''
)
const [doctors, setDoctors] = useState([])
const [appointments, setAppointments] = useState([])
const [dashData, setDashData] = useState(false)

const backendUrl = import.meta.env.VITE_BACKEND_URL
```

**Functions:**

`getAllDoctors`:
```jsx
const getAllDoctors = async () => {
  const { data } = await axios.post(
    backendUrl + '/api/admin/all-doctors', {},
    { headers: { atoken: aToken } }
  )
  if (data.success) setDoctors(data.doctors)
  else toast.error(data.message)
}
```

`changeAvailability`:
```jsx
const changeAvailability = async (docId) => {
  const { data } = await axios.post(
    backendUrl + '/api/admin/change-availability',
    { docId },
    { headers: { atoken: aToken } }
  )
  if (data.success) {
    toast.success(data.message)
    getAllDoctors()
  } else toast.error(data.message)
}
```

`getAllAppointments`:
```jsx
const getAllAppointments = async () => {
  const { data } = await axios.get(
    backendUrl + '/api/admin/appointments',
    { headers: { atoken: aToken } }
  )
  if (data.success) setAppointments(data.appointments)
  else toast.error(data.message)
}
```

`cancelAppointment`:
```jsx
const cancelAppointment = async (appointmentId) => {
  const { data } = await axios.post(
    backendUrl + '/api/admin/cancel-appointment',
    { appointmentId },
    { headers: { atoken: aToken } }
  )
  if (data.success) {
    toast.success(data.message)
    getAllAppointments()
  } else toast.error(data.message)
}
```

`getDashData`:
```jsx
const getDashData = async () => {
  const { data } = await axios.get(
    backendUrl + '/api/admin/dashboard',
    { headers: { atoken: aToken } }
  )
  if (data.success) setDashData(data.dashData)
  else toast.error(data.message)
}
```

**Value object:** `{ aToken, setAToken, backendUrl, doctors, getAllDoctors, changeAvailability, appointments, setAppointments, getAllAppointments, cancelAppointment, dashData, getDashData }`

---

## 37. Doctor Context (Admin App)

### `admin/src/context/DoctorContext.jsx`

**State variables:**
```jsx
const [dToken, setDToken] = useState(
  localStorage.getItem('dToken') ? localStorage.getItem('dToken') : ''
)
const [appointments, setAppointments] = useState([])
const [dashData, setDashData] = useState(false)
const [profileData, setProfileData] = useState(false)

const backendUrl = import.meta.env.VITE_BACKEND_URL
```

**Functions:**

`getAppointments`:
```jsx
const getAppointments = async () => {
  const { data } = await axios.get(
    backendUrl + '/api/doctor/appointments',
    { headers: { dtoken: dToken } }
  )
  if (data.success) setAppointments(data.appointments.reverse())
  else toast.error(data.message)
}
```

`completeAppointment`:
```jsx
const completeAppointment = async (appointmentId) => {
  const { data } = await axios.post(
    backendUrl + '/api/doctor/complete-appointment',
    { appointmentId },
    { headers: { dtoken: dToken } }
  )
  if (data.success) {
    toast.success(data.message)
    getAppointments()
  } else toast.error(data.message)
}
```

`cancelAppointment`:
```jsx
const cancelAppointment = async (appointmentId) => {
  const { data } = await axios.post(
    backendUrl + '/api/doctor/cancel-appointment',
    { appointmentId },
    { headers: { dtoken: dToken } }
  )
  if (data.success) {
    toast.success(data.message)
    getAppointments()
  } else toast.error(data.message)
}
```

`getDashData`:
```jsx
const getDashData = async () => {
  const { data } = await axios.get(
    backendUrl + '/api/doctor/dashboard',
    { headers: { dtoken: dToken } }
  )
  if (data.success) setDashData(data.dashData)
  else toast.error(data.message)
}
```

`getProfileData`:
```jsx
const getProfileData = async () => {
  const { data } = await axios.get(
    backendUrl + '/api/doctor/profile',
    { headers: { dtoken: dToken } }
  )
  if (data.success) setProfileData(data.profileData)
}
```

**Value object:** `{ dToken, setDToken, backendUrl, appointments, setAppointments, getAppointments, completeAppointment, cancelAppointment, dashData, getDashData, profileData, setProfileData, getProfileData }`

---

## 38. App Context (Admin App)

### `admin/src/context/AppContext.jsx`

```jsx
import { createContext } from 'react'

export const AppContext = createContext()

const AppContextProvider = (props) => {
  const currency = '$'

  const months = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split('_')
    return dateArray[0] + ' ' + months[Number(dateArray[1])] + ' ' + dateArray[2]
  }

  const calculateAge = (dob) => {
    const today = new Date()
    const birthDate = new Date(dob)
    return today.getFullYear() - birthDate.getFullYear()
  }

  const value = { calculateAge, slotDateFormat, currency }

  return <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
}

export default AppContextProvider
```

---

## 39. Admin Login Page

### `admin/src/pages/Login.jsx`

**State variables:**
```jsx
const [state, setState] = useState('Admin')
const [email, setEmail] = useState('')
const [password, setPassword] = useState('')

const { setAToken, backendUrl } = useContext(AdminContext)
const { setDToken } = useContext(DoctorContext)
```

**Submit handler:**
```jsx
const onSubmitHandler = async (event) => {
  event.preventDefault()
  try {
    if (state === 'Admin') {
      const { data } = await axios.post(backendUrl + '/api/admin/login', { email, password })
      if (data.success) {
        localStorage.setItem('aToken', data.token)
        setAToken(data.token)
      } else {
        toast.error(data.message)
      }
    } else {
      const { data } = await axios.post(backendUrl + '/api/doctor/login', { email, password })
      if (data.success) {
        localStorage.setItem('dToken', data.token)
        setDToken(data.token)
      } else {
        toast.error(data.message)
      }
    }
  } catch (error) {
    toast.error(error.message)
  }
}
```

**Structure:**
- Form with email + password inputs
- Title shows "`<span className='text-primary'>{state}</span>` Login"
- Toggle link: "Doctor Login" / "Admin Login"
- Login button (type submit)

---

## 40. Admin Navbar

### `admin/src/components/Navbar.jsx`

**Structure:**
- Logo image (`assets.admin_logo`)
- `<p>` — ternary: `aToken ? 'Admin' : 'Doctor'`
- Logout button

**Logout function:**
```jsx
const { aToken, setAToken } = useContext(AdminContext)
const { dToken, setDToken } = useContext(DoctorContext)
const navigate = useNavigate()

const logout = () => {
  if (aToken) {
    setAToken('')
    localStorage.removeItem('aToken')
  }
  if (dToken) {
    setDToken('')
    localStorage.removeItem('dToken')
  }
  navigate('/')
}
```

**CSS notes:**
- Outer: `flex justify-between items-center px-4 sm:px-10 py-3 border-b bg-white`
- Logo: `w-36 cursor-pointer`
- Admin/Doctor tag: `border border-gray-500 text-gray-600 rounded-full text-xs px-2 py-0.5`
- Button: `bg-primary text-white text-sm px-10 py-2 rounded-full`

---

## 41. Sidebar Component

### `admin/src/components/Sidebar.jsx`

**Structure:**
- Ternary on `aToken` → Admin sidebar
- Ternary on `dToken` → Doctor sidebar

**Admin sidebar items (NavLink with icons):**
| Icon | Label | Path |
|------|-------|------|
| `home_icon` | Dashboard | `/admin-dashboard` |
| `appointment_icon` | Appointments | `/all-appointments` |
| `add_icon` | Add Doctor | `/add-doctor` |
| `people_icon` | Doctors List | `/doctor-list` |

**Doctor sidebar items:**
| Icon | Label | Path |
|------|-------|------|
| `home_icon` | Dashboard | `/doctor-dashboard` |
| `appointment_icon` | Appointments | `/doctor-appointments` |
| `people_icon` | Profile | `/doctor-profile` |

**Active state:**
```jsx
className={({ isActive }) =>
  `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
    isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''
  }`
}
```

**Each NavLink inner structure:**
```jsx
<img src={icon} />
<p className='hidden md:block'>{label}</p>
```

**CSS notes:**
- Outer div: `min-h-screen bg-white border-r`
- UL: `text-[#515151] mt-5`

---

## 42. Add Doctor Page

### `admin/src/pages/admin/AddDoctor.jsx`

**State variables:**
```jsx
const [docImg, setDocImg] = useState(false)
const [name, setName] = useState('')
const [email, setEmail] = useState('')
const [password, setPassword] = useState('')
const [experience, setExperience] = useState('1 Year')
const [fees, setFees] = useState('')
const [about, setAbout] = useState('')
const [speciality, setSpeciality] = useState('General physician')
const [degree, setDegree] = useState('')
const [address1, setAddress1] = useState('')
const [address2, setAddress2] = useState('')

const { backendUrl, aToken } = useContext(AdminContext)
```

**Submit handler:**
```jsx
const onSubmitHandler = async (event) => {
  event.preventDefault()
  try {
    if (!docImg) return toast.error('Image Not Selected')

    const formData = new FormData()
    formData.append('image', docImg)
    formData.append('name', name)
    formData.append('email', email)
    formData.append('password', password)
    formData.append('experience', experience)
    formData.append('fees', Number(fees))
    formData.append('about', about)
    formData.append('speciality', speciality)
    formData.append('degree', degree)
    formData.append('address', JSON.stringify({ line1: address1, line2: address2 }))

    const { data } = await axios.post(
      backendUrl + '/api/admin/add-doctor',
      formData,
      { headers: { atoken: aToken } }
    )

    if (data.success) {
      toast.success(data.message)
      setDocImg(false)
      setName(''); setPassword(''); setEmail('')
      setAddress1(''); setAddress2(''); setDegree('')
      setAbout(''); setFees('')
    } else {
      toast.error(data.message)
    }
  } catch (error) {
    toast.error(error.message)
    console.log(error)
  }
}
```

**Structure:**
- `<form onSubmit={onSubmitHandler}>`
- Image upload area:
  - `<label htmlFor="doc-img">` — shows preview if `docImg`, else `assets.upload_area`
  - `<input type="file" id="doc-img" hidden onChange={e => setDocImg(e.target.files[0])}>`
- Left column fields: Doctor Name, Doctor Email, Doctor Password, Experience (select), Fees
- Right column fields: Speciality (select), Education/Degree, Address 1, Address 2
- About (textarea, rows=5)
- "Add Doctor" submit button

**Experience options:** 1 Year, 2 Years, 3 Years, 4 Years, 5 Years, 6 Years, 7 Years, 8 Years, 9 Years, 10 Years

**Speciality options:** General physician, Gynecologist, Dermatologist, Pediatricians, Neurologist, Gastroenterologist

**CSS notes:**
- Form: `m-5 w-full`
- Container: `bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll`
- Image label: `cursor-pointer`
- Two-column div: `flex flex-col lg:flex-row items-start gap-10 text-gray-600`
- Input fields: `border rounded px-3 py-2`
- Submit button: `bg-primary px-10 py-3 mt-4 text-white rounded-full`

---

## 43. Doctor List Page

### `admin/src/pages/admin/DoctorsList.jsx`

**Logic:**
```jsx
const { doctors, aToken, getAllDoctors, changeAvailability } = useContext(AdminContext)

useEffect(() => {
  if (aToken) getAllDoctors()
}, [aToken])
```

**Each doctor card:**
```jsx
<div className='border border-indigo-200 rounded-xl max-w-56 overflow-hidden cursor-pointer group'>
  <img className='bg-indigo-50 group-hover:bg-primary transition-all duration-500' src={item.image} />
  <div className='p-4'>
    <p className='text-neutral-800 text-lg font-medium'>{item.name}</p>
    <p className='text-zinc-600 text-sm'>{item.speciality}</p>
    <div className='mt-2 flex items-center gap-1 text-sm'>
      <input
        onChange={() => changeAvailability(item._id)}
        type='checkbox'
        checked={item.available}
      />
      <p>Available</p>
    </div>
  </div>
</div>
```

**CSS notes:**
- Outer: `m-5 max-h-[90vh] overflow-y-scroll`
- H1: `text-lg font-medium mb-3`
- Cards container: `w-full flex flex-wrap gap-4 pt-5 gap-y-6`

---

## 44. All Appointments Page (Admin)

### `admin/src/pages/admin/AllAppointments.jsx`

**Logic:**
```jsx
const { aToken, appointments, getAllAppointments, cancelAppointment } = useContext(AdminContext)
const { calculateAge, slotDateFormat, currency } = useContext(AppContext)

useEffect(() => {
  if (aToken) getAllAppointments()
}, [aToken])
```

**Table header columns:** `#, Patient, Age, Date & Time, Doctor, Fees, Action`

**Each appointment row:**
- Serial number (index + 1)
- Patient: image + name (flex)
- Age: `calculateAge(item.userData.dob)`
- Date: `slotDateFormat(item.slotDate)` + `, ` + `item.slotTime`
- Doctor: image (bg-gray-200) + name (flex)
- Fees: `currency + item.amount`
- Action: ternary
  - If `item.cancelled` → `<p className='text-red-400 text-xs font-medium'>Cancelled</p>`
  - Else if `item.isCompleted` → `<p className='text-green-500 text-xs font-medium'>Completed</p>`
  - Else → `<img onClick={() => cancelAppointment(item._id)} src={assets.cancel_icon} className='w-10 cursor-pointer' />`

**CSS notes:**
- Row div: `` `flex flex-wrap justify-between max-sm:gap-2 sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] gap-1 items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-100` ``

---

## 45. Admin Dashboard Page

### `admin/src/pages/admin/Dashboard.jsx`

**Logic:**
```jsx
const { aToken, getDashData, cancelAppointment, dashData } = useContext(AdminContext)
const { slotDateFormat } = useContext(AppContext)

useEffect(() => {
  if (aToken) getDashData()
}, [aToken])
```

**Structure:**
- 3 stat cards:
  - Doctors: `assets.doctor_icon` + `dashData.doctors` + "Doctors"
  - Appointments: `assets.appointments_icon` + `dashData.appointments` + "Appointments"
  - Patients: `assets.patients_icon` + `dashData.patients` + "Patients"

- Latest Bookings section:
  - Header: `assets.list_icon` + "Latest Bookings"
  - List of `dashData.latestAppointments` (5 items):
    - Doctor image + name + `slotDateFormat(item.slotDate)`
    - Action ternary: cancelled/completed/cancel icon

**Stat card CSS:** `flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all`

**Latest bookings row CSS:** `flex items-center px-6 py-3 gap-3 hover:bg-gray-100`

---

## 46. Doctor Dashboard Page

### `admin/src/pages/doctor/DoctorDashboard.jsx`

**Logic:**
```jsx
const { dToken, dashData, getDashData, cancelAppointment, completeAppointment } = useContext(DoctorContext)
const { currency, slotDateFormat } = useContext(AppContext)

useEffect(() => {
  if (dToken) getDashData()
}, [dToken])
```

**Structure:**
- 3 stat cards: Earnings (`currency + dashData.earnings`), Appointments, Patients
- Latest Appointments list (5 items):
  - Patient image + name + `slotDateFormat(item.slotDate)`
  - Action ternary (same as admin dashboard but with complete/cancel)

**Icons used:**
- `assets.earning_icon`, `assets.appointments_icon`, `assets.patients_icon`
- `assets.cancel_icon`, `assets.tick_icon`

---

## 47. Doctor Appointments Page

### `admin/src/pages/doctor/DoctorAppointments.jsx`

**Logic:**
```jsx
const { dToken, appointments, getAppointments, cancelAppointment, completeAppointment } = useContext(DoctorContext)
const { calculateAge, slotDateFormat, currency } = useContext(AppContext)

useEffect(() => {
  if (dToken) getAppointments()
}, [dToken])
```

**Table header:** `#, Patient, Payment, Age, Date & Time, Fees, Action`

**Payment column:**
```jsx
<p className={`text-xs inline border border-primary rounded-full px-2 py-0.5`}>
  {item.payment ? 'Online' : 'Cash'}
</p>
```

**Action column ternary:**
```jsx
{item.cancelled
  ? <p className='text-red-400 text-xs font-medium'>Cancelled</p>
  : item.isCompleted
    ? <p className='text-green-500 text-xs font-medium'>Completed</p>
    : <div className='flex'>
        <img onClick={() => cancelAppointment(item._id)} src={assets.cancel_icon} className='w-10 cursor-pointer' />
        <img onClick={() => completeAppointment(item._id)} src={assets.tick_icon} className='w-10 cursor-pointer' />
      </div>
}
```

---

## 48. Doctor Profile Page

### `admin/src/pages/doctor/DoctorProfile.jsx`

**State variables:**
```jsx
const { dToken, profileData, setProfileData, getProfileData, backendUrl } = useContext(DoctorContext)
const { currency } = useContext(AppContext)
const [isEdit, setIsEdit] = useState(false)
```

**Update profile:**
```jsx
const updateProfile = async () => {
  try {
    const updateData = {
      address: profileData.address,
      fees: profileData.fees,
      available: profileData.available
    }

    const { data } = await axios.post(
      backendUrl + '/api/doctor/update-profile',
      updateData,
      { headers: { dtoken: dToken } }
    )

    if (data.success) {
      toast.success(data.message)
      setIsEdit(false)
      getProfileData()
    } else {
      toast.error(data.message)
    }
  } catch (error) {
    toast.error(error.message)
  }
}
```

**Structure:**
- Doctor image
- Name + verified icon
- Degree — Speciality | Experience button
- About section
- Appointment fee:
  - Edit mode → `<input type='number'>` bound to `profileData.fees`
  - View mode → `{currency}{profileData.fees}`
- Address:
  - Edit mode → two text inputs
  - View mode → two `<p>` tags with `<br>`
- Available checkbox (toggles `profileData.available` in state, save on "Save" button)
- Edit / Save button

**Editable fields only via doctor panel:** `fees`, `address.line1`, `address.line2`, `available`

**CSS notes:**
- Outer: `flex flex-col gap-4 m-5`
- Image: `bg-primary/80 w-full sm:max-w-64 rounded-lg`
- Details box: `flex-1 border border-stone-100 rounded-lg p-8 py-7 bg-white`

---

## 49. App.jsx (Admin)

### `admin/src/App.jsx`

```jsx
import { useContext } from 'react'
import { Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AdminContext } from './context/AdminContext'
import { DoctorContext } from './context/DoctorContext'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Login from './pages/Login'
import Dashboard from './pages/admin/Dashboard'
import AllAppointments from './pages/admin/AllAppointments'
import AddDoctor from './pages/admin/AddDoctor'
import DoctorsList from './pages/admin/DoctorsList'
import DoctorDashboard from './pages/doctor/DoctorDashboard'
import DoctorAppointments from './pages/doctor/DoctorAppointments'
import DoctorProfile from './pages/doctor/DoctorProfile'

const App = () => {
  const { aToken } = useContext(AdminContext)
  const { dToken } = useContext(DoctorContext)

  return aToken || dToken ? (
    <div className='bg-[#F8F9FD]'>
      <ToastContainer />
      <Navbar />
      <div className='flex items-start'>
        <Sidebar />
        <Routes>
          {/* Admin Routes */}
          <Route path='/admin-dashboard' element={<Dashboard />} />
          <Route path='/all-appointments' element={<AllAppointments />} />
          <Route path='/add-doctor' element={<AddDoctor />} />
          <Route path='/doctor-list' element={<DoctorsList />} />
          {/* Doctor Routes */}
          <Route path='/doctor-dashboard' element={<DoctorDashboard />} />
          <Route path='/doctor-appointments' element={<DoctorAppointments />} />
          <Route path='/doctor-profile' element={<DoctorProfile />} />
        </Routes>
      </div>
    </div>
  ) : (
    <>
      <ToastContainer />
      <Login />
    </>
  )
}

export default App
```

---

## 7. Payment Integration — Razorpay

### Setup
1. Create a Razorpay account at [razorpay.com](https://razorpay.com)
2. Complete KYC to get API keys
3. Get **Key ID** and **Key Secret** from Dashboard → Settings → API Keys
4. Store in `backend/.env`:
   ```
   RAZORPAY_KEY_ID=rzp_test_xxxxx
   RAZORPAY_KEY_SECRET=xxxxx
   CURRENCY=INR
   ```
5. Store Key ID (public) in `frontend/.env`:
   ```
   VITE_RAZORPAY_KEY_ID=rzp_test_xxxxx
   ```

### Flow
```
Frontend                    Backend
--------                    -------
Click "Pay Online"
  → POST /api/user/payment-razorpay  { appointmentId }
                            ← { success, order: { id, amount, currency, receipt } }
  → initPay(order)
  → new window.Razorpay(options).open()
  → User pays in Razorpay modal
  → handler(response) fires with razorpay_order_id
  → POST /api/user/verifyRazorpay  { razorpay_order_id, ... }
                            ← { success: true, message: 'Payment Successful' }
  → getUserAppointments()
  → navigate('/my-appointments')
```

### Test card details (from Razorpay test mode)
- Card number: `4111 1111 1111 1111`
- Expiry: Any future date
- CVV: Any 3 digits
- Simulate: Click "Complete on Bank's Page" → "Success"

---

## 8. Frontend API Integration Summary

| Feature | Method | Endpoint | Auth |
|---------|--------|----------|------|
| Get doctors list | GET | `/api/doctor/list` | None |
| Register user | POST | `/api/user/register` | None |
| Login user | POST | `/api/user/login` | None |
| Get user profile | GET | `/api/user/get-profile` | `token` header |
| Update user profile | POST | `/api/user/update-profile` | `token` header |
| Book appointment | POST | `/api/user/book-appointment` | `token` header |
| Get user appointments | GET | `/api/user/appointments` | `token` header |
| Cancel appointment | POST | `/api/user/cancel-appointment` | `token` header |
| Pay via Razorpay | POST | `/api/user/payment-razorpay` | `token` header |
| Verify Razorpay | POST | `/api/user/verifyRazorpay` | `token` header |

---

## 9. Complete API Reference

### Admin APIs (`/api/admin/*`) — Header: `atoken`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/login` | Admin login → returns JWT |
| POST | `/add-doctor` | Add new doctor (multipart/form-data) |
| POST | `/all-doctors` | Get all doctors list |
| POST | `/change-availability` | Toggle doctor availability |
| GET | `/appointments` | Get all appointments |
| POST | `/cancel-appointment` | Cancel any appointment |
| GET | `/dashboard` | Get dashboard stats |

### Doctor APIs (`/api/doctor/*`) — Header: `dtoken`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/list` | Public: get all doctors (no password/email) |
| POST | `/login` | Doctor login → returns JWT |
| GET | `/appointments` | Doctor's own appointments |
| POST | `/complete-appointment` | Mark appointment completed |
| POST | `/cancel-appointment` | Cancel appointment |
| GET | `/dashboard` | Doctor's dashboard data |
| GET | `/profile` | Doctor's own profile |
| POST | `/update-profile` | Update fees, address, availability |

### User APIs (`/api/user/*`) — Header: `token`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/register` | Create new patient account |
| POST | `/login` | Patient login → returns JWT |
| GET | `/get-profile` | Get patient profile |
| POST | `/update-profile` | Update profile (multipart/form-data) |
| POST | `/book-appointment` | Book appointment with doctor |
| GET | `/appointments` | Get patient's booked appointments |
| POST | `/cancel-appointment` | Cancel own appointment |
| POST | `/payment-razorpay` | Create Razorpay order |
| POST | `/verifyRazorpay` | Verify payment + mark paid |

---

## Key Business Logic Summary

### Slot Booking Logic
- Slots generated: daily 10:00 AM – 9:00 PM in 30-minute intervals
- For today: starts from `currentHour + 1` (rounded to next 30 min)
- Slot format for DB key: `day_month_year` (e.g., `25_8_2024`)
- Doctor model stores booked slots in `slots_booked` object: `{ "25_8_2024": ["10:00 AM", "11:30 AM"] }`
- On booking: push slot time into array
- On cancellation: filter out slot time from array

### Appointment Cancellation Rules
- Patient can cancel from My Appointments page
- Admin can cancel any appointment from Admin panel
- Doctor can cancel from Doctor panel
- On cancel: `cancelled: true` in appointment + slot released from doctor's `slots_booked`

### Earnings Calculation (Doctor Dashboard)
```
earnings += item.amount  // for each appointment where item.isCompleted OR item.payment === true
```

### Unique Patient Count (Doctor Dashboard)
```
Collect all unique userId values from appointments array
patients.length = number of unique patients
```

### Available Status Display (Frontend)
- Green dot + "Available" if `doctor.available === true`
- Gray dot + "Not Available" if `doctor.available === false`
- Appointment cannot be booked if doctor is unavailable

---

*End of Build Guide — Prescripto Full Stack Doctor Appointment Booking System*
