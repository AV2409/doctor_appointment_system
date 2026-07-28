import { useContext, useEffect } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'

const RowActions = ({ item, onComplete, onCancel }) => {
  if (item.cancelled) {
    return (
      <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold
                       bg-red-50 text-red-500 border border-red-100 whitespace-nowrap'>
        Cancelled
      </span>
    )
  }
  if (item.isCompleted) {
    return (
      <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold
                       bg-green-50 text-green-600 border border-green-100 whitespace-nowrap'>
        Completed
      </span>
    )
  }
  return (
    <div className='flex items-center gap-2'>
      <button
        onClick={() => onComplete(item._id)}
        title='Mark as completed'
        className='flex items-center justify-center w-8 h-8 rounded-full
                   text-green-500 hover:text-white hover:bg-green-500
                   border border-green-200 hover:border-green-500
                   transition-all duration-150'
      >
        <svg className='w-4 h-4' viewBox='0 0 24 24' fill='none'>
          <path d='M20 6L9 17l-5-5' stroke='currentColor' strokeWidth='2.2'
                strokeLinecap='round' strokeLinejoin='round' />
        </svg>
      </button>

      <button
        onClick={() => onCancel(item._id)}
        title='Cancel appointment'
        className='flex items-center justify-center w-8 h-8 rounded-full
                   text-red-400 hover:text-white hover:bg-red-400
                   border border-red-200 hover:border-red-400
                   transition-all duration-150'
      >
        <svg className='w-4 h-4' viewBox='0 0 24 24' fill='none'>
          <path d='M18 6L6 18M6 6l12 12' stroke='currentColor' strokeWidth='2'
                strokeLinecap='round' />
        </svg>
      </button>
    </div>
  )
}

const DoctorAppointments = () => {
  const {
    dToken,
    appointments,
    getAppointments,
    completeAppointment,
    cancelAppointment,
  } = useContext(DoctorContext)
  const { slotDateFormat, calculateAge, currency } = useContext(AppContext)

  useEffect(() => {
    if (dToken) getAppointments()
  }, [dToken])

  return (
    <div>
      <div className='flex items-center justify-between mb-6'>
        <h1 className='text-xl font-semibold text-gray-700'>My Appointments</h1>
        <span className='text-sm text-gray-400 bg-white border border-gray-100
                         rounded-full px-3 py-1 shadow-sm'>
          {appointments.length} appointment{appointments.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className='bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden'>

        <div className='hidden sm:grid
                        grid-cols-[0.5fr_3fr_1fr_3fr_1fr_1fr_1.5fr]
                        px-6 py-3 border-b border-gray-100 bg-gray-50
                        text-xs font-semibold text-gray-500 uppercase tracking-wide'>
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date &amp; Time</p>
          <p>Fees</p>
          <p>Payment</p>
          <p>Action</p>
        </div>

        {appointments.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-20 text-gray-400'>
            <svg className='w-10 h-10 mb-3 text-gray-200' viewBox='0 0 24 24' fill='none'>
              <rect x='3' y='4' width='18' height='18' rx='2' stroke='currentColor' strokeWidth='1.5' strokeLinejoin='round' />
              <path d='M16 2v4M8 2v4M3 10h18' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' />
            </svg>
            <p className='text-sm'>No appointments yet.</p>
          </div>
        ) : (
          appointments.map((item, index) => (
            <div
              key={item._id || index}
              className='flex flex-wrap justify-between gap-2 items-center
                         sm:grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_1fr_1fr_1.5fr]
                         px-6 py-4 border-b border-gray-50 last:border-0
                         text-sm text-gray-600 hover:bg-gray-50 transition-colors'
            >
              <p className='hidden sm:block font-medium text-gray-400'>{index + 1}</p>

              <div className='flex items-center gap-2.5 min-w-0'>
                <img
                  className='w-9 h-9 rounded-full object-cover bg-gray-100 shrink-0'
                  src={item.userData?.image || ''}
                  alt={item.userData?.name}
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(item.userData?.name || 'P')}&background=EEF0FF&color=5F6FFF&size=72`
                  }}
                />
                <span className='font-medium text-gray-700 truncate'>
                  {item.userData?.name}
                </span>
              </div>

              <p className='hidden sm:block text-gray-500'>
                {item.userData?.dob ? calculateAge(item.userData.dob) : '—'}
              </p>

              <p className='text-gray-600'>
                {slotDateFormat(item.slotDate)},&nbsp;
                <span className='text-gray-400'>{item.slotTime}</span>
              </p>

              <p className='font-medium text-gray-700'>
                {currency}{item.amount}
              </p>

              {item.payment ? (
                <span className='inline-flex items-center px-2 py-0.5 rounded-full text-xs
                                 font-semibold bg-blue-50 text-blue-500 border border-blue-100
                                 whitespace-nowrap'>
                  Online
                </span>
              ) : (
                <span className='inline-flex items-center px-2 py-0.5 rounded-full text-xs
                                 font-semibold bg-amber-50 text-amber-500 border border-amber-100
                                 whitespace-nowrap'>
                  Cash
                </span>
              )}

              <RowActions
                item={item}
                onComplete={completeAppointment}
                onCancel={cancelAppointment}
              />
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default DoctorAppointments
