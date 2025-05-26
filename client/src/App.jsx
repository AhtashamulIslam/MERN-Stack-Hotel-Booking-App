import React from 'react'
import Navbar from './components/Navbar'
import {useLocation} from 'react-router-dom'

function App() {
   // If we navigate to the owner, the navbar will not appear. 
   const isOwnerPath = useLocation().pathname.includes('owner')
  return (
    <div className=''>
     { !isOwnerPath && <Navbar /> }
    </div>
  )
}

export default App