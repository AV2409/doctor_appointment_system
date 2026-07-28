import { useContext, useState } from 'react'
import { toast } from 'react-toastify'
import { AdminContext } from '../../context/AdminContext'
import axiosInstance from '../../utils/axiosInstance'
import { getErrorMessage } from '../../utils/getErrorMessage'

const UploadPlaceholder = () => (
  <div className='w-16 h-16 rounded-full bg-gray-100 border-2 border-dashed border-gray-300
                  flex flex-col items-center justify-center cursor-pointer
                  hover:bg-primary/5 hover:border-primary transition-all group'>
    <svg className='w-6 h-6 text-gray-400 group-hover:text-primary transition-colors' viewBox='0 0 24 24' fill='none'>
      <path d='M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' strokeLinejoin='round' />
      <polyline points='17 8 12 3 7 8' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' strokeLinejoin='round' />
      <line x1='12' y1='3' x2='12' y2='15' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' />
    </svg>
    <span className='text-[9px] text-gray-400 group-hover:text-primary mt-0.5 font-medium'>Upload</span>
  </div>
)

const SPECIALITIES = [
  'General physician', 'Gynecologist', 'Dermatologist',
  'Pediatricians', 'Neurologist', 'Gastroenterologist',
]

const EXPERIENCE_OPTIONS = [
  '1 Year', '2 Years', '3 Years', '4 Years', '5 Years',
  '6 Years', '7 Years', '8 Years', '9 Years', '10 Years',
]

const Field = ({ label, children }) => (
  <div className='flex flex-col gap-1'>
    <label className='text-sm font-medium text-gray-600'>{label}</label>
    {children}
  </div>
)

const inputCls = 'border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 \
focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all'

const AddDoctor = () => {
  const { getAllDoctors } = useContext(AdminContext)

  const [docImg, setDocImg]         = useState(null)
  const [name, setName]             = useState('')
  const [email, setEmail]           = useState('')
  const [password, setPassword]     = useState('')
  const [experience, setExperience] = useState('1 Year')
  const [fees, setFees]             = useState('')
  const [speciality, setSpeciality] = useState('General physician')
  const [degree, setDegree]         = useState('')
  const [address1, setAddress1]     = useState('')
  const [address2, setAddress2]     = useState('')
  const [about, setAbout]           = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const resetForm = () => {
    setDocImg(null)
    setName('')
    setEmail('')
    setPassword('')
    setExperience('1 Year')
    setFees('')
    setSpeciality('General physician')
    setDegree('')
    setAddress1('')
    setAddress2('')
    setAbout('')
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault()

    if (!docImg) {
      toast.error('Please select a doctor photo')
      return
    }

    setIsSubmitting(true)
    try {
      const formData = new FormData()
      formData.append('image', docImg)
      formData.append('name', name)
      formData.append('email', email)
      formData.append('password', password)
      formData.append('experience', experience)
      formData.append('fees', Number(fees))
      formData.append('speciality', speciality)
      formData.append('degree', degree)
      formData.append('address', JSON.stringify({ line1: address1, line2: address2 }))
      formData.append('about', about)

      const { data } = await axiosInstance.post('/api/admin/add-doctor', formData)

      if (data.success) {
        toast.success(data.message)
        resetForm()
        getAllDoctors()   // refresh the doctors list in context
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <h1 className='text-xl font-semibold text-gray-700 mb-6'>Add Doctor</h1>

      <form
        onSubmit={onSubmitHandler}
        className='bg-white rounded-xl border border-gray-100 shadow-sm
                   px-8 py-8 max-w-4xl'
      >
        <div className='flex items-center gap-4 mb-8'>
          <label htmlFor='doc-img' className='cursor-pointer'>
            {docImg ? (
              <img
                className='w-16 h-16 rounded-full object-cover border-2 border-primary/30'
                src={URL.createObjectURL(docImg)}
                alt='Doctor preview'
              />
            ) : (
              <UploadPlaceholder />
            )}
          </label>
          <input
            id='doc-img'
            type='file'
            accept='image/*'
            hidden
            onChange={(e) => setDocImg(e.target.files[0] || null)}
          />
          <div>
            <p className='font-medium text-gray-700 text-sm'>Doctor photo</p>
            <p className='text-xs text-gray-400 mt-0.5'>Click to upload (JPG, PNG, WebP)</p>
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-x-10 gap-y-5 text-gray-600'>

          <div className='flex flex-col gap-5'>
            <Field label='Doctor Name'>
              <input
                className={inputCls}
                type='text'
                placeholder='Full name'
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Field>

            <Field label='Email'>
              <input
                className={inputCls}
                type='email'
                placeholder='doctor@example.com'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Field>

            <Field label='Password'>
              <input
                className={inputCls}
                type='password'
                placeholder='Set a strong password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Field>

            <Field label='Experience'>
              <select
                className={inputCls}
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
              >
                {EXPERIENCE_OPTIONS.map((exp) => (
                  <option key={exp} value={exp}>{exp}</option>
                ))}
              </select>
            </Field>

            <Field label='Consultation Fee (₹)'>
              <input
                className={inputCls}
                type='number'
                min='0'
                placeholder='e.g. 500'
                value={fees}
                onChange={(e) => setFees(e.target.value)}
                required
              />
            </Field>
          </div>

          <div className='flex flex-col gap-5'>
            <Field label='Speciality'>
              <select
                className={inputCls}
                value={speciality}
                onChange={(e) => setSpeciality(e.target.value)}
              >
                {SPECIALITIES.map((spec) => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
            </Field>

            <Field label='Degree / Education'>
              <input
                className={inputCls}
                type='text'
                placeholder='e.g. MBBS, MD'
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                required
              />
            </Field>

            <Field label='Address Line 1'>
              <input
                className={inputCls}
                type='text'
                placeholder='Street, clinic name'
                value={address1}
                onChange={(e) => setAddress1(e.target.value)}
                required
              />
            </Field>

            <Field label='Address Line 2'>
              <input
                className={inputCls}
                type='text'
                placeholder='City, State, PIN'
                value={address2}
                onChange={(e) => setAddress2(e.target.value)}
              />
            </Field>
          </div>
        </div>

        <div className='mt-5'>
          <Field label='About Doctor'>
            <textarea
              className={`${inputCls} resize-none`}
              placeholder='Brief bio — qualifications, areas of expertise, approach…'
              rows={4}
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              required
            />
          </Field>
        </div>

        <button
          type='submit'
          disabled={isSubmitting}
          className='mt-7 bg-primary text-white px-10 py-2.5 rounded-full text-sm font-medium
                     hover:bg-primary/90 active:scale-[0.98] transition-all
                     disabled:opacity-60 disabled:cursor-not-allowed'
        >
          {isSubmitting ? 'Adding…' : 'Add Doctor'}
        </button>
      </form>
    </div>
  )
}

export default AddDoctor
