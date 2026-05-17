import { useEffect, useRef, useState } from "react";

const RETURN_FLAG = "returnToLobby";

/** Programmatically trigger the splash as a "return to lobby" transition. */
export const triggerReturnToLobby = () => {
  try { sessionStorage.setItem(RETURN_FLAG, "1"); } catch {}
  // Hard navigate so the SplashScreen on / mounts fresh and detects the flag
  window.location.href = "/";
};

/**
 * Splash video.
 * - Initial mobile landing: plays once, no "tap to continue" hint.
 * - Return-to-lobby (any device): plays with a "tap to continue" hint.
 */
export const SplashScreen = () => {
  const [show, setShow] = useState(false);
  const [fading, setFading] = useState(false);
  const [isReturn, setIsReturn] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    let returning = false;
    try {
      returning = sessionStorage.getItem(RETURN_FLAG) === "1";
      if (returning) sessionStorage.removeItem(RETURN_FLAG);
    } catch {}
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    if (returning) {
      setIsReturn(true);
      setShow(true);
    } else if (isMobile) {
      setShow(true);
    }
  }, []);

  useEffect(() => {
    if (!show) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
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
      {isReturn && (
        <div className="pointer-events-none absolute bottom-10 left-1/2 -translate-x-1/2 text-center">
          <span className="px-4 py-2 rounded-full bg-black/55 backdrop-blur-md text-white/95 text-xs sm:text-sm uppercase tracking-[0.3em] animate-pulse">
            Tap to continue
          </span>
        </div>
      )}
    </div>
  );
};
