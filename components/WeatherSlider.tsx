"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import Navigation from "@/components/Navigation";

const videoPaths = ["/rain.mp4", "/cloud.mp4", "/sun.mp4"];

const WeatherSlider: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);
  const [sliding, setSliding] = useState(false);
  const SLIDE_DURATION = 7000;

  // Refs to all videos
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const nextSlide = useCallback(() => {
    if (sliding) return;
    setSliding(true);
    setCurrent((prev) => (prev + 1) % videoPaths.length);
    setTimeout(() => setSliding(false), 700);
  }, [sliding]);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          nextSlide();
          return 0;
        }
        return prev + 100 / (SLIDE_DURATION / 100);
      });
    }, 100);

    return () => clearInterval(interval);
  }, [nextSlide]);

  useEffect(() => {
    setProgress(0);

    // Reset current video to start from 0
    const currentVideo = videoRefs.current[current];
    if (currentVideo) {
      currentVideo.currentTime = 0;
      currentVideo.play().catch(() => {
        // Autoplay might be blocked on some devices until interaction
      });
    }
  }, [current]);

  return (
    <div className="fixed inset-0 -z-10">
      {videoPaths.map((path, index) => {
        const isActive = index === current;
        return (
          <video
            key={path}
            ref={(el) => (videoRefs.current[index] = el)}
            src={path}
            autoPlay
            muted
            playsInline
            loop={false}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
              isActive ? "opacity-100" : "opacity-0"
            }`}
          />
        );
      })}

      {/* Progress bar */}
      <Navigation progress={progress} />
    </div>
  );
};

export default WeatherSlider;
