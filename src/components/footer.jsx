import {
  Facebook,
  Twitter,
  Dribbble,
  Instagram,

  ShoppingCart,
  Image,
  Calendar,
  ArrowUp,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { MdWhatsapp } from "react-icons/md";

const Footer = () => {
  return (<>

    <div className="bg-black overflow-hidden py-3" aria-hidden="true">
      <div className="ticker-track flex whitespace-nowrap w-max">
        {Array.from({ length: 10 }).map((_, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-3 text-white uppercase tracking-[0.2em] text-[11px] px-6 flex-shrink-0 font-barlow"
          >
            GOD FAMILY CAREER FRIENDSHIP BASKETBALL
            <span className="opacity-50 text-[10px]">✦</span>
          </span>
        ))}
      </div>
    </div>
    <footer className="relative bg-black text-white pt-24 pb-10 px-6">

      <div className="max-w-7xl mx-auto">

        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16">

          {/* Column 1 */}
          <div>
            <div className="flex flex-row gap-4 items-center pb-4 ">
              <img src="/img/badge1.webp"
                alt=""
                className="h-16 w-16 rounded-full "
              />
              <h3 className="uppercase text-sm font-extrabold tracking-widest mb-6">
                Urbanville Basketball
              </h3>

            </div>

            <p className="text-gray-400 leading-7 max-w-xs">
              Inissimos ducimos qui blanditiis praesentium voluptatum deleniti.
            </p>
          </div>

          {/* Column 2 */}
          <div>
            <h3 className="uppercase text-sm font-extrabold tracking-widest mb-6">
              Address
            </h3>

            <p className="text-gray-400 leading-7 mb-6">
              P.O  BOX 40100— <br />
              Mamboleo,Kisumu , <br />
              KENYA
            </p>

            <p className="text-gray-400 underline underline-offset-4 mb-6">
              urbanvillebasketball2021@gmail.com
            </p>

            <p className="font-extrabold text-white text-lg">
              +254 723 866886
            </p>
          </div>

          {/* Column 3 */}
          <div>
            <h3 className="uppercase text-sm font-extrabold tracking-widest mb-6">
              Links
            </h3>

            <ul className="space-y-4 text-gray-400">
              {[
                { name: "Home", path: "/" },
                { name: "About Us", path: "/aboutus" },
                { name: "Programs", path: "/programs" },
                { name: "Blog", path: "/blog" },
                { name: "Shop", path: "/merch" },
                { name: "Schedule", path: "/games" },
                { name: "Contact Us", path: "/contactus" },
              ].map((link) => (
                <li key={link.name}>
                  <NavLink
                    to={link.path}
                    className="hover:text-white transition duration-200"
                  >
                    {link.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 */}
          <div>
            <h3 className="uppercase text-sm font-extrabold tracking-widest mb-6">
              Get In Touch
            </h3>

            <ul className="space-y-4 text-gray-400">
              <li className="flex items-center gap-4 hover:text-white transition cursor-pointer">
                <Facebook size={16} />
                <a href="https://www.facebook.com/urbanvillesports" target="_blank" rel="noopener noreferrer">
                  Facebook
                </a>
              </li>
              <li className="flex items-center gap-4 hover:text-white transition cursor-pointer">
                <Twitter size={16} />
                Twitter
              </li>
              <li className="flex items-center gap-4 hover:text-white transition cursor-pointer">
                <MdWhatsapp size={16} />
                <a href="#">WhatsApp</a>
              </li>
              <li className="flex items-center gap-4 hover:text-white transition cursor-pointer">
                <Instagram size={16} />
                <a href="https://www.instagram.com/urbanvillesports_047?igsh=YjB5ZXk4d2czenV4" target="_blank">Instagram</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-20 border-t border-gray-800 relative">

          {/* Small white dot on divider */}
          <span className="absolute -top-2 left-0 w-3 h-3 bg-white rounded-full"></span>

          <div className="pt-8 flex justify-center items-center">
            <p className="text-gray-500 text-sm">
              Urbanville Basketball © {new Date().getFullYear()} All Rights Reserved.
            </p>

            {/* Scroll Top Button 
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="bg-[#1a1a1a] hover:bg-[#2a2a2a] p-4 transition"
            >
              <ArrowUp size={18} />
            </button>
            */}
          </div>
        </div>
      </div>

    </footer>
  </>

  );
};

export default Footer;
