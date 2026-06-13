import React from 'react'
import { Link } from 'react-router-dom'
import { specialityData } from '../assets/assets'

const SpecialityMenu = () => {
  return (
    <div
      id='speciality'
      className='flex flex-col items-center gap-4 py-16 text-gray-800'
    >
      {/* Section heading */}
      <h1 className='text-3xl font-medium'>Find by Speciality</h1>

      <p className='text-center text-sm text-gray-600 w-1/3'>
        Simply browse through our extensive list of trusted doctors, schedule
        your appointment hassle-free.
      </p>

      {/* Horizontally scrollable speciality cards */}
      <div className='flex sm:justify-center gap-4 pt-5 w-full overflow-x-scroll'>
        {specialityData.map((item, index) => (
          <Link
            key={index}
            onClick={() => scrollTo(0, 0)}
            to={`/doctors/${item.speciality}`}
            className='flex flex-col items-center text-xs cursor-pointer flex-shrink-0 hover:-translate-y-[10px] transition-all duration-500'
          >
            <img
              className='w-16 sm:w-24 mb-2'
              src={item.image}
              alt={item.speciality}
            />
            <p>{item.speciality}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default SpecialityMenu
