import React from "react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate()
  const goToAbout = () => {
    navigate("/aboutus")
  }
  return (
    <section id="about" className="relative overflow-hidden min-h-screen overflow-hidden bg-neutral-100">



      <div className="absolute inset-y-0 right-0 w-full lg:w-[60%] bg-neutral-900 z-0"></div>


      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 py-10 lg:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">


          <div className="relative flex gap-6 justify-center lg:justify-start">
            <div className="relative z-20 relative z-10 w-64 sm:w-72 md:w-88 h-80 sm:h-[28rem] md:h-[36rem] 
                            overflow-hidden rounded-xl shadow-xl translate-y-8">
              <img
                src="img/about1.webp"
                alt="Squash action shot"
                className="w-full h-full object-cover"
              />
            </div>


            <div className="relative z-10 w-64 sm:w-72 md:w-88 h-80 sm:h-[28rem] md:h-[36rem] 
                            overflow-hidden rounded-xl shadow-2xl">
              <img
                src="img/about2.webp"
                alt="Coach training player"
                className="w-full h-full object-cover"
              />
            </div>

          </div>


          <div className="flex flex-col gap-6 max-w-xl text-white">

            <span className="text-sm uppercase tracking-widest text-blue-800 font-semibold">
              ABOUT  US
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight">
              We Make  You Become <br />
              a <span className="text-lime-400">Squash Pro</span>
            </h1>

            <p className="text-base sm:text-lg text-white/70 leading-relaxed">
              Dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas
              sit aspernatur aut odit aut fugit sed quia.
            </p>

            <ul className="flex flex-col gap-3 mt-2">
              <li className="flex items-center gap-3 text-white/90">
                <span className="text-blue-400">✔</span>
                We over me
              </li>
              <li className="flex items-center gap-3 text-white/90">
                <span className="text-blue-400">✔</span>
                Process over results
              </li>
              <li className="flex items-center gap-3 text-white/90">
                <span className="text-blue-400">✔</span>
                Serving over self-focused
              </li>
              <li className="flex items-center gap-3 text-white/90">
                <span className="text-blue-400">✔</span>
                Learning over stubbornness
              </li><li className="flex items-center gap-3 text-white/90">
                <span className="text-blue-400">✔</span>
                Encouragement over negativity
              </li><li className="flex items-center gap-3 text-white/90">
                <span className="text-blue-400">✔</span>
                Teamwork over individual needs
              </li>
              <li className="flex items-center gap-3 text-white/90">
                <span className="text-blue-400">✔</span>
                Communication over assumption
              </li>
            </ul>

            <div className="mt-6">
              <button
                onClick={goToAbout}
                className="bg-transparent border-1 text-neutral-white font-semibold 
                                 px-8 py-4 rounded-lg 
                                 hover:bg-orange-600 hover:cursor-pointer transition-colors duration-300">
                Learn More
              </button>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
