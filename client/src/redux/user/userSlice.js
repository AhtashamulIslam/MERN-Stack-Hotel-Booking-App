import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser:null,
    error:null,
    loading:false
}

const userSlice = createSlice({
    name:'user',
    initialState,
    reducers:{
        signInStart:(state)=>{   //Activate when the sign In page loading
              state.loading=true
              state.error=null
        },
        signInSuccess:(state,action)=>{  //When we get a response back after sign In json(rest) as action.payload
              state.currentUser=action.payload
              state.loading=false
              state.error=null
        },
        signInFailure:(state,action)=>{
            state.loading=false
            state.error=action.payload // Take the error as response when get error at the time of signing in.
        },
        updateStart:(state)=>{ // Start when we about to update user data.
            state.loading=true
            state.error=null
        },
        updateSuccess:(state,action)=>{
            state.currentUser=action.payload // Update the user data in current User.
            state.loading=false
            state.error=null
        },
        updateFailure:(state,action)=>{
            state.loading=false
            state.error=action.payload
        },
        deleteUserStart:(state)=>{
            state.loading=true
            state.error=null
        },
        deleteUserSuccess:(state)=>{
            state.currentUser=null;
            state.loading=false;
            state.error=null;
        },
        deleteUserFailure:(state,action)=>{
            state.loading=false;
            state.error=action.payload;
        },
        signOutSuccess:(state)=>{
            state.currentUser=null
            state.loading=false
            state.error=null
        }

    }
})

export const { signInStart ,
               signInSuccess , 
               signInFailure , 
               updateStart , 
               updateSuccess , 
               updateFailure,
               deleteUserStart,
               deleteUserSuccess,
               deleteUserFailure,
               signOutSuccess} = userSlice.actions
    // The reducer function will be added in userSlice object in actions property
export default userSlice.reducer  // All the functionalities are considered as a reducer.
