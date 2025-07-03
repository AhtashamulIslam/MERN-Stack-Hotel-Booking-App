import React, { useState } from 'react'
import Title from '../../components/Title'
import { assets} from '../../assets/assets'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'

function Dashboard() {

  const [dashboardData, setDashboardData] = useState({
        bookings: [],
        totalBooking: 0,
        totalRevenue: 0,
  })
  const { currentUser } = useSelector((state) => state.user)
  
  const fetchDashboardData = async () => {
    try {
          const res = await fetch(`/api/booking/hotelowner-bookings/${currentUser._id}`)
          const data = await res.json()
          setDashboardData(data)
    } catch (error) {
          console.error('Error fetching dashboard data:', error)  
    }
  }

  useEffect(() => {
    if (currentUser) {
      fetchDashboardData();
    }
  }, [currentUser]);
  return (
    <div>
      <Title title='Dashboard' subTitle='Monitor your room listings, track bookings and analyze revenue-all
             in one place. Stay updated with real-time insights to ensure smooth operations.' 
             align='left' font='outfit'/>
      
      <div className='flex my-8 gap-4'>
         {/*Total Bookings*/}
         <div className='bg-primary/3 border border-primary/10 rounded p-4 flex pr-8'>
            <img src={assets.totalBookingIcon} alt="Total Bookings" className='max-sm:hidden h-10' />
            <div className='flex flex-col sm:ml-4 font-medium'>
             <p className='text-blue-500 text-lg'>Total Bookings</p>
             <p className='text-neutral-400 text-base'>{dashboardData.totalBooking}</p>
            </div>
         </div>
         {/*Total Revenue*/}
          <div className='bg-primary/3 border border-primary/10 rounded p-4 flex pr-8'>
            <img src={assets.totalRevenueIcon} alt="Revenue Bookings" className='max-sm:hidden h-10' />
            <div className='flex flex-col sm:ml-4 font-medium'>
             <p className='text-blue-500 text-lg'>Total Revenue</p>
             <p className='text-neutral-400 text-base'>$ {dashboardData.totalRevenue}</p>
            </div>
         </div>
      </div>
      {/*Recent Bookings*/} 
      
      <h2 className='text-xl text-blue-950/70 font-medium mb-5'>Recent Bookings</h2>
      <div className='w-full max-w-3xl text-left border border-gray-300 
            rounded-lg max-h-80 overflow-y-scroll'>
        <table className='w-full'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='py-3 px-4 text-gray-800 font-medium'>User Name</th>
              <th className='py-3 px-4 text-gray-800 font-medium max-sm:hidden'>Room Name</th>
              <th className='py-3 px-4 text-gray-800 font-medium text-center'>Total Amount</th>
              <th className='py-3 px-4 text-gray-800 font-medium text-center'>Payment Status</th>

            </tr>
          </thead>
          <tbody className='text-sm'>
           {dashboardData.bookings.map((item, index) => (
             <tr key={index}>
               <td className='py-3 px-4 text-gray-700 border-t border-gray-300'>{item.username}</td>
              <td className='py-3 px-4 text-gray-700 border-t border-gray-300 max-sm:hidden'>{item.roomType}</td>
              <td className='py-3 px-4 text-gray-700 border-t border-gray-300 text-center'>$ {item.totalPrice}</td>
              <td className='py-3 px-4 text-gray-700 border-t border-gray-300 flex'>
                <button className={`px-3 py-1 rounded-full text-xs mx-auto
                  ${item.isPaid ? 'bg-green-200 text-green-600' : 'bg-amber-200 text-yellow-600'}`}>
                  {item.isPaid ? 'Completed' : 'Pending'} 
                </button>
              </td>
             </tr>
           ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Dashboard