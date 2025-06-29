import React, { Children } from 'react'
import {useSelector} from 'react-redux'

//We will wrap our App with this Themeprovider.
function ThemeProvider({children}) {
    const {theme}=useSelector(state=>state.theme)
  return (
    <div className={theme}>
      <div className='bg-white text-gray-700 dark:text-gray-200 dark:bg-gray-900 min-h-screen'>
        {children}
      </div>
    </div>
  )
}

export default ThemeProvider