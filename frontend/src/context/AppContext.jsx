import { createContext, useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { doctors as mockDoctors } from '../assets/assets'

export const AppContext = createContext()

const AppContextProvider = (props) => {
  const currencySymbol = '$'
  const backendUrl = import.meta.env.VITE_BACKEND_URL

  // Start with mock data; once backend is live, this gets replaced by API response
  const [doctors, setDoctors] = useState(mockDoctors)
  const [token, setToken] = useState(
    localStorage.getItem('token') ? localStorage.getItem('token') : false
  )
  const [userData, setUserData] = useState(false)

  const months = [
    '', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ]

  // Format a slot date string like "15_6_2025" → "15 Jun 2025"
  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split('_')
    return dateArray[0] + ' ' + months[Number(dateArray[1])] + ' ' + dateArray[2]
  }

  // Calculate age from a date-of-birth string
  const calculateAge = (dob) => {
    const today = new Date()
    const birthDate = new Date(dob)
    const age = today.getFullYear() - birthDate.getFullYear()
    return age
  }

  // Fetch doctors from backend (used once backend is connected)
  const getDoctorsData = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/doctor/list')
      if (data.success) {
        setDoctors(data.doctors)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      // Backend not yet connected — silently keep mock data
      console.log('Backend not connected, using mock data:', error.message)
    }
  }

  // Fetch the logged-in user's profile data
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

  // Fetch doctors on mount (will fall back to mock data if backend is unavailable)
  useEffect(() => {
    getDoctorsData()
  }, [])

  // Reload user profile whenever auth token changes
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
