import * as React from "react";

// Breakpoints: Mobile < 640px, Tablet 640-1023px, Desktop ≥ 1024px
const MOBILE_BREAKPOINT = 640;
const TABLET_BREAKPOINT = 1024;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(
    undefined
  );

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
}

export function useIsTablet() {
  const [isTablet, setIsTablet] = React.useState<boolean | undefined>(
    undefined
  );

  React.useEffect(() => {
    const mql = window.matchMedia(
      `(min-width: ${MOBILE_BREAKPOINT}px) and (max-width: ${TABLET_BREAKPOINT - 1}px)`
    );
    const onChange = () => {
      const width = window.innerWidth;
      setIsTablet(width >= MOBILE_BREAKPOINT && width < TABLET_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    const width = window.innerWidth;
    setIsTablet(width >= MOBILE_BREAKPOINT && width < TABLET_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isTablet;
}

export function useDeviceType(): "mobile" | "tablet" | "desktop" {
  const [deviceType, setDeviceType] = React.useState<
    "mobile" | "tablet" | "desktop"
  >("desktop");

  React.useEffect(() => {
    const updateDeviceType = () => {
      const width = window.innerWidth;
      if (width < MOBILE_BREAKPOINT) {
        setDeviceType("mobile");
      } else if (width >= MOBILE_BREAKPOINT && width < TABLET_BREAKPOINT) {
        setDeviceType("tablet");
      } else {
        setDeviceType("desktop");
      }
    };

    // Initial check
    updateDeviceType();

    // Listen to resize events
    const mobileMql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const tabletMql = window.matchMedia(
      `(min-width: ${MOBILE_BREAKPOINT}px) and (max-width: ${TABLET_BREAKPOINT - 1}px)`
    );
    const desktopMql = window.matchMedia(`(min-width: ${TABLET_BREAKPOINT}px)`);

    const handleChange = () => updateDeviceType();

    mobileMql.addEventListener("change", handleChange);
    tabletMql.addEventListener("change", handleChange);
    desktopMql.addEventListener("change", handleChange);

    return () => {
      mobileMql.removeEventListener("change", handleChange);
      tabletMql.removeEventListener("change", handleChange);
      desktopMql.removeEventListener("change", handleChange);
    };
  }, []);

  return deviceType;
}
