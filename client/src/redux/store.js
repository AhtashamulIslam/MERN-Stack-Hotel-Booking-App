import { configureStore,combineReducers} from '@reduxjs/toolkit'
import userReducer from './user/userSlice'
import themeReducer from './theme/themeSlice'
import { persistReducer } from 'redux-persist'  // To save the state while refreshing.
import storage from 'redux-persist/lib/storage'
import persistStore from 'redux-persist/es/persistStore'

const rootReducer = combineReducers({
    user:userReducer, // Set the reducer functions from userSlice. 
    theme:themeReducer // Set the reducer functions from themeSlice.
})

const persistConfig={
    key:'root',
    storage,   //The persisted state will be stored in Local storage named as key>root.
    version:1
}
const persistedReducer = persistReducer(persistConfig,rootReducer)
export const store = configureStore({
  reducer: persistedReducer,
  middleware:(getDefaultMiddleware)=>getDefaultMiddleware({ //To prevent default errors.
    serializableCheck:false
  })
})

export const persistor = persistStore(store) //This is exported for global state in main.jsx.
