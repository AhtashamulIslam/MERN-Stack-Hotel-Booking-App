import React from 'react'
import HotelCard from './HotelCard'
import Title from './Title'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useEffect } from 'react'

function FeaturedDestination() {
    const [rooms, setRooms] = useState([]);
    const navigate = useNavigate(); 

    const fetchRooms = async () => {
        try {
            const res = await fetch('/api/room/get-rooms');
            const data = await res.json();
            if (res.ok) {
                setRooms(data);
            }
        }
        catch (error) {
            console.log(error.message);
        }
    }

    useEffect(() => {
        fetchRooms();
    }, []);
  return rooms.length > 0 && (
    <div className='flex flex-col items-center px-6 md:px-16 lg:px-24 bg-slate-50 py-20'>

        <Title 
         title='Featured Destination'
         subTitle='Discover our handpicked selection of exceptional properties around the world,
                    offering unparalleled comfort and unforgettable experiences.'
         />
        <div className='flex flex-wrap items-center justify-between mt-20 gap-6'>
            {/* Here we display 4 hotel only from the roomsDummyData array. */} 
            { rooms.slice(0, 4).map((room, index) => (
                <HotelCard key={room._id} room={room} index={index}/>
            ))}
        </div>
        <button onClick={() => {
            navigate('/rooms');
            scrollTo(0, 0);
        }}
        className='my-14 px-4 py-2 text-sm font-medium border
         border-gray-300 rounded bg-white hover:bg-gray-50 transition-all cursor-pointer'>
            View All Destinations
        </button>
    </div>
  )
}

export default FeaturedDestination