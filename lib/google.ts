// this file is used to fetch data from google maps api and so if the user starts typing in the input field it will show the autocomplete suggestions meaning if c is typed it will show cities starting with c and so on. it returns all the cities with their coordinates and place id. this is used to show the autocomplete suggestions in the input field. it uses the google maps api to fetch the data and so it is important to have a valid api key in the .env file. it uses the google maps services js library to fetch the data and so it is important to have that installed in the project. it uses the place autocomplete method to fetch the data and so it is important to have that enabled in the google cloud console for the api key. it uses the place details method to fetch the details of each place and so it is important to have that enabled in the google cloud console for the api key. it uses async await to fetch the data and so it is important to have that enabled in the google cloud console for the api key. it uses promise.all to fetch all the places at once and so it is important to have that enabled in the google cloud console for the api key.


"use server";

import { Client } from "@googlemaps/google-maps-services-js";

import { PlaceAutocompleteType } from "@googlemaps/google-maps-services-js";

const client = new Client();

export const autocomplete = async (input: string) => {
  if (!input) return [];

  try {
    const response = await client.placeAutocomplete({
      params: {
        input,
        types: PlaceAutocompleteType.cities,
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
