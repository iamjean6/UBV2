import { React,useEffect,useState } from 'react';
import Navbar from '../UI/navbar';
import { HiChevronDown } from "react-icons/hi";


const Hero = () => {
  return (
    <div id="Home" className='pt-24 font-barlow relative w-full h-dvh overflow-hidden bg-black isolate'>
      
       
       {/* 
       <div className='w-full bg-blue-900 h-12 relative z-20'>
       <div className='overflow-hidden w-full h-full flex items-center'>
     <div className="flex items-center gap-8 whitespace-nowrap ticker-track">
  
  <span className="text-orange-500 text-xl font-bold uppercase tracking-wide">
    GOD
  </span>
  <span className="text-white/40">•</span>
  <span className="text-orange-500 text-xl font-bold uppercase tracking-wide">
    FAMILY
  </span>
  <span className="text-white/40">•</span>
  <span className="text-orange-500 text-xl font-bold uppercase tracking-wide">
    CAREER
  </span>
  <span className="text-white/40">•</span>
  <span className="text-orange-500 text-xl font-bold uppercase tracking-wide">
    FRIENDSHIP
  </span>
  <span className="text-white/40">•</span>
  <span className="text-orange-500 text-xl font-bold uppercase tracking-wide">
    BASKETBALL
  </span>

  {/* Second set (duplicate) 
  <span className="text-orange-500 text-xl font-bold uppercase tracking-wide ml-8">
    GOD
  </span>
  <span className="text-white/40">•</span>
  <span className="text-orange-500 text-xl font-bold uppercase tracking-wide">
    FAMILY
  </span>
  <span className="text-white/40">•</span>
  <span className="text-orange-500 text-xl font-bold uppercase tracking-wide">
    CAREER
  </span>
  <span className="text-white/40">•</span>
  <span className="text-orange-500 text-xl font-bold uppercase tracking-wide">
    FRIENDSHIP
  </span>
  <span className="text-white/40">•</span>
  <span className="text-orange-500 text-xl font-bold uppercase tracking-wide">
    BASKETBALL
  </span>
</div>

            </div> 
         </div>
        */}
     
       
       
      <div
      className='absolute inset-0 bg-cover bg-center bg-no-repeat'>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/80 z-10"></div>

        <video
          src="/videos/hero2.mov"
          autoPlay
          muted
          playsInline
          loop
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 z-20 flex items-center justify-center">
  <div className="flex flex-col mt-20 items-center text-center px-6 max-w-5xl -translate-y-10">
    
    <h1 className="text-white  font-extrabold text-6xl uppercase sm:text-6xl md:text-6xl lg:text-7xl leading-tight mb-3">
      Play With Purpose
    </h1>

    <p className="text-white/80 text-2xl md:text-3xl max-w-xl mb-5">
       Building disciplined athletes for life and sport.
    </p>

    
    <button className="bg-transparent text-lg border-1 border-orange  hover:text-white hover:cursor-pointer text-orange-500 font-semibold uppercase tracking-wide px-8 py-4 rounded-md transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02]">
      Join The Urbanville Fan Club
    </button>
  </div>
</div>

      </div>
      <a
  href="#about"
  className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center text-white/70 hover:text-white transition"
>
  <HiChevronDown className="text-5xl animate-bounce" />
</a>

    </div>
  );
};

export default Hero;