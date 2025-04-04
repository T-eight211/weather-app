// after getting the weather data from the API, we will pass the condition and iconCode to this component. based on the condition and iconCode, we will get the video source and play it. the video will be reset every time the condition or iconCode changes. the progress of the video will be set to 0 every time the condition or iconCode changes. the video will play for 7 seconds and then reset to 0. if the video is at 100% progress, it will reset to 0 and play again.


"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";

type WeatherSliderProps = {
  condition: string;
  iconCode: string; // To determine day/night
};

const WeatherSlider: React.FC<WeatherSliderProps> = ({ condition, iconCode }) => {
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const SLIDE_DURATION = 7000;

  const isNight = iconCode?.endsWith("n");


  const getVideoSrc = () => {
    const lower = condition.toLowerCase();
    if (isNight) return "/night.mp4";
    if (lower.includes("thunderstorm")) return "/thunderstorm.mp4";
    if (lower.includes("drizzle") || lower.includes("rain")) return "/rain.mp4";
    if (lower.includes("snow")) return "/snow.mp4";
    if (lower.includes("clear")) return "/sun.mp4";
    if (lower.includes("cloud")) return "/cloud.mp4";
    return "/cloud.mp4"; // Fallback
  };



  const resetVideo = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  }, []);

  useEffect(() => {
    resetVideo();
    setProgress(0);
  }, [condition, iconCode, resetVideo]);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          resetVideo();
          return 0;
        }
        return prev + 100 / (SLIDE_DURATION / 100);
      });
    }, 100);

    return () => clearInterval(interval);
  }, [resetVideo]);

  return (
    <div className="fixed inset-0 -z-10">
      <video
        ref={videoRef}
        src={getVideoSrc()}
        autoPlay
        muted
        playsInline
        loop={false}
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 opacity-100 filter brightness-[0.7]"
      />
    </div>
  );
};

export default WeatherSlider;

