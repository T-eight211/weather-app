"use client";

import React from 'react';
import GaugeComponent from './ui/gauge-chart';
import TransportCombobox from "@/components/ui/combobox";
import Image from 'next/image';

type DangerLevelGaugeProps = {
  value: number;
  messages: string[];
  selectedValue: string;
  onChange: (mode: string) => void;
};

const DangerLevelGauge: React.FC<DangerLevelGaugeProps> = ({
  value,
  messages,
  selectedValue,
  onChange
}) => {
  return (
    <>
      {/* Header */}
      <div className="flex items-center py-2 gap-2">
        <div className="w-4 h-7 flex items-center justify-center">
          <Image src="/exclamationmark.triangle.fill.svg" alt="danger icon" width={16} height={16} />
        </div>
        <h2 className="w-40 text-white text-sm font-medium  text-white/60 ">DANGER LEVEL</h2>
      </div>

      {/* Combobox */}
      <div className="flex justify-end">
        <TransportCombobox
          options={[
            { value: "walking", label: "🚶 Walking" },
            { value: "bicycle", label: "🚴 Bicycle" },
            { value: "car", label: "🚗 Car" },
            { value: "motorcycle", label: "🛵 Motorcycle" },
          ]}
          placeholder="Select Transport"
          searchPlaceholder="Search transport..."
          emptyMessage="No transport found."
          value={selectedValue}
          onChange={onChange}
        />
      </div>

      {/* Gauge & Messages */}
      <div className="grid grid-cols-1 items-center justify-center mt-4">
        <GaugeComponent
          value={value}
          type="semicircle"
          labels={{
            tickLabels: {
              type: "inner",
              hideMinMax: true,
              ticks: [
                { value: 1, valueConfig: { formatTextValue: () => "0" } },
                { value: 25 },
                { value: 50 },
                { value: 75 },
                { value: 99, valueConfig: { formatTextValue: () => "100" } },
              ],
            },
          }}
          arc={{
            colorArray: ['#5BE12C', '#F9C802', '#EA4228'],
            subArcs: [{ limit: 33 }, { limit: 66 }, { limit: 100 }],
            padding: 0.02,
            width: 0.3,
          }}
          pointer={{
            elastic: true,
            animationDelay: 1,
            color: '#4a62a0',
          }}
        />

        {/* Message List */}
        <div className="mt-4 space-y-1 text-white text-sm sem">
          {messages.map((msg, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <span>•</span>
              <span>{msg}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default DangerLevelGauge;
