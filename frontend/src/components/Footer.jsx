import React from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <footer>
      {/* ── Main grid ── */}
      <div className='md:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>

        {/* Left — brand + description */}
        <div>
          <img className='mb-5 w-40' src={assets.logo} alt='MediSync logo' />
          <p className='w-full md:w-2/3 text-gray-600 leading-6'>
            MediSync is your trusted partner in managing your healthcare needs
            conveniently and efficiently. We connect patients with qualified
            doctors, making quality healthcare accessible to everyone.
          </p>
        </div>

        {/* Center — company links */}
        <div>
          <p className='text-xl font-medium mb-5'>COMPANY</p>
          <ul className='flex flex-col gap-2 text-gray-600'>
            <li>
              <Link to='/' className='hover:text-primary transition-colors'>
                Home
              </Link>
            </li>
            <li>
              <Link to='/about' className='hover:text-primary transition-colors'>
                About us
              </Link>
            </li>
            <li>
              <Link to='/contact' className='hover:text-primary transition-colors'>
                Contact us
              </Link>
            </li>
            <li>
              {/* Privacy policy is a static page — placeholder href */}
              <a href='#' className='hover:text-primary transition-colors'>
                Privacy policy
              </a>
            </li>
          </ul>
        </div>

        {/* Right — contact info */}
        <div>
          <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
          <ul className='flex flex-col gap-2 text-gray-600'>
            <li>
              <a
                href='tel:+10000000000'
                className='hover:text-primary transition-colors'
              >
                +1-000-000-0000
              </a>
            </li>
            <li>
              <a
                href='mailto:medisync@gmail.com'
                className='hover:text-primary transition-colors'
              >
                medisync@gmail.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div>
        <hr className='border-gray-200' />
        <p className='py-5 text-sm text-center text-gray-500'>
          © {new Date().getFullYear()} MediSync. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer
