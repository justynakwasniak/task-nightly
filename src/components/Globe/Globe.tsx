"use client";

import { useEffect, useRef, useState } from "react";
import { useValidators } from "../../hooks/useValidators";
import { Validator } from "@/src/lib/validators";

type GlobeComponentProps = {
  initialValidators?: Validator[];
};

export default function GlobeComponent({
  initialValidators = [],
}: GlobeComponentProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const globeRef = useRef<any>(null);

  const [selected, setSelected] = useState<Validator | null>(null);

  const { data: validators, loading, error } =
    useValidators(initialValidators);

  /**
   * Responsive camera altitude
   */
  const getAltitude = () => {
    if (typeof window === "undefined") return 2;
    if (window.innerWidth < 640) return 3.2;
    if (window.innerWidth < 1024) return 2.6;
    return 1.5;
  };

  /**
   * Initialize globe
   */
  useEffect(() => {
    if (!containerRef.current) return;

    let globeInstance: any;
    let isMounted = true;

    const initGlobe = async () => {
      const GlobeModule = await import("globe.gl");

      if (!isMounted || !containerRef.current) return;

      const Globe = GlobeModule.default;

      globeInstance = Globe()(containerRef.current)
        .globeImageUrl(
          "//unpkg.com/three-globe/example/img/earth-night.jpg"
        )
        .backgroundColor("#020204");

      globeInstance.atmosphereColor("#6366f1");
      globeInstance.atmosphereAltitude(0.15);

      globeRef.current = globeInstance;

      globeInstance
        .width(containerRef.current.clientWidth)
        .height(containerRef.current.clientHeight);

      globeInstance.pointOfView({ altitude: getAltitude() }, 0);
    };

    initGlobe();

    const handleResize = () => {
      if (!globeInstance || !containerRef.current) return;

      globeInstance
        .width(containerRef.current.clientWidth)
        .height(containerRef.current.clientHeight);

      globeInstance.pointOfView({ altitude: getAltitude() }, 0);
    };

    window.addEventListener("resize", handleResize);

    const observer = new ResizeObserver(() => {
      if (!globeInstance || !containerRef.current) return;

      globeInstance
        .width(containerRef.current.clientWidth)
        .height(containerRef.current.clientHeight);
    });

    observer.observe(containerRef.current);

    return () => {
      isMounted = false;
      window.removeEventListener("resize", handleResize);
      observer.disconnect();
      globeInstance?._destructor?.();
    };
  }, []);

  /**
   * Update points data
   */
  useEffect(() => {
    if (!globeRef.current) return;

    const globe = globeRef.current;

    globe
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

        globe.pointOfView(
          {
            lat: point.lat,
            lng: point.lng,
            altitude: getAltitude(),
          },
          1000
        );
      })
      .onPointHover((point: Validator | null) => {
        document.body.style.cursor = point ? "pointer" : "default";
      });
  }, [validators, selected]);

  return (
    <>
      <div className="relative w-full h-dvh">
        <div ref={containerRef} className="w-full h-full" />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-md">
            <div className="text-white text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-400 mx-auto mb-3" />
              <p className="text-sm text-gray-400">
                Loading validators...
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="absolute top-4 left-4 bg-red-500/90 backdrop-blur px-4 py-2 rounded text-white shadow">
            {error}
          </div>
        )}

        {selected && (
          <div className="hidden md:block absolute top-0 right-0 w-80 h-full bg-black/60 backdrop-blur-xl border-l border-white/10 shadow-[0_0_40px_rgba(99,102,241,0.15)] text-white p-6 overflow-y-auto custom-scrollbar transition-all duration-300">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-violet-400 transition-colors text-2xl"
              onClick={() => setSelected(null)}
            >
              ✕
            </button>

            <h2 className="text-2xl font-semibold tracking-tight mt-8 mb-6">
              {selected.name}
            </h2>

            <div className="space-y-3 text-sm">
              {[
                ["ID", selected.id],
                ["Lat", `${selected.lat.toFixed(4)}°`],
                ["Lng", `${selected.lng.toFixed(4)}°`],
                ["Stake", `${selected.stake?.toLocaleString()} IOTA`],
                ["Status", selected.status],
                ["Uptime", `${selected.uptime?.toFixed(2)}%`],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.05]"
                >
                  <p className="text-gray-500 uppercase text-[11px] tracking-wider">
                    {label}
                  </p>

                  <p
                    className={`mt-1 ${
                      label === "Status"
                        ? selected.status === "active"
                          ? "text-violet-400"
                          : "text-gray-400"
                        : "font-mono"
                    }`}
                  >
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {selected && (
        <div
          className="fixed md:hidden inset-0 bg-black/40 z-40"
          onClick={() => setSelected(null)}
        />
      )}

      {selected && (
        <div className="fixed md:hidden bottom-6 left-4 right-4 z-50">
          <div className="bg-black/60 backdrop-blur-2xl border border-white/10 shadow-xl rounded-2xl p-5 text-white transition-all duration-300 ease-out">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-base font-semibold tracking-tight truncate">
                {selected.name}
              </h2>

              <button
                className="text-gray-400 hover:text-violet-400 transition-colors text-xl"
                onClick={() => setSelected(null)}
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                ["Stake", `${selected.stake?.toLocaleString()} IOTA`],
                ["Status", selected.status],
                ["Uptime", `${selected.uptime?.toFixed(2)}%`],
                ["Lat", `${selected.lat.toFixed(2)}°`],
                ["Lng", `${selected.lng.toFixed(2)}°`],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.05]"
                >
                  <p className="text-gray-500 uppercase text-[10px] tracking-wider">
                    {label}
                  </p>

                  <p
                    className={`mt-1 ${
                      label === "Status"
                        ? selected.status === "active"
                          ? "text-violet-400"
                          : "text-gray-400"
                        : "font-mono"
                    }`}
                  >
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}