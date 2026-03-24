import { useState } from 'react';
import {Volume2} from 'lucide-react'
const Coachescard = ({staff}) => {
const handlePlayAudio = () => {
  const audio = new Audio(staff.audio);
  audio.play();
};
  return (
    <div className='w-full font-barlow rounded-xl shadow-md overflow-hidden border border-gray-200'>
      <div className='flex items-center gap-2'>
        <div className='w-1/2'>
            <img src={staff.img} 
            className='h-64 object-contain '
            />
        </div>
        <div className='space-y-2 w-1/2'>
        <div  className='leading-tight'>
          <p className='text-lg font-normal '>{staff.firstName}</p>
          <p className='text-2xl  font-bold ' >{staff.lastName}</p>
        </div>
        <p className='text-lg text-gray-600 uppercase'>
            {staff.position}
        </p>
        <button className='hover:cursor-pointer' 
        onClick={handlePlayAudio}
        >
        <Volume2 className='text-sm text-orange-600' />
        </button>
        </div>
      </div>
    </div>
  );
};

export default Coachescard;