import React from 'react'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Whenever we go to any url, the window will scroll top according to the function. 

const ScrollToTop = ()=>{
    const {pathname} = useLocation();
    useEffect(()=>{
        window.scrollTo(0,0)
    },[pathname])
    return null;
}

export default ScrollToTop