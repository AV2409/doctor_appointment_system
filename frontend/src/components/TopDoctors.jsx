import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const TopDoctors = () => {
  const { doctors } = useContext(AppContext)
  const navigate = useNavigate()

  return (
    <div className='flex flex-col items-center gap-4 my-16 text-gray-900'>

      {/* Section heading */}
      <h1 className='text-3xl font-medium'>Top Doctors to Book</h1>
      <p className='text-center text-sm text-gray-600 sm:w-1/3'>
        Simply browse through our extensive list of trusted doctors.
      </p>

      {/* Doctor card grid — first 10 doctors */}
      <div className='w-full grid grid-cols-auto gap-4 pt-5 gap-y-6 px-3 sm:px-0'>
        {doctors.slice(0, 10).map((item, index) => (
          <div
            key={index}
            onClick={() => { navigate(`/appointment/${item._id}`); scrollTo(0, 0) }}
            className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:-translate-y-[10px] transition-all duration-500'
          >
            {/* Doctor photo */}
            <img
              className='bg-blue-50 w-full h-48 object-cover object-top'
              src={item.image}
              alt={item.name}
            />

            {/* Card body */}
            <div className='p-4'>
              {/* Availability badge */}
              <div className='flex items-center gap-2 text-sm text-green-500'>
                <p
                  className={`w-2 h-2 rounded-full ${
                    item.available ? 'bg-green-500' : 'bg-gray-400'
                  }`}
                />
                <p className={item.available ? 'text-green-500' : 'text-gray-500'}>
                  {item.available ? 'Available' : 'Not Available'}
                </p>
              </div>

              <p className='text-gray-900 text-lg font-medium mt-1'>{item.name}</p>
              <p className='text-gray-600 text-sm'>{item.speciality}</p>
            </div>
          </div>
        ))}
      </div>

      {/* More doctors CTA */}
      <button
        onClick={() => { navigate('/doctors'); scrollTo(0, 0) }}
        className='bg-blue-50 text-gray-600 px-12 py-3 rounded-full mt-10 hover:bg-blue-100 transition-colors'
      >
        more
      </button>
    </div>
  )
}

export default TopDoctors
