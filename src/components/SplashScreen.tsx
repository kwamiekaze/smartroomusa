import { useEffect, useRef, useState } from "react";

/**
 * Mobile-only splash video that plays on first landing.
 * Tap anywhere to skip. Auto-dismisses when the video ends.
 */
export const SplashScreen = () => {
  const [show, setShow] = useState(false);
  const [fading, setFading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    if (!isMobile) return;
    setShow(true);
  }, []);

  useEffect(() => {
    if (!show) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [show]);

  const dismiss = () => {
    if (fading) return;
    setFading(true);
    setTimeout(() => {
      setShow(false);
      document.body.style.overflow = "";
    }, 350);
  };

  if (!show) return null;

  return (
    <div
      onClick={dismiss}
      onTouchStart={dismiss}
      role="button"
      aria-label="Skip intro"
      className={`fixed inset-0 z-[100] bg-black flex items-center justify-center transition-opacity duration-300 ${
        fading ? "opacity-0" : "opacity-100"
      }`}
    >
      <video
        ref={videoRef}
        src="/splash.mp4"
        autoPlay
        muted
        playsInline
        onEnded={dismiss}
        className="h-full w-full object-cover"
      />
    </div>
  );
};
