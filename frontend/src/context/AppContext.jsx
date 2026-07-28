import { createContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import axiosInstance from '../utils/axiosInstance' // replaces raw axios
import { getErrorMessage } from '../utils/getErrorMessage'

export const AppContext = createContext()

const AppContextProvider = (props) => {
  const currencySymbol = '₹'

  const [doctors, setDoctors] = useState([])
  const [token, setToken] = useState(
    localStorage.getItem('accessToken') ? localStorage.getItem('accessToken') : false
  )
  const [userData, setUserData] = useState(false)

  const months = [
    '', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ]

  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split('_')
    return dateArray[0] + ' ' + months[Number(dateArray[1])] + ' ' + dateArray[2]
  }

  const calculateAge = (dob) => {
    const today     = new Date()
    const birthDate = new Date(dob)
    let age = today.getFullYear() - birthDate.getFullYear()
    const hasHadBirthdayThisYear =
      today.getMonth() > birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate())
    if (!hasHadBirthdayThisYear) age -= 1
    return age
  }

  const getDoctorsData = async () => {
    try {
      const { data } = await axiosInstance.get('/api/doctor/list')
      if (data.success) {
        setDoctors(data.data) // CHANGED: was data.doctors
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.error(error)
      toast.error(getErrorMessage(error))
    }
  }

  const loadUserProfileData = async () => {
    try {
      const { data } = await axiosInstance.get('/api/user/get-profile')
      if (data.success) {
        setUserData(data.data) // CHANGED: was data.userData
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.error(error)
      if (error?.response?.status === 401) {
        setToken(false)
        setUserData(false)
        localStorage.removeItem('accessToken')
      } else {
        toast.error(getErrorMessage(error))
      }
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















