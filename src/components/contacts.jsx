import {
  CiLocationOn,
  CiUser,
  CiMail,
  CiPhone,
  CiChat1
} from "react-icons/ci";
import { User, Mail, PhoneCall, MessageCircleMore, Pencil, MapPin } from 'lucide-react';
import { FaPhoneAlt } from "react-icons/fa";
import { MdOutlineMailOutline } from "react-icons/md";
import React from "react";
import { TiLocationArrow } from "react-icons/ti";
 

const Contacts = () => {
  return (
    <section className="w-full bg-gray-50 py-24">
      <div className="max-w-7xl mx-auto px-6">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">

          {/* LEFT SIDE */}
          <div className="space-y-6">
            <p className="text-sm uppercase tracking-[0.2em] font-semibold opacity-70">
              Contact Us
            </p>

            <h1 className="text-4xl md:text-5xl font-extrabold uppercase leading-tight">
              Have questions? <br /> Get in touch!
            </h1>

            <p className="text-gray-500 max-w-md">
              Adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>

            <div className="space-y-6 pt-8">

              <div className="flex items-start gap-4">
                <MapPin className="text-2xl text-blue-500 mt-1" />
                <p className="text-gray-600">
                  P.O BOX 40100, Jomo Kenyatta Stadium, Kisumu
                </p>
              </div>

              <div className="flex items-center gap-4">
                <PhoneCall className="text-xl text-blue-500" />
                <p className="font-semibold text-lg">
                  +254723 866886
                </p>
              </div>

              <div className="flex items-center gap-4">
                <Mail className="text-xl text-blue-500" />
                <p className="text-gray-600">
                  urbanvillebasketball2021@gmail.com
                </p>
              </div>

            </div>
          </div>

          {/* RIGHT SIDE */}
          <div>
            <form className="grid grid-cols-2 gap-8">

              {/* Name */}
              <div className="relative">
                <User className="absolute left-0 top-1/2 -translate-y-1/2 text-orange-600 text-xl" />
                <input
                  type="text"
                  placeholder="Name"
                  className="w-full border-b border-gray-300 pl-8 pb-2 bg-transparent 
                  focus:outline-none focus:border-b-2 focus:border-lime-500 
                  transition-all duration-300"
                />
              </div>

              {/* Email */}
              <div className="relative">
                <Mail className="absolute left-0 top-1/2 -translate-y-1/2 text-orange-600 text-xl" />
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full border-b border-gray-300 pl-8 pb-2 bg-transparent 
                  focus:outline-none focus:border-b-2 focus:border-lime-500 
                  transition-all duration-300"
                />
              </div>

              {/* Phone */}
              <div className="relative">
                <PhoneCall className="absolute left-0 top-1/2 -translate-y-1/2 text-orange-600 text-xl" />
                <input
                  type="text"
                  placeholder="Phone"
                  className="w-full border-b border-gray-300 pl-8 pb-2 bg-transparent 
                  focus:outline-none focus:border-b-2 focus:border-lime-500 
                  transition-all duration-300"
                />
              </div>

              {/* Subject */}
              <div className="relative">
                <MessageCircleMore className="absolute left-0 top-1/2 -translate-y-1/2 text-orange-600 text-xl" />
                <input
                  type="text"
                  placeholder="Subject"
                  className="w-full border-b border-gray-300 pl-8 pb-2 bg-transparent 
                  focus:outline-none focus:border-b-2 focus:border-lime-500 
                  transition-all duration-300"
                />
              </div>

              {/* Textarea */}
              <div className="relative col-span-2">

                <textarea
                  rows="4"
                  placeholder="How can we help you? Feel free to get in touch!"
                  className="w-full border-b border-gray-300 pb-2 bg-transparent 
                  focus:outline-none focus:border-b-2 focus:border-lime-500 
                  transition-all duration-300 resize-none"
                />
              </div>

              
<div className="md:col-span-2 flex flex-col items-center space-y-6 pt-6">

  <button
    type="submit"
    className="bg-lime-500 flex items-center gap-2 text-white uppercase hover:cursor-pointer tracking-wider px-8 py-3 hover:bg-lime-600 transition"
  >
    <TiLocationArrow className='text-black'/>
    <span>Get in Touch</span>
  </button>

  <div className="flex items-center gap-2 text-sm text-gray-600">
    <input type="checkbox" className="accent-lime-500" />
    <p>I agree that my data is collected and stored.</p>
  </div>

</div>


            </form>
           
          </div>

        </div>
      </div>
    </section>
  );
};

export default Contacts;
