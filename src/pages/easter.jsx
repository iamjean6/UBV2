import React, { useEffect, useRef, useState } from "react";

const left = [
  { img: "/img/easter/shai (2).png" },
  { img: "/img/easter/Kobe (2).png" },
  { img: "/img/easter/ibra.png" },
  { img: "/img/easter/rocky.png" },
  { img: "/img/easter/hulvey.png" },
  { img: "/img/easter/korra.png" },
  { img: "/img/easter/drogba.png" },
  { img: "/img/easter/dog.png" },
  { img: "/img/easter/spiderman.png" }
];

const right = [
  { img: "/img/easter/brunson.png" },
  { img: "/img/easter/larry.png" },
  { img: "/img/easter/cr7.png" },
  { img: "/img/easter/goggins.png" },
  { img: "/img/easter/forrest.png" },
  { img: "/img/easter/jack.png" },
  { img: "/img/easter/cole.png" },
  { img: "/img/easter/cat.png" },
    { img: "/img/easter/cap.png" }
];

const Easter = () => {
  const bannerRef = useRef(null);
  const [bannerVisible, setBannerVisible] = useState(false);
  const [index, setIndex] = useState(0);

  // Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setBannerVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (bannerRef.current) observer.observe(bannerRef.current);
    return () => observer.disconnect();
  }, []);

  // Rotate images every 5s
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % left.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
  
     <div id="easter" className="bg-black overflow-hidden py-3" aria-hidden="true">
        <div className="ticker-track flex whitespace-nowrap w-max">
          {Array.from({ length: 10 }).map((_, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-3 text-white uppercase tracking-[0.2em] text-[11px] px-6 flex-shrink-0 font-barlow"
            >
              1 Corinthians 10:31
              <span className="opacity-50 text-[10px]">✦</span>
            </span>
          ))}
        </div>
      </div>
    <div
      ref={bannerRef}
      className={`claim-banner !min-h-screen relative bg-black overflow-hidden ${
        bannerVisible ? "banner-visible" : ""
      }`}
    >
        
      <div className="absolute inset-0 bg-black pointer-events-none" />

      {/* LEFT IMAGE */}
      <img
        key={`left-${index}`}
        src={left[index].img}
        alt=""
        aria-hidden="true"
        className="claim-model--left absolute left-0 top-1/2 -translate-y-1/2 object-contain"
      />

      {/* CENTER CONTENT */}
      <div className="relative z-10 flex flex-col items-center py-4 text-center">
        <img
          src="/img/easter/yeshua.jpg"
          alt=""
          className="w-20 md:w-44 rounded-full mb-6 shadow-xl"
        />
       <p className="claim-cta-text font-barlow text-yellow-200  !text-sm md:!text-base font-semibold uppercase">
  🎉 OH! Hey There? You found the secret spot! <br />
   Take a moment to smile and enjoy this little surprise. <br />
  Even hidden places are seen by God—He knows every step you take ✝️ <br />
  If this made you happy… can you buy me a coffee? ☕😭 <br />
  Keep seeking, keep exploring, and keep shining ✝️ <br />
  For inquires, collabs or if you just want to say hi, <br />
  shoot me at <i>+254703676436</i> 
  </p>
      </div>


      {/* RIGHT IMAGE */}
      <img
        key={`right-${index}`}
        src={right[index].img}
        alt=""
        aria-hidden="true"
        className="claim-model--right absolute right-0 top-1/2 -translate-y-1/2 object-contain"
      />
    </div>
      </>
  );
};

export default Easter;