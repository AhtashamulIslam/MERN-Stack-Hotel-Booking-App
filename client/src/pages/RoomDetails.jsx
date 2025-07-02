import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { assets, facilityIcons, roomCommonData, userDummyData} from '../assets/assets';
import StarRating from '../components/StarRating';
import Alert from '@mui/material/Alert';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';


const RoomDetails = () => {
    const {id} = useParams(); // Assuming you're using react-router-dom to get the room ID from the URL.
    const [room,setRoom] = useState(null);
    const [mainImage,setMainImage] = useState(null);
    const [guests, setGuests] = useState(0);
    const [checkInDate, setCheckInDate] = useState('');
    const [checkOutDate, setCheckOutDate] = useState('');
    const [isAvailable, setIsAvailable] = useState(false);
    const [successMessage, setSuccessMessage] = useState(''); 
    const [errorMessage, setErrorMessage] = useState(''); 
    const {currentUser} = useSelector((state) => state.user); // Assuming you have a user slice in your Redux store 
    const navigate = useNavigate();

    useEffect(() => {
      const fetchRoomDetails = async () => {
        try {
          const res = await fetch(`/api/room/get-room/${id}`);
          const data = await res.json();
          // Check if the response is ok and data is not empty
          if (res.ok) {
            setRoom(data);
            setMainImage(data.images[0][0]);
          } else {
            console.error('Failed to fetch room details:', data.message);
          }
        } catch (error) {
          console.error('Error fetching room details:', error.message);
        }
      }
      fetchRoomDetails();
      

    },[id])

    const handleCheckAvailability = async () => {
      
      if (!checkInDate || !checkOutDate || guests <= 0) {
        setErrorMessage('Please fill in all fields correctly.');
        return;
      }
      if(checkInDate >= checkOutDate){
        setErrorMessage('Check-Out date must be after Check-In date.');
        return;
      }
      try {
        const res = await fetch(`/api/booking/check-availability/${id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ checkInDate, checkOutDate }),
        });
        const data = await res.json();
  
        if (data === true) {

          setIsAvailable(data);
          setSuccessMessage('Room is available for booking.');
          setErrorMessage('');
        } else {
          setIsAvailable(false);
          setErrorMessage(data.message || 'Room is not available.');
          setSuccessMessage('');
        }
      } catch (error) {
        console.error('Error checking availability:', error.message);
        setErrorMessage('An error occurred while checking availability.');
      }
    }

    const handleSubmitBooking = async (e) => {
     
     try {
        e.preventDefault();
        if(!isAvailable){
          return handleCheckAvailability();
        }
        const res = await fetch(`/api/booking/create-booking/${currentUser._id}/${room.hotelId}/${id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ checkInDate, checkOutDate, guests }),
        });
        const data = await res.json();
  
        if (data === 'Room is booked successfully') {
          setSuccessMessage('Room is booked successfully and confirmation email sent');
          setErrorMessage('');
          navigate('/profile/my-bookings');
          scrollTo(0, 0); // Scroll to top after booking
        } else {
          setErrorMessage(data.message);
          setSuccessMessage('');
        }
      } catch (error) {
        setErrorMessage('An error occurred while creating the booking here.');
      }
    }


  return room && (
    <div className='py-28 md:py-35 px-4 md:px-16 lg:px-24 xl:px-32'>    
        {/* Room Details */}
        <div className='flex flex-col md:flex-row items-start md:items-center gap-2'>
            <h1 className='text-3xl md:text-4xl font-playfair'>{room.hotelName} 
                <span className='font-inter text-sm'>({room.roomType})</span>
            </h1>
            <p className='text-xs font-inter py-1.5 px-3 text-white bg-orange-500
            rounded-full'>20% OFF</p>
        </div>
        {/* Room Ratings */}
        <div className='flex items-center gap-1 mt-2'>
            <StarRating />
            <p className='ml-2'>200+ reviews</p>
        </div>
        {/* Room Location */}
        <div className='flex items-center gap-1 text-gray-500 mt-2'>
            <img src={assets.locationIcon} alt='location_icon' />
            <span>{room.hotelAddress}</span>
        </div>
        {/* Room Images */} 
        <div className='flex flex-col lg:flex-row gap-6 mt-6'>
            <div className='lg:w-1/2 w-full'>
              <img src={mainImage} alt='room_image'
               className='w-full rounded-xl shadow-lg object-cover' />
            </div>
            <div className='lg:w-1/2 w-full grid grid-cols-2 gap-4'>
                { room?.images[0].length > 1 && room.images[0].map((image, index) => (
                    <img onClick={() => setMainImage(image)}
                    key={index} src={image} alt='room_image'
                    className={`w-full rounded-xl shadow-md object-cover cursor-pointer 
                                ${mainImage === image && 'outline-3 outline-orange-500'}`} />
                ))}
            </div>
        </div>
        {/* Room Highlights */}
       <div className='flex flex-col md:flex-row md:justify-between gap-4 mt-10'>
         <div className='flex flex-col'>
            <h1 className='text-3xl md:text-4xl font-playfair'>Experience Luxury Like Never Before</h1>
            <div className='flex flex-wrap items-center gap-4 mt-3 mb-6'>
                {room.amenities.map((item, index) => (
                    <div key={index} className='flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100'>
                      <img src={facilityIcons[item]} alt={item} className='w-5 h-5' />
                      <p className='text-xs'>{item}</p>
                    </div>
                ))}
            </div>
         </div>
         {/*Room Price*/}
         <p className='text-2xl font-medium'>${room.pricePerNight}/night</p>
       </div>
       {/*CheckIn CheckOut Form */}
       <form  onSubmit={handleSubmitBooking}
         className='flex flex-col md:flex-row items-start md:items-center justify-between
                        bg-white shadow-[0px_0px_20px_rgba(0,0,0,0.15)] p-6 rounded-xl mx-auto
                        mt-16 max-w-6xl'>
          <div className='flex flex-col flex-wrap md:flex-row items-start
                            md:items-center gap-4 md:gap-10 text-gray-500'>
              <div className='flex flex-col'>
                  <label htmlFor='checkInDate' className='font-medium'>Check-In</label>
                  <input type='date' id='checkInDate' placeholder='Check-In'
                   onChange={(e) => setCheckInDate(e.target.value)}
                   min={new Date().toISOString().split('T')[0]} // Prevent past dates
                   className='w-full rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none'
                   required />
              </div>
              <div className='w-px h-15 bg-gray-300/70 max-md:hidden'></div>
              <div className='flex flex-col'>
                  <label htmlFor='checkOutDate' className='font-medium'>Check-Out</label>
                  <input type='date' id='checkOutDate' placeholder='Check-Out'
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    min={checkInDate} disabled={!checkInDate}
                   className='w-full rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none'
                   required />
              </div>
              <div className='w-px h-15 bg-gray-300/70 max-md:hidden'></div>
              <div className='flex flex-col'>
                  <label htmlFor='guests' className='font-medium'>Guests</label>
                  <input type='number' id='guests' placeholder='1' 
                   onChange={(e) => setGuests(e.target.value)}
                   value={guests}
                   className='max-w-20 rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none'
                   required />
              </div>
          </div>
          
          <button type='submit' 
           className='bg-primary hover:bg-primary-dull active:scale-95 transition-all
          text-white rounded-md max-md:mt-6 max-md:w-full md:px-25 py-3 md:py-4 text-base cursor-pointer'>
           { isAvailable ? 'Book Now' : 'Check Availability' }
          </button>
         
       </form>
        <div>
          { errorMessage && (
               <Alert className='mt-2 max-w-xl mx-auto' variant="outlined" severity="error">
                   {errorMessage}
               </Alert>
              )
           }
            { successMessage && (
                <Alert className='mt-2 max-w-xl mx-auto' variant="outlined" severity="success">
                    {successMessage}
                </Alert>
                )
            } 
            </div>
       {/*Common Specifications*/}
       <div className='mt-25 space-y-4'>
        { roomCommonData.map((spec, index) => (
            <div key={index} className='flex items-start gap-2'>
                <img src={spec.icon} alt={spec.title} className='w-6.5' />
                <div>
                    <p className='text-base'>{spec.title}</p>
                    <p className='text-gray-500'>{spec.description}</p>
                </div>
            </div>
        ))}
       </div>
         {/*Room Description*/}
         <div className='max-w-3xl border-y border-gray-300 my-15 py-10 text-gray-500'>
            <p>
                Guests will be allocated on the ground floor according to availability.
                You get a comfortable Two bedroom apartment has a true city feeling.The
                price quoted is for two guest, at the guets slot please mark the number
                of guests to get the exact price for groups. Guests will be allocated on 
                the ground floor according to availability.You get a comfortable Two bedroom 
                apartment has a true city feeling.
            </p>
         </div>
         {/*Hotel owner details*/}
         <div className='flex flex-col items-start gap-4'>
           <div className='flex gap-4'>
             <img src={userDummyData.image} alt='owner_image'
             className='h-14 w-14 md:h-18 md:w-18 rounded-full' />
             <div>
                <p className='text-lg md:text-xl'>
                   Hosted by {room.hotelName}
                </p>
                <div className='flex items-center mt-1'>
                    <StarRating />
                    <p className='ml-2'>200+ reviews</p>
                </div>
             </div>
           </div>
           <button className='px-6 py-2.5 mt-4 rounded text-white bg-primary
                hover:bg-primary-dull transition-all cursor-pointer'>
             Contact Now
           </button>
         </div>
    </div>
  )
}

export default RoomDetails