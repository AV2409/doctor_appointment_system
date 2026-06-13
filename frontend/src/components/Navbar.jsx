import React, { useContext, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets'

const Navbar = () => {
  const [showMenu, setShowMenu] = useState(false)
  const { token, setToken, userData } = useContext(AppContext)
  const navigate = useNavigate()

  const logout = () => {
    setToken(false)
    localStorage.removeItem('token')
    navigate('/')
  }

  return (
    <nav className='flex items-center justify-between text-sm py-4 mb-5 border-b border-gray-200'>

      {/* ── Logo ── */}
      <img
        onClick={() => navigate('/')}
        className='w-44 cursor-pointer'
        src={assets.logo}
        alt='Prescripto logo'
      />

      {/* ── Desktop nav links ── */}
      <ul className='hidden md:flex items-start gap-5 font-medium'>
        {[
          { to: '/',        label: 'HOME' },
          { to: '/doctors', label: 'ALL DOCTORS' },
          { to: '/about',   label: 'ABOUT' },
          { to: '/contact', label: 'CONTACT' },
        ].map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) => isActive ? 'active' : ''}
          >
            <li className='py-1 cursor-pointer'>
              {label}
              {/* Active underline indicator */}
              <hr className='hidden border-none outline-none h-0.5 bg-primary w-3/5 m-auto' />
            </li>
          </NavLink>
        ))}
      </ul>

      {/* ── Right section ── */}
      <div className='flex items-center gap-4'>
        {token && userData ? (
          /* Profile dropdown (visible when logged in) */
          <div className='flex items-center gap-2 cursor-pointer group relative'>
            <img
              className='w-8 rounded-full object-cover'
              src={userData?.image || assets.profile_pic}
              alt='Profile'
            />
            <img
              className='w-2.5'
              src={assets.dropdown_icon}
              alt='dropdown'
            />

            {/* Dropdown menu */}
            <div className='absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block'>
              <div className='min-w-48 bg-stone-100 rounded-lg flex flex-col gap-4 p-4 shadow-md'>
                <p
                  onClick={() => { navigate('/my-profile'); setShowMenu(false) }}
                  className='hover:text-primary cursor-pointer transition-colors'
                >
                  My Profile
                </p>
                <p
                  onClick={() => { navigate('/my-appointments'); setShowMenu(false) }}
                  className='hover:text-primary cursor-pointer transition-colors'
                >
                  My Appointments
                </p>
                <p
                  onClick={logout}
                  className='hover:text-red-500 cursor-pointer transition-colors'
                >
                  Logout
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Create account button (guest) */
          <button
            onClick={() => navigate('/login')}
            className='hidden md:block bg-primary text-white px-8 py-3 rounded-full font-light hover:opacity-90 transition-opacity'
          >
            Create account
          </button>
        )}

        {/* ── Hamburger (mobile only) ── */}
        <img
          onClick={() => setShowMenu(true)}
          className='w-6 md:hidden cursor-pointer'
          src={assets.menu_icon}
          alt='Menu'
        />
      </div>

      {/* ── Mobile slide-in menu ── */}
      <div
        className={`md:hidden fixed inset-0 z-30 bg-white transition-all duration-300 ${
          showMenu ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Mobile menu header */}
        <div className='flex items-center justify-between px-5 py-6 border-b border-gray-100'>
          <img
            className='w-36'
            src={assets.logo}
            alt='Prescripto logo'
          />
          <img
            onClick={() => setShowMenu(false)}
            className='w-7 cursor-pointer'
            src={assets.cross_icon}
            alt='Close menu'
          />
        </div>

        {/* Mobile nav links */}
        <ul className='flex flex-col items-start gap-2 mt-5 px-5 text-gray-600 font-medium'>
          {[
            { to: '/',              label: 'HOME' },
            { to: '/doctors',       label: 'ALL DOCTORS' },
            { to: '/about',         label: 'ABOUT' },
            { to: '/contact',       label: 'CONTACT' },
          ].map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={() => setShowMenu(false)}
              className={({ isActive }) => isActive ? 'active w-full' : 'w-full'}
            >
              <p className='px-4 py-2 rounded text-sm hover:bg-gray-50 transition-colors'>
                {label}
              </p>
            </NavLink>
          ))}

          {/* Auth links in mobile menu */}
          {token ? (
            <>
              <NavLink
                to='/my-profile'
                onClick={() => setShowMenu(false)}
                className='w-full'
              >
                <p className='px-4 py-2 rounded text-sm hover:bg-gray-50 transition-colors'>
                  My Profile
                </p>
              </NavLink>
              <NavLink
                to='/my-appointments'
                onClick={() => setShowMenu(false)}
                className='w-full'
              >
                <p className='px-4 py-2 rounded text-sm hover:bg-gray-50 transition-colors'>
                  My Appointments
                </p>
              </NavLink>
              <button
                onClick={() => { logout(); setShowMenu(false) }}
                className='w-full text-left px-4 py-2 rounded text-sm text-red-500 hover:bg-red-50 transition-colors'
              >
                Logout
              </button>
            </>
          ) : (
            <div className='w-full mt-4 px-4'>
              <button
                onClick={() => { navigate('/login'); setShowMenu(false) }}
                className='w-full bg-primary text-white py-3 rounded-full text-sm hover:opacity-90 transition-opacity'
              >
                Create account
              </button>
            </div>
          )}
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
