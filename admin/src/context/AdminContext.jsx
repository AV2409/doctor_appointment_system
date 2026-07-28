import { createContext, useState } from 'react'
import { toast } from 'react-toastify'
import axiosInstance from '../utils/axiosInstance'
import { getRoleFromToken } from '../utils/getRoleFromToken'
import { getErrorMessage } from '../utils/getErrorMessage'

export const AdminContext = createContext()

const AdminContextProvider = (props) => {
  const storedToken = localStorage.getItem('accessToken') || ''
  const [aToken, setAToken] = useState(
    getRoleFromToken(storedToken) === 'ADMIN' ? storedToken : ''
  )

  const [doctors, setDoctors] = useState([])
  const [appointments, setAppointments] = useState([])
  const [dashData, setDashData] = useState(false)

  const backendUrl = import.meta.env.VITE_BACKEND_URL


  const login = async (email, password) => {
    try {
      const { data } = await axiosInstance.post('/api/admin/login', { email, password })
      if (data.success) {
        localStorage.setItem('accessToken', data.data.accessToken)
        setAToken(data.data.accessToken)
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
      await axiosInstance.post('/api/admin/logout')
    } catch (_) {
    }
    localStorage.removeItem('accessToken')
    setAToken('')
  }


  const getAllDoctors = async () => {
    try {
      const { data } = await axiosInstance.get('/api/admin/all-doctors')
      if (data.success) setDoctors(data.data)
      else toast.error(data.message)
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  const changeAvailability = async (docId) => {
    try {
      const { data } = await axiosInstance.post('/api/admin/change-availability', { docId })
      if (data.success) {
        toast.success(data.message)
        getAllDoctors()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }


  const getAllAppointments = async () => {
    try {
      const { data } = await axiosInstance.get('/api/admin/appointments')
      if (data.success) setAppointments(data.data)
      else toast.error(data.message)
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axiosInstance.post('/api/admin/cancel-appointment', { appointmentId })
      if (data.success) {
        toast.success(data.message)
        getAllAppointments()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }


  const getDashData = async () => {
    try {
      const { data } = await axiosInstance.get('/api/admin/dashboard')
      if (data.success) setDashData(data.data)
      else toast.error(data.message)
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  const value = {
    aToken,
    setAToken,
    login,
    logout,
    backendUrl,
    doctors,
    getAllDoctors,
    changeAvailability,
    appointments,
    setAppointments,
    getAllAppointments,
    cancelAppointment,
    dashData,
    getDashData,
  }

  return (
    <AdminContext.Provider value={value}>
      {props.children}
    </AdminContext.Provider>
  )
}

export default AdminContextProvider
