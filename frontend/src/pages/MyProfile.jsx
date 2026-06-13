import React, { useContext, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets'

const MyProfile = () => {
  const { userData, setUserData, backendUrl, token, loadUserProfileData } = useContext(AppContext)
  const [isEdit, setIsEdit] = useState(false)
  const [image, setImage]   = useState(false)

  // ── Save updated profile to backend ──────────────────────────────────────
  const updateUserProfileData = async () => {
    try {
      const formData = new FormData()
      formData.append('name', userData.name)
      formData.append('phone', userData.phone)
      formData.append('address', JSON.stringify(userData.address))
      formData.append('dob', userData.dob)
      formData.append('gender', userData.gender)
      if (image) formData.append('image', image)

      const { data } = await axios.post(
        backendUrl + '/api/user/update-profile',
        formData,
        { headers: { token } }
      )

      if (data.success) {
        toast.success(data.message)
        await loadUserProfileData()
        setIsEdit(false)
        setImage(false)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  // ── Guard: userData not yet loaded ────────────────────────────────────────
  if (!userData) {
    return (
      <div className='flex items-center justify-center min-h-[60vh] text-gray-400'>
        <p>Loading profile…</p>
      </div>
    )
  }

  return (
    <div className='max-w-lg flex flex-col gap-2 text-sm pt-5'>

      {/* ── Profile image with upload overlay in edit mode ── */}
      {isEdit ? (
        <label htmlFor='profile-image-upload' className='inline-block cursor-pointer'>
          <div className='relative w-36'>
            <img
              className='w-36 rounded opacity-75'
              src={image ? URL.createObjectURL(image) : userData.image}
              alt={userData.name}
            />
            {!image && (
              <img
                className='w-10 absolute bottom-0 right-0'
                src={assets.upload_icon}
                alt='upload'
              />
            )}
          </div>
          <input
            id='profile-image-upload'
            type='file'
            accept='image/*'
            className='hidden'
            onChange={e => setImage(e.target.files[0])}
          />
        </label>
      ) : (
        <img
          className='w-36 rounded'
          src={userData.image}
          alt={userData.name}
        />
      )}

      {/* ── Name ── */}
      {isEdit ? (
        <input
          id='profile-name'
          className='bg-gray-50 text-3xl font-medium max-w-60 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-primary'
          type='text'
          value={userData.name}
          onChange={e => setUserData(prev => ({ ...prev, name: e.target.value }))}
        />
      ) : (
        <p className='font-medium text-3xl text-neutral-800 mt-4'>{userData.name}</p>
      )}

      <hr className='bg-zinc-400 h-[1px] border-none my-2' />

      {/* ── CONTACT INFORMATION ── */}
      <div>
        <p className='text-neutral-500 underline mt-3'>CONTACT INFORMATION</p>
        <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700'>

          <p className='font-medium'>Email id:</p>
          <p className='text-blue-500'>{userData.email}</p>

          <p className='font-medium'>Phone:</p>
          {isEdit ? (
            <input
              id='profile-phone'
              className='bg-gray-50 max-w-52 border border-gray-300 rounded px-2 py-0.5 focus:outline-none focus:border-primary'
              type='tel'
              value={userData.phone}
              onChange={e => setUserData(prev => ({ ...prev, phone: e.target.value }))}
            />
          ) : (
            <p className='text-blue-500'>{userData.phone}</p>
          )}

          <p className='font-medium'>Address:</p>
          {isEdit ? (
            <div className='flex flex-col gap-1'>
              <input
                id='profile-addr1'
                className='bg-gray-50 border border-gray-300 rounded px-2 py-0.5 focus:outline-none focus:border-primary'
                type='text'
                placeholder='Address line 1'
                value={userData.address?.line1 || ''}
                onChange={e =>
                  setUserData(prev => ({
                    ...prev,
                    address: { ...prev.address, line1: e.target.value },
                  }))
                }
              />
              <input
                id='profile-addr2'
                className='bg-gray-50 border border-gray-300 rounded px-2 py-0.5 focus:outline-none focus:border-primary'
                type='text'
                placeholder='Address line 2'
                value={userData.address?.line2 || ''}
                onChange={e =>
                  setUserData(prev => ({
                    ...prev,
                    address: { ...prev.address, line2: e.target.value },
                  }))
                }
              />
            </div>
          ) : (
            <p className='text-gray-500'>
              {userData.address?.line1}
              <br />
              {userData.address?.line2}
            </p>
          )}
        </div>
      </div>

      {/* ── BASIC INFORMATION ── */}
      <div>
        <p className='text-neutral-500 underline mt-3'>BASIC INFORMATION</p>
        <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700'>

          <p className='font-medium'>Gender:</p>
          {isEdit ? (
            <select
              id='profile-gender'
              className='max-w-20 bg-gray-50 border border-gray-300 rounded px-2 py-0.5 focus:outline-none focus:border-primary'
              value={userData.gender}
              onChange={e => setUserData(prev => ({ ...prev, gender: e.target.value }))}
            >
              <option value='Male'>Male</option>
              <option value='Female'>Female</option>
            </select>
          ) : (
            <p className='text-gray-500'>{userData.gender}</p>
          )}

          <p className='font-medium'>Birthday:</p>
          {isEdit ? (
            <input
              id='profile-dob'
              className='max-w-40 bg-gray-50 border border-gray-300 rounded px-2 py-0.5 focus:outline-none focus:border-primary'
              type='date'
              value={userData.dob}
              onChange={e => setUserData(prev => ({ ...prev, dob: e.target.value }))}
            />
          ) : (
            <p className='text-gray-500'>{userData.dob}</p>
          )}
        </div>
      </div>

      {/* ── Edit / Save buttons ── */}
      <div className='mt-6'>
        {isEdit ? (
          <button
            id='profile-save'
            onClick={updateUserProfileData}
            className='border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all'
          >
            Save information
          </button>
        ) : (
          <button
            id='profile-edit'
            onClick={() => setIsEdit(true)}
            className='border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all'
          >
            Edit
          </button>
        )}
      </div>
    </div>
  )
}

export default MyProfile
