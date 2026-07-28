import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import RelatedDoctors from '../components/RelatedDoctors'
import axiosInstance from '../utils/axiosInstance' // replaces raw axios
import { getErrorMessage } from '../utils/getErrorMessage'

const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

const Appointment = () => {
  const { docId } = useParams()
  const { doctors, currencySymbol, token, getDoctorsData } = useContext(AppContext)
  const navigate = useNavigate()

  const [docInfo, setDocInfo]     = useState(null)
  const [docSlots, setDocSlots]   = useState([])   // array of arrays: 7 days × N slots
  const [slotIndex, setSlotIndex] = useState(0)    // selected day index
  const [slotTime, setSlotTime]   = useState('')   // selected time string
  const [isBooking, setIsBooking] = useState(false) // prevents duplicate submissions

  const fetchDocInfo = () => {
    const doc = doctors.find(d => d._id === docId)
    setDocInfo(doc || null)
  }

  useEffect(() => {
    fetchDocInfo()
  }, [doctors, docId])

  const getAvailableSlots = () => {
    setDocSlots([])
    const today = new Date()

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(today)
      currentDate.setDate(today.getDate() + i)

      const endTime = new Date()
      endTime.setDate(today.getDate() + i)
      endTime.setHours(21, 0, 0, 0)

      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(
          currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10
        )
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0)
      } else {
        currentDate.setHours(10)
        currentDate.setMinutes(0)
      }

      const timeSlots = []

      while (currentDate < endTime) {
        const formattedTime = currentDate.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })

        const day = currentDate.getDate()
        const month = currentDate.getMonth() + 1
        const year = currentDate.getFullYear()
        const slotDate = `${day}_${month}_${year}`

        const isSlotAvailable = !(
          docInfo?.slots_booked?.[slotDate]?.includes(formattedTime)
        )

        if (isSlotAvailable) {
          timeSlots.push({ datetime: new Date(currentDate), time: formattedTime })
        }

        currentDate.setMinutes(currentDate.getMinutes() + 30)
      }

      setDocSlots(prev => [...prev, timeSlots])
    }
  }

  useEffect(() => {
    if (docInfo) getAvailableSlots()
  }, [docInfo])

  const bookAppointment = async () => {
    if (!token) {
      toast.warn('Login to book appointment')
      return navigate('/login')
    }

    if (!slotTime) {
      toast.error('Please select a time slot')
      return
    }
    if (!docSlots[slotIndex]?.length) {
      toast.error('No slots available for the selected day. Please choose another day.')
      return
    }

    setIsBooking(true)
    try {
      const date = docSlots[slotIndex][0].datetime
      const day = date.getDate()
      const month = date.getMonth() + 1
      const year = date.getFullYear()
      const slotDate = `${day}_${month}_${year}`

      const { data } = await axiosInstance.post('/api/user/book-appointment', {
        docId,
        slotDate,
        slotTime,
      })

      if (data.success) {
        toast.success(data.message)
        getDoctorsData()
        navigate('/my-appointments')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.error(error)
      toast.error(getErrorMessage(error))
    } finally {
      setIsBooking(false)
    }
  }

  if (!docInfo) {
    return (
      <div className='flex items-center justify-center min-h-[60vh] text-gray-400'>
        <p>Loading doctor information…</p>
      </div>
    )
  }

  return (
    <div>
      {/* ── Doctor info card ── */}
      <div className='flex flex-col sm:flex-row gap-4'>

        {/* Doctor photo */}
        <div>
          <img
            className='bg-primary w-full sm:max-w-72 rounded-lg object-cover object-top'
            src={docInfo.image || assets.profile_pic}
            alt={docInfo.name}
          />
        </div>

        {/* Doctor details box */}
        <div className='flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white'>

          {/* Name + verified badge */}
          <p className='flex items-center gap-2 text-2xl font-medium text-gray-900'>
            {docInfo.name}
            <img
              className='w-5'
              src={assets.verified_icon}
              alt='Verified'
            />
          </p>

          {/* Degree · Speciality · Experience */}
          <div className='flex items-center gap-2 text-sm mt-1 text-gray-600'>
            <p>{docInfo.degree} — {docInfo.speciality}</p>
            <button className='py-0.5 px-2 border text-xs rounded-full'>
              {docInfo.experience}
            </button>
          </div>

          {/* About */}
          <div className='mt-3'>
            <p className='flex items-center gap-1 text-sm font-medium text-gray-900'>
              About
              <img className='w-4' src={assets.info_icon} alt='info' />
            </p>
            <p className='text-sm text-gray-500 mt-1 max-w-[700px] leading-5'>
              {docInfo.about}
            </p>
          </div>

          {/* Appointment fee */}
          <p className='text-gray-500 font-medium mt-4'>
            Appointment fee:{' '}
            <span className='text-gray-700'>
              {currencySymbol}{docInfo.fees}
            </span>
          </p>
        </div>
      </div>

      {/* ── Booking slots section ── */}
      <div className='sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700'>
        <p className='text-sm'>Booking slots</p>

        {/* ── Day selector ── */}
        <div className='flex gap-3 items-center w-full overflow-x-scroll mt-4'>
          {docSlots.length > 0 &&
            docSlots.map((daySlots, index) => (
              <div
                key={index}
                onClick={() => { setSlotIndex(index); setSlotTime('') }}
                className={`text-center py-6 min-w-16 rounded-full cursor-pointer transition-colors ${
                  slotIndex === index
                    ? 'bg-primary text-white'
                    : 'border border-gray-200 text-gray-600 hover:border-primary'
                }`}
              >
                <p>{daySlots[0] && daysOfWeek[daySlots[0].datetime.getDay()]}</p>
                <p>{daySlots[0] && daySlots[0].datetime.getDate()}</p>
              </div>
            ))}
        </div>

        {/* ── Time selector ── */}
        <div className='flex items-center gap-3 w-full overflow-x-scroll mt-4'>
          {docSlots.length > 0 &&
            docSlots[slotIndex]?.map((slot, index) => (
              <p
                key={index}
                onClick={() => setSlotTime(slot.time)}
                className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer transition-colors ${
                  slot.time === slotTime
                    ? 'bg-primary text-white'
                    : 'border border-gray-300 text-gray-400 hover:border-primary'
                }`}
              >
                {slot.time.toLowerCase()}
              </p>
            ))}
        </div>

        {/* ── No slots message ── */}
        {docSlots.length > 0 && docSlots[slotIndex]?.length === 0 && (
          <p className='text-sm text-gray-400 mt-4'>
            No available slots for this day. Please select another day.
          </p>
        )}

        {/* ── Book button ── */}
        <button
          onClick={bookAppointment}
          className='bg-primary text-white text-sm font-light px-14 py-3 rounded-full my-6 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed'
          disabled={!slotTime || isBooking}
        >
          {isBooking ? 'Booking...' : 'Book an Appointment'}
        </button>
      </div>

      {/* ── Related doctors ── */}
      <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
    </div>
  )
}

export default Appointment



















    

















