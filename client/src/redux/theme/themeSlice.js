import {createSlice} from '@reduxjs/toolkit'

const initialState={
    theme:'light'
}

const themeSlice = createSlice({
    name:'theme',
    initialState,
    reducers:{
        toggleTheme:(state)=>{ //This state object will come from frontend theme button.
            state.theme=state.theme==='light' ? 'dark' : 'light'
        }
    }
})

export const {toggleTheme} = themeSlice.actions; // To do user actions
export default themeSlice.reducer // To save the state in our store.