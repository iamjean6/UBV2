
import {useState} from "react";
import { values } from "../../constants";
import { ChevronDownIcon, ChevronUpIcon,Handshake,Lightbulb, Star, UsersRound } from "lucide-react";
import { principles } from "../../constants";
const Aboutus = () => {
    
    const [activeId, setActiveId] = useState(null);
    const iconMap = {
  community: <UsersRound />,
  innovation: <Lightbulb />,
  legendary: <Star />,
  teamwork: <Handshake />,
};
  
    return (
    <div id="aboutus" className="w-full bg-gray-100">
      <div className="w-full mx-auto  py-20">
         <h1 className="text-[90px] md:text-[120px] px-6 md:px-12 leading-[0.8] tracking-tight font-zentry uppercase">
              About
            </h1>
        {/* ================= HERO SECTION ================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start pb-16">

          {/* LEFT COLUMN */}
          <div className="flex flex-col px-6 md:px-12">
           
            <h1 className="text-[90px] md:text-[120px] leading-[0.8] tracking-tight font-zentry uppercase">
              Us
            </h1>

            <p className="mt-8 text-sm text-gray-700 max-w-xs">
              Luxurious Interior and Industrial Design
            </p>
            <p className="mt-4 text-sm text-gray-700 max-w-xs">
              Modern Elegance: Designs featuring clean lines,
              neutral palettes, and high-quality materials.
            </p>
          </div>

          {/* CENTER IMAGE */}
          <div>
            <img
              src="/img/pic1.jpg"
              alt="Interior Design"
              className="rounded-3xl w-full h-[420px] object-cover"
            />
          </div>

          {/* RIGHT PHILOSOPHY */}
          <div className="flex flex-col px-6 md:px-12 ">
            <img
              src="/img/pic1.jpg"
              alt="Philosophy"
              className="rounded-3xl w-full h-[200px] object-cover"
            />

            <h3 className="mt-6 text-2xl font-semibold">
              Our Philosophy
            </h3>

            <p className="mt-4 text-sm text-gray-700">
              At Britto Charette, we believe in creating luxurious,
              personalized environments that reflect our clients'
              tastes and lifestyles.
            </p>
          </div>

        </div>

       {/* ================= WHO WE ARE SECTION ================= */}
<div className="w-full">

  {/* TOP FULL WIDTH IMAGE */}
  <div className="relative w-full h-[400px]">
    <img
      src="/img/pic1.jpg"
      alt="Who We Are"
      className="w-full h-full object-cover"
    />

    {/* Overlay Content */}
    <div className="absolute inset-0 bg-black/40 flex items-start justify-start">
      <div className="text-white max-w-xl px-4 py-8">
        <h2 className="text-3xl font-bold">
          Who We Are
        </h2>
        <p className="text-sm">
          We are Jakarta's leading sports community platform,
          connecting athletes, hobbyists, and everyday movers
          across the city.
        </p>
      </div>
    </div>
  </div>

  {/* BOTTOM TWO COLUMN SECTION */}
  <div className="grid grid-cols-1 md:grid-cols-2  ">

    {/* LEFT SIDE */}
    <div className="relative h-[350px]">
      <img
        src="/img/pic.jpg"
        alt="Our Mission"
        className="w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-black/50 flex items-start justify-start">
        <div className="text-white max-w-md px-4 py-8">
          <h3 className="text-2xl font-bold">
            Our Mission
          </h3>
          <p className="text-sm">
            To energize Jakarta through sports, community,
            and meaningful movement.
          </p>
        </div>
      </div>
    </div>

    {/* RIGHT SIDE */}
    <div className="relative h-[350px]">
      <img
        src="/img/pic1.jpg"
        alt="Why We Exist"
        className="w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-black/40 flex items-start justify-start">
        <div className="text-white max-w-md px-4 py-8">
          <h3 className="text-2xl font-bold">
            Why We Exist
          </h3>
          <p className="text-sm">
            Jakarta is full of energy, yet finding sports
            activities and communities is still confusing.
          </p>
        </div>
      </div>
    </div>

  </div>

</div>

        {/* ================= OUR SERVICES ================= */}
        <div className="mt-32 px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-20">

          {/* LEFT SIDE */}
          <div>
            <h2 className="text-5xl font-bold tracking-tight">
              Our Services
            </h2>

            <p className="mt-6 text-gray-700 max-w-md">
              At Britto Charette, we offer a comprehensive range of
              services to bring your interior design vision to life.
              Each service is tailored to meet the unique needs of
              our clients.
            </p>

            <img
              src="/img/pic1.jpg"
              alt="Services"
              className="mt-10 rounded-3xl w-full h-[400px] object-cover"
            />
          </div>

          {/* RIGHT SIDE */}
          <div className="space-y-12">

            <div>
              <h3 className="text-xl font-bold uppercase">
                Space Planning
              </h3>
              <p className="mt-3 text-gray-600 text-sm">
                We create efficient layouts to maximize the use of
                space. Every design is crafted with attention to detail.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold uppercase">
                Interior Design
              </h3>
              <p className="mt-3 text-gray-600 text-sm">
                From concept development to final installation, we
                handle all aspects of interior decoration.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold uppercase">
                Custom Furniture Design
              </h3>
              <p className="mt-3 text-gray-600 text-sm">
                We design and craft unique furniture pieces tailored
                to specific client needs.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold uppercase">
                Project Management
              </h3>
              <p className="mt-3 text-gray-600 text-sm">
                We oversee the entire design process, ensuring projects
                are completed on time and within budget.
              </p>
            </div>

          </div>

        </div>
     <div className="py-14 px-6">
      <h2 className="text-center text-3xl font-bold text-gray-900 mb-10">
        Our Core Values
      </h2>
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">

        {values.map((value) => {
          const isActive = activeId === value.id;

          return (
            <div
              key={value.id}
              className="relative h-96 overflow-hidden"
            >
              {isActive ? (
                <div className="h-full bg-white flex flex-col items-center justify-between px-6 py-8 border-t-4 border-blue-600">
                  <div className="text-orange-600 [&_svg]:w-16 [&_svg]:h-16 [&_svg]:stroke-1">
                    {iconMap[value.id]}
                  </div>
                  <h3 className="text-lg font-extrabold tracking-widest text-blue-800 text-center">
                    {value.label}
                  </h3>
                  <p className="text-sm text-gray-600 text-left leading-relaxed">
                    {value.description}
                  </p>
                  <button
                    onClick={() => setActiveId(null)}
                    className="mt-2 flex items-center justify-center hover:cursor-pointer"
                    aria-label="Collapse"
                  >
                    <ChevronDownIcon />
                  </button>

                </div>
              ) : (
                
                <div className="relative h-full w-full group cursor-pointer">
                  <img
                    src={value.bg}
                    alt={value.label}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-black/60 group-hover:bg-black/70 transition-colors duration-300" />
                  <div className="relative z-10 h-full flex flex-col items-center justify-between py-10 px-4">

                    <div className="text-white [&_svg]:w-16 [&_svg]:h-16 [&_svg]:stroke-1">
                        {iconMap[value.id]}
                        </div>

                    <h3 className="text-xl font-extrabold tracking-widest text-orange-600 text-center">
                      {value.label}
                    </h3>
                    <button
                      onClick={() => setActiveId(value.id)}
                      className="flex flex-col items-center gap-1 animate-bounce text-white text-sm font-medium hover:cursor-pointer "
                      aria-label={`Learn more about ${value.label}`}
                    >
                      <ChevronUpIcon />
                      <span>Learn More</span>
                    </button>

                  </div>
                </div>
              )}
            </div>
          );
        })}

      </div>
    </div>
    <div className="py-4 px-10">
        <div>
            <div className="border-t w-24 border-blue-800 "></div>
            <div className="py-3 lg:max-w-4xl ">
                <p className="text-sm md:text-lg uppercase pb-4 text-blue-800 font-extrabold">
                    Urbanville to the world
                </p>
                <h1 className="text-black text-3xl md:text-5xl  font-black uppercase">
                    Our principles are foundational
                </h1>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 px-4 py-8">
                 {principles.map((principle) => (
        <div
          key={principle.id}
          className="flex gap-4 items-start p-6"
        >
          
          <div className="border border-gray-400 bg-gray-200 px-5 rounded-xs py-5 shrink-0">
            <span className="text-3xl italic font-black font-industry">{principle.id}</span>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="text-2xl leading-tight  uppercase text-orange-600 font-black leading-tight">
              {principle.title}
            </h3>
            <p className="text-lg text-gray-500 leading-relaxed">
              {principle.description}
            </p>
            
          </div>
        </div>
      ))}
            </div>
        </div>
    </div> 
     
      </div>
    </div>
  );
};

export default Aboutus;
