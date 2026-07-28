/**
 * assets.js
 * -----------
 * Central export for all static assets and mock data.
 *
 * During early frontend development (before backend is wired up), the
 * `doctors` array and `specialityData` array below serve as the data source.
 * Once the backend is live, AppContext replaces these with API responses.
 *
 * Images are referenced as URLs to Unsplash/placeholder services so the
 * project runs immediately without needing local image files.
 * When you have production images, import them normally and swap the values.
 */

export const assets = {
  logo: 'https://placehold.co/160x50/5F6FFF/ffffff?text=MediSync&font=outfit',
  header_img: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600&auto=format&fit=crop',
  group_profiles:
    'https://placehold.co/120x40/e0e7ff/5F6FFF?text=●●●●&font=roboto',

  appointment_img:
    'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=500&auto=format&fit=crop',

  about_image:
    'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&auto=format&fit=crop',
  contact_image:
    'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=800&auto=format&fit=crop',

  profile_pic:
    'https://placehold.co/150x150/e0e7ff/5F6FFF?text=User&font=outfit',

  dropdown_icon:
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%236B7280' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E",

  menu_icon:
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath d='M3 6h18M3 12h18M3 18h18' stroke='%23374151' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E",

  cross_icon:
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath d='M18 6L6 18M6 6l12 12' stroke='%23374151' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E",

  arrow_icon:
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24'%3E%3Cpath d='M5 12h14M12 5l7 7-7 7' stroke='%235F6FFF' stroke-width='2' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E",

  verified_icon:
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24'%3E%3Ccircle cx='12' cy='12' r='10' fill='%2322c55e'/%3E%3Cpath d='M8 12l3 3 5-5' stroke='white' stroke-width='2' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E",

  info_icon:
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24'%3E%3Ccircle cx='12' cy='12' r='10' stroke='%235F6FFF' stroke-width='2' fill='none'/%3E%3Cpath d='M12 8v4M12 16h.01' stroke='%235F6FFF' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E",

  chats_icon:
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24'%3E%3Cpath d='M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z' stroke='%235F6FFF' stroke-width='2' fill='none' stroke-linejoin='round'/%3E%3C/svg%3E",

  upload_icon:
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12' stroke='%235F6FFF' stroke-width='2' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E",

  stripe_logo:
    'https://placehold.co/100x32/ffffff/635bff?text=stripe&font=outfit',
  razorpay_logo:
    'https://placehold.co/100x32/ffffff/3395FF?text=razorpay&font=outfit',
}

export const specialityData = [
  {
    speciality: 'General physician',
    image:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Ccircle cx='40' cy='40' r='40' fill='%23e0e7ff'/%3E%3Cpath d='M40 20a12 12 0 1 1 0 24 12 12 0 0 1 0-24zm0 28c13 0 20 6 20 10v2H20v-2c0-4 7-10 20-10z' fill='%235F6FFF'/%3E%3Cpath d='M33 42h14M40 35v14' stroke='%235F6FFF' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E",
  },
  {
    speciality: 'Gynecologist',
    image:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Ccircle cx='40' cy='40' r='40' fill='%23fce7f3'/%3E%3Cpath d='M40 20a12 12 0 1 1 0 24 12 12 0 0 1 0-24zm0 28c13 0 20 6 20 10v2H20v-2c0-4 7-10 20-10z' fill='%23ec4899'/%3E%3C/svg%3E",
  },
  {
    speciality: 'Dermatologist',
    image:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Ccircle cx='40' cy='40' r='40' fill='%23fef3c7'/%3E%3Cpath d='M40 20a12 12 0 1 1 0 24 12 12 0 0 1 0-24zm0 28c13 0 20 6 20 10v2H20v-2c0-4 7-10 20-10z' fill='%23f59e0b'/%3E%3C/svg%3E",
  },
  {
    speciality: 'Pediatricians',
    image:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Ccircle cx='40' cy='40' r='40' fill='%23d1fae5'/%3E%3Cpath d='M40 20a12 12 0 1 1 0 24 12 12 0 0 1 0-24zm0 28c13 0 20 6 20 10v2H20v-2c0-4 7-10 20-10z' fill='%2310b981'/%3E%3C/svg%3E",
  },
  {
    speciality: 'Neurologist',
    image:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Ccircle cx='40' cy='40' r='40' fill='%23ede9fe'/%3E%3Cpath d='M40 20a12 12 0 1 1 0 24 12 12 0 0 1 0-24zm0 28c13 0 20 6 20 10v2H20v-2c0-4 7-10 20-10z' fill='%237c3aed'/%3E%3C/svg%3E",
  },
  {
    speciality: 'Gastroenterologist',
    image:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Ccircle cx='40' cy='40' r='40' fill='%23fee2e2'/%3E%3Cpath d='M40 20a12 12 0 1 1 0 24 12 12 0 0 1 0-24zm0 28c13 0 20 6 20 10v2H20v-2c0-4 7-10 20-10z' fill='%23ef4444'/%3E%3C/svg%3E",
  },
]

