"use client";

import { useEffect, useRef, useState } from "react";

export function useGlobe(
  containerRef: React.RefObject<HTMLDivElement | null>
) {
  const globeRef = useRef<any>(null);
  const [isReady, setIsReady] = useState(false);

  const getAltitude = () => {
    if (typeof window === "undefined") return 2;
    if (window.innerWidth < 640) return 3.2;
    if (window.innerWidth < 1024) return 2.6;
    return 1.5;
  };

  useEffect(() => {
    if (!containerRef.current) return;

    let globeInstance: any;
    let isMounted = true;

    const init = async () => {
      const GlobeModule = await import("globe.gl");

      if (!isMounted || !containerRef.current) return;

      const Globe = GlobeModule.default as any;

      globeInstance = Globe()(containerRef.current)
        .globeImageUrl("//unpkg.com/three-globe/example/img/earth-night.jpg")
        .backgroundColor("#020204");

      globeInstance.atmosphereColor("#6366f1");
      globeInstance.atmosphereAltitude(0.15);

      globeRef.current = globeInstance;

      globeInstance
        .width(containerRef.current.clientWidth)
        .height(containerRef.current.clientHeight);

      globeInstance.pointOfView({ altitude: getAltitude() }, 0);

      setIsReady(true);
    };

    init();

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

    if (containerRef.current) observer.observe(containerRef.current);

    return () => {
      isMounted = false;
      window.removeEventListener("resize", handleResize);
      observer.disconnect();
      globeInstance?._destructor?.();
    };
  }, [containerRef]);

  return { globeRef, getAltitude, isReady };
}