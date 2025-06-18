import React from 'react'
import { useState } from 'react'
import Title from '../../components/Title'
import { assets } from '../../assets/assets'

function AddRoom() {

  // Here we make functionality to add a room by which hotel owner can add a room to their hotel.

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
  return (
    <form className='h-full'>
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
                 <input type='checkbox' id={`amnities ${index+1}`}
                  checked={inputs.amenities[amenity]}
                  onChange={()=>setInputs({
                    ...inputs,
                    amenities:{
                      ...inputs.amenities,
                      [amenity]:!inputs.amenities[amenity]
                    }
                  })}
                  />
                  <label htmlFor={`amnities ${index+1}`}>{amenity}</label>
              </div>
           ))}
         </div>
         <button type='submit' className='bg-primary text-white px-8 py-2 rounded mt-6 mb-10 '>
           Add Room 
          </button>
    </form>
  )
}

export default AddRoom