const doctorPhoto = (seed, gender = 'men') =>
  `https://randomuser.me/api/portraits/${gender}/${seed}.jpg`

export const doctors = [
  {
    _id: 'doc1',
    name: 'Dr. Richard James',
    image: doctorPhoto(10, 'men'),
    speciality: 'General physician',
    degree: 'MBBS',
    experience: '4 Years',
    about:
      'Dr. James has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. He is dedicated to improving patient well-being.',
    available: true,
    fees: 50,
    slots_booked: {},
    address: { line1: '17th Cross, Richmond', line2: 'Circle, Ring Road, London' },
  },
  {
    _id: 'doc2',
    name: 'Dr. Emily Larson',
    image: doctorPhoto(20, 'women'),
    speciality: 'Gynecologist',
    degree: 'MBBS',
    experience: '3 Years',
    about:
      'Dr. Larson specializes in women\'s health, providing expert care in gynecology and obstetrics. She is committed to empowering her patients with knowledge and compassionate support.',
    available: true,
    fees: 60,
    slots_booked: {},
    address: { line1: '27th Cross, Whitefield', line2: 'Outer Ring Road, Bangalore' },
  },
  {
    _id: 'doc3',
    name: 'Dr. Sarah Patel',
    image: doctorPhoto(30, 'women'),
    speciality: 'Dermatologist',
    degree: 'MBBS',
    experience: '1 Year',
    about:
      'Dr. Patel is passionate about skin health, offering treatments for acne, eczema, psoriasis, and cosmetic dermatology. She provides personalized care plans tailored to each patient.',
    available: true,
    fees: 30,
    slots_booked: {},
    address: { line1: '57th Cross, MG Road', line2: 'Indiranagar, Bangalore' },
  },
  {
    _id: 'doc4',
    name: 'Dr. Christopher Lee',
    image: doctorPhoto(40, 'men'),
    speciality: 'Pediatricians',
    degree: 'MBBS',
    experience: '2 Years',
    about:
      'Dr. Lee is a caring pediatrician dedicated to the health and well-being of children from newborns to teenagers. He builds strong relationships with both children and their families.',
    available: false,
    fees: 40,
    slots_booked: {},
    address: { line1: '37th Cross, Koramangala', line2: '5th Block, Bangalore' },
  },
  {
    _id: 'doc5',
    name: 'Dr. Jennifer Garcia',
    image: doctorPhoto(50, 'women'),
    speciality: 'Neurologist',
    degree: 'MBBS',
    experience: '4 Years',
    about:
      'Dr. Garcia is a skilled neurologist who manages conditions like migraines, epilepsy, stroke, and Parkinson\'s disease. She provides cutting-edge diagnostic and therapeutic solutions.',
    available: true,
    fees: 50,
    slots_booked: {},
    address: { line1: '47th Cross, HSR Layout', line2: 'Sector 4, Bangalore' },
  },
  {
    _id: 'doc6',
    name: 'Dr. Andrew Williams',
    image: doctorPhoto(60, 'men'),
    speciality: 'Neurologist',
    degree: 'MBBS',
    experience: '4 Years',
    about:
      'Dr. Williams has extensive experience in treating neurological disorders with a patient-centred approach. He focuses on lifestyle-based interventions alongside evidence-based medicine.',
    available: true,
    fees: 50,
    slots_booked: {},
    address: { line1: '67th Cross, Electronic City', line2: 'Phase 1, Bangalore' },
  },
  {
    _id: 'doc7',
    name: 'Dr. Christopher Davis',
    image: doctorPhoto(70, 'men'),
    speciality: 'General physician',
    degree: 'MBBS',
    experience: '4 Years',
    about:
      'Dr. Davis offers thorough general medical care with a focus on chronic disease management and routine wellness. He maintains long-term relationships with patients for continuous care.',
    available: true,
    fees: 50,
    slots_booked: {},
    address: { line1: '77th Cross, Jayanagar', line2: '9th Block, Bangalore' },
  },
  {
    _id: 'doc8',
    name: 'Dr. Timothy White',
    image: doctorPhoto(80, 'men'),
    speciality: 'Gynecologist',
    degree: 'MBBS',
    experience: '3 Years',
    about:
      'Dr. White is an obstetrician-gynecologist committed to women\'s health across all life stages, from adolescent care to menopause management.',
    available: true,
    fees: 60,
    slots_booked: {},
    address: { line1: '17th Cross, Yelahanka', line2: 'New Town, Bangalore' },
  },
  {
    _id: 'doc9',
    name: 'Dr. Ava Mitchell',
    image: doctorPhoto(10, 'women'),
    speciality: 'Dermatologist',
    degree: 'MBBS',
    experience: '1 Year',
    about:
      'Dr. Mitchell brings enthusiasm and evidence-based practice to dermatology, treating both medical and cosmetic skin conditions with the latest techniques.',
    available: true,
    fees: 30,
    slots_booked: {},
    address: { line1: '87th Cross, Marathahalli', line2: 'Outer Ring Road, Bangalore' },
  },
  {
    _id: 'doc10',
    name: 'Dr. Jeffrey King',
    image: doctorPhoto(90, 'men'),
    speciality: 'Pediatricians',
    degree: 'MBBS',
    experience: '2 Years',
    about:
      'Dr. King provides comprehensive pediatric care with a focus on developmental milestones, immunizations, and childhood illness management.',
    available: true,
    fees: 40,
    slots_booked: {},
    address: { line1: '97th Cross, Hebbal', line2: 'Ring Road, Bangalore' },
  },
  {
    _id: 'doc11',
    name: 'Dr. Zoe Kelly',
    image: doctorPhoto(40, 'women'),
    speciality: 'General physician',
    degree: 'MBBS',
    experience: '4 Years',
    about:
      'Dr. Kelly believes in holistic, preventive care. She ensures her patients receive timely screenings and lifestyle guidance alongside medical treatment.',
    available: true,
    fees: 50,
    slots_booked: {},
    address: { line1: '107th Cross, Bannerghatta', line2: 'Road, Bangalore' },
  },
  {
    _id: 'doc12',
    name: 'Dr. Patrick Harris',
    image: doctorPhoto(11, 'men'),
    speciality: 'Neurologist',
    degree: 'MBBS',
    experience: '4 Years',
    about:
      'Dr. Harris has a deep understanding of complex neurological conditions. He uses advanced diagnostics to tailor individualized treatment plans.',
    available: true,
    fees: 50,
    slots_booked: {},
    address: { line1: '57th Cross, Banashankari', line2: '3rd Stage, Bangalore' },
  },
  {
    _id: 'doc13',
    name: 'Dr. Chloe Evans',
    image: doctorPhoto(60, 'women'),
    speciality: 'General physician',
    degree: 'MBBS',
    experience: '4 Years',
    about:
      'Dr. Evans prioritizes building trust with her patients. She offers comprehensive primary care, including management of hypertension, diabetes, and respiratory conditions.',
    available: true,
    fees: 50,
    slots_booked: {},
    address: { line1: '117th Cross, JP Nagar', line2: '7th Phase, Bangalore' },
  },
  {
    _id: 'doc14',
    name: 'Dr. Ryan Martinez',
    image: doctorPhoto(21, 'men'),
    speciality: 'Gastroenterologist',
    degree: 'MBBS',
    experience: '4 Years',
    about:
      'Dr. Martinez specializes in digestive health, treating conditions like IBS, GERD, liver disease, and colorectal issues with precision and empathy.',
    available: false,
    fees: 70,
    slots_booked: {},
    address: { line1: '127th Cross, Basavanagudi', line2: 'Gavipuram, Bangalore' },
  },
  {
    _id: 'doc15',
    name: 'Dr. Amelia Johnson',
    image: doctorPhoto(70, 'women'),
    speciality: 'Gynecologist',
    degree: 'MBBS',
    experience: '3 Years',
    about:
      'Dr. Johnson is devoted to promoting women\'s health and reproductive wellness. She offers compassionate care for all stages of womanhood.',
    available: true,
    fees: 60,
    slots_booked: {},
    address: { line1: '137th Cross, RT Nagar', line2: 'Palace Guttahalli, Bangalore' },
  },
]
