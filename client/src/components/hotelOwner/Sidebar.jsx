import React from 'react'
import { assets } from '../../assets/assets';
import { NavLink } from 'react-router-dom';

export default function Sidebar() {

  const sidebarLinks = [
    { name: 'Dashboard', path: '/owner', icon: assets.dashboardIcon },
    { name: 'Add Room', path: '/owner/add-room', icon: assets.addIcon },
    { name: 'List Room', path: '/owner/list-room', icon: assets.listIcon },
  ];
  
  return (
    <div className='md:w-64 w-16 text-base flex flex-col transition-all duration-300
                       border-r h-full border-gray-300 pt-4'>
     
      {sidebarLinks.map((item, index) => (
        <NavLink to={item.path} key={index} end='/owner' 
        className={({ isActive }) =>
         `flex items-center gap-3 py-3 px-4 md:px-8 
         ${isActive ? 'border-r-4 md:border-r-[6px] bg-blue-600/10 border-blue-600 text-blue-600' :
          'hover:bg-gray-100/90 text-gray-700 border-white'}
         `}>
          <img src={item.icon} alt={item.name} className='min-w-6 min-h-6' />
          <p className='hidden md:block text-center'>{item.name}</p>
        </NavLink>
      ))}
    </div>
  )
}
