import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { AppContext } from '../context/AppContext'
import axiosInstance from '../utils/axiosInstance' // replaces raw axios
import { getErrorMessage } from '../utils/getErrorMessage'

const Login = () => {
  const [state, setState]       = useState('Sign Up')
  const [name, setName]         = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')

  const { token, setToken } = useContext(AppContext)
  const navigate = useNavigate()

  useEffect(() => {
    if (token) navigate('/')
  }, [token])

  const onSubmitHandler = async (event) => {
    event.preventDefault()
    try {
      if (state === 'Sign Up') {
        const { data } = await axiosInstance.post('/api/user/register', {
          name,
          email,
          password,
        })
        if (data.success) {
          localStorage.setItem('accessToken', data.data.accessToken)
          setToken(data.data.accessToken)
        } else {
          toast.error(data.message)
        }
      } 
      else {
        const { data } = await axiosInstance.post('/api/user/login', {
          email,
          password,
        })
        if (data.success) {
          localStorage.setItem('accessToken', data.data.accessToken)
          setToken(data.data.accessToken)
        } else {
          toast.error(data.message)
        }
      }
    } catch (error) {
      console.error(error)
      toast.error(getErrorMessage(error))
    }
  }

  return (
    <form
      className='min-h-[80vh] flex items-center'
      onSubmit={onSubmitHandler}
    >
      <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-gray-600 text-sm shadow-lg'>

        {/* Title */}
        <p className='text-2xl font-semibold text-gray-800'>
          {state === 'Sign Up' ? 'Create Account' : 'Login'}
        </p>
        <p className='text-gray-500'>
          Please {state === 'Sign Up' ? 'sign up' : 'sign in'} to book appointment
        </p>

        {/* Name field — only for Sign Up */}
        {state === 'Sign Up' && (
          <div className='w-full'>
            <p className='mb-1'>Full Name</p>
            <input
              id='login-name'
              className='border border-gray-300 rounded w-full p-2 mt-1 focus:outline-none focus:border-primary'
              type='text'
              placeholder='John Doe'
              onChange={e => setName(e.target.value)}
              value={name}
              required
            />
          </div>
        )}

        {/* Email */}
        <div className='w-full'>
          <p className='mb-1'>Email</p>
          <input
            id='login-email'
            className='border border-gray-300 rounded w-full p-2 mt-1 focus:outline-none focus:border-primary'
            type='email'
            placeholder='you@email.com'
            onChange={e => setEmail(e.target.value)}
            value={email}
            required
          />
        </div>

        {/* Password */}
        <div className='w-full'>
          <p className='mb-1'>Password</p>
          <input
            id='login-password'
            className='border border-gray-300 rounded w-full p-2 mt-1 focus:outline-none focus:border-primary'
            type='password'
            placeholder='••••••••'
            onChange={e => setPassword(e.target.value)}
            value={password}
            required
          />
        </div>

        {/* Submit */}
        <button
          id='login-submit'
          type='submit'
          className='bg-primary text-white w-full py-2 rounded-md text-base hover:opacity-90 transition-opacity mt-1'
        >
          {state === 'Sign Up' ? 'Create account' : 'Login'}
        </button>

        {/* Toggle between modes */}
        {state === 'Sign Up' ? (
          <p className='text-gray-500'>
            Already have an account?{' '}
            <span
              className='text-primary underline cursor-pointer'
              onClick={() => setState('Login')}
            >
              Login here
            </span>
          </p>
        ) : (
          <p className='text-gray-500'>
            Create a new account?{' '}
            <span
              className='text-primary underline cursor-pointer'
              onClick={() => setState('Sign Up')}
            >
              Click here
            </span>
          </p>
        )}
      </div>
    </form>
  )
}

export default Login













