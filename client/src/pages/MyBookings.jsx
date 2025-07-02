import React, { useState } from 'react'
import Title from '../components/Title'
import { assets, userBookingsDummyData } from '../assets/assets'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'

function MyBookings() {

    const [bookings, setBookings] = useState([])
    const {currentUser} = useSelector((state) => state.user)

    const fetchBookings = async ()=>{
           try {
                 const res = await fetch(`/api/booking/user-bookings/${currentUser._id}`)
                 const data = await res.json()
                 if(res.ok){
                    setBookings(data)
                 }else{
                    console.log(data.message)
                 }
           } catch (error) {
              console.log(error.message)
           }
    }

    useEffect(()=>{
        if(currentUser){
          fetchBookings()
        }
    },[currentUser])
  return (
    <div>
        <Title title="My Bookings" subTitle='easily manage your past, current and upcoming hotel reservations
          in one place. Plan your trips seamlessly with our user-friendly interface.'
          align="left" />

        <div className='max-w-6xl w-full text-gray-800 mt-8'>
          <div className='hidden md:grid md:grid-cols-[3fr_2fr_1fr] w-full border-b border-gray-300 font-medium
                           text-base py-3'>
            <div className=''>Hotels</div>
            <div className='w-1/3'>Date & Timings</div>
            <div className='w-1/3'>Payment</div>
          </div>

          {bookings.map((booking) => (
            <div key={booking._id} 
            className='grid grid-cols-1 md:grid-cols-[3fr_2fr_1fr] w-full border-b border-gray-300 py-6 first:border-t'>
              {/*Hotel details*/}
              <div className='flex flex-col md:flex-row flex-wrap'>
                <img src={booking.roomImages[0][0]} alt='hotel_image'
                  className='min-md:w-44 rounded shadow object-cover'/>
                  <div className='flex flex-col gap-1.5 max-md:mt-3 min-md:ml-4'>
                    <p className='font-playfair text-2xl'>
                      {booking.hotelName}
                      <span className='font-inter text-sm'> ({booking.roomType})</span>
                    </p>
                    <div className='flex items-center gap-1 text-gray-500 text-sm'>
                      <img src={assets.locationIcon} alt='location_icon' />
                      <span>{booking.hotelAddress}</span>
                    </div>
                      <div className='flex items-center gap-1 text-gray-500 text-sm'>
                      <img src={assets.guestsIcon} alt='guests_icon' />
                      <span>guests: {booking.guests}</span>
                    </div>
                    <p className='text-base'>Total: ${booking.totalPrice}</p>
                  </div>
              </div>
              {/*Date & Timings*/}
              <div className='flex flex-row items-center md:gap-12 mt-3 gap-8'>
                 <div>
                   <p>Check-In:</p>
                   <p className='text-gray-500 text-sm'>
                    {new Date(booking.checkInDate).toDateString()}
                   </p>
                  </div>
                  <div>
                   <p>Check-Out:</p>
                   <p className='text-gray-500 text-sm'>
                    {new Date(booking.checkOutDate).toDateString()}
                   </p>
                  </div>
              </div>
              {/*Payment status*/}
              <div className='flex flex-col items-start justify-center pt-3'>
                <div className='flex items-center gap-2'>
                  <div className={`h-3 w-3 rounded-full ${booking.isPaid ? 'bg-green-500':'bg-red-500'}`}></div>
                  <p className={`text-sm ${booking.isPaid ? 'text-green-500':'text-red-500'} `}>
                    {booking.isPaid ? 'Paid' : 'Unpaid'}  
                  </p>
                 </div>
                 {!booking.isPaid && (
                  <button className='px-4 py-1.5 mt-4 text-xs border
                      border-gray-400 rounded-full hover:bg-gray-50 transition-all cursor-pointer'>
                    Pay Now
                  </button>
                 )}
              </div>
            </div>
          ))}
            
        </div>
    </div>
  )
}

export default MyBookings