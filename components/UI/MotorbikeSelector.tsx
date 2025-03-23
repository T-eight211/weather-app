// components/UI/MotorbikeSelector.tsx
import React from 'react';

interface MotorbikeSelectorProps {
  locations: string[];
  danger: number;
  dangerText: string;
}

const MotorbikeSelector: React.FC<MotorbikeSelectorProps> = ({ locations, danger, dangerText }) => {
  // Determine dynamic style based on danger level
  const dangerStyle =
    danger === 0 ? "bg-[radial-gradient(circle,#FFF,#90EE90)] border-green-500 text-green-700" :
    danger === 1 ? "bg-[radial-gradient(circle,#FFF,#FFDBBB)] border-orange-500 text-orange-700" :
                   "bg-[radial-gradient(circle,#FFF,#FF8080)] border-red-500 text-red-700";

  return (
    <div className={`row-start-1 border-[1px] rounded-[3px] grid grid-rows-[15%_15%_10%_60%] grid-cols-1 xl:grid-cols-2 xl:grid-rows-[10%_10%_80%] m-1 xl:m-2 text-xs xl:text-2xl p-1 ${dangerStyle}`}>
      <select className="bg-white border-b-[1px] border-blue-500 rounded m-1 xl:m-2 text-xs xl:text-base" defaultValue="0">
        <option value="0">Motorbike Type</option>
        <option value="1">Sports</option>
        <option value="2">Scooter</option>
        <option value="3">Cruiser</option>
        <option value="4">Off-road</option>
        <option value="5">Street</option>
      </select>
      <select className="bg-white border-b-[1px] border-blue-500 rounded m-1 xl:m-2 text-xs xl:text-base">
        {locations.map((location, index) => (
          <option key={index} value={location}>{location}</option>
        ))}
      </select>
      <p className="xl:col-span-2 ml-1 xl:ml-2 mt-auto text-xs xl:text-base text-black font-bold">Danger Levels:</p>
      <div className="xl:col-span-2 mx-auto my-auto">
        <p className="text-9xl font-bold text-center">{dangerText}</p>
      </div>
    </div>
  );
};

export default MotorbikeSelector;
