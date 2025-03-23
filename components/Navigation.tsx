import React from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface NavigationProps {

  progress: number;
}

const Navigation = ({

  progress,
}: NavigationProps) => {
  return (
    <>
      {/* Progress bar */}
      <div className="slide-indicator absolute top-0 left-0 w-full h-1">
        <div
          className="slide-indicator-inner h-full bg-green-500 transition-all duration-100 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>

     
    </>
  );
};

export default Navigation;
