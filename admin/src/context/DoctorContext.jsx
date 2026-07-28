import { createContext, useState } from 'react'
import { toast } from 'react-toastify'
import axiosInstance from '../utils/axiosInstance'
import { getRoleFromToken } from '../utils/getRoleFromToken'
import { getErrorMessage } from '../utils/getErrorMessage'

export const DoctorContext = createContext()

const DoctorContextProvider = (props) => {
  const storedToken = localStorage.getItem('accessToken') || ''
  const [dToken, setDToken] = useState(
    getRoleFromToken(storedToken) === 'DOCTOR' ? storedToken : ''
  )

  const [appointments, setAppointments] = useState([])
  const [dashData, setDashData] = useState(false)
  const [profileData, setProfileData] = useState(false)

  const backendUrl = import.meta.env.VITE_BACKEND_URL


  const login = async (email, password) => {
    try {
      const { data } = await axiosInstance.post('/api/doctor/login', { email, password })
      if (data.success) {
        localStorage.setItem('accessToken', data.data.accessToken)
        setDToken(data.data.accessToken)
        toast.success(data.message)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  const logout = async () => {
    try {
      await axiosInstance.post('/api/doctor/logout')
    } catch (_) {
    }
    localStorage.removeItem('accessToken')
    setDToken('')
  }


  const getAppointments = async () => {
    try {
      const { data } = await axiosInstance.get('/api/doctor/appointments')
      if (data.success) setAppointments(data.data.reverse())
      else toast.error(data.message)
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  const completeAppointment = async (appointmentId) => {
    try {
      const { data } = await axiosInstance.post('/api/doctor/complete-appointment', { appointmentId })
      if (data.success) {
        toast.success(data.message)
        getAppointments()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axiosInstance.post('/api/doctor/cancel-appointment', { appointmentId })
      if (data.success) {
        toast.success(data.message)
        getAppointments()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }


  const getDashData = async () => {
    try {
      const { data } = await axiosInstance.get('/api/doctor/dashboard')
      if (data.success) setDashData(data.data)
      else toast.error(data.message)
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }


  const getProfileData = async () => {
    try {
      const { data } = await axiosInstance.get('/api/doctor/profile')
      if (data.success) setProfileData(data.data)
      else toast.error(data.message)
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  const updateProfile = async (profilePayload) => {
    try {
      const { data } = await axiosInstance.post('/api/doctor/update-profile', profilePayload)
      if (data.success) {
        toast.success(data.message)
        await getProfileData()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  const value = {
    dToken,
    setDToken,
    login,
    logout,
    backendUrl,
    appointments,
    setAppointments,
    getAppointments,
    completeAppointment,
    cancelAppointment,
    dashData,
    getDashData,
    profileData,
    setProfileData,
    getProfileData,
    updateProfile,
  }

  return (
    <DoctorContext.Provider value={value}>
      {props.children}
    </DoctorContext.Provider>
  )
}

export default DoctorContextProvider
