import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface RoomsIntroModalProps {
  open: boolean;
  onClose: () => void;
}

const ROOMS_VIDEO = "/rooms-intro.mp4";

/**
 * Cinematic intro that plays before navigating to the Rooms page.
 * Mirrors the TourModal pattern — video plays, then on end/skip we
 * navigate to /rooms so the rooms list is the "reveal".
 */
export const RoomsIntroModal = ({ open, onClose }: RoomsIntroModalProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const navigate = useNavigate();

  // Preload once so first click plays instantly
  useEffect(() => {
    const v = document.createElement("video");
    v.src = ROOMS_VIDEO;
    v.preload = "auto";
    v.muted = true;
    try { v.load(); } catch {}
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const v = videoRef.current;
    if (!v) return;
    let cancelled = false;
    const tryPlay = async (attempt = 0) => {
      try {
        v.muted = true;
        v.currentTime = 0;
        await v.play();
      } catch {
        if (cancelled) return;
        if (attempt < 2) setTimeout(() => tryPlay(attempt + 1), 120);
        else finish();
      }
    };
    tryPlay();
    return () => { cancelled = true; };
  }, [open]);

  const finish = () => {
    onClose();
    navigate("/rooms");
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[120] bg-black animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-label="Entering the rooms"
    >
      <video
        ref={videoRef}
        src={ROOMS_VIDEO}
        autoPlay
        muted
        playsInline
        preload="auto"
        onEnded={finish}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <button
        type="button"
        onClick={finish}
        aria-label="Skip intro"
        className="absolute top-4 right-4 z-30 h-10 w-10 grid place-items-center rounded-full bg-black/45 backdrop-blur text-white/90 hover:bg-black/70 transition"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
};
