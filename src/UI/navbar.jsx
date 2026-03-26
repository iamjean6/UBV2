import { React, useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Coins, LogIn, ShoppingCart } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleStatusTab } from '../store/cart'
import Sidebar from './sidebar';
const Navbar = () => {

  const location = useLocation()
  const navigate = useNavigate()

  const isHome = location.pathname === "/"
  const [totalQuantity, setTotalQuantity] = useState(0)
  const dispatch = useDispatch()
  const handleOpenTabCart = () => {
    console.log("Cart clicked")
    dispatch(toggleStatusTab())
  }
  const carts = useSelector(store => store.cart.items)
  const navbarBg = isHome ? "bg-transparent" : "bg-blue-800 shadow-md";
  const textColor =
    isHome
      ? "text-white"
      : "text-white";

  const linkClass = ({ isActive }) =>
    ` text-2xl font-bold uppercase font-zentry tracking-wider hover:text-white transition-colors
        ${isActive ? 'text-orange-600'
      : isHome
        ? "text-white/80"
        : "text-black"
    }`;
  useEffect(() => {
    let total = 0
    carts.forEach(items => total += items.quantity)
    setTotalQuantity(total)
  }, [carts])
  const handleLogoClick = () => {
    navigate("/easter")
  }
  return (
    <nav className={`w-full z-50 transition-all duration-300   ${isHome ? "absolute top-0 left-0" : "relative"} ${navbarBg}`}>

      <div className=" mx-auto px-4 sm:px-6 text-black lg:px-8">
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3 px-2 py-4 ' onClick={handleLogoClick}>
            <img src="/img/badge1.webp" alt="Urbanville Logo"
              className='w-15 h-15 bg-white rounded-full flex-shrink-0'
            />
            <p className={`hidden md:block  font-zentry text-xl font-bold uppercase tracking-wide ${textColor}`}>
              Urbanville Basketball
            </p>
          </div>
          <div className='hidden lg:flex text-sm text-white items-center gap-4 flex-1 justify-center'>
            <NavLink to="/" className={linkClass}>
              Home
            </NavLink>

            <NavLink to="/aboutus" className={linkClass}>
              About Us
            </NavLink>
            <NavLink to="/programs" className={linkClass}>
              Programs
            </NavLink>

            <NavLink to="/blog" className={linkClass}>
              Blog
            </NavLink>

            <NavLink to="/merch" className={linkClass}>
              Shop
            </NavLink>
            <NavLink to="/games" className={linkClass}>
              Schedule
            </NavLink>
            <NavLink to="/contactus" className={linkClass}>
              Contact Us
            </NavLink>
          </div>
          <div className='flex items-center gap-4'>

            <Coins className='text-3xl text-white hover:cursor-pointer' />
            <div className=' rounded-full flex justify-center items items-center relative'>
              <button className='hover:cursor-pointer' onClick={handleOpenTabCart}>
                <ShoppingCart className="text-3xl text-white" />
              </button>
              <span className='absolute top-2/3 right-1/4 bg-red-500 text-black text-sm w-5 h-5
                rounded-full flex justify-center items-center'>{totalQuantity}</span>
            </div>
            <div className='lg:hidden'>
              <Sidebar />
            </div>



          </div>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;