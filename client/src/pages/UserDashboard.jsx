import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import DashSidebar from '../components/DashSidebar'
import DashProfile from '../components/DashProfile'
import MyBookings from './MyBookings'


function UserDashboard() {
  const location=useLocation() // to determine in which tab user visits.
                               // dashboard?tab=profile.
  const [tab,setTab]=useState('')
  useEffect(()=>{
    const urlParams=new URLSearchParams(location.search) // get the url params here.
    const tabFromUrl=urlParams.get('tab') // Take the tab value from urlParams.
    if(tabFromUrl){
      setTab(tabFromUrl)
    }
  },[location.search])
  return (
    <div className='min-h-screen flex flex-col sm:flex-row'>
      {/*sidebar*/}
      <div className='sm:w-56'>
        <DashSidebar />
      </div>
      {/*Profile*/}
      {tab==='profile' && <DashProfile />}

       {tab==='my-bookings' && <MyBookings />}
    
    </div>
  )
}

export default UserDashboard
