import React, { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import Logo from "../assets/shubh_avsar_logo.png";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuItems = ["Home", "Services", "Portfolio", "Testimonials", "Contact"];

  return (
    <nav className="w-full flex items-center justify-between px-4 py-3 md:px-6 md:py-4 bg-gradient-to-r from-[#85171A] via-[#CEA13B] via-[#FFE35B] to-[#FCE983] shadow-md fixed top-0 z-50">
      
      {/* Logo Only */}
      <div className="flex items-center cursor-pointer">
        <img
          src={Logo}
          alt="Shubh Avsar Logo"
          className="w-14 md:w-20 transition-transform duration-500 hover:rotate-6 hover:scale-110 drop-shadow-[0_0_6px_rgba(255,227,91,0.5)]"
        />
      </div>

      {/* Desktop Menu */}
      <ul className="hidden md:flex space-x-6 font-medium text-[#85171A] drop-shadow-md">
        {menuItems.map((item) => (
          <li key={item}>
            <a
              href={`#${item.toLowerCase()}`}
              className="relative after:content-[''] after:block after:w-0 after:h-[2px] after:bg-[#85171A] after:transition-all after:duration-300 hover:after:w-full hover:text-white"
            >
              {item}
            </a>
          </li>
        ))}
      </ul>

      {/* Mobile Menu Toggle */}
      <button
        className="md:hidden text-white text-3xl"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <FiX /> : <FiMenu />}
      </button>

      {/* Mobile Menu */}
      <div
        className={`absolute top-16 left-0 w-full bg-gradient-to-b from-[#85171A] via-[#CEA13B] via-[#FFE35B] to-[#FCE983] shadow-lg md:hidden transition-all duration-500 ease-in-out ${
          menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <ul className="flex flex-col items-center py-6 space-y-4 font-medium text-[#85171A] drop-shadow-md">
          {menuItems.map((item) => (
            <li key={item}>
              <a
                href={`#${item.toLowerCase()}`}
                className="block text-lg hover:text-white transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {item}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
