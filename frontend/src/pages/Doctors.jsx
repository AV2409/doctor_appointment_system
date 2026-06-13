import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

// All speciality options — mirrors the sidebar list from the build guide
const SPECIALITIES = [
  'General physician',
  'Gynecologist',
  'Dermatologist',
  'Pediatricians',
  'Neurologist',
  'Gastroenterologist',
]

const Doctors = () => {
  const { speciality } = useParams()
  const [filterDoc, setFilterDoc] = useState([])
  const [showFilter, setShowFilter] = useState(false)
  const { doctors } = useContext(AppContext)
  const navigate = useNavigate()

  // Re-apply the filter whenever the route param or doctors list changes
  const applyFilter = () => {
    if (speciality) {
      setFilterDoc(doctors.filter(doc => doc.speciality === speciality))
    } else {
      setFilterDoc(doctors)
    }
  }

  useEffect(() => {
    applyFilter()
  }, [doctors, speciality])

  return (
    <div>
      {/* Page heading */}
      <p className='text-gray-600 mt-5'>Browse through the doctors specialist.</p>

      <div className='flex flex-col sm:flex-row items-start gap-5 mt-5'>

        {/* ── Filter toggle (mobile only) ── */}
        <button
          onClick={() => setShowFilter(!showFilter)}
          className={`py-1 px-3 border rounded text-sm transition-all sm:hidden ${
            showFilter ? 'bg-primary text-white' : 'text-gray-600'
          }`}
        >
          Filters
        </button>

        {/* ── Left sidebar: speciality filter ── */}
        <div
          className={`flex flex-col gap-4 text-sm text-gray-600 ${
            showFilter ? 'flex' : 'hidden sm:flex'
          }`}
        >
          {SPECIALITIES.map((item) => (
            <p
              key={item}
              onClick={() =>
                // Toggle: clicking active filter clears it
                speciality === item
                  ? navigate('/doctors')
                  : navigate(`/doctors/${item}`)
              }
              className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer hover:bg-indigo-50 ${
                speciality === item ? 'bg-indigo-100 text-black' : ''
              }`}
            >
              {item}
            </p>
          ))}
        </div>

        {/* ── Right: doctor card grid ── */}
        <div className='w-full grid grid-cols-auto gap-4'>
          {filterDoc.length > 0 ? (
            filterDoc.map((item, index) => (
              <div
                key={index}
                onClick={() => {
                  navigate(`/appointment/${item._id}`)
                  scrollTo(0, 0)
                }}
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
                  <div className='flex items-center gap-2 text-sm'>
                    <p
                      className={`w-2 h-2 rounded-full ${
                        item.available ? 'bg-green-500' : 'bg-gray-400'
                      }`}
                    />
                    <p
                      className={
                        item.available ? 'text-green-500' : 'text-gray-500'
                      }
                    >
                      {item.available ? 'Available' : 'Not Available'}
                    </p>
                  </div>

                  <p className='text-gray-900 text-lg font-medium mt-1'>
                    {item.name}
                  </p>
                  <p className='text-gray-600 text-sm'>{item.speciality}</p>
                </div>
              </div>
            ))
          ) : (
            /* Empty state */
            <div className='col-span-full text-center py-20 text-gray-400'>
              <p className='text-lg'>No doctors found</p>
              {speciality && (
                <p className='text-sm mt-2'>
                  No doctors available for{' '}
                  <span className='text-primary font-medium'>{speciality}</span>
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Doctors
