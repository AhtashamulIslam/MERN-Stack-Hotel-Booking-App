import React from 'react'
import Sidebar from '../../components/hotelOwner/Sidebar'
import { Outlet } from 'react-router-dom'

function Layout() {
  return (
    <div className='flex flex-col min-h-screen mt-18'>
      
      <div className='flex h-full max-sm:flex-col bg-white'>
        <Sidebar />
        <div className='md:flex-1 h-full md:pb-3 px-4 mt-8 md:px-16 lg:px-10'>
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default Layout