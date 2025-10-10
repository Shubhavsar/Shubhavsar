import React from "react";

export default function Portfolio() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12" id="portfolio">
      <h2 className="text-3xl font-bold text-center mb-6">Our Portfolio</h2>
      <p className="text-center text-gray-600 mb-10">A glimpse of our past events, designs, and celebrations.</p>

      <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-lg overflow-hidden shadow">
          <video src="public/videos/video1.mp4" autoPlay muted loop className="w-full h-full object-cover" />
        </div>
        <div className="rounded-lg overflow-hidden shadow">
          <video src="public/videos/video2.mp4" autoPlay muted loop className="w-full h-full object-cover" />
        </div>
        <div className="rounded-lg overflow-hidden shadow">
          <video src="public/videos/video3.mp4" autoPlay muted loop className="w-full h-full object-cover" />
        </div>
      </div>
    </div>
  );
}
