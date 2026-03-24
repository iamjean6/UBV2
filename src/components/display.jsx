import { useState} from 'react';

const Display = () => {
  return (
    <section className="min-h-screen w-full">
      
      {/* Full Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 h-full">   {/* LEFT — Large Feature */}
        <figure className="relative lg:col-span-3 overflow-hidden group cursor-pointer">
          
          <img
            src="/img/pic5.jpg"
            alt="Performance training"
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-500"></div>

          {/* Text */}
          <figcaption className="absolute bottom-8 left-8 text-white opacity-0 translate-y-6 group-hover:opacity-100 group-hover:translate-y-0 transition duration-500">
            <span className="text-sm uppercase tracking-widest text-gray-300">
              Category
            </span>
            <h3 className="text-3xl font-semibold mt-3">
              Performance Training
            </h3>
          </figcaption>

        </figure>

        {/* RIGHT — Supporting Grid */}
        <div className="lg:col-span-2 grid grid-cols-2 grid-rows-2 h-full">

          {/* Card 1 */}
          <figure className="relative overflow-hidden group cursor-pointer">
            <img
              src="/img/pic1.jpg"
              alt="Equipment"
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition duration-500"></div>
            <figcaption className="absolute bottom-6 left-6 text-white opacity-0 group-hover:opacity-100 transition duration-500">
              <h4 className="text-xl font-medium">Equipment</h4>
            </figcaption>
          </figure>

          {/* Card 2 */}
          <figure className="relative overflow-hidden group cursor-pointer">
            <img
              src="/img/pic.jpg"
              alt="Community"
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition duration-500"></div>
            <figcaption className="absolute bottom-6 left-6 text-white opacity-0 group-hover:opacity-100 transition duration-500">
              <h4 className="text-xl font-medium">Community</h4>
            </figcaption>
          </figure>

          {/* Card 3 */}
          <figure className="relative overflow-hidden group cursor-pointer">
            <img
              src="/img/pic3.jpg"
              alt="Technique"
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition duration-500"></div>
            <figcaption className="absolute bottom-6 left-6 text-white opacity-0 group-hover:opacity-100 transition duration-500">
              <h4 className="text-xl font-medium">Technique</h4>
            </figcaption>
          </figure>

          {/* Card 4 */}
          <figure className="relative overflow-hidden group cursor-pointer">
            <img
              src="/img/pic4.jpg"
              alt="Lifestyle"
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition duration-500"></div>
            <figcaption className="absolute bottom-6 left-6 text-white opacity-0 group-hover:opacity-100 transition duration-500">
              <h4 className="text-xl font-medium">Lifestyle</h4>
            </figcaption>
          </figure>

        </div>
      </div>
    </section>
  );
};

export default Display;

