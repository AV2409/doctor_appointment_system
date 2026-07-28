import { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { AdminContext } from '../context/AdminContext'
import { DoctorContext } from '../context/DoctorContext'

const HomeIcon = () => (
  <svg className='w-5 h-5 shrink-0' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
    <path
      d='M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z'
      stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' strokeLinejoin='round'
    />
    <path d='M9 21V12h6v9' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' strokeLinejoin='round' />
  </svg>
)

const CalendarIcon = () => (
  <svg className='w-5 h-5 shrink-0' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
    <rect x='3' y='4' width='18' height='18' rx='2' stroke='currentColor' strokeWidth='1.8' strokeLinejoin='round' />
    <path d='M16 2v4M8 2v4M3 10h18' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' />
  </svg>
)

const PlusIcon = () => (
  <svg className='w-5 h-5 shrink-0' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
    <circle cx='12' cy='12' r='9' stroke='currentColor' strokeWidth='1.8' />
    <path d='M12 8v8M8 12h8' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' />
  </svg>
)

const PeopleIcon = () => (
  <svg className='w-5 h-5 shrink-0' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
    <circle cx='9' cy='7' r='4' stroke='currentColor' strokeWidth='1.8' />
    <path d='M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' />
    <path d='M16 3.13a4 4 0 010 7.75M21 21v-2a4 4 0 00-3-3.87' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' />
  </svg>
)

const UserIcon = () => (
  <svg className='w-5 h-5 shrink-0' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
    <circle cx='12' cy='8' r='4' stroke='currentColor' strokeWidth='1.8' />
    <path d='M4 21v-1a8 8 0 0116 0v1' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' />
  </svg>
)

const navItemClass = ({ isActive }) =>
  [
    'flex items-center gap-3 py-3 px-4 md:px-6 md:min-w-56',
    'rounded-lg mx-2 cursor-pointer transition-all duration-150 font-medium text-sm',
    isActive
      ? 'bg-primary/10 text-primary border-l-4 border-primary rounded-l-none'
      : 'text-[#515151] hover:bg-gray-100 border-l-4 border-transparent rounded-l-none',
  ].join(' ')

const Sidebar = () => {
  const { aToken } = useContext(AdminContext)
  const { dToken } = useContext(DoctorContext)

  return (
    <aside className='min-h-[calc(100vh-57px)] w-16 md:w-64 bg-white border-r border-gray-100
                      flex flex-col pt-4 shrink-0 transition-all duration-200'>

      {aToken && (
        <nav>
          <ul className='flex flex-col gap-1'>
            <li>
              <NavLink id='sidebar-admin-dashboard' to='/admin-dashboard' className={navItemClass}>
                <HomeIcon />
                <span className='hidden md:block'>Dashboard</span>
              </NavLink>
            </li>
            <li>
              <NavLink id='sidebar-all-appointments' to='/all-appointments' className={navItemClass}>
                <CalendarIcon />
                <span className='hidden md:block'>Appointments</span>
              </NavLink>
            </li>
            <li>
              <NavLink id='sidebar-add-doctor' to='/add-doctor' className={navItemClass}>
                <PlusIcon />
                <span className='hidden md:block'>Add Doctor</span>
              </NavLink>
            </li>
            <li>
              <NavLink id='sidebar-doctor-list' to='/doctors-list' className={navItemClass}>
                <PeopleIcon />
                <span className='hidden md:block'>Doctors List</span>
              </NavLink>
            </li>
          </ul>
        </nav>
      )}

      {dToken && (
        <nav>
          <ul className='flex flex-col gap-1'>
            <li>
              <NavLink id='sidebar-doctor-dashboard' to='/doctor-dashboard' className={navItemClass}>
                <HomeIcon />
                <span className='hidden md:block'>Dashboard</span>
              </NavLink>
            </li>
            <li>
              <NavLink id='sidebar-doctor-appointments' to='/doctor-appointments' className={navItemClass}>
                <CalendarIcon />
                <span className='hidden md:block'>Appointments</span>
              </NavLink>
            </li>
            <li>
              <NavLink id='sidebar-doctor-profile' to='/doctor-profile' className={navItemClass}>
                <UserIcon />
                <span className='hidden md:block'>Profile</span>
              </NavLink>
            </li>
          </ul>
        </nav>
      )}
    </aside>
  )
}

export default Sidebar
