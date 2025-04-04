"use client";
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
import { useEffect, useState } from "react";

// object to store the selected city returned from the search bar after calling google places api
// the suggestions are returned from the google places api
// the autocomplete function is called in the useEffect hook when the input changes

type Place = {
  name: string;
  place_id: string;
  lat: number;
  lng: number;
};

type Props = {
  onSelect: (place: Place) => void;
};

export default function SearchBarCity({ onSelect }: Props) {
  const [predictions, setPredictions] = useState<any[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    const fetchPredictions = async () => {
      if (!input) return setPredictions([]);
      const results = await autocomplete(input);
      setPredictions(results ?? []);
    };
    fetchPredictions();
  }, [input]);

  const handleSelect = (place: Place) => {
    setInput(place.name);
    onSelect(place);
    setTimeout(() => {
      setPredictions([]);
    }, 900);
  };

  return (
    <div className="col-span-1 sm:col-span-2 lg:col-span-3">
      <div className="relative">
        <Command>
          <CommandInput
            placeholder="Search your city..."
            value={input}
            onValueChange={setInput}
          />
          {input && predictions.length > 0 && (
            <div className="absolute top-full w-full z-50 bg-white border rounded-md shadow-md mt-1">
              <CommandList>
                <CommandGroup heading="Suggestions">
                  {predictions.map((place) => (
                    <CommandItem
                      key={place.place_id}
                      className="cursor-pointer"
                      onSelect={() => handleSelect(place)}
                    >
                      {place.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </div>
          )}
          <CommandSeparator />
        </Command>
      </div>
    </div>
  );
}
