import React, { useState, useEffect } from "react";
import logoImg from "/autproj.png";
import img1 from "./assets/images/img1.png";
import img2 from "./assets/images/img2.png";
import img3 from "./assets/images/img3.jpeg";

const slides = [
  {
    image: img1,
    text: "Secure Your Access, Empower Your Future.",
  },
  {
    image: img2,
    text: "Learn. Protect. Authenticate.",
  },
  {
    image: img3,
    text: "Building Trust, One Login at a Time.",
  },
];

const Slideshow: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden rounded-2xl shadow-lg">
      {/* Background Images with fade effect */}
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
            style={{ backgroundImage: `url(${slide.image})` }}
          ></div>
        ))}
      </div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Bottom Shadow Gradient */}
      <div className="absolute bottom-0 inset-x-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent"></div>

      {/* Logo */}
      <div className="absolute top-5 left-6">
        <img src={logoImg} alt="Logo" className="w-20 opacity-90 select-none" />
      </div>

      {/* Text */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-center text-white px-4">
        <h2 className="text-2xl md:text-3xl font-light tracking-wide">
          {slides[currentIndex].text}
        </h2>

        {/* Dots */}
        <div className="flex justify-center mt-4 space-x-2">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`h-2 w-6 rounded-full transition-all duration-500 ${
                index === currentIndex ? "bg-white" : "bg-white/30"
              }`}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Slideshow;
