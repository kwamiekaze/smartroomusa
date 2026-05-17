import { useEffect, useRef, useState } from "react";
import { X, Calendar as CalendarIcon } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TourModalProps {
  open: boolean;
  onClose: () => void;
}

const TOUR_VIDEO = "/tour.mp4";
const TOUR_POSTER = "/tour-last.jpg";

/**
 * Cinematic tour-request experience: plays a short luxury intro video,
 * then transitions seamlessly into a booklet-style form whose layout
 * matches the final frame of the video.
 */
export const TourModal = ({ open, onClose }: TourModalProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [income, setIncome] = useState("");

  // Preload video once on mount so first click plays instantly
  useEffect(() => {
    const v = document.createElement("video");
    v.src = TOUR_VIDEO;
    v.preload = "auto";
    v.muted = true;
    // hint browser to fetch
    try {
      v.load();
    } catch {}
  }, []);

  // Lock body scroll while open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Reset + start playback whenever modal opens
  useEffect(() => {
    if (!open) return;
    setShowForm(false);
    setSubmitting(false);
    setIncome("");

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
        if (attempt < 2) {
          setTimeout(() => tryPlay(attempt + 1), 120);
        } else {
          // Give up gracefully -> jump straight to form
          setShowForm(true);
        }
      }
    };
    tryPlay();
    return () => {
      cancelled = true;
    };
  }, [open]);

  const finishVideo = () => {
    const v = videoRef.current;
    if (v) {
      try {
        v.pause();
        if (v.duration && isFinite(v.duration)) {
          v.currentTime = Math.max(0, v.duration - 0.05);
        }
      } catch {}
    }
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name") || "").trim(),
      phone: String(fd.get("phone") || "").trim(),
      email: String(fd.get("email") || "").trim(),
      movein: String(fd.get("movein") || "").trim(),
      income: String(fd.get("income") || "").trim(),
      message: String(fd.get("message") || "").trim(),
      source: "tour" as const,
    };
    try {
      const { submitBooking } = await import("@/lib/bookings");
      await submitBooking(payload);
      toast.success("Tour request received", {
        description: "We'll reach out shortly to confirm your tour.",
      });
      onClose();
    } catch (err: any) {
      toast.error(err?.message || "Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[120] bg-black animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-label="Schedule a tour"
    >
      {/* Cinematic intro video — hidden once form is shown so transition is seamless */}
      {!showForm && (
        <video
          ref={videoRef}
          src={TOUR_VIDEO}
          poster={TOUR_POSTER}
          autoPlay
          muted
          playsInline
          preload="auto"
          onEnded={finishVideo}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}

      {/* Skip — only while video is playing */}
      {!showForm && (
        <button
          type="button"
          onClick={finishVideo}
          aria-label="Skip intro"
          className="absolute top-4 right-4 z-30 h-10 w-10 grid place-items-center rounded-full bg-black/45 backdrop-blur text-white/90 hover:bg-black/70 transition"
        >
          <X className="h-5 w-5" />
        </button>
      )}

      {/* Form — styled to match the final frame of the video exactly */}
      {showForm && (
        <div
          className="absolute inset-0 z-20 overflow-y-auto animate-in fade-in duration-300"
          style={{
            background:
              "radial-gradient(ellipse at center, #3a2418 0%, #1a0f08 70%, #0a0604 100%)",
          }}
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="fixed top-4 right-4 z-30 h-10 w-10 grid place-items-center rounded-full bg-black/60 backdrop-blur text-white hover:bg-black/80 transition"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="min-h-full flex justify-center px-4 py-6 sm:py-10">
            <div
              className="relative w-full max-w-[520px] px-6 sm:px-10 py-8 sm:py-10"
              style={{
                background:
                  "linear-gradient(180deg, #f5ecd9 0%, #efe2c4 100%)",
                boxShadow:
                  "0 35px 80px -20px rgba(0,0,0,0.85), 0 10px 30px -10px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.6)",
              }}
            >
              <form onSubmit={handleSubmit} className="space-y-5">
                <Field label="Full Name">
                  <Input name="name" required autoComplete="name" className="bookField" />
                </Field>

                <Field label="Phone Number">
                  <Input name="phone" type="tel" required autoComplete="tel" inputMode="tel" className="bookField" />
                </Field>

                <Field label="Email">
                  <Input name="email" type="email" required autoComplete="email" inputMode="email" className="bookField" />
                </Field>

                <Field label="Desired Move-In Date">
                  <div className="relative">
                    <Input name="movein" type="date" required className="bookField pr-12" />
                    <CalendarIcon
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#1a1a1a]"
                      aria-hidden
                    />
                  </div>
                </Field>

                <Field label="Proof of Income">
                  <Select value={income} onValueChange={setIncome}>
                    <SelectTrigger className="bookField">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent className="z-[200]">
                      <SelectItem value="paystub">Pay stub available</SelectItem>
                      <SelectItem value="offer">Offer letter</SelectItem>
                      <SelectItem value="bank">Bank statement</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <input type="hidden" name="income" value={income} />
                </Field>

                <Field label="Message">
                  <Textarea
                    name="message"
                    rows={4}
                    className="bookField resize-none"
                  />
                </Field>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full mt-2 rounded-[10px] py-4 font-bold text-[#1a1a1a] text-lg shadow-md hover:brightness-105 transition active:scale-[0.99] disabled:opacity-70"
                  style={{
                    background:
                      "linear-gradient(180deg, #e6a83a 0%, #d18a1e 100%)",
                  }}
                >
                  {submitting ? "Submitting…" : "Submit Tour Request"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Field = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="space-y-2">
    <Label className="block text-[#0c0c0c] font-bold text-[15px] tracking-tight">
      {label}
    </Label>
    {children}
  </div>
);
