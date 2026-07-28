import { useContext, useEffect } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'

const EarningsIcon = () => (
  <svg className='w-10 h-10 text-yellow-400' viewBox='0 0 24 24' fill='none'>
    <circle cx='12' cy='12' r='9' stroke='currentColor' strokeWidth='1.8' />
    <path d='M12 7v1m0 8v1M9.5 9.5A2.5 2.5 0 0112 8a2.5 2.5 0 010 5 2.5 2.5 0 000 5 2.5 2.5 0 002.5-1.5'
          stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' />
  </svg>
)

const AppointmentsIcon = () => (
  <svg className='w-10 h-10 text-indigo-400' viewBox='0 0 24 24' fill='none'>
    <rect x='3' y='4' width='18' height='18' rx='2' stroke='currentColor' strokeWidth='1.8' strokeLinejoin='round' />
    <path d='M16 2v4M8 2v4M3 10h18' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' />
    <path d='M8 15h8M8 18h5' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' />
  </svg>
)

const PatientsIcon = () => (
  <svg className='w-10 h-10 text-green-400' viewBox='0 0 24 24' fill='none'>
    <circle cx='9' cy='7' r='4' stroke='currentColor' strokeWidth='1.8' />
    <path d='M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' />
    <path d='M16 3.13a4 4 0 010 7.75M21 21v-2a4 4 0 00-3-3.87' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' />
  </svg>
)

const ListIcon = () => (
  <svg className='w-5 h-5 text-primary' viewBox='0 0 24 24' fill='none'>
    <path d='M9 6h10M9 12h10M9 18h10M5 6h.01M5 12h.01M5 18h.01'
          stroke='currentColor' strokeWidth='2' strokeLinecap='round' />
  </svg>
)

const StatCard = ({ icon: Icon, value, label, accent }) => (
  <div className={`flex items-center gap-4 bg-white p-5 min-w-52 rounded-xl border-2 ${accent}
                   cursor-default hover:scale-[1.03] transition-transform duration-200 shadow-sm`}>
    <div className='p-2 rounded-lg bg-gray-50'>
      <Icon />
    </div>
    <div>
      <p className='text-2xl font-bold text-gray-700'>{value}</p>
      <p className='text-sm text-gray-400 font-medium'>{label}</p>
    </div>
  </div>
)

const RowActions = ({ item, onComplete, onCancel }) => {
  if (item.cancelled) {
    return (
      <span className='px-2 py-0.5 rounded-full text-xs font-semibold
                       bg-red-50 text-red-500 border border-red-100'>
        Cancelled
      </span>
    )
  }
  if (item.isCompleted) {
    return (
      <span className='px-2 py-0.5 rounded-full text-xs font-semibold
                       bg-green-50 text-green-600 border border-green-100'>
        Completed
      </span>
    )
  }
  return (
    <div className='flex items-center gap-2'>
      <button
        onClick={() => onComplete(item._id)}
        title='Mark complete'
        className='flex items-center justify-center w-8 h-8 rounded-full
                   text-green-500 hover:text-white hover:bg-green-500
                   border border-green-200 hover:border-green-500
                   transition-all duration-150'
      >
        <svg className='w-4 h-4' viewBox='0 0 24 24' fill='none'>
          <path d='M20 6L9 17l-5-5' stroke='currentColor' strokeWidth='2.2' strokeLinecap='round' strokeLinejoin='round' />
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
          <path d='M18 6L6 18M6 6l12 12' stroke='currentColor' strokeWidth='2' strokeLinecap='round' />
        </svg>
      </button>
    </div>
  )
}

const DoctorDashboard = () => {
  const {
    dToken,
    dashData,
    getDashData,
    completeAppointment,
    cancelAppointment,
  } = useContext(DoctorContext)
  const { currency, slotDateFormat } = useContext(AppContext)

  useEffect(() => {
    if (dToken) getDashData()
  }, [dToken])

  const handleComplete = async (id) => {
    await completeAppointment(id)
    getDashData()
  }

  const handleCancel = async (id) => {
    await cancelAppointment(id)
    getDashData()
  }

  if (!dashData) {
    return (
      <div className='flex items-center justify-center h-64 text-gray-400 text-sm'>
        Loading dashboard…
      </div>
    )
  }

  return (
    <div>
      <h1 className='text-xl font-semibold text-gray-700 mb-6'>Dashboard</h1>

      <div className='flex flex-wrap gap-4'>
        <StatCard
          icon={EarningsIcon}
          value={`${currency}${dashData.earnings}`}
          label='Earnings'
          accent='border-yellow-100'
        />
        <StatCard
          icon={AppointmentsIcon}
          value={dashData.appointments}
          label='Appointments'
          accent='border-indigo-100'
        />
        <StatCard
          icon={PatientsIcon}
          value={dashData.patients}
          label='Patients'
          accent='border-green-100'
        />
      </div>

      <div className='bg-white mt-8 rounded-xl border border-gray-100 shadow-sm overflow-hidden'>
        <div className='flex items-center gap-2.5 px-6 py-4 border-b border-gray-100'>
          <ListIcon />
          <p className='font-semibold text-gray-700'>Latest Bookings</p>
        </div>

        <div>
          {dashData?.latestAppointments?.length === 0 ? (
            <p className='text-center text-gray-400 text-sm py-10'>No appointments yet.</p>
          ) : (
            dashData?.latestAppointments?.map((item, index) => (
              <div
                key={item._id || index}
                className='flex items-center px-6 py-4 gap-4 hover:bg-gray-50
                           transition-colors border-b border-gray-50 last:border-0'
              >
                <img
                  className='w-10 h-10 rounded-full object-cover bg-gray-100 shrink-0'
                  src={item.userData?.image || ''}
                  alt={item.userData?.name}
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(item.userData?.name || 'P')}&background=EEF0FF&color=5F6FFF&size=80`
                  }}
                />

                <div className='flex-1 min-w-0'>
                  <p className='text-gray-800 font-medium text-sm truncate'>
                    {item.userData?.name}
                  </p>
                  <p className='text-gray-400 text-xs'>
                    {slotDateFormat(item.slotDate)}, {item.slotTime}
                  </p>
                </div>

                <RowActions
                  item={item}
                  onComplete={handleComplete}
                  onCancel={handleCancel}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default DoctorDashboard
