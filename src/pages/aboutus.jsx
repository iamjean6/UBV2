import { useState } from "react";
import { values } from "../../constants";
import { ChevronDownIcon, ChevronUpIcon, Handshake, Lightbulb, Star, UsersRound } from "lucide-react";
import { principles } from "../../constants";
import ImageComponent from "../UI/imagecomponent";
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

            <p className="mt-8 text-lg font-Barlow text-gray-700 max-w-xs">
              Urbanville Community CBO is a grassroots organization dedicated to transforming
              lives through sports-based development. We believe in the transformative potential of 
              athletics to nurture talent, instill discipline, and open doors to personal growth. Our 
              programs yarget undeserved youth aged 12-25, combining sports excellence with education ,
              mentorship, and  community engagement.
            </p>
            
          </div>

          {/* CENTER IMAGE */}
          <div>
            <ImageComponent
              src="/img/oliver.webp"
              alt="Oliver"
              className="rounded-3xl w-full h-[420px] object-cover"
              
            />
          </div>

          {/* RIGHT PHILOSOPHY */}
          <div className="flex flex-col px-6 md:px-12 ">
            <ImageComponent
              src="/img/about.webp"
              alt="Philosophy"
              className="rounded-3xl w-full h-[200px] object-cover"
              
            />

            <h3 className="mt-6 text-5xl font-semibold font-zentry">
              Our Ethos
            </h3>
            <ol className= "list-decimal list-inside space-y-1 mt-4 text-lg text-gray-700">
              <li>God</li>
              <li>Family</li>
              <li>Career</li>
              <li>Friendship</li>
              <li>Basketball</li>
            </ol>
           
          </div>

        </div>

        {/* ================= WHO WE ARE SECTION ================= */}
        <div className="w-full">

          {/* TOP FULL WIDTH IMAGE */}
          <div className="relative w-full h-[400px]">
            <ImageComponent
              src="/img/pic1.webp"
              alt="Who We Are"
              className="w-full h-full object-cover"
              
            />

            {/* Overlay Content */}
            <div className="absolute inset-0 bg-black/40 flex items-start justify-start">
              <div className=" max-w-xl px-4 py-8">
                <h2 className="text-4xl font-bold text-white ">
                  Our Vision
                </h2>
                <p className="text-lg text-white">
                 Urbanville Basketball Program envisions impacting youth in the 
                 region through basketball as a tool to adding value beyond contemporary 
                 success.
                </p>
              </div>
            </div>
          </div>

          {/* BOTTOM TWO COLUMN SECTION */}
          <div className="grid grid-cols-1 md:grid-cols-2  ">

            {/* LEFT SIDE */}
            <div className="relative h-[350px]">
              <ImageComponent
                src="/img/camp1.webp"
                alt="Our Mission"
                className="w-full h-full object-cover"
                
              />

              <div className="absolute inset-0 bg-black/50 flex items-start justify-start">
                <div className=" max-w-md px-4 py-8">
                  <h3 className="text-4xl font-bold text-white">
                    Our Mission
                  </h3>
                  <p className="text-lg text-white">
                    Our mission is to grow and develop generations of confident and visionary
                    basketball players as leaders on and beyond the game of basketball. 
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="relative h-[350px]">
              <ImageComponent
                src="/img/content5.webp"
                alt="Why We Exist"
                className="w-full h-full object-cover"
                
              />

              <div className="absolute inset-0 bg-black/40 flex items-start justify-start">
                <div className="text-white max-w-md px-4 py-8">
                  <h3 className="text-4xl font-bold">
                    Values
                  </h3>
                <ol className= "list-decimal list-inside space-y-1 mt-1 text-xl" >
                  <li> Communication</li>
                  <li>Commitment</li>
                  <li>Consistency</li>
                  <li>Effort</li>
                  <li>Accountability</li>
                </ol>
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
              Our Motto
            </h2>

            <p className="mt-2 text-2xl  text-gray-700 max-w-md">
              Value beyond success
            </p>

            <ImageComponent
              src="/img/camp5.webp"
              alt="Services"
              className="mt-10 rounded-3xl w-full h-[400px] object-cover"
              
            />
          </div>

          {/* RIGHT SIDE */}
          <div className="space-y-6">
            <div>
              <h3 className=" text-4xl text-orange-500 font-bold leading-tight ">  
                Program Goals:
              </h3>
              <ol className="border-l-4 border-orange-500 pl-4 list-decimal list-inside space-y-4 mt-1 text-xl">
                <li> Add value to program participants by progressively developing skilled and impactful players and leaders through a structured Youth Basketball Player Development
                  curriculum based on both Qualitative and Quantitative training methodologies.
                </li>
                <li>
                  Link developing Players to Pathways and Opportunities for Athletic Scholarships in High Schools and Universities in Kenya, East Africa
                  and United States of America.
                </li>
                <li>
                  To Nurture and Develop visionary and impactful youth leaders in different spheres of
                  Basketball and Basketball Development.
                </li>
              </ol>
            </div>
          </div>

        </div>
        <div className="mt-14 px-12 md:px-24 grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-4">
            <h3 className="text-3xl font-black text-orange-600">
              <span className="text-blue-800">Program Membership</span> Categories
            </h3>
            <p className="text-xl leading-tight font-bold text-blue-800">1. Academy Players(KBL Season Roster)</p>
            <ul className="mt-2 list-disc pl-5 text-lg">
               <li>UBV Basketball</li>
               <li>
              Tritons Basketball
               </li>
            </ul>
            <p className="text-xl leading-tight font-bold text-blue-800">
              2. Camp Players (Season Roster)
            </p>
            <ul className="mt-2 list-disc pl-5 text-lg">
               <li>U16 Boys Team</li>
               <li>
               U18 Boys Team
               </li>
               <li>U16 Girls Team</li>
            </ul>
             <p className="text-xl leading-tight font-bold text-blue-800">
              3. Individual Training
            </p>
            <ul className="mt-2 list-disc pl-5 text-lg">
               <li>After school and weekends (Devt. Training)</li>
               <li>
               Custom Scheduled (Elite training)
               </li>
              
            </ul>
            <p className="text-xl leading-tight font-bold text-blue-800">
              4. Affiliate Player
            </p>
            <ul className="mt-2 list-disc pl-5 text-lg">
               <li>KBL Contracted Players</li>
               <li>
               Invitational Players
               </li>
              
            </ul><p className="text-xl leading-tight font-bold text-blue-800">
              5. Alumni membership
            </p>
            <ul className="mt-2 list-disc pl-5 text-lg">
               <li>Former players</li>
               <li>
               Current Program leaders
               </li>
               <li>
                Inactive/Semi-active players
               </li>
              
            </ul>
        <p className="text-xl leading-tight font-bold text-blue-800">
              6. Registration Requirements
            </p>

            <ol className=" list-[lower-roman] pl-5 space-y-1  text-lg">
               <li>Membership Registartion fee of Ks. 1,500/- (monthly Subscription as per Membership Category and Camp Charges apply )</li>
               <li>
              Player Details and relevant player documents (Link Registartion form)
               </li>
               <li>
                Try Out (Active players)
               </li>
               <li>
                Signed Parent Consent (Players below 18Yrs)
               </li>
               <li>
                Signed Contact Agreement(Non-Academy players) and/or Code of Conduct copy (All players above 18yrs)
               </li>
            </ol>
            <h4 className="text-xl mt-8 text-orange-600 font-black ">
              Program Calendar:
            </h4>
            <ol className="list-decimal list-inside space-y-1 mt-1 text-lg">
              <li> Teams Off-season - January to March</li>
              <li>Academy Teams season - April to December</li>
              <li> Div 2 National League Season - April to November</li>
              <li>Camp Training - April,August and November-December</li>
              <li>Individual training- January to December</li>
            </ol>
          </div>
        <div className="space-y-4">
  <h3 className="text-3xl font-black">
    <span className="text-blue-800">Program Culture and</span>{" "}
    <span className="text-orange-600">Traditions</span>
  </h3>

  {/* Program Training Days */}
  <div>
    <h4 className="text-xl font-bold text-blue-800">
      1. Program Training Days
    </h4>

    <ul className="mt-3 list-disc pl-6 space-y-1 text-gray-700">
      <li>
        Tuesday, Wednesday & Thursday:
        <ul className="mt-2 list-[circle] pl-6">
          <li>9:00 AM – 12:30 PM (Camp Training)</li>
          <li>4:30 PM – 7:30 PM (Team Training)</li>
        </ul>
      </li>

      <li>
        Monday, Friday & Weekends training sessions are scheduled on a need
        basis or as communicated by the coaching staff.
      </li>
    </ul>
  </div>

  {/* Practice Sessions */}
  <div>
    <h4 className="text-xl font-bold text-blue-800">
      2. Practice Sessions
    </h4>

    <ul className="mt-3 list-disc pl-6 space-y-1 text-gray-700">
      <li>
        <span className="font-semibold">Time Management:</span> All
        participants are expected to attend training on time and remain until
        completion. Lateness or early departure is only permitted with prior
        communication to team captains, coaches, and notification on the
        team's WhatsApp group at least 30 minutes before the session begins.
      </li>

      <li>
        Practice sessions are led by coaches and captains through delegation
        or assignment by the Head Coach, following the Program Curriculum,
        Session Practice Plan Template, and Basketball Development Philosophy.
      </li>

      <li>
        Players must attend at least three training sessions per week and one
        team run every two weeks to remain eligible for Game Day roster
        selection.
      </li>

      <li>
        Players unable to attend must notify team captains and administrators
        to receive an alternate training plan approved by the Head Coach.
      </li>

      <li>All players must carry drinking water to every practice session.</li>

      <li>
        Maximum attentiveness, awareness, and responsiveness are expected
        during all training sessions.
      </li>
    </ul>
  </div>

  {/* Game Day */}
  <div>
    <h4 className="text-xl font-bold text-blue-800">
      3. Game Day & Game Preparation
    </h4>

    <ul className="mt-3 list-disc pl-6 space-y-1 text-gray-700">
      <li>
        <span className="font-semibold">Personal Grooming:</span> Individual
        cleanliness, trimmed nails, and well-kept hair.
      </li>

      <li>
        <span className="font-semibold">Attire:</span> Clean shoes, white
        socks, and approved accessories such as headbands, sleeves, and
        tights.
      </li>

      <li>
        <span className="font-semibold">Branding:</span> Branded team
        merchandise including clothing, water bottles, and wristbands.
      </li>

      <li>
        <span className="font-semibold">Cohesion:</span> Team members are
        expected to gather at a central location before games to promote
        collective preparation.
      </li>

      <li>
        <span className="font-semibold">Lock In:</span> No phones or earphones
        during team warm-ups (20 minutes before game time).
      </li>
    </ul>
  </div>

  {/* Program Trips */}
  <div>
    <h4 className="text-xl font-bold text-blue-800">
      4. Program Trips
    </h4>

    <ul className="mt-3 list-disc pl-6 space-y-1 text-gray-700">
      <li>
        Program-arranged transport, meals, and accommodation are provided for
        tournament and game roster players according to the shared itinerary.
      </li>

      <li>
        Pick-ups and drop-offs are arranged individually by players and
        guardians.
      </li>

      <li>
        Players share assigned responsibilities and duties that contribute to
        the welfare and representation of the program during trips and events.
      </li>

      <li>Urbanville merchandise should be worn at all event venues.</li>

      <li>No sex or drugs.</li>

      <li>Trip charges may apply.</li>
    </ul>
  </div>

  {/* Code of Conduct */}
  <div>
    <h4 className="text-xl font-bold text-blue-800">
      5. Code of Conduct
    </h4>

    <ul className="mt-3 list-disc pl-6 space-y-1 text-gray-700">
      <li>
        Be an ambassador of the Urbanville Basketball Program and positively
        impact society through adherence to the program's values, ethos,
        motto, culture, and traditions.
      </li>

      <li>Do not engage in illegal activities.</li>

      <li>Do not engage in immoral activities.</li>

      <li>Do not engage in unethical activities.</li>

      <li>
        Do not be <span className="font-bold text-orange-600">L.A.M.E.</span>{" "}
        — Lazy, Arrogant, Mediocre, or Entitled.
      </li>
    </ul>
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
                      <ImageComponent
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
