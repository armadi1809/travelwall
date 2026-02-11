"use client";

import { countries, CountryProperties } from "@/constants/countries";
import { geoNaturalEarth1, geoPath } from "d3-geo";
import type { Feature, Geometry } from "geojson";

type CountryFeature = Feature<Geometry, CountryProperties> & {
  id?: string | number;
};

const WIDTH = 980;
const HEIGHT = 520;

const projection = geoNaturalEarth1().fitSize([WIDTH, HEIGHT], countries);
const path = geoPath(projection);

function getCountryId(country: CountryFeature): string {
  if (country.id !== undefined && country.id !== null)
    return String(country.id);
  return country.properties?.name ?? "unknown";
}

export default function WorldMap({
  selectedId,
  hasPhotoById,
  onSelect,
}: {
  selectedId: string | null;
  hasPhotoById: (id: string) => boolean;
  onSelect: (country: { id: string; name: string }) => void;
}) {
  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      className="h-auto w-full"
      role="img"
      aria-label="World map"
    >
      <rect
        x={0}
        y={0}
        width={WIDTH}
        height={HEIGHT}
        className="fill-slate-900"
      />
      <g>
        {(countries.features as unknown as CountryFeature[]).map((country) => {
          const d = path(
            country as unknown as Feature<Geometry, CountryProperties>,
          );
          if (!d) return null;

          const id = getCountryId(country);
          const name = country.properties?.name ?? "Unknown";
          const selected = selectedId === id;
          const hasPhoto = hasPhotoById(id);

          const fillClass = selected ? "fill-slate-700" : "fill-slate-800";
          const strokeClass = selected
            ? "stroke-orange-400/70"
            : hasPhoto
              ? "stroke-amber-200/30"
              : "stroke-slate-600/70";
          const hoverClass = "hover:fill-slate-700";
          const ringClass =
            "focus-visible:ring-2 focus-visible:ring-teal-400/30";

          return (
            <path
              key={id}
              d={d}
              vectorEffect="non-scaling-stroke"
              role="button"
              tabIndex={0}
              aria-label={name}
              onClick={() => onSelect({ id, name })}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelect({ id, name });
                }
              }}
              className={[
                "cursor-pointer outline-none transition-colors duration-150",
                hoverClass,
                ringClass,
                "active:opacity-95",
                "stroke-[0.7]",
                strokeClass,
                fillClass,
              ].join(" ")}
            />
          );
        })}
      </g>

      <g>
        {(countries.features as unknown as CountryFeature[]).map((country) => {
          const d = path(
            country as unknown as Feature<Geometry, CountryProperties>,
          );
          if (!d) return null;

          const id = getCountryId(country);
          if (!hasPhotoById(id)) return null;

          const [cx, cy] = path.centroid(
            country as unknown as Feature<Geometry, CountryProperties>,
          );
          const name = country.properties?.name ?? "Unknown";

          return (
            <circle
              key={`pin-${id}`}
              cx={cx}
              cy={cy}
              r={4.2}
              role="button"
              tabIndex={0}
              aria-label={`Visited: ${name}`}
              onClick={() => onSelect({ id, name })}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelect({ id, name });
                }
              }}
              className={[
                "cursor-pointer",
                "fill-orange-500",
                "stroke-orange-200/80 stroke-[1.4]",
                "hover:fill-orange-400",
              ].join(" ")}
            />
          );
        })}
      </g>
    </svg>
  );
}
