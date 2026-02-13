"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import WorldMap from "./WorldMap";
import { countries } from "@/constants/countries";
import { LoginButton } from "./LoginButton";
import { authClient } from "@/utils/auth-client";

type SelectedCountry = {
  id: string;
  name: string;
};

type Photo = {
  url: string;
  fileName: string;
};

export default function TravelWallPOC() {
  const [selected, setSelected] = useState<SelectedCountry | null>(null);
  const [photosById, setPhotosById] = useState<Record<string, Photo>>({});
  const { data } = authClient.useSession();

  const userName = data?.user?.name ?? "";

  const selectedPhoto = useMemo(() => {
    if (!selected) return null;
    return photosById[selected.id] ?? null;
  }, [photosById, selected]);

  function hasPhotoById(id: string) {
    return Boolean(photosById[id]);
  }

  const visitedCountries = `${Object.keys(photosById).length}/${countries.features.length}`;

  function clearPhoto(countryId: string) {
    setPhotosById((prev) => {
      const existing = prev[countryId];
      if (existing) URL.revokeObjectURL(existing.url);

      const next = { ...prev };
      delete next[countryId];
      return next;
    });
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <header className="sticky top-0 z-10 border-b border-slate-800/60 bg-slate-950/70 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
          <div className="flex flex-col">
            <h1 className="text-xl font-semibold tracking-tight">TravelWall</h1>
            <p className="text-sm text-slate-300/80">
              Click a country, upload a photo.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-full border border-slate-700/70 bg-slate-900/60 px-3 py-1 text-sm text-slate-200 shadow-sm">
              {userName}
            </span>
            <LoginButton />
          </div>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 px-6 pb-10 md:grid-cols-[1fr_360px] mt-2">
        <section className="rounded-2xl border border-slate-800/70 bg-slate-900/40 p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-sm text-slate-300/80">
              Visited countries: {visitedCountries}
            </div>
            <div className="text-sm">
              {selected ? (
                <span>
                  Selected: <span className="font-medium">{selected.name}</span>
                </span>
              ) : (
                <span className="text-slate-300/80">Select a country</span>
              )}
            </div>
          </div>

          <div className="w-full overflow-hidden rounded-xl border border-slate-800/70 bg-slate-900">
            <WorldMap
              selectedId={selected?.id ?? null}
              hasPhotoById={hasPhotoById}
              onSelect={(country) => setSelected(country)}
            />
          </div>
        </section>

        <aside className="rounded-2xl border border-slate-800/70 bg-slate-900/40 p-5 shadow-sm">
          <h2 className="text-base font-semibold">Upload</h2>
          <p className="mt-1 text-sm text-slate-300/80">
            {selected
              ? `Add a travel photo for ${selected.name}. (Stored in-memory only.)`
              : "Pick a country on the map to start."}
          </p>

          <div className="mt-4 space-y-3">
            <label className="block">
              <span className="mb-2 block text-sm font-medium">Photo</span>
              <input
                type="file"
                accept="image/*"
                disabled={!selected}
                className="block w-full text-sm file:mr-4 file:rounded-full file:border-0 file:bg-teal-500 file:px-4 file:py-2 file:text-white hover:file:bg-teal-400 disabled:opacity-50"
                onChange={(e) => {
                  const country = selected;
                  const file = e.currentTarget.files?.[0];
                  if (!country || !file) return;

                  const url = URL.createObjectURL(file);

                  setPhotosById((prev) => {
                    const existing = prev[country.id];
                    if (existing) URL.revokeObjectURL(existing.url);
                    return {
                      ...prev,
                      [country.id]: { url, fileName: file.name },
                    };
                  });

                  e.currentTarget.value = "";
                }}
              />
            </label>

            {selected && selectedPhoto ? (
              <div className="rounded-xl border border-slate-800/70 bg-slate-950/40 p-3 shadow-sm">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">
                      {selectedPhoto.fileName}
                    </div>
                    <div className="text-xs text-slate-300/80">Preview</div>
                  </div>
                  <button
                    type="button"
                    className="rounded-full border border-slate-700/70 bg-slate-900/60 px-3 py-1 text-sm hover:bg-slate-900"
                    onClick={() => clearPhoto(selected.id)}
                  >
                    Clear
                  </button>
                </div>
                <div className="relative aspect-4/3 w-full overflow-hidden rounded-lg bg-slate-900">
                  <Image
                    src={selectedPhoto.url}
                    alt={`Travel photo for ${selected.name}`}
                    fill
                    unoptimized
                    className="object-cover"
                    sizes="(min-width: 768px) 360px, 100vw"
                  />
                </div>
              </div>
            ) : null}
          </div>
        </aside>
      </main>
    </div>
  );
}
