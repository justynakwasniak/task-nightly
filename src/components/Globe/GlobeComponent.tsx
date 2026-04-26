"use client";

import { useEffect, useRef, useState } from "react";
import { useValidators } from "../../hooks/useValidators";
import { Validator } from "@/src/lib/validators";

import { useGlobe } from "./useGlobe";
import ValidatorPanel from "./ValidatorPanel";
import ValidatorMobileSheet from "./ValidatorMobileSheet";

export default function GlobeComponent({
  initialValidators = [],
}: {
  initialValidators?: Validator[];
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { globeRef, getAltitude } = useGlobe(containerRef);

  const [selected, setSelected] = useState<Validator | null>(null);
  const { data: validators, loading, error } = useValidators(initialValidators);

  useEffect(() => {
    if (!globeRef.current) return;

    globeRef.current
      .pointsData(validators)
      .pointLat((d: Validator) => d.lat)
      .pointLng((d: Validator) => d.lng)
      .pointColor((d: Validator) => {
        if (selected?.id === d.id) return "#ef4444";
        return d.status === "active" ? "#fbbf24" : "#e5e7eb";
      })
      .pointRadius(0.5)
      .pointAltitude(0)
      .pointResolution(8)
      .onPointClick((point: Validator) => {
        setSelected(point);

        globeRef.current?.pointOfView(
          {
            lat: point.lat,
            lng: point.lng,
            altitude: getAltitude(),
          },
          1000,
        );
      })
      .onPointHover((point: Validator | null) => {
        document.body.style.cursor = point ? "pointer" : "default";
      });
  }, [validators, selected, getAltitude]);

  return (
    <>
      <div className="relative w-full h-dvh">
        <div ref={containerRef} className="w-full h-full" />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-md">
            <p className="text-white">Loading validators...</p>
          </div>
        )}

        {error && (
          <div className="absolute top-4 left-4 bg-red-500/90 px-4 py-2 rounded text-white">
            {error}
          </div>
        )}

        {selected && (
          <ValidatorPanel
            selected={selected}
            onClose={() => setSelected(null)}
          />
        )}

        {selected && (
          <>
            <div
              className="fixed md:hidden inset-0 bg-black/40 z-40"
              onClick={() => setSelected(null)}
            />
            <ValidatorMobileSheet
              selected={selected}
              onClose={() => setSelected(null)}
            />
          </>
        )}
      </div>
    </>
  );
}
