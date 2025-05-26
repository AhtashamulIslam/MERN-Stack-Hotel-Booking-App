import React from 'react'
import Navbar from './components/Navbar'
import {Routes,Route, useLocation} from 'react-router-dom'
import Home from './pages/Home'

function App() {
   // If we navigate to the owner, the navbar will not appear. 
   const isOwnerPath = useLocation().pathname.includes('owner')
  return (
    <div className=''>
     { !isOwnerPath && <Navbar /> }
     <div className='min-h-[70vh]'>
       <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/rooms' element={<h1>Rooms Page</h1>} />
          <Route path='/experience' element={<h1>Experience Page</h1>} />
          <Route path='/about' element={<h1>About Page</h1>} />
          <Route path='/owner' element={<h1>Owner Dashboard</h1>} />
          {/* Add more routes as needed */}
       </Routes>
     </div>
    </div>
  )
}

export default App