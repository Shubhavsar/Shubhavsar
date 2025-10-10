import React from "react";
import { FaWhatsapp } from "react-icons/fa";

export default function WhatsAppFloat() {
  return (
    <a
      href="https://wa.me/919601903111" // Correct format with country code
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 
                 text-white rounded-full shadow-xl flex items-center justify-center 
                 animate-bounce hover:scale-110 hover:shadow-2xl transition-transform duration-300"
    >
      <FaWhatsapp size={36} className="drop-shadow-lg" />
    </a>
  );
}
