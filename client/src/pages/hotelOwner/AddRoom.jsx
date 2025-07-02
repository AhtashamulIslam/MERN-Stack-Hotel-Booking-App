import React, { useEffect } from 'react'
import { useState } from 'react'
import Title from '../../components/Title'
import { assets } from '../../assets/assets'
import { useSelector } from 'react-redux'
import axios from 'axios'
import Alert from '@mui/material/Alert'

function AddRoom() {
  // For storing images of the room
  const [images,setImages] = useState({
    1:null,
    2:null,
    3:null,
    4:null
  }) 
 
  // For storing inputs of the room that hotel owner will fill.
  const [inputs,setInputs] = useState({
    roomType:'',
    pricePerNight:0,
    amenities:{
      'Free Wi-Fi':false,
      'Free Breakfast':false,
      'Room Service':false,
      'Mountain View':false,  
      'Pool Access':false,  
    }
  })


  const [loading,setLoading] = useState(false)
  const [errorMessage,setErrorMessage] = useState(null) 
  const [successMessage,setSuccessMessage] = useState(null) 
  const {currentUser} = useSelector((state) => state.user)
  const [hotelData,setHotelData] = useState(null)

  useEffect(() => {

       const fetchHotel = async () => {
           const hotel = await fetch(`/api/hotel/get-hotel/${currentUser._id}`)
           const hotelData = await hotel.json()
           setHotelData(hotelData);
       }
         fetchHotel();
  }, [currentUser])

  const handleSubmit = async (e) => {
    e.preventDefault()  
    if(!inputs.roomType || !inputs.pricePerNight || !inputs.amenities || 
        !Object.values(images).some(image => image)){
      setErrorMessage('Please fill all the fields and upload all images.')
      return
    }
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('roomType',inputs.roomType)
      formData.append('pricePerNight',inputs.pricePerNight)
     //Convert amenties to array and keeping only the checked ones.
      const amenities = Object.keys(inputs.amenities).filter(key => inputs.amenities[key]) 
      formData.append('amenities',JSON.stringify(amenities))
      Object.keys(images).forEach((key) => {
        images[key] && formData.append('images', images[key])
        })
      const { data } = await axios.post(`/api/room/create-room/${currentUser._id}/${hotelData._id}`,formData,{
        headers: { 'Content-Type': 'multipart/form-data' }})

            if(data.success===false){
                 setErrorMessage(data.message)
              }
             if(data === 'Room created successfully'){  
                 setSuccessMessage('Room added successfully')
                  setInputs({
                    roomType:'',
                    pricePerNight:0,
                    amenities:{
                      'Free Wi-Fi':false,
                      'Free Breakfast':false,
                      'Room Service':false,
                      'Mountain View':false,  
                      'Pool Access':false,  
                    }
                  })
                  setImages({
                    1:null,
                    2:null,
                    3:null,
                    4:null
                  })
             }
    } catch (error) {
      setErrorMessage(error.message)
    }finally {
      setLoading(false)
    }
  }

  return (
    <form className='h-full' onSubmit={handleSubmit}>
      <Title align='left' font='outfit' title='Add Room' subTitle='Fill in the details carefully and accurate 
        room details, pricing and amenities to enhance the user booking experience.' />
        {/*Upload areas for images*/} 
        <p className='text-gray-800 mt-10'>Images</p>
        <div className='grid grid-cols-2 gap-4 my-2 sm:flex flex-wrap'>
          {Object.keys(images).map((key, index) => (
            <label htmlFor={`roomImage${key}`} key={key}>
              <img className='max-h-13 cursor-pointer opacity-80'
              src={images[key] ? URL.createObjectURL(images[key]) : assets.uploadArea} 
                alt={`Room Image ${key}`} />
              <input type="file" accept='image/*' id={`roomImage${key}`} hidden
                onChange={e=>setImages({...images,[key]:e.target.files[0]})}/>
            </label>
          ))}
        </div>
        {/* Insert Room types and other pricing details */}
         <div className='w-full flex max-sm:flex-col sm:gap-4 mt-6 items-center'>
           <div className='flex-1 max-w-48'>
             <p className='max-sm:text-center text-gray-800'>Room Type</p>
             <select value={inputs.roomType} onChange={e=>setInputs({...inputs,roomType:e.target.value})}
             className='border opacity-70 border-gray-300 text-gray-700 mt-1 rounded p-2 w-full'>
               <option value=''>Select Room Type</option>
               <option value='Single Bed'>Single Bed</option>
               <option value='Double Bed'>Double Bed</option>
               <option value='Luxury Room'>Luxury Room</option>
               <option value='Family Suite'>Family Suite</option>
               <option value='Family Suite'>Presidential Suite</option>
             </select>
           </div>
           <div>
              <p className='max-sm:mt-4 max-sm:text-center text-gray-800'>
                Price <span className='text-xs'>/night</span>
              </p>
              <input type='number' placeholder='0' 
              className='border border-gray-300 mt-1 rounded p-2 w-24 text-gray-700'
              value={inputs.pricePerNight} onChange={e=>setInputs({...inputs,pricePerNight:e.target.value})} />
           </div>
         </div>

         {/* Insert Amenities */} 
         <p className='text-gray-800 mt-4'>Amenities</p>
         <div className='flex flex-col flex-wrap max-w-sm mt-1 text-gray-600'>
           {Object.keys(inputs.amenities).map((amenity, index) => (
              <div key={index}>
                 <input type='checkbox' id={`amenities ${index+1}`}
                  checked={inputs.amenities[amenity]}
                  onChange={()=>setInputs({
                    ...inputs,
                    amenities:{
                      ...inputs.amenities,
                      [amenity]:!inputs.amenities[amenity]
                    }
                  })}
                  />
                  <label htmlFor={`amenities ${index+1}`}>{amenity}</label>
              </div>
           ))}
         </div>
         <button type='submit' className='bg-primary text-white px-8 py-2 rounded mt-6 mb-8' disabled={loading}>
           { loading ? 'Adding ...' : 'Add Room' } 
          </button>
           { errorMessage && (
               <Alert className='mt-1 max-w-2xl mx-auto' variant="outlined" severity="error">
                   {errorMessage}
               </Alert>
              )
           }
            { successMessage && (
                <Alert className='mt-1 max-w-2xl mx-auto' variant="outlined" severity="success">
                    {successMessage}
                </Alert>
                )
            } 
    </form>
  )
}

export default AddRoom