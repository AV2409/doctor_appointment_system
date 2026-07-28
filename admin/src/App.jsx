import React, { useContext } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { AdminContext } from './context/AdminContext'
import { DoctorContext } from './context/DoctorContext'

import Login from './pages/Login'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'

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

  const isLoggedIn = Boolean(aToken || dToken)

  if (!isLoggedIn) {
    return (
      <div className='min-h-screen bg-[#F8F9FD]'>
        <ToastContainer position='top-right' autoClose={3000} />
        <Routes>
          <Route path='*' element={<Login />} />
        </Routes>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-[#F8F9FD]'>
      <ToastContainer position='top-right' autoClose={3000} />

      <Navbar />

      <div className='flex items-start'>
        <Sidebar />

        <main className='flex-1 p-4 sm:p-6 min-h-[calc(100vh-57px)] overflow-y-auto'>
          <Routes>
            {aToken && (
              <>
                <Route path='/'                  element={<Navigate to='/admin-dashboard' replace />} />
                <Route path='/admin-dashboard'   element={<Dashboard />} />
                <Route path='/all-appointments'  element={<AllAppointments />} />
                <Route path='/add-doctor'        element={<AddDoctor />} />
                <Route path='/doctors-list'      element={<DoctorsList />} />
              </>
            )}

            {dToken && (
              <>
                <Route path='/'                    element={<Navigate to='/doctor-dashboard' replace />} />
                <Route path='/doctor-dashboard'    element={<DoctorDashboard />} />
                <Route path='/doctor-appointments' element={<DoctorAppointments />} />
                <Route path='/doctor-profile'      element={<DoctorProfile />} />
              </>
            )}

            <Route
              path='*'
              element={
                <Navigate to={aToken ? '/admin-dashboard' : '/doctor-dashboard'} replace />
              }
            />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default App
