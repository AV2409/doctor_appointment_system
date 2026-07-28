import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AdminContext } from '../context/AdminContext'
import { DoctorContext } from '../context/DoctorContext'

const MediSyncLogo = () => (
  <svg width='36' height='36' viewBox='0 0 36 36' fill='none' xmlns='http://www.w3.org/2000/svg'>
    <rect width='36' height='36' rx='10' fill='#5F6FFF' />
    <path
      d='M10 10h8a6 6 0 010 12h-8V10zm0 12h10M18 22v4'
      stroke='white' strokeWidth='2.2' strokeLinecap='round' strokeLinejoin='round'
    />
  </svg>
)

const LogoutIcon = () => (
  <svg width='18' height='18' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
    <path
      d='M16 17l5-5-5-5M21 12H9M13 22H5a2 2 0 01-2-2V4a2 2 0 012-2h8'
      stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'
    />
  </svg>
)

const Navbar = () => {
  const { aToken, logout: adminLogout } = useContext(AdminContext)
  const { dToken, logout: doctorLogout } = useContext(DoctorContext)
  const navigate = useNavigate()

  const role = aToken ? 'Admin' : 'Doctor'

  const handleLogout = async () => {
    if (aToken) await adminLogout()
    if (dToken) await doctorLogout()
    navigate('/')
  }

  return (
    <div className='sticky top-0 z-50 flex justify-between items-center
                    px-4 sm:px-8 py-3 bg-white border-b border-gray-100 shadow-sm'>
      <div className='flex items-center gap-3'>
        <MediSyncLogo />
        <div className='leading-tight'>
          <p className='text-base font-bold text-gray-800 tracking-tight'>MediSync</p>
          <p className='text-[10px] text-gray-400 font-medium -mt-0.5 uppercase tracking-widest'>
            {role} Panel
          </p>
        </div>

        <span className='hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full
                         text-xs font-medium bg-primary/10 text-primary border border-primary/20
                         ml-1'>
          {role}
        </span>
      </div>

      <button
        id='navbar-logout-btn'
        onClick={handleLogout}
        className='flex items-center gap-2 bg-primary text-white text-sm
                   px-4 py-2 rounded-full font-medium
                   hover:bg-primary/90 active:scale-[0.97] transition-all'
      >
        <LogoutIcon />
        <span className='hidden sm:inline'>Logout</span>
      </button>
    </div>
  )
}

export default Navbar
