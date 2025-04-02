"use client";
import { Button } from "@/components/ui/button"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { autocomplete } from "@/lib/google";
import { PlaceAutocompleteResult } from "@googlemaps/google-maps-services-js";
import { useEffect, useState } from "react";

type Props = {
  onSelect: (value: string) => void;
};

export default function SearchBarCity({ onSelect }: Props) {
  const [predictions, setPredictions] = useState<PlaceAutocompleteResult[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    const fetchPredictions = async () => {
      if (!input) return setPredictions([]);
      const predictions = await autocomplete(input);
      setPredictions(predictions ?? []);
    };
    fetchPredictions();
  }, [input]);

  const handleSelect = (description: string) => {
    console.log("handleSelect triggered with:", description); // ✅ debug
    setInput(description);                  // Clears input after selection
    setPredictions([]);           // Hides dropdown
    onSelect(description);        // Pass selected city to parent
  };

  return (
    <>
    <div className="relative">
      <Command>
        <CommandInput
          placeholder="Search your city..."
          value={input}
          onValueChange={setInput}
        />

        {input && predictions.length > 0 && (
          <div className="absolute top-full  w-full z-50 bg-white border rounded-md shadow-md mt-1">
            <CommandList>
              <CommandGroup heading="Suggestions">
                {predictions.map((prediction) => (
                  <CommandItem
                    key={prediction.place_id}
                    className="cursor-pointer"
                    onSelect={() => handleSelect(prediction.description)}
                  >
                    {prediction.description}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </div>
        )}

        <CommandSeparator />
      </Command>
    </div>
    {/* <Button variant="outline" className="cursor-pointer"
      onClick={() => {
        console.log("Button clicked with input:", input); // ✅ debug
        if (input.trim()) {
          handleSelect(input.trim());
        }
      }}
    >
    
      Search</Button> */}
    </>
  );
}
