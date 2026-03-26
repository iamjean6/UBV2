import { useEffect } from 'react';
import Button from './button';
import { TiLocationArrow } from 'react-icons/ti';
import { Link } from 'react-router-dom';
const Team = () => {
  return (
    <div className='min-h-screen bg-black w-full py-24 px-4'>
      <div className='max-w-7xl mx-auto'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 items-center'>
          <div className='overflow-hidden bg-gray-100 h-full'>
            <img src="/img/Mark.webp"
              className='w-full h-[550px] object-cover overflow-hidden rounded-sm'
              alt="" srcset="" />
          </div>
          <div className='flex flex-col justify-center space-y-6'>
            <div className='space-y-2'>
              <p className='text-sm uppercase tracking-widest text-gray-500'>
                Power Forward/ Center
              </p>
              <h2 className='text-3xl lg:text-4xl font-extrabold text-blue-600'>
                Mark Obondi
              </h2>
            </div>
            <div className='flex items-center gap-3 text-blue-600'>
              <span className="text-lg text-white leading-relaxed">24 years</span>
              <span>|</span>
              <span className="text-lg text-white leading-relaxed"> 6 ft 4In</span>
              <span>|</span>
              <span className="text-lg text-white leading-relaxed"> 87kg</span>

            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                Player Biography
              </h3>

              <p className="text-white leading-relaxed">
                Lorem ipsum dolor sit amet, vis an altera torquatos, vel assum nostrum
                eleifend at. Choro posidonium vix et, ei mei iisque antiopam comprehensam.
                Putent repudiandae ei sed, eu vis accusamus sadipscing mea.
              </p>
            </div>

            <div className='flex items-center gap-2'>

              <Link to="/roster">
                <Button
                  id="Meet the Team"
                  title="Meet the Team"
                  leftIcon={<TiLocationArrow />}
                  containerClass="
          inline-flex items-center justify-center 
          px-8 py-4 
          !bg-white/90
          text-black 
          font-bold 
          !rounded-xs
          shadow-lg 
          gap-2 
          !hover:bg-green-300 
          transition
            "
                />
              </Link>
            </div>
          </div>
        </div>

      </div>
      <div className='flex items-center justify-center py-8'>




      </div>
    </div>
  );
};

export default Team;