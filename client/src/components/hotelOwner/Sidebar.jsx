import React from 'react'
import { NavLink } from 'react-router-dom';
import { HiArrowSmDown, HiArrowSmRight, HiChartPie, HiUser, HiViewList } from 'react-icons/hi';
import { AiFillBook, AiFillFileAdd } from 'react-icons/ai';
import {FaHotel} from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { signOutSuccess } from '../../redux/user/userSlice'

export default function Sidebar() {

  const {currentUser} = useSelector(state=>state.user)
  const dispatch = useDispatch();
  const sidebarLinksOwner = [
    { name: 'Dashboard', path: '/owner', icon:<HiChartPie /> },
     { name: 'Profile', path: '/owner/profile', icon: <HiUser /> },
     { name: 'My-Bookings', path: '/owner/my-bookings', icon:<AiFillBook /> },
    { name: 'Add Room', path: '/owner/add-room', icon: <FaHotel /> },
    { name: 'List Room', path: '/owner/list-room', icon:<HiViewList /> },
     { name: 'Sign Out', path: '/', icon: <HiArrowSmRight /> }

  ];

  const sideBarLinksUser = [
     { name: 'Profile', path: '/profile', icon: <HiUser /> },
     { name: 'My-Bookings', path: '/profile/my-bookings', icon:<AiFillBook /> },
     { name: 'Sign Out', path: '/', icon: <HiArrowSmRight /> }
  ]
  
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
    <div className='w-55 max-sm:w-full text-base flex flex-col transition-all duration-300
                       max-sm:bg-gray-100'>
     
      {currentUser && currentUser.isHotelOwner && sidebarLinksOwner.map((item, index) => (
        <NavLink to={item.path} key={index} end='/owner' 
         onClick={item.name === 'Sign Out' && handleSignOut}
        className={({ isActive }) =>
         `flex items-center justify-start gap-2 py-3 px-4 mt-1.5 md:px-8 
         ${isActive ? 'border-r-4 md:border-r-[6px] bg-blue-600/10 border-blue-600 text-blue-600' :
          'hover:bg-gray-100/90 text-gray-700 border-white'}
         `}>
          <p>{item.icon}</p>
          <p className='text-center '>{item.name}</p>
        </NavLink>
      ))}

       {currentUser && !currentUser.isHotelOwner && sideBarLinksUser.map((item, index) => (
        <NavLink to={item.path} key={index} end='/owner' 
         onClick={item.name === 'Sign Out' && handleSignOut}
        className={({ isActive }) =>
         `flex items-center justify-start gap-2 py-3 px-4 mt-1.5 md:px-8 
         ${isActive ? 'border-r-4 md:border-r-[6px] bg-blue-600/10 border-blue-600 text-blue-600' :
          'hover:bg-gray-100/90 text-gray-700 border-white'}
         `}>
          <p>{item.icon}</p>
          <p className='text-center '>{item.name}</p>
        </NavLink>
      ))}
    </div>
  )
}
