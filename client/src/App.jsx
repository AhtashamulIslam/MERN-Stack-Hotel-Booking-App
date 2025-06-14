import React from 'react'
import Navbar from './components/Navbar'
import {Routes,Route, useLocation} from 'react-router-dom'
import Home from './pages/Home'
import Footer from './components/Footer'
import AllRooms from './pages/AllRooms'
import RoomDetails from './pages/RoomDetails'
import MyBookings from './pages/MyBookings'
import HotelRegistration from './components/HotelRegistration'
import Layout from './pages/hotelOwner/Layout'
import Dashboard from './pages/hotelOwner/Dashboard'
import AddRoom from './pages/hotelOwner/AddRoom'
import ListRoom from './pages/hotelOwner/ListRoom'

function App() {
   // If we navigate to the owner, the navbar will not appear. 
   const isOwnerPath = useLocation().pathname.includes('owner')
  return (
    <div className=''>
     { !isOwnerPath && <Navbar /> } 
     {false && <HotelRegistration />}
     <div className='min-h-[70vh]'>
       <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/rooms' element={<AllRooms />} />
          <Route path='/rooms/:id' element={<RoomDetails />} />
          <Route path='/my-bookings' element={<MyBookings />} />
          <Route path='/owner' element={<Layout />} >
            <Route index element={<Dashboard />} />
             <Route path='add-room' element={<AddRoom />} />
              <Route path='list-room' element={<ListRoom />} />
          </Route>
          {/* Add more routes as needed */}
       </Routes>
     </div>
    { !isOwnerPath && <Footer /> }
    </div>
  )
}

export default App