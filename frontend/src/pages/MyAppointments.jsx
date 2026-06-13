import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { AppContext } from '../context/AppContext'

const MyAppointments = () => {
  const { backendUrl, token, getDoctorsData, slotDateFormat, currencySymbol } =
    useContext(AppContext)

  const [appointments, setAppointments] = useState([])
  const navigate = useNavigate()

  // ── Fetch user's appointments ─────────────────────────────────────────────
  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/user/appointments', {
        headers: { token },
      })
      if (data.success) {
        setAppointments(data.appointments.reverse())
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (token) getUserAppointments()
  }, [token])

  // ── Cancel appointment ────────────────────────────────────────────────────
  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + '/api/user/cancel-appointment',
        { appointmentId },
        { headers: { token } }
      )
      if (data.success) {
        toast.success(data.message)
        getUserAppointments()
        getDoctorsData()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  // ── Razorpay payment flow ─────────────────────────────────────────────────
  const initPay = (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: 'Appointment Payment',
      description: 'Appointment Payment',
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        try {
          const { data } = await axios.post(
            backendUrl + '/api/user/verifyRazorpay',
            response,
            { headers: { token } }
          )
          if (data.success) {
            getUserAppointments()
            navigate('/my-appointments')
          }
        } catch (error) {
          toast.error(error.message)
        }
      },
    }
    const rzp = new window.Razorpay(options)
    rzp.open()
  }

  const appointmentRazorpay = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + '/api/user/payment-razorpay',
        { appointmentId },
        { headers: { token } }
      )
      if (data.success) {
        initPay(data.order)
      }
    } catch (error) {
      toast.error(error.message)
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
          appointments.map((item, index) => (
            <div
              key={index}
              className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-4 border-b'
            >
              {/* Doctor photo */}
              <div>
                <img
                  className='w-32 bg-indigo-50 rounded'
                  src={item.docData?.image}
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
                    Date & Time:
                  </span>{' '}
                  {slotDateFormat(item.slotDate)} | {item.slotTime}
                </p>
              </div>

              {/* Action buttons — right column */}
              <div className='flex flex-col gap-2 justify-end text-sm text-center'>
                {/* ── Completed state ── */}
                {item.isCompleted && (
                  <button className='sm:min-w-48 py-2 border rounded text-green-500 bg-green-50 cursor-default'>
                    Completed
                  </button>
                )}

                {/* ── Cancelled state ── */}
                {item.cancelled && !item.isCompleted && (
                  <button className='sm:min-w-48 py-2 border rounded text-red-500 bg-red-50 cursor-default'>
                    Appointment Cancelled
                  </button>
                )}

                {/* ── Active: pay + cancel ── */}
                {!item.cancelled && !item.isCompleted && (
                  <>
                    {item.payment ? (
                      <button className='sm:min-w-48 py-2 border rounded text-green-500 bg-green-50 cursor-default'>
                        Paid
                      </button>
                    ) : (
                      <button
                        onClick={() => appointmentRazorpay(item._id)}
                        className='sm:min-w-48 py-2 border rounded text-stone-500 bg-stone-100 hover:bg-primary hover:text-white transition-all'
                      >
                        Pay Online
                      </button>
                    )}

                    <button
                      onClick={() => cancelAppointment(item._id)}
                      className='sm:min-w-48 py-2 border rounded text-stone-500 bg-stone-100 hover:bg-red-600 hover:text-white transition-all'
                    >
                      Cancel appointment
                    </button>
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
