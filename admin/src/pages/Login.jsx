import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AdminContext } from '../context/AdminContext'
import { DoctorContext } from '../context/DoctorContext'
import { getRoleFromToken } from '../utils/getRoleFromToken'

const Login = () => {
  const [state, setState] = useState('Admin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const { login: adminLogin } = useContext(AdminContext)
  const { login: doctorLogin } = useContext(DoctorContext)
  const navigate = useNavigate()

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (state === 'Admin') {
        await adminLogin(email, password)
        const stored = localStorage.getItem('accessToken')
        if (getRoleFromToken(stored) === 'ADMIN') navigate('/admin-dashboard')
      } else {
        await doctorLogin(email, password)
        const stored = localStorage.getItem('accessToken')
        if (getRoleFromToken(stored) === 'DOCTOR') navigate('/doctor-dashboard')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-[#F8F9FD]'>
      <form
        onSubmit={onSubmitHandler}
        className='flex flex-col gap-4 m-auto items-start p-8 min-w-[340px] sm:min-w-96
                   bg-white border border-gray-200 rounded-2xl text-[#5E5E5E] text-sm
                   shadow-lg'
      >
        <div className='w-full text-center mb-1'>
          <p className='text-2xl font-semibold'>
            <span className='text-primary'>{state}</span> Login
          </p>
          <p className='text-gray-400 text-xs mt-1'>
            {state === 'Admin'
              ? 'Sign in to the admin dashboard'
              : 'Sign in to your doctor portal'}
          </p>
        </div>

        <div className='w-full'>
          <label className='block mb-1 font-medium' htmlFor='login-email'>
            Email
          </label>
          <input
            id='login-email'
            type='email'
            required
            autoComplete='email'
            placeholder='you@example.com'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='border border-[#DADADA] rounded-lg w-full p-2.5 mt-0.5
                       focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary
                       transition-all'
          />
        </div>

        <div className='w-full'>
          <label className='block mb-1 font-medium' htmlFor='login-password'>
            Password
          </label>
          <input
            id='login-password'
            type='password'
            required
            autoComplete='current-password'
            placeholder='••••••••'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='border border-[#DADADA] rounded-lg w-full p-2.5 mt-0.5
                       focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary
                       transition-all'
          />
        </div>

        <button
          type='submit'
          disabled={isLoading}
          className='bg-primary text-white w-full py-2.5 rounded-lg text-base font-medium
                     hover:bg-primary/90 active:scale-[0.98] transition-all
                     disabled:opacity-60 disabled:cursor-not-allowed'
        >
          {isLoading ? 'Signing in…' : 'Login'}
        </button>

        {state === 'Admin' ? (
          <p className='text-center w-full text-xs'>
            Doctor Login?{' '}
            <span
              onClick={() => setState('Doctor')}
              className='text-primary underline cursor-pointer font-medium'
            >
              Click here
            </span>
          </p>
        ) : (
          <p className='text-center w-full text-xs'>
            Admin Login?{' '}
            <span
              onClick={() => setState('Admin')}
              className='text-primary underline cursor-pointer font-medium'
            >
              Click here
            </span>
          </p>
        )}
      </form>
    </div>
  )
}

export default Login
