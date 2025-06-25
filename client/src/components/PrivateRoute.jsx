import { useSelector } from 'react-redux'
import { Outlet,Navigate } from 'react-router-dom'

function PrivateRoute() {
    const {currentUser}=useSelector(state=>state.user)
  return currentUser ? <Outlet /> : <Navigate to='/signin' />
      //Outlet allow the authenticated user to the Dashboard.
}

export default PrivateRoute