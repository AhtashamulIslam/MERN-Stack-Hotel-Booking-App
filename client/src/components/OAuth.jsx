
import React from 'react'
import {AiFillGoogleCircle} from 'react-icons/ai'
import {GoogleAuthProvider, signInWithPopup ,getAuth} from 'firebase/auth'
import {app} from '../firebase'
import {useDispatch} from 'react-redux'
import {signInSuccess} from '../redux/user/userSlice'
import { useNavigate } from 'react-router-dom'

function OAuth() {
      const auth=getAuth(app) // It will initialize the firebase PopUp app.
     //After invoking this function a pop window will appear for Firebase google authentication.
     const dispatch = useDispatch()
     const navigate = useNavigate()
    const handleGoogleClick=async ()=>{
         const provider=new GoogleAuthProvider()
         provider.setCustomParameters({prompt:'select_account'}) //Every it will pop up a window displaying accounts to choose after clicking the button.
         try {
               const resultFromGoogle = await signInWithPopup(auth,provider)
               //Will find a promise of user object.
               //Now we will save this authenticated user in DB using api/auth/google
               const res=await fetch(`/api/auth/google`,{
                method:'POST',
                headers:{'Content-Type':'application/json'},
                body:JSON.stringify({
                  name:resultFromGoogle.user.displayName,
                  email:resultFromGoogle.user.email,
                  googlePhotoUrl:resultFromGoogle.user.photoURL
                })
               })
               const data = await res.json()
               if(res.ok){
                 dispatch(signInSuccess(data))
                 navigate('/')
               }
         } catch (error) {
           console.log(error)
         }
    }
  return (
    <button type='button' className="btn btn-gradient btn-warning" onClick={handleGoogleClick}>
        <AiFillGoogleCircle className='w-6 h-6 mr-2'/>
        Continue with Google
    </button>
  )
}

export default OAuth
