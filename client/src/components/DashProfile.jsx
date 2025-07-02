import React, { useEffect, useRef, useState } from 'react'
import Alert from '@mui/material/Alert'
import {Link} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import {app} from '../firebase'
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import {updateStart,
        updateSuccess,
        updateFailure,
        deleteUserFailure,
        deleteUserStart,
        deleteUserSuccess,
        signOutSuccess
        } from '../redux/user/userSlice'

function DashProfile() {
    const {currentUser,error,loading}=useSelector((state)=>state.user)
    const [imageFile,setImageFile]=useState(null)
    const [imageFileUrl,setImageFileUrl]=useState(null)
    const [imageFileUploading,setImageFileUploading ]=useState(false)
    // To know the image is uploaded fully or not.
    const [imageFileUploadProgress,setImageFileUploadProgress]=useState(null)
    const [imageFileUploadError,setImageFileUploadError]=useState(null)
    const [updateUserSuccess,setUpdateUserSuccess]=useState(null)
    const [updateUserError,setUpdateUserError]=useState(null)
    const [showModal,setShowModal]=useState(false)
    const [formData,setFormData]=useState({})
    const dispatch=useDispatch()
    const filePickerRef = useRef() //To make a ref of upload image button and attatch it on
                                    // image div.
    //This is for permenantly change our profile image and save it to DB.
    
    useEffect(()=>{

        if(imageFile){
            uploadImage()
        }
    },[imageFile])
       // This func will save the new image to DB.
       const uploadImage = async()=>{
        // service firebase.storage {
        //     match /b/{bucket}/o {
        //       match /{allPaths=**} {
        //         allow read ;
        //         allow write : if
        //         request.resource.size < 2 * 1024 * 1024 &&
        //         request.resource.contentType.matches('image/.*')
        //       }
        //     }
        //   }
            setImageFileUploading(true)
            setImageFileUploadError(null)
            const storage = getStorage(app)
        //Make our file url unique.
            const fileName = new Date().getTime() + imageFile.name
        //create a ref of storage and image file.
            const storageRef = ref(storage,fileName) 
        //Upload the image under the previously created ref.
            const uploadTask = uploadBytesResumable(storageRef,imageFile)
        //Add the event to handle state_change and errors
        uploadTask.on(
            'state_changed',
            (snapshot)=>{  // snapshot is a piece of information while uploading
               //Progress to demonstrate progress bar.
                const progress=
                 (snapshot.bytesTransferred/snapshot.totalBytes)*100
                setImageFileUploadProgress(progress.toFixed(0))//Discard decimels.
            },
            (error)=>{
                setImageFileUploadError('Could not upload image(File must be less than 2 MB)')
                setImageFileUploadProgress(null) //Hide the progress bar when an error occurs.
                setImageFile(null)
                setImageFileUrl(null)
                setImageFileUploading(false)
            },
            ()=>{ //Image will be stored in firebase storage having an url.
                getDownloadURL(uploadTask.snapshot.ref)
                .then((downloadURL)=>{
                    setImageFileUrl(downloadURL)
                    setFormData( { ...formData,profilePicture : downloadURL })
                    setImageFileUploading(false)
                })
            }
        )
       }
       
    
        const handleImageChange=(e)=>{
        const file=e.target.files[0]
        if(file){
        setImageFile(file)
        setImageFileUrl(URL.createObjectURL(file)) // It will create a useable temp image
                                                   //url to upload image.
    }

    }

     const handleChange=(e)=>{
            setFormData({...formData,[e.target.id]:e.target.value})
            //Track the data from TextInput fields.
       }
     const handleSubmit= async (e)=>{
          e.preventDefault()
          setUpdateUserError(null)
          setUpdateUserSuccess(null)
          if(Object.keys(formData).length===0){
            setUpdateUserError('No changes made')
            return; //For empty Object it will not be submitted.
          }
          if(imageFileUploading){
            setUpdateUserError('Please wait for image to upload')
            return; // Terminate when image will be uploading.
          }
          try{
            // We get the data via userSlice.js file's reducer.
            dispatch(updateStart())
            const res = await fetch(`/api/user/update/${currentUser._id}`,{
                method:'PUT',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify(formData)
            })
            //Here we send the data to Server for validation.
             const data= await res.json()
             //If the res from server is not ok
             if(!res.ok){
                dispatch(updateFailure(data.message))
                setUpdateUserError(data.message)
             }else{
                //Here the res is ok sent from server
                dispatch(updateSuccess(data))
                setUpdateUserSuccess("User's profile updated successfully")
             }
          }catch(error){
             dispatch(updateFailure(error.message))
             setUpdateUserError(error.message)
          }
     }
     
     const handleDeleteUser=async ()=> {
       setShowModal(false)
      try {
        dispatch(deleteUserStart());
        const res = await fetch(`/api/user/delete/${currentUser._id}`, {
          method: 'DELETE',
        });
        const data = await res.json();
        if (!res.ok) {
          dispatch(deleteUserFailure(data.message));
        } else {
          dispatch(deleteUserSuccess(data));
        }
      } catch (error) {
        dispatch(deleteUserFailure(error.message));
      }
    };
const handleSignOut=async ()=>{
  try {
    const res =await fetch(`/api/user/signout`,{
      method:'POST'
    })
    const data = await res.json()
    if(!res.ok){
      console.log(data.message)
    }else{
      dispatch(signOutSuccess())
    }
  } catch (error) {
    console.log(error)
  }
}
  return (
    <div className='max-w-lg w-full mx-auto p-3'>
      <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
        {/*Add onSubmit event to submit the data to DB via api/user/update api*/}
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input 
        type='file' 
        accept='image/*' 
        onChange={handleImageChange} 
        ref={filePickerRef} 
        hidden />
        <div className='relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full' onClick={()=>filePickerRef.current.click()}>
        {/*image file uploading prgress bar */}
        {imageFileUploadProgress && (
            <CircularProgressbar 
            value={imageFileUploadProgress || 0} 
            text={`${imageFileUploadProgress}%`}
            strokeWidth={5}
            styles={{
                root:{
                    width:'100%',
                    height:'100%',
                    position:'absolute',
                    top:0,
                    left:0
                },
                path:{
                    stroke:`rgba(62,152,199,${imageFileUploadProgress/100})`
                }
            }
                
            }/>
        )} 
        <img src={imageFileUrl || currentUser.profilePicture} 
        alt='user' 
        className={`rounded-full w-full h-full border-8 object-cover border-[lightgray]
         ${imageFileUploadProgress && imageFileUploadProgress < 100 && 'opacity-60'}
        `
        }
        />
        </div>
        {imageFileUploadError && <Alert color='failure'>{imageFileUploadError}</Alert>}
         <div>
           <p className='font-medium'>Name</p>
             <input type='text' id='username' placeholder='username'
              className='border border-gray-200 rounded w-full px-3 
                          py-3 mt-1 outline-indigo-500 font-light'
              defaultValue={currentUser.username}
              onChange={handleChange} required/>
          </div>
          <div>
           <p className='font-medium'>Email</p>
             <input type='email' id='email' placeholder='example@company.com'
                   className='border border-gray-200 rounded w-full px-3 
                              py-3 mt-1 outline-indigo-500 font-light'
              defaultValue={currentUser.email}
              onChange={handleChange} required/>
          </div>

           <div>
           <p className='font-medium'>Password</p>
            <input type='password' id='password' placeholder='**************'
              className='border border-gray-200 rounded w-full px-3 
                         py-3 mt-1 outline-indigo-500 font-light'
              defaultValue={currentUser.password}
              onChange={handleChange} required/>
          </div>
          <button className="btn btn-gradient btn-primary" type='submit'>
            {
              loading ? (
                <>
                <span className='pl-3'>Loading...</span>
                </>
              ) : 'Update'
            }
           </button>
        {
          currentUser &&  
            <Link to={'/rooms'}>
             <button className="btn btn-gradient bg-green-950 w-full" type='button'>
                Book Now
             </button>
            </Link>
          
        }
      </form>
      <div className='mt-5 flex justify-between text-red-500 font-semibold'>
        <span onClick={()=>setShowModal(true)} className='cursor-pointer border-b-2 hover:border-red-500'>Delete Account</span>
        <span onClick={handleSignOut} className='cursor-pointer border-b-2 hover:border-red-500'>Sign Out</span>
      </div>
      { updateUserSuccess && (
      <Alert className='mt-2.5' variant="outlined" severity="success">
       {updateUserSuccess}
      </Alert>
      )
      }
      { updateUserError && (
      <Alert className='mt-2.5' variant="outlined" severity="error">
        {updateUserError}
      </Alert>
      )
      }
      {error && (
        <Alert className='mt-2.5' variant="outlined" severity="error">
          {error}
        </Alert>
      )}
      { showModal && 
        <div>
            <div
                className="fixed inset-0 p-4 flex flex-wrap justify-center items-center w-full h-full z-[1000] before:fixed before:inset-0 before:w-full before:h-full before:bg-[rgba(0,0,0,0.5)] overflow-auto">
                <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-6 relative">
                  <button type='button' onClick={()=>setShowModal(false)}>
                    <svg id="closeIcon" xmlns="http://www.w3.org/2000/svg"
                        className="w-3.5 h-3.5 cursor-pointer shrink-0 fill-gray-400 hover:fill-red-500 float-left"
                        viewBox="0 0 320.591 320.591">
                        <path
                            d="M30.391 318.583a30.37 30.37 0 0 1-21.56-7.288c-11.774-11.844-11.774-30.973 0-42.817L266.643 10.665c12.246-11.459 31.462-10.822 42.921 1.424 10.362 11.074 10.966 28.095 1.414 39.875L51.647 311.295a30.366 30.366 0 0 1-21.256 7.288z"
                            data-original="#000000"></path>
                        <path
                            d="M287.9 318.583a30.37 30.37 0 0 1-21.257-8.806L8.83 51.963C-2.078 39.225-.595 20.055 12.143 9.146c11.369-9.736 28.136-9.736 39.504 0l259.331 257.813c12.243 11.462 12.876 30.679 1.414 42.922-.456.487-.927.958-1.414 1.414a30.368 30.368 0 0 1-23.078 7.288z"
                            data-original="#000000"></path>
                    </svg>
                   </button>
                    <div className="my-10 text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-14 h-14 fill-red-500 inline"
                            viewBox="0 0 286.054 286.054">
                            <path fill="#e2574c"
                                d="M143.027 0C64.04 0 0 64.04 0 143.027c0 78.996 64.04 143.027 143.027 143.027 78.996 0 143.027-64.022 143.027-143.027C286.054 64.04 222.022 0 143.027 0zm0 259.236c-64.183 0-116.209-52.026-116.209-116.209S78.844 26.818 143.027 26.818s116.209 52.026 116.209 116.209-52.026 116.209-116.209 116.209zm.009-196.51c-10.244 0-17.995 5.346-17.995 13.981v79.201c0 8.644 7.75 13.972 17.995 13.972 9.994 0 17.995-5.551 17.995-13.972V76.707c-.001-8.43-8.001-13.981-17.995-13.981zm0 124.997c-9.842 0-17.852 8.01-17.852 17.86 0 9.833 8.01 17.843 17.852 17.843s17.843-8.01 17.843-17.843c-.001-9.851-8.001-17.86-17.843-17.86z"
                                data-original="#e2574c" />
                        </svg>
    
                        <h4 className="text-lg text-slate-900 font-semibold mt-6">Your account will be deleted permanently!</h4>
                        <p className="text-sm text-slate-500 mt-2">Are you sure to proceed?</p>
                    </div>
    
                    <div className="flex max-sm:flex-col gap-4">
                        <button type="button"
                           onClick={()=>setShowModal(false)}
                            className="px-2 py-2.5 rounded-lg w-full tracking-wide text-slate-900 text-sm font-medium border-none outline-none bg-gray-200 hover:bg-gray-300">I
                            am not sure</button>
                        <button type="button"
                            onClick={handleDeleteUser}
                            className="px-2 py-2.5 rounded-lg w-full tracking-wide text-white text-sm font-medium border-none outline-none bg-red-500 hover:bg-red-600">Remove
                            my account</button>
                    </div>
                </div>
            </div>
       </div>
    }
    </div>
  )
}

export default DashProfile