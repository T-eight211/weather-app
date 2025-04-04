// this is a react compass ui component that takes wind speed which is desplayed in the middle and direction using an arrow, we do a bit of mathematics to basically get the position where the arrow should be so assuming its a circle, we know the point in circumference using maths we can find the coordinates of the point in the circle and then we rotate the arrow to that point.


import React from "react";

interface WindDirectionCompassProps {
  windSpeed: number; 
  direction: number; 
}

const directions = ["N", "E", "S", "W"];

const WindDirectionCompass: React.FC<WindDirectionCompassProps> = ({
  windSpeed,
  direction,
}) => {
  return (
    <div className="w-45 h-30 relative flex items-center justify-center ">
      {/* Compass Circle */}
      <svg className="absolute w-full h-full" viewBox="0 0 100 100">
        {/* Outer Circle */}
        <circle cx="50" cy="50" r="48" stroke="#ccc" strokeWidth="1" fill="none" />

        {/* Direction Labels */}
        {directions.map((dir, i) => {
          const angle = (i * 360) / directions.length;
          const rad = (angle * Math.PI) / 180;
          const x = 50 + 40 * Math.sin(rad);
          const y = 50 - 40 * Math.cos(rad);
          return (
            <text
              key={dir}
              x={x}
              y={y + 3}
              textAnchor="middle"
              fill="white"
              fontSize="10"
              fontWeight="bold"
              fontFamily="monospace"
            >
              {dir}
            </text>
          );
        })}

        {/* Pointer */}
        <g transform={`rotate(${direction}, 50, 50)`}>
          <polygon
            points="50,15 46,30 54,30"
            fill="#f87171"
            stroke="white"
            strokeWidth="0.5"
          />
        </g>
      </svg>


      <div className="z-10 text-white text-center">

        <div className="text-sm font-semibold">{windSpeed} <br />mph</div>
      </div>
    </div>
  );
};

export default WindDirectionCompass;
