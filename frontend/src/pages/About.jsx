import React from 'react'
import { assets } from '../assets/assets'

const WHY_ITEMS = [
  {
    title: 'EFFICIENCY',
    desc: 'Streamlined appointment scheduling that fits into your busy lifestyle. We optimise every touchpoint so you spend less time waiting and more time receiving the care you deserve.',
  },
  {
    title: 'CONVENIENCE',
    desc: 'Access to a network of trusted healthcare professionals in your area with real-time availability. Book, reschedule, or cancel from any device — whenever you need.',
  },
  {
    title: 'PERSONALIZATION',
    desc: 'Tailored recommendations, customised reminders, and a personal health profile that grows with you — because every patient is unique and your care should reflect that.',
  },
]

const About = () => {
  return (
    <div>
      {/* ── Title ── */}
      <div className='text-center text-2xl pt-10 text-gray-500'>
        <p>
          ABOUT <span className='text-gray-700 font-semibold'>US</span>
        </p>
      </div>

      {/* ── Two-column: image + text ── */}
      <div className='my-10 flex flex-col md:flex-row gap-12'>
        <img
          className='w-full max-w-[360px] rounded-lg object-cover'
          src={assets.about_image}
          alt='About MediSync'
        />

        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600'>
          <p>
            Welcome to MediSync, your trusted partner in managing your healthcare
            needs conveniently and efficiently. At MediSync, we understand how
            valuable your time is and how important it is to have seamless access to
            quality medical care.
          </p>
          <p>
            MediSync is committed to excellence in healthcare technology. We
            continuously strive to enhance our platform, integrating the latest
            advancements to improve user experience and deliver superior service. Whether
            you're booking your first appointment or managing ongoing care, MediSync is
            here to support you every step of the way.
          </p>
          <p>
            Our platform connects patients with a wide network of verified, experienced
            healthcare professionals across specialities — making quality healthcare
            accessible to everyone, everywhere.
          </p>

          <b className='text-gray-800 text-base'>Our Vision</b>
          <p>
            Our vision at MediSync is to create a seamless healthcare experience for
            every user. We aim to bridge the gap between patients and healthcare
            providers, making it easier for you to access the care you need, when you
            need it.
          </p>
        </div>
      </div>

      {/* ── Why Choose Us ── */}
      <div className='text-xl my-4'>
        <p>
          WHY{' '}
          <span className='text-gray-700 font-semibold'>CHOOSE US</span>
        </p>
      </div>

      <div className='flex flex-col md:flex-row mb-20'>
        {WHY_ITEMS.map((item) => (
          <div
            key={item.title}
            className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px]
                       hover:bg-primary hover:text-white transition-all duration-300
                       text-gray-600 cursor-pointer'
          >
            <b>{item.title}</b>
            <p>{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default About
