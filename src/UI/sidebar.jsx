import { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import {
  HiOutlineX,
  HiUser
} from "react-icons/hi";

import { BanknoteArrowUp, CalendarClock, FileUser, House, NotebookPen, PhoneCall, Shirt, Spotlight } from "lucide-react";

const Sidebar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 uppercase text-2xl md:text-4xl font-zentry font-semibold
     transition-colors duration-300
     hover:text-black ${
       isActive ? "text-orange-600" : "text-white"
     }`;

  return (
    <>
      
      {/*<div className="fixed top-1 right-0 z-50"></div>*/}
        <div className=" p-2">
          <GiHamburgerMenu
            onClick={() => setIsMenuOpen(true)}
            className="text-black text-5xl p-2 cursor-pointer hover:text-white transition-colors duration-300"
          />
        </div>
      

      <div
        className={`fixed top-0 left-0 h-screen w-72 md:w-96 z-40
        bg-blue-700/90 backdrop-blur-sm rounded-r-lg
        transform transition-transform duration-300 ease-in-out
        ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Close button */}
        <HiOutlineX
          onClick={() => setIsMenuOpen(false)}
          className="absolute top-4 right-4 text-2xl text-white cursor-pointer hover:text-red-600 transition-colors duration-300"
        />

        {/* Nav links */}
        <div className="flex flex-col gap-6 px-10 py-6 mt-16">
          <NavLink to="/" className={linkClass}>
            <House/> Home
          </NavLink>

        <NavLink to="/aboutus" className={linkClass}>
            <FileUser /> About us
          </NavLink>
          <NavLink to="/programs" className={linkClass}>
            <Spotlight /> Programs
          </NavLink>

          <NavLink to="/blog" className={linkClass}>
            <NotebookPen /> Blog
          </NavLink>

          <NavLink to="/merch" className={linkClass}>
            <Shirt /> Shop
          </NavLink>

          <NavLink to="/games" className={linkClass}>
            <CalendarClock /> Games
          </NavLink>

          <NavLink to="/contactus" className={linkClass}>
            <PhoneCall /> Contact us
          </NavLink>

           <NavLink to="/contribution" className={linkClass}>
            <BanknoteArrowUp /> Donate
          </NavLink>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
