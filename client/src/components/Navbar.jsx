import React from "react";
import { useEffect,useState} from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { useSelector,useDispatch } from "react-redux";
import { signOutSuccess,updateStart,updateSuccess,updateFailure } from "../redux/user/userSlice";
import Avatar from '@mui/material/Avatar';
import { AiOutlineSearch, AiFillProfile, AiOutlineArrowLeft, AiOutlineArrowRight, AiOutlineLogout } from "react-icons/ai";
import { FaMoon,FaSun } from "react-icons/fa";
import { toggleTheme } from "../redux/theme/themeSlice";
import { cities } from '../assets/assets'
import Alert from "@mui/material/Alert";


const BookIcon = ()=>(
    <svg className="w-4 h-4 text-gray-700" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" >
    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 19V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v13H7a2 2 0 0 0-2 2Zm0 0a2 2 0 0 0 2 2h12M9 3v14m7 0v4" />
</svg>
)

const Navbar = () => {
    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Hotels', path: '/rooms' },
        { name: 'Experience', path: '/' },
        { name: 'About', path: '/' },
    ];


    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showRegForm,setShowRegForm] = useState(false);
    const [formData,setFormData] = useState({});
    const [errorMessage,setErrorMessage] = useState(null);
    const [loading,setLoading] = useState(false);
    const [userData,setUserData] = useState({});
    const [hotelData,setHotelData] = useState({});
    const {currentUser}=useSelector(state=>state.user)
    const {theme}=useSelector(state=>state.theme)
    const [openDropdown, setOpenDropdown] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {

        // We do this scroll effect for the home page only.
        // If the user is not on the home page, we set the isScrolled to true.
        if(location.pathname !== '/') {
            setIsScrolled(true);
            return;
        }else {
            setIsScrolled(false);
        }
        setIsScrolled(prev=> location.pathname !== '/' ? true : prev);


        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [location.pathname,]);

    const handleChange = (e)=>{
        setFormData({...formData,[e.target.id]:e.target.value.trim()})
    }

    const handleSubmit = async (e)=>{
        e.preventDefault();
      
        if(!formData.name || !formData.contact || !formData.address || !formData.city){
            setErrorMessage('Please fill out all fields')
        }
        
       
        try {
              setLoading(true)
              setErrorMessage(null)
              const res = await fetch(`api/hotel/${currentUser._id}`,{
                method:'POST',
                headers:{'Content-Type':'application/json'},
                body:JSON.stringify(formData)
              })

              const data = await res.json();
              if(data.success===false){
                 setErrorMessage(data.message)
                 setLoading(false)
               }
              if(res.ok){  
                 setErrorMessage(null)
                 setShowRegForm(false)
                 setLoading(false)
                 dispatch(updateStart())
                 const hotelData = await fetch(`/api/hotel/get-hotel/${currentUser._id}`);
                 const hotel = await hotelData.json();  
                 setHotelData(hotel);
            
              }
        } catch (error) {
            setErrorMessage(error.message)
            setLoading(false)
        }
        if(!currentUser.isHotelOwner){
        
            try {
                const res = await fetch(`/api/hotel/update-user-role/${currentUser._id}`,{
                    method:'PUT',
                    headers:{'Content-Type':'application/json'},
                    body:JSON.stringify({
                        username:currentUser.username,
                        email:currentUser.email,    
                        profilePicture:currentUser.profilePicture,
                        password:currentUser.password,
                        recentSearchedCities:currentUser.recentSearchedCities
                    })
                })
                const data = await res.json()
                if(!res.ok){
                    dispatch(updateFailure())
                    setErrorMessage(data.message)
                }else{
                    dispatch(updateSuccess(data))
                    navigate('/')
                    setShowRegForm(false)
                    const fetchUser = async () => {
                
                    const res = await fetch(`/api/user/${currentUser._id}`);
                    const data = await res.json();
                    const userData = await data;
                    setUserData(userData);
                    dispatch(updateSuccess(userData));
                }
                fetchUser();
                }
            } catch (error) {
                dispatch(updateFailure())
                setErrorMessage(error.message)
            }
        }
    }
    const handleSignOut=async ()=>{
      try {
        const res =await fetch(`/api/user/signout`,{
          method:'POST'
        })
        const data = await res.json()
        if(!res.ok){
          console.log(data.message)
        }else{
          dispatch(signOutSuccess())
          setOpenDropdown(false)
        }
      } catch (error) {
        console.log(error)
      }
    }

    return (

            <nav className={`fixed top-0 left-0 w-full flex items-center 
            justify-between px-4 md:px-16 lg:px-24 xl:px-32 transition-all duration-500 
            z-50 ${isScrolled ? "bg-white/80 shadow-md text-gray-700 backdrop-blur-lg py-3 md:py-4" 
            : "py-4 md:py-6"}`}>

                {/* Logo */}
                <Link to='/'>
                    <img src={assets.logo} alt="logo" className={`h-9 ${isScrolled && "invert opacity-80"}`} />
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-4 lg:gap-8">
                    {navLinks.map((link, i) => (
                        <a key={i} href={link.path} className={`group flex flex-col gap-0.5 ${isScrolled ? "text-gray-700" : "text-white"}`}>
                            {link.name}
                            <div className={`${isScrolled ? "bg-gray-700" : "bg-white"} h-0.5 w-0 group-hover:w-full transition-all duration-300`} />
                        </a>
                    ))}
                  {  
                     currentUser &&
                    (( currentUser.isHotelOwner  ||  hotelData.userId === currentUser._id) ? (
                   <button 
                   onClick={() => {
                        navigate('/owner');
                    
                    }}
                   className={`border px-4 py-1 text-sm font-light ${isScrolled ? "text-gray-700" : "text-white"} rounded-full cursor-pointer transition-all`}>
                        Dashboard
                    </button>
                ) :
                     (
                   !isScrolled &&
                     <button
                       onClick={() => {
                           setShowRegForm(true)
                        
                        }}
                     className={`border px-4 py-1 text-sm font-light ${isScrolled ? "text-gray-700" : "text-white"} rounded-full cursor-pointer transition-all`}>
                        List your hotel
                    </button>
                    
                    ))}
                </div>

                {/* Desktop Right */}
                <div className="hidden md:flex items-center gap-4">
                   <img src={assets.searchIcon} alt="Search" 
                   className={`${isScrolled && 'invert'} h-7 transition-all duration-500`} />
                    <button className='w-12 h-10 text-center sm:inline md:ml-3' 
                     onClick={()=>dispatch(toggleTheme())}
                      >
                        {theme==='light' ? <FaMoon /> : <FaSun /> }
                    </button>
                 { currentUser ? (
                    
                    
                      <Avatar alt="Remy Sharp" 
                        src={currentUser.profilePicture}
                        onClick={()=>setOpenDropdown(!openDropdown)}
                        />
                 )
                 : 
                 (
                     <Link to='/signin'>
                    <button
                    className="bg-black text-white px-8 py-2.5 rounded-full 
                    ml-4 transition-all duration-500">
                        Sign in
                    </button>
                    </Link>
                 )
                }  
                  
                 </div>
               
                { /*Drop dpwn menu */}
            { openDropdown && currentUser &&
                 <div className="drop-menu-wrap bg-gray-200 rounded-lg">
                    <div className="drop-menu-item p-5 m-2.5">
                        <div className="user-info flex items-center">
                            <Avatar src={currentUser.profilePicture || userData.profilePicture} className="w-10 h-10 rounded-full mr-3" alt="profile picture" />
                            <h2 className="font-bold overflow-hidden">{currentUser.username || userData.username}</h2>
                        </div>
                        <hr className="border-none bg-gray-400 mt-1.5"></hr>
                        <div className="flex flex-col gap-4 mt-5">
                       <Link to={( currentUser.isHotelOwner || hotelData.userId === userData._id)? '/owner/profile' : '/profile'} 
                       onClick={()=>setOpenDropdown(false)}>
                        <div className="flex items-center gap-2 justify-baseline hover:bg-gray-300 px-3 py-2 rounded-lg">
                            <span><AiFillProfile className="h-9 w-9 p-1 bg-gray-300 rounded-full"/></span>
                            <p>Manage Account</p>
                            <span><AiOutlineArrowRight /></span>
                        </div>
                        </Link>
                        <div className="flex items-center gap-2 justify-baseline
                         hover:bg-gray-300 px-3 py-2 rounded-lg cursor-pointer"
                           onClick={handleSignOut}
                           >
                            <span><AiOutlineLogout className="h-9 w-9 p-1 bg-gray-300 rounded-full" /></span>
                            <p>Sign Out</p>
                            <span><AiOutlineArrowRight /></span>
                        </div>
                        </div>
                    </div>
                  </div>
                 }
                {/* Mobile Menu Button */}
                
                <div className="flex items-center gap-4 md:hidden">
                    <button className='w-12 h-10 text-center sm:inline ml-3' 
                     onClick={()=>dispatch(toggleTheme())}
                      >
                        {theme==='light' ? <FaMoon /> : <FaSun /> }
                    </button>
                   {
                      currentUser && <Avatar alt="Remy Sharp" 
                      src={currentUser.profilePicture} 
                      onClick={()=>setOpenDropdown(!openDropdown)}
                      />
                   }
                   <img src={assets.menuIcon} alt="menu_icon" 
                   onClick={() => setIsMenuOpen(!isMenuOpen)}
                   className={`${isScrolled && 'invert'} h-4`} />
                  
                </div>

                {/* Mobile Menu */}
                <div className={`fixed top-0 left-0 w-full h-screen bg-white text-base flex flex-col md:hidden items-center justify-center gap-6 font-medium text-gray-800 transition-all duration-500 ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
                    <button className="absolute top-4 right-4" onClick={() => setIsMenuOpen(false)}>
                    <img src={assets.closeIcon} alt="close_icon" className='h-6.5' />
                    </button>
                    
                    {navLinks.map((link, i) => (
                        <a key={i} href={link.path} onClick={() => setIsMenuOpen(false)}>
                            {link.name}
                        </a>
                    ))}
                 
               {  
                     currentUser &&
                    (( currentUser.isHotelOwner  ||  hotelData.userId === currentUser._id) ? (
                   <button 
                   onClick={() => {
                        navigate('/owner');
                        setIsMenuOpen(false);
                    }}
                   className={`border px-4 py-1 text-sm font-light ${isScrolled ? "text-gray-700" : "text-black"} rounded-full cursor-pointer transition-all`}>
                        Dashboard
                    </button>
                ) :
                     (
                   !isScrolled &&
                     <button
                       onClick={() => {
                           setShowRegForm(true)
                           setIsMenuOpen(false);
                        }}
                     className={`border px-4 py-1 text-sm font-light ${isScrolled ? "text-gray-700" : "text-black"} rounded-full cursor-pointer transition-all`}>
                        List your hotel
                    </button>
                    
                    ))}
                    { !currentUser && 
                       <Link to='/signin'>
                    <button
                    className="bg-black text-white px-8 py-2.5 rounded-full 
                    ml-4 transition-all duration-500">
                        Sign in
                    </button>
                    </Link>
                        }
                </div>
                { showRegForm && !currentUser.isHotelOwner && !isScrolled &&
                 <div className='md:px-8 fixed top-0 left-0 right-0 bottom-0 
                 flex items-center justify-center bg-black/70 z-100'>
                        <form className='flex bg-white rounded-xl max-w-3xl' 
                              onSubmit={handleSubmit}
                              >
                            <img src={assets.regImage} alt='reg-image'
                            className='w-1/2 rounded-xl hidden md:block' />
                            <div className='relative flex flex-col items-center md:w-1/2 p-8 md:p-10'>
                                <img src={assets.closeIcon} alt='close-icon'
                                  onClick={()=>setShowRegForm(false)}
                                className='absolute top-4 right-4 h-4 w-4 cursor-pointer' />
                                <p className='text-2xl font-semibold mt-6'>Register Your Hotel</p>
                                <div className='w-full mt-4'>
                                  <label htmlFor='name' className='font-medium text-gray-500' >
                                    Hotel Name
                                  </label>
                                  <input type='text' id='name' placeholder='Type here'
                                   className='border border-gray-200 rounded w-full px-3 
                                              py-2.5 mt-1 outline-indigo-500 font-light'
                                              onChange={handleChange} required/>
                                </div>
                                {/*Phone*/}
                                <div className='w-full mt-4'>
                                  <label htmlFor='contact' className='font-medium text-gray-500' >
                                    Phone
                                  </label>
                                  <input type='text' id='contact' placeholder='Type here'
                                   className='border border-gray-200 rounded w-full px-3 
                                              py-2.5 mt-1 outline-indigo-500 font-light' 
                                              onChange={handleChange} required/>
                                </div>
                                {/*Address*/}
                                <div className='w-full mt-4'>
                                  <label htmlFor='address' className='font-medium text-gray-500' >
                                    Address
                                  </label>
                                  <input type='text' id='address' placeholder='Type here'
                                   className='border border-gray-200 rounded w-full px-3 
                                              py-2.5 mt-1 outline-indigo-500 font-light' 
                                              onChange={handleChange} required/>
                                </div>
                                {/*Select city drop down*/}
                                <div className='w-full max-w-60 mt-4 mr-auto'>
                                    <label htmlFor='city' className='font-medium text-gray-500'>
                                        City
                                    </label>
                                    <select id='city' className='border border-gray-200 rounded w-full px-3 py-2.5 mt-1
                                                               outline-indigo-500 font-light'
                                                                onChange={handleChange} required>
                                        <option value=''>Select City</option>
                                        {cities.map((city) => (
                                            <option key={city} value={city}>
                                                {city}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <button className='bg-indigo-500 hover:bg-indigo-600 transition-all text-white mr-auto
                                                      px-6 py-2 rounded cursor-pointer mt-6'>
                                  {
                                     loading ? (
                                      <>
                                       <span className='pl-3'>Loading...</span>
                                      </>
                                     ) : 'Register'
                                  }
                                </button>
                                { errorMessage && (
                                            <Alert className='mt-2.5' variant="outlined" severity="error">
                                                             {errorMessage}
                                             </Alert>
                                            )
                                 }
                            </div>

                        </form>
                    </div>
                   }
            </nav>
        
    );
}

export default Navbar;