import { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'

const DoctorIcon = () => (
  <svg className='w-10 h-10 text-primary' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
    <circle cx='12' cy='7' r='4' stroke='currentColor' strokeWidth='1.8' />
    <path d='M4 21v-1a8 8 0 0116 0v1' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' />
    <path d='M12 13v5M9.5 15.5h5' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' />
  </svg>
)

const AppointmentsIcon = () => (
  <svg className='w-10 h-10 text-indigo-400' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
    <rect x='3' y='4' width='18' height='18' rx='2' stroke='currentColor' strokeWidth='1.8' strokeLinejoin='round' />
    <path d='M16 2v4M8 2v4M3 10h18' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' />
    <path d='M8 15h8M8 18h5' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' />
  </svg>
)

const PatientsIcon = () => (
  <svg className='w-10 h-10 text-green-400' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
    <circle cx='9' cy='7' r='4' stroke='currentColor' strokeWidth='1.8' />
    <path d='M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' />
    <path d='M16 3.13a4 4 0 010 7.75M21 21v-2a4 4 0 00-3-3.87' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' />
  </svg>
)

const ListIcon = () => (
  <svg className='w-5 h-5 text-primary' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
    <path d='M9 6h10M9 12h10M9 18h10M5 6h.01M5 12h.01M5 18h.01' stroke='currentColor' strokeWidth='2' strokeLinecap='round' />
  </svg>
)

const CancelIcon = () => (
  <svg className='w-6 h-6 text-red-400 cursor-pointer hover:text-red-600 transition-colors' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
    <circle cx='12' cy='12' r='9' stroke='currentColor' strokeWidth='1.8' />
    <path d='M15 9l-6 6M9 9l6 6' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' />
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

const StatusBadge = ({ item, onCancel }) => {
  if (item.cancelled) {
    return (
      <span className='px-2 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-500 border border-red-100'>
        Cancelled
      </span>
    )
  }
  if (item.isCompleted) {
    return (
      <span className='px-2 py-0.5 rounded-full text-xs font-semibold bg-green-50 text-green-500 border border-green-100'>
        Completed
      </span>
    )
  }
  return (
    <button
      onClick={() => onCancel(item._id)}
      title='Cancel appointment'
      className='flex items-center gap-1 text-xs text-red-400 hover:text-red-600
                 transition-colors font-medium'
    >
      <CancelIcon />
    </button>
  )
}

const Dashboard = () => {
  const { aToken, getDashData, cancelAppointment, dashData } = useContext(AdminContext)
  const { slotDateFormat } = useContext(AppContext)

  useEffect(() => {
    if (aToken) getDashData()
  }, [aToken])

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
          icon={DoctorIcon}
          value={dashData.doctors}
          label='Doctors'
          accent='border-primary/20'
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
                  src={item.docData?.image || ''}
                  alt={item.docData?.name || 'Doctor'}
                  onError={(e) => { e.target.style.display = 'none' }}
                />

                <div className='flex-1 min-w-0'>
                  <p className='text-gray-800 font-medium text-sm truncate'>
                    {item.docData?.name}
                  </p>
                  <p className='text-gray-400 text-xs'>
                    {slotDateFormat(item.slotDate)}, {item.slotTime}
                  </p>
                  <p className='text-gray-500 text-xs mt-0.5'>
                    Patient: {item.userData?.name}
                  </p>
                </div>

                <StatusBadge
                  item={item}
                  onCancel={async (id)=>{
    await cancelAppointment(id)
    await getDashData()
}}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
