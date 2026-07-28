import { useContext, useEffect, useState } from 'react'
import { DoctorContext } from '../../context/DoctorContext'

const InfoRow = ({ label, value }) => (
  <div className='flex flex-col gap-0.5'>
    <p className='text-xs font-semibold text-gray-400 uppercase tracking-wide'>{label}</p>
    <p className='text-sm text-gray-700 font-medium'>{value || '—'}</p>
  </div>
)

const inputCls = `border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700
  focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all w-full`

const DoctorProfile = () => {
  const { dToken, profileData, getProfileData, updateProfile } = useContext(DoctorContext)

  const [fees, setFees]         = useState('')
  const [address1, setAddress1] = useState('')
  const [address2, setAddress2] = useState('')
  const [available, setAvailable] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (dToken) getProfileData()
  }, [dToken])

  useEffect(() => {
    if (profileData) {
      setFees(profileData.fees ?? '')
      setAddress1(profileData.address?.line1 ?? '')
      setAddress2(profileData.address?.line2 ?? '')
      setAvailable(profileData.available ?? false)
    }
  }, [profileData])

  const handleSave = async () => {
    setIsSaving(true)
    await updateProfile({
      fees: Number(fees),
      address: { line1: address1, line2: address2 },
      available,
    })
    setIsSaving(false)
  }

  if (!profileData) {
    return (
      <div className='flex items-center justify-center h-64 text-gray-400 text-sm'>
        Loading profile…
      </div>
    )
  }

  return (
    <div className='max-w-3xl'>
      <h1 className='text-xl font-semibold text-gray-700 mb-6'>My Profile</h1>

      <div className='bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden'>

        <div className='flex items-center gap-5 px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-primary/5 to-transparent'>
          <img
            className='w-20 h-20 rounded-full object-cover border-2 border-primary/20 bg-gray-100 shrink-0'
            src={profileData.image || ''}
            alt={profileData.name}
            onError={(e) => {
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(profileData.name || 'D')}&background=EEF0FF&color=5F6FFF&size=160`
            }}
          />
          <div>
            <p className='text-xl font-bold text-gray-800'>{profileData.name}</p>
            <p className='text-sm text-primary font-medium mt-0.5'>{profileData.speciality}</p>
            <span className='inline-flex items-center mt-1.5 px-2.5 py-0.5 rounded-full text-xs
                             font-semibold bg-primary/10 text-primary border border-primary/20'>
              {profileData.experience} experience
            </span>
          </div>
        </div>

        <div className='px-8 py-6 flex flex-col gap-8'>

          <section>
            <p className='text-xs font-bold text-gray-500 uppercase tracking-widest mb-4'>
              Qualifications
            </p>
            <div className='grid grid-cols-2 sm:grid-cols-3 gap-5'>
              <InfoRow label='Degree'      value={profileData.degree} />
              <InfoRow label='Speciality'  value={profileData.speciality} />
              <InfoRow label='Experience'  value={profileData.experience} />
            </div>
          </section>

          <section>
            <p className='text-xs font-bold text-gray-500 uppercase tracking-widest mb-4'>
              Editable Details
            </p>

            <div className='flex flex-col gap-4'>
              <div className='flex flex-col gap-1'>
                <label className='text-sm font-medium text-gray-600'>
                  Consultation Fee (₹)
                </label>
                <input
                  className={inputCls}
                  type='number'
                  min='0'
                  value={fees}
                  onChange={(e) => setFees(e.target.value)}
                  placeholder='e.g. 500'
                />
              </div>

              <div className='flex flex-col gap-1'>
                <label className='text-sm font-medium text-gray-600'>Address Line 1</label>
                <input
                  className={inputCls}
                  type='text'
                  value={address1}
                  onChange={(e) => setAddress1(e.target.value)}
                  placeholder='Street, clinic name'
                />
              </div>
              <div className='flex flex-col gap-1'>
                <label className='text-sm font-medium text-gray-600'>Address Line 2</label>
                <input
                  className={inputCls}
                  type='text'
                  value={address2}
                  onChange={(e) => setAddress2(e.target.value)}
                  placeholder='City, State, PIN'
                />
              </div>

              <div className='flex items-center gap-3 pt-1'>
                <label
                  htmlFor='doc-available'
                  className='flex items-center gap-3 cursor-pointer select-none'
                >
                  <div className='relative'>
                    <input
                      id='doc-available'
                      type='checkbox'
                      className='sr-only'
                      checked={available}
                      onChange={(e) => setAvailable(e.target.checked)}
                    />
                    <div
                      className={`w-10 h-6 rounded-full transition-colors duration-200 ${
                        available ? 'bg-primary' : 'bg-gray-200'
                      }`}
                    />
                    <div
                      className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow
                                  transition-transform duration-200 ${
                                    available ? 'translate-x-4' : 'translate-x-0'
                                  }`}
                    />
                  </div>
                  <span className={`text-sm font-medium ${available ? 'text-primary' : 'text-gray-400'}`}>
                    {available ? 'Available for appointments' : 'Not available'}
                  </span>
                </label>
              </div>
            </div>
          </section>

          <div>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className='bg-primary text-white px-8 py-2.5 rounded-full text-sm font-medium
                         hover:bg-primary/90 active:scale-[0.98] transition-all
                         disabled:opacity-60 disabled:cursor-not-allowed'
            >
              {isSaving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DoctorProfile
