import { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'

const CancelBtn = ({ onClick }) => (
  <button
    onClick={onClick}
    title='Cancel appointment'
    className='flex items-center justify-center w-8 h-8 rounded-full
               text-red-400 hover:text-white hover:bg-red-400
               border border-red-200 hover:border-red-400
               transition-all duration-150'
  >
    <svg className='w-4 h-4' viewBox='0 0 24 24' fill='none'>
      <path d='M18 6L6 18M6 6l12 12' stroke='currentColor' strokeWidth='2' strokeLinecap='round' />
    </svg>
  </button>
)

const StatusBadge = ({ item, onCancel }) => {
  if (item.cancelled) {
    return (
      <span className='inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold
                       bg-red-50 text-red-500 border border-red-100'>
        Cancelled
      </span>
    )
  }
  if (item.isCompleted) {
    return (
      <span className='inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold
                       bg-green-50 text-green-600 border border-green-100'>
        Completed
      </span>
    )
  }
  return <CancelBtn onClick={() => onCancel(item._id)} />
}

const AllAppointments = () => {
  const { aToken, appointments, getAllAppointments, cancelAppointment } = useContext(AdminContext)
  const { slotDateFormat, calculateAge, currency } = useContext(AppContext)

  useEffect(() => {
    if (aToken) getAllAppointments()
  }, [aToken])

  return (
    <div>
      <div className='flex items-center justify-between mb-6'>
        <h1 className='text-xl font-semibold text-gray-700'>All Appointments</h1>
        <span className='text-sm text-gray-400 bg-white border border-gray-100
                         rounded-full px-3 py-1 shadow-sm'>
          {appointments.length} appointment{appointments.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className='bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden'>

        <div className='hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr]
                        px-6 py-3 border-b border-gray-100 bg-gray-50
                        text-xs font-semibold text-gray-500 uppercase tracking-wide'>
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date &amp; Time</p>
          <p>Doctor</p>
          <p>Fees</p>
          <p>Action</p>
        </div>

        {appointments.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-20 text-gray-400'>
            <svg className='w-10 h-10 mb-3 text-gray-200' viewBox='0 0 24 24' fill='none'>
              <rect x='3' y='4' width='18' height='18' rx='2' stroke='currentColor' strokeWidth='1.5' strokeLinejoin='round' />
              <path d='M16 2v4M8 2v4M3 10h18' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' />
            </svg>
            <p className='text-sm'>No appointments found.</p>
          </div>
        ) : (
          appointments.map((item, index) => (
            <div
              key={item._id || index}
              className='flex flex-wrap justify-between gap-2 items-center
                         sm:grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr]
                         px-6 py-4 border-b border-gray-50 last:border-0
                         text-sm text-gray-600 hover:bg-gray-50 transition-colors'
            >
              <p className='hidden sm:block font-medium text-gray-400'>{index + 1}</p>

              <div className='flex items-center gap-2.5 min-w-0'>
                <img
                  className='w-8 h-8 rounded-full object-cover bg-gray-100 shrink-0'
                  src={item.userData?.image || ''}
                  alt={item.userData?.name}
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(item.userData?.name || 'P')}&background=EEF0FF&color=5F6FFF&size=64`
                  }}
                />
                <span className='font-medium text-gray-700 truncate'>{item.userData?.name}</span>
              </div>

              <p className='hidden sm:block text-gray-500'>
                {item.userData?.dob ? calculateAge(item.userData.dob) : '—'}
              </p>

              <p className='text-gray-600'>
                {slotDateFormat(item.slotDate)},&nbsp;
                <span className='text-gray-400'>{item.slotTime}</span>
              </p>

              <div className='flex items-center gap-2.5 min-w-0'>
                <img
                  className='w-8 h-8 rounded-full object-cover bg-gray-100 shrink-0'
                  src={item.docData?.image || ''}
                  alt={item.docData?.name}
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(item.docData?.name || 'D')}&background=EEF0FF&color=5F6FFF&size=64`
                  }}
                />
                <span className='truncate'>{item.docData?.name}</span>
              </div>

              <p className='font-medium text-gray-700'>
                {currency}{item.amount}
              </p>

              <StatusBadge item={item} onCancel={cancelAppointment} />
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default AllAppointments
