import { geoNaturalEarth1, geoPath } from "d3-geo";
import type { Feature, FeatureCollection, Geometry } from "geojson";
import { feature as topojsonFeature } from "topojson-client";
import world from "world-atlas/countries-110m.json";

type CountryProperties = {
  name?: string;
};


const countries = topojsonFeature(
  world as unknown as Parameters<typeof topojsonFeature>[0],
  (world as unknown as { objects: { countries: unknown } }).objects
    .countries as Parameters<typeof topojsonFeature>[1],
) as unknown as FeatureCollection<Geometry, CountryProperties>;


export type { CountryProperties };
export { countries };