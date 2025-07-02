
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch,useSelector } from 'react-redux'
import { signInFailure,signInSuccess,signInStart } from '../redux/user/userSlice'
import OAuth from '../components/OAuth'
import Alert from '@mui/material/Alert';

//In order to use these functions we have to dispatch them using useDispatch.

function SignIn() {
   const [formData,setFormData]=useState({})
   const {loading,error:errorMessage}=useSelector(state=>state.user)
   //This props will be from userSlice InitialState props.
   const navigate=useNavigate()
   const dispatch=useDispatch()

   const handleChange = (e)=>{
      setFormData({...formData,[e.target.id]:e.target.value.trim()})
      //Here each time the field data will be destructed which will be stored in fromData as a single valued object. And every time the field data be filled via id and add to the destructured properties and form an object.
   }
   
   const handleSubmit = async (e)=>{
    e.preventDefault()
    if(!formData.email || !formData.password)
       dispatch(signInFailure('Please fill out all fields'))
    try{
         dispatch(signInStart())// dispatch Set them to update the previous state's value
        const res = await fetch(`/api/auth/signin`,{
          method:'POST',
          headers: {'Content-Type':'application/json'},
          body:JSON.stringify(formData)
        })
        const data = await res.json()
        //data Contains the response status like success and message
        if(data.success===false)
          dispatch(signInFailure(data.message))
        if(res.ok){
          dispatch(signInSuccess(data))
          navigate('/')
          }
    }catch(error){
      //Handling from client side.
      dispatch(signInFailure(error.message))
    }
   }
  return (
    <div className='min-h-screen mt-40 '>
      <div className='flex flex-col px-8 sm:px-12  max-w-3xl mx-auto md:flex-row md:p-3 md:items-center gap-5 '>
        <div className='flex-1'>
        <Link to='/' className='text-4xl dark:text-white font-bold'>
        <span className='px-3 py-2 bg-black rounded-lg text-orange-500 dark:text-white mr-1'>
        Quick
        </span> 
         Stay
        </Link>
        <p className='text-sm mt-5'>This is a personal project. You can sign in with your email and password or with Google</p>
        </div>
        <div className='flex-1'>
         <h2 className="text-4xl md:text-center mb-2 text-gray-900 font-medium">Sign in</h2>
          <p className="text-sm md:text-center text-gray-500/90 mt-3">Welcome back! Please sign in to continue</p>
          <div className="flex items-center gap-4 w-full my-5">
                <div className="w-full h-px bg-gray-300/90"></div>
                <p className="w-full text-nowrap text-sm text-gray-500/90">sign in with Email or Google</p>
                <div className="w-full h-px bg-gray-300/90"></div>
            </div>
          <form className='flex flex-col gap-4 mt-4' onSubmit={handleSubmit}>
           
          <div>
           <label className="font-medium" htmlFor="email">Email</label>
             <input type='email' id='email' placeholder='example@company.com'
                   className='border border-gray-200 rounded w-full px-3 
                              py-3 mt-1 outline-indigo-500 font-light'
                              onChange={handleChange} required/>
          </div>

           <div>
           <label className="font-medium" htmlFor="password">Password</label>
            <input type='password' id='password' placeholder='**************'
                   className='border border-gray-200 rounded w-full px-3 
                              py-3 mt-1 outline-indigo-500 font-light'
                              onChange={handleChange} required/>
          </div>
          <button className="btn btn-gradient btn-primary" type='submit'>
            {
              loading ? (
                <>
                <span className='pl-3'>Loading...</span>
                </>
              ) : 'Sign In'
            }
           </button>
           <OAuth />
          </form>
          <div className='flex flex-row gap-2 mt-5 text-sm items-center md:justify-center'>
            <p>Don't Have an account ?</p>
            <Link to='/signup' className='text-blue-600'>
            Sign Up
            </Link>
          </div>
            { errorMessage && (
            <Alert className='mt-2.5' variant="outlined" severity="error">
                 {errorMessage}
           </Alert>
            )
          }
        </div>
      </div>
    </div>
  )
}

export default SignIn
