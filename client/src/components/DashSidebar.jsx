import {HiArrowSmRight, HiUser,
    } from 'react-icons/hi'
import {useLocation,Link} from 'react-router-dom'
import { useState,useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { signOutSuccess } from '../redux/user/userSlice'
import { useSelector } from 'react-redux'
import { AiFillBook } from 'react-icons/ai'
import { NavLink } from 'react-router-dom'

const sidebarLinks = [
    { name: 'Profile', path: '/dashboard?tab=profile', icon: <HiUser /> },
    { name: 'My Bookings', path: '/dashboard/my-bookings', icon: <AiFillBook /> },
     { name: 'Sign Out', path: '/', icon: <HiArrowSmRight /> },
  ];

function DashSidebar() {
    const location=useLocation() // to determine in which tab user visits.
                               // dashboard?tab=profile.
  const [tab,setTab]=useState('')
  const dispatch=useDispatch()
  const {currentUser} = useSelector(state=>state.user);
  useEffect(()=>{
    const urlParams=new URLSearchParams(location.search) // get the url params here.
    const tabFromUrl=urlParams.get('tab') // Take the tab value from urlParams.
    if(tabFromUrl){
      setTab(tabFromUrl)
    }
  },[location.search])
  const handleSignOut=async ()=>{
    try {
      const res =await fetch(`/api/user/signout`,{
        method:'POST'
      })
      const data = await res.json()
      if(!res.ok){
        console.log(data.message)
      }else{
        dispatch(signOutSuccess())
      }
    } catch (error) {
      console.log(error)
    }
  }
  return (
      <div className='md:w-60 w-full text-base flex flex-col gap-2 transition-all duration-300
                       border-r h-full border-gray-300 pt-4 mt-23'>
     
      {sidebarLinks.map((item, index) => (
        <NavLink to={item.path} key={index} end='/dashboard'
        onClick={item.name === 'Sign Out' && handleSignOut}
        className={({ isActive }) =>
         `flex items-center gap-3 py-3 px-4 md:px-8 
         ${isActive ? 'border-r-4 md:border-r-[6px] bg-blue-600/10 border-blue-600 text-blue-600' :
          'hover:bg-gray-100/90 text-gray-700 border-white'}
         `}>
          <span>{item.icon}</span>
          <p className='md:block text-center'>{item.name}</p>
        </NavLink>
        
))}
    </div>
    
  )
}

export default DashSidebar