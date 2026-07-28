import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import axiosInstance from '../utils/axiosInstance'
import { getErrorMessage } from '../utils/getErrorMessage'

const MyAppointments = () => {
  const { getDoctorsData, slotDateFormat, currencySymbol, token } = useContext(AppContext)

  const [appointments, setAppointments] = useState([])
  const [processingPayment, setProcessingPayment] = useState(null) // appointmentId being processed, or null
  const navigate = useNavigate()

  useEffect(() => {
    if (token === false) navigate('/login')
  }, [token])

  const getUserAppointments = async () => {
    try {
      const { data } = await axiosInstance.get('/api/user/appointments')
      if (data.success) {
        setAppointments([...data.data].reverse())
      }
    } catch (error) {
      console.error(error)
      toast.error(getErrorMessage(error))
    }
  }

  useEffect(() => {
    if (token) {
      ;(async () => { await getUserAppointments() })()
    }
  }, [token])

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axiosInstance.post('/api/user/cancel-appointment', {
        appointmentId,
      })
      if (data.success) {
        toast.success(data.message)
        getUserAppointments()
        getDoctorsData()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.error(error)
      toast.error(getErrorMessage(error))
    }
  }

  const initPay = (order) => {
    const options = {
      key:         order.key,
      amount:      order.amount,
      currency:    order.currency,
      name:        'MediSync',
      description: 'Appointment Payment',
      order_id:    order.orderId,

      handler: async function (response) {
        try {
          const { data } = await axiosInstance.post('/api/user/verifyRazorpay', response)
          if (data.success) {
            toast.success('Payment Successful')
            await getUserAppointments()
          }
        } catch (error) {
          console.error(error)
          toast.error(getErrorMessage(error))
        }
      },
    }

    const razorpay = new window.Razorpay(options)

    razorpay.on('payment.failed', function (response) {
      console.error(response)
      toast.error('Payment Failed')
    })

    razorpay.open()
  }

  const appointmentRazorpay = async (appointmentId) => {
    setProcessingPayment(appointmentId)   // disable + show "Processing…" on this button
    try {
      const { data } = await axiosInstance.post('/api/user/payment-razorpay', {
        appointmentId,
      })
      if (data.success) {
        initPay(data.data)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.error(error)
      toast.error(getErrorMessage(error))
    } finally {
      setProcessingPayment(null)          // always re-enable after backend responds
    }
  }

  return (
    <div>
      <p className='pb-3 mt-12 font-medium text-zinc-700 border-b'>My appointments</p>

      {/* ── Appointment list ── */}
      <div>
        {appointments.length === 0 ? (
          /* Empty state */
          <div className='flex flex-col items-center justify-center py-20 text-gray-400 gap-3'>
            <p className='text-lg'>No appointments yet</p>
            <p className='text-sm'>
              Book an appointment from the{' '}
              <span
                className='text-primary underline cursor-pointer'
                onClick={() => navigate('/doctors')}
              >
                doctors page
              </span>
            </p>
          </div>
        ) : (
          appointments.map((item) => (
            <div
              key={item._id}
              className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-4 border-b'
            >
              {/* Doctor photo */}
              <div>
                <img
                  className='w-32 bg-indigo-50 rounded'
                  src={item.docData?.image || assets.profile_pic}
                  alt={item.docData?.name}
                />
              </div>

              {/* Appointment details */}
              <div className='flex-1 text-sm text-zinc-600'>
                <p className='text-neutral-800 font-semibold'>
                  {item.docData?.name}
                </p>
                <p>{item.docData?.speciality}</p>

                {/* Address */}
                <p className='text-zinc-700 font-medium mt-1'>Address:</p>
                <p className='text-xs'>{item.docData?.address?.line1}</p>
                <p className='text-xs'>{item.docData?.address?.line2}</p>

                {/* Date + time */}
                <p className='text-xs mt-1'>
                  <span className='text-sm text-neutral-700 font-medium'>
                    Date &amp; Time:
                  </span>{' '}
                  {slotDateFormat(item.slotDate)} | {item.slotTime}
                </p>
              </div>

              {/* Action buttons — right column */}
              <div className='flex flex-col gap-2 justify-end text-sm text-center'>

                {/* ── 1. Completed ──────────────────────────────────────── */}
                {item.isCompleted && (
                  <>
                    <button className='sm:min-w-48 py-2 border rounded text-green-500 bg-green-50 cursor-default'>
                      Completed
                    </button>
                    {/* Also show Paid badge on completed+paid appointments */}
                    {item.payment && (
                      <button className='sm:min-w-48 py-2 border rounded text-green-500 bg-green-50 cursor-default'>
                        Paid
                      </button>
                    )}
                  </>
                )}

                {/* ── 2. Cancelled — no Pay Online shown ───────────────── */}
                {item.cancelled && !item.isCompleted && (
                  <button className='sm:min-w-48 py-2 border rounded text-red-500 bg-red-50 cursor-default'>
                    Appointment Cancelled
                  </button>
                )}

                {/* ── 3 & 4. Active (not cancelled, not completed) ─────── */}
                {!item.cancelled && !item.isCompleted && (
                  <>
                    {item.payment ? (
                      /* 3. Active + paid → Paid badge (no Pay Online) */
                      <button className='sm:min-w-48 py-2 border rounded text-green-500 bg-green-50 cursor-default'>
                        Paid
                      </button>
                    ) : (
                      /* 4. Active + unpaid → Pay Online button with loading state */
                      <button
                        onClick={() => appointmentRazorpay(item._id)}
                        disabled={processingPayment === item._id}
                        className='sm:min-w-48 py-2 border rounded text-stone-500 bg-stone-100 hover:bg-primary hover:text-white transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-stone-100 disabled:hover:text-stone-500'
                      >
                        {processingPayment === item._id ? 'Processing...' : 'Pay Online'}
                      </button>
                    )}

                    {/* Cancel button — hidden for paid appointments */}
                    {!item.payment && (
                      <button
                        onClick={() => cancelAppointment(item._id)}
                        className='sm:min-w-48 py-2 border rounded text-stone-500 bg-stone-100 hover:bg-red-600 hover:text-white transition-all'
                      >
                        Cancel appointment
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default MyAppointments
