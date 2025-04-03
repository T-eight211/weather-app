"use server";

import { Client } from "@googlemaps/google-maps-services-js";

const client = new Client();

export const autocomplete = async (input: string) => {
  if (!input) return [];

  try {
    const response = await client.placeAutocomplete({
      params: {
        input,
        types: ["(cities)"],
        key: process.env.GOOGLE_API_KEY!,
      },
    });

    // Now fetch place details for each suggestion to get coordinates
    const places = await Promise.all(
      response.data.predictions.map(async (prediction) => {
        const details = await client.placeDetails({
          params: {
            place_id: prediction.place_id,
            key: process.env.GOOGLE_API_KEY!,
            fields: ["geometry", "formatted_address", "name"],
          },
        });

        return {
          name: prediction.description,
          place_id: prediction.place_id,
          lat: details.data.result.geometry?.location.lat,
          lng: details.data.result.geometry?.location.lng,
        };
      })
    );

    return places;
  } catch (error) {
    console.error("Autocomplete error:", error);
    return [];
  }
};
