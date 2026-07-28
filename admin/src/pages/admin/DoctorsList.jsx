import { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'

const AvailabilityToggle = ({ available, onChange }) => (
  <label className='flex items-center gap-2 cursor-pointer select-none group'>
    <div className='relative'>
      <input
        type='checkbox'
        className='sr-only'
        checked={available}
        onChange={onChange}
        readOnly={false}
      />
      <div
        className={`w-9 h-5 rounded-full transition-colors duration-200 ${
          available ? 'bg-primary' : 'bg-gray-200'
        }`}
      />
      <div
        className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow
                    transition-transform duration-200 ${
                      available ? 'translate-x-4' : 'translate-x-0'
                    }`}
      />
    </div>
    <span className={`text-xs font-medium ${available ? 'text-primary' : 'text-gray-400'}`}>
      {available ? 'Available' : 'Unavailable'}
    </span>
  </label>
)

const DoctorCard = ({ doctor, onToggle }) => (
  <div className='bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm
                  hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group'>
    <div className='bg-indigo-50 group-hover:bg-primary/10 transition-colors duration-300 h-48 flex items-center justify-center'>
      <img
        className='h-full w-full object-cover'
        src={doctor.image}
        alt={doctor.name}
        onError={(e) => {
          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.name)}&background=EEF0FF&color=5F6FFF&size=200`
        }}
      />
    </div>

    <div className='p-4'>
      <p className='text-gray-800 font-semibold text-base truncate'>{doctor.name}</p>
      <p className='text-gray-400 text-sm mt-0.5 truncate'>{doctor.speciality}</p>

      <div className='mt-3 pt-3 border-t border-gray-50 flex items-center justify-between'>
        <AvailabilityToggle
          available={doctor.available}
          onChange={() => onToggle(doctor._id)}
        />
        <span className='text-xs text-gray-300'>{doctor.experience}</span>
      </div>
    </div>
  </div>
)

const DoctorsList = () => {
  const { doctors, aToken, getAllDoctors, changeAvailability } = useContext(AdminContext)

  useEffect(() => {
    if (aToken) getAllDoctors()
  }, [aToken])

  return (
    <div>
      <div className='flex items-center justify-between mb-6'>
        <h1 className='text-xl font-semibold text-gray-700'>All Doctors</h1>
        <span className='text-sm text-gray-400 bg-white border border-gray-100
                         rounded-full px-3 py-1 shadow-sm'>
          {doctors.length} doctor{doctors.length !== 1 ? 's' : ''}
        </span>
      </div>

      {doctors.length === 0 ? (
        <div className='flex flex-col items-center justify-center py-20 text-gray-400'>
          <svg className='w-12 h-12 mb-3 text-gray-200' viewBox='0 0 24 24' fill='none'>
            <circle cx='12' cy='7' r='4' stroke='currentColor' strokeWidth='1.5' />
            <path d='M4 21v-1a8 8 0 0116 0v1' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' />
          </svg>
          <p className='text-sm'>No doctors added yet.</p>
        </div>
      ) : (
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4'>
          {doctors.map((doctor) => (
            <DoctorCard
              key={doctor._id}
              doctor={doctor}
              onToggle={changeAvailability}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default DoctorsList
