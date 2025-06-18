import React from 'react'
import { useSelector } from 'react-redux'
import { Outlet,Navigate } from 'react-router-dom'

function OnlyAdminPrivateRoute() {
    const {currentUser}=useSelector(state=>state.user)
    return (currentUser && currentUser.isHotelOwner ? <Outlet /> : <Navigate to='/signin' />)
    //Outlet allow the authenticated Admin to the Dashboard.
}

export default OnlyAdminPrivateRoute
