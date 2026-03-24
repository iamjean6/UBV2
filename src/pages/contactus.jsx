import React, { useState, useEffect, useRef } from "react";
import { HiX } from "react-icons/hi";
import Button from "../components/button";
import { MessageCircle } from "lucide-react";


const FAQItem = ({ question, answer, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-black/20 py-4">
      <div
        onClick={() => setOpen(!open)}
        className="flex justify-between items-start cursor-pointer gap-4"
      >
        <h3 className="text-xs md:text-sm tracking-wide leading-snug font-medium">
          {question}
        </h3>
        <span className="text-lg flex-shrink-0 font-light">{open ? "—" : "+"}</span>
      </div>

      <div className={`faq-answer-wrapper ${open ? "faq-answer-wrapper--open" : ""}`}>
        <p className="mt-3 text-xs text-gray-500 leading-relaxed max-w-md">
          {answer}
        </p>
      </div>
    </div>
  );
};

const ContactPage = () => {
  const bannerRef = useRef(null);
  const modalRef = useRef(null)
  const [activeCard, setActiveCard] = useState(null);
  const [bannerVisible, setBannerVisible] = useState(false);
  const openCard = () =>{
     setActiveCard({
    image: "/img/badge.jpeg",
    title: "Get In Touch",
    synopsis:
      "For collaborations, press inquiries, or general questions, please reach out to us via email and our team will respond as soon as possible."
  });
  }
  const closeCard = () => {
  setActiveCard(null);
};
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setBannerVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    if (bannerRef.current) observer.observe(bannerRef.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
  const handleEsc = (e) => {
    if (e.key === "Escape") closeCard();
  };

  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      closeCard();
    }
  };

  if (activeCard) {
    document.addEventListener("keydown", handleEsc);
    document.addEventListener("mousedown", handleClickOutside);
  }

  return () => {
    document.removeEventListener("keydown", handleEsc);
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, [activeCard]);

  return (
    <section className="relative overflow-hidden bg-[#f1f1f1]">
      <div className="max-w-[1400px] mx-auto px-8 md:px-16 pt-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.05),rgba(0,0,0,0.15))] pointer-events-none" />
        <div className="relative z-20 overflow-hidden">
          <h1 className="contact-title text-orange-600 font-barlow font-semibold leading-none tracking-tight uppercase">
            CONTACT US
          </h1>
        </div>

    
        <div className="relative grid grid-cols-1 md:grid-cols-[180px_1fr_1fr] gap-8 mt-8">

          {/* ── COL 1: Intro text ── order-2 on mobile so image stays first ── */}
          <div className="pt-2 z-10 order-2 md:order-1">
            <p className="text-[15px] text-gray-500 leading-relaxed">
              For any inquiries, collaborations, or just to say hello,
              we'd love to hear from you! Reach out, and let's connect.
            </p>
          </div>

          {/* ── COL 2: Contact sections + FAQ ── order-3 on mobile ── */}
          <div className="z-10 flex flex-col gap-8 order-3 md:order-2">

            {/* Press */}
            <div className="flex flex-col gap-1">
              <h3 className="text-lg font-bold uppercase tracking-widest ">PRESS</h3>
              <p className="text-lg font-semibold uppercase tracking-wide text-black">
                SAMSUNG C&T CORPORATION (MILAN OFFICE)
              </p>
              <p className="text-sm text-gray-500 leading-relaxed">
                Centro Direzionale Milanofiori, Strada 2,<br />
                PALAZZO C1, 20057 Assago Milano, Italy
              </p>
              <p className="text-lg font-semibold uppercase tracking-wide text-black mt-3">
                JUUN.J PR
              </p>
              <p className="text-sm text-gray-500">JUUN.JPR@samsung.com</p>
            </div>

            {/* Sales */}
            <div className="flex flex-col gap-1">
              <h3 className="text-lg font-bold uppercase tracking-widest ">SALES</h3>
              <p className="text-sm font-semibold uppercase tracking-wide text-black">
                JUUN.J SHOWROOM
              </p>
              <p className="text-sm text-gray-500">showroom.it@samsung.com</p>
            </div>

            {/* Head Office */}
            <div className="flex flex-col gap-1">
              <h3 className="text-lg font-bold uppercase tracking-widest ">HEAD OFFICE</h3>
              <p className="text-lg font-semibold uppercase tracking-wide text-black">
                JUUN.J SAMSUNG C&T CORPORATION
              </p>
              <p className="text-sm text-gray-500 leading-relaxed">
                2806, Nambusunhwan-ro, Gangnam-Gu, Seoul,<br />
                Republic of Korea
              </p>
            </div>

            {/* FAQ */}
            <div className="mt-12 mb-16">
              <h2 className="text-2xl md:text-3xl tracking-widest font-bold uppercase mb-8 leading-tight">
                FREQUENTLY ASKED<br />QUESTIONS
              </h2>

              <FAQItem
                question="Can Urbanville beat Nairobi City Thunder?"
                defaultOpen
                answer="We're always open to new creative ventures. For partnership or collaboration inquiries, please fill out our Collaboration Inquiry Form on the Contact Us page, and our team will review and reach out if there's a match."
              />
              <FAQItem
                question="Where can I find information on JUUN.J campaigns and releases?"
                answer="All campaign and release information is published on our official website and social media channels including Instagram, YouTube, and Twitter."
              />
              <FAQItem
                question="How can I reach your customer support team?"
                answer="You can reach our customer support team via email at JUUNJ.PR@Samsung.com or through the contact form on this page."
              />
              <FAQItem
                question="How to Purchase JUUN.J Products?"
                answer="JUUN.J products are available at our official stores across South Korea, Australia, Austria, Canada, China, and France, as well as through our online platform."
              />
            </div>

          </div>
          <div className="relative order-1 md:order-3 w-full h-[75vw] md:h-auto">
            <img
              src="/img/shai.png"
              alt="JUUN.J model"
              className="w-full h-full md:absolute md:right-0 md:top-[-60px] md:h-auto object-contain object-top"
              style={{ filter: "grayscale(100%)" }}
            />
          </div>

        </div>
      </div>
      <div
        ref={bannerRef}
        className={`claim-banner relative overflow-hidden ${bannerVisible ? "banner-visible" : ""}`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.05),rgba(0,0,0,0.15))] pointer-events-none" />

        <img
          src="/img/kyrie.png"
          alt=""
          aria-hidden="true"
          className="claim-model--left absolute bottom-0 left-0 object-contain object-bottom"
          style={{ filter: "grayscale(100%)" }}
        />

        <button
          onClick={openCard}
          className="claim-cta-link relative z-10 flex items-center gap-4 text-black no-underline"
        >
          <span className="font-barlow hover:cursor-pointer font-semibold uppercase tracking-[0.2em] claim-cta-text">
            REACH OUT
          </span>
          <span className="claim-cta-arrow">→</span>
        </button>

        <img
          src="/img/steph.png"
          alt=""
          aria-hidden="true"
          className="claim-model--right absolute bottom-0 right-0 object-contain object-bottom"
          style={{ filter: "grayscale(100%)" }}
        />
      </div>
        {activeCard && (
                  <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4">
                    <div
                      ref={modalRef}
                      className="bg-neutral-900 text-white max-w-4xl w-full h-[420px] rounded-xl overflow-hidden grid grid-cols-2 "
                    >
                      <div className="relative h-[420px] md:h-full">
                        <img
                          src={activeCard.image}
                          alt={activeCard.title}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
      
                        <button
                          onClick={closeCard}
                          className="absolute top-4 left-4 z-10 w-9 h-9 rounded-full hover:text-black  text-white flex items-center justify-center  hover:cursor-pointer hover:scale-105 active:scale-95 transition"
                        >
                          <HiX className="w-8 h-8 " />
                        </button>
      
                        <div className="absolute inset-0 bg-black/20" />
                      </div>
                      <div className="p-6 md:p-8 flex flex-col justify-center space-y-4">
                        <h3 className="text-4xl md:text-5xl font-bold text-orange-600 uppercase font-barlow">
                          {activeCard.title}
                        </h3>
      
                        <p className="text-neutral-300 leading-relaxed">
                          {activeCard.synopsis}
                        </p>
                        <form action="">
                            
                        </form>
                        <Button 
                        title={'Send us a message'}
                        id='Send us  a message'
                        leftIcon={<MessageCircle />}
                         containerClass="mt-4
                         inline-flex items-center justify-center 
                         px-8 py-4 
                         !bg-white-500 
                         text-black 
                         font-bold 
                         shadow-lg 
                         gap-2 
                         !hover:bg-green-300 
                         transition
                         "
                         />
                        
                      </div>
                    </div>
                  </div>
                )}

     

    </section>
  );
};

export default ContactPage;