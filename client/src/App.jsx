import React from 'react'
import Navbar from './components/Navbar'
import {Routes,Route, useLocation, BrowserRouter} from 'react-router-dom'
import Home from './pages/Home'
import Footer from './components/Footer'
import AllRooms from './pages/AllRooms'
import RoomDetails from './pages/RoomDetails'
import MyBookings from './pages/MyBookings'
import Layout from './pages/hotelOwner/Layout'
import Dashboard from './pages/hotelOwner/Dashboard'
import AddRoom from './pages/hotelOwner/AddRoom'
import ListRoom from './pages/hotelOwner/ListRoom'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import ScrollToTop from './components/ScrollToTop'
import PrivateRoute from './components/PrivateRoute'
import OnlyAdminPrivateRoute from './components/OnlyAdminPrivateRoute'
import DashProfile from './components/DashProfile'
import HotelRooms  from './pages/HotelRooms'


function App() {

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Navbar /> 
       <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/signin' element={<SignIn />}/>
          <Route path='/signup' element={<SignUp />}/>
          <Route path='/rooms' element={<AllRooms />} />
          <Route path='/rooms/:id' element={<RoomDetails />} />
          <Route path='/hotelrooms/:destination' element={<HotelRooms />} />
           <Route element={<PrivateRoute />}>
            <Route path='/profile' element={<Layout />} >
            <Route index element={<DashProfile />} />
            <Route path='my-bookings' element={<MyBookings />} />
            </Route>
           </Route>

          <Route element={<OnlyAdminPrivateRoute />}>
          <Route path='/owner' element={<Layout />} >
            <Route index element={<Dashboard />} />
            <Route path='add-room' element={<AddRoom />} />
            <Route path='list-room' element={<ListRoom />} />
            <Route path='profile' element={<DashProfile />} />
            <Route path='my-bookings' element={<MyBookings />} />

          </Route>
          </Route>
          {/* Add more routes as needed */}
       </Routes>
     <Footer />
    </BrowserRouter>
  )
}

export default App
