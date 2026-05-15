import { useEffect, useRef, useState } from "react";
import { X, CalendarDays } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
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

/**
 * Plays the splash/tour video full-screen, then transitions into a
 * book-style "Schedule a Tour" form on the last frame.
 */
export const TourModal = ({ open, onClose }: TourModalProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Reset state whenever modal opens
  useEffect(() => {
    if (open) {
      setShowForm(false);
      setSubmitting(false);
      // try to play (some browsers need explicit call)
      const v = videoRef.current;
      if (v) {
        v.currentTime = 0;
        v.play().catch(() => {
          // autoplay blocked — show form straight away
          setShowForm(true);
        });
      }
    }
  }, [open]);

  // Lock body scroll while open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const handleVideoEnd = () => {
    // freeze on last frame
    const v = videoRef.current;
    if (v) {
      try {
        v.pause();
        v.currentTime = Math.max(0, (v.duration || 0) - 0.05);
      } catch {}
    }
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      toast.success("Tour request received", {
        description: "We'll reach out shortly to confirm your tour.",
      });
      onClose();
    }, 400);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[120] bg-black flex items-center justify-center animate-in fade-in duration-300"
      role="dialog"
      aria-modal="true"
      aria-label="Schedule a tour"
    >
      {/* Video stays mounted as the backdrop; final frame remains visible behind the form */}
      <video
        ref={videoRef}
        src="/splash.mp4"
        autoPlay
        muted
        playsInline
        onEnded={handleVideoEnd}
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Skip button — only while video plays */}
      {!showForm && (
        <button
          type="button"
          onClick={handleVideoEnd}
          aria-label="Skip intro"
          className="absolute top-4 right-4 z-10 h-10 w-10 grid place-items-center rounded-full bg-black/50 backdrop-blur text-white/90 hover:bg-black/70 transition"
        >
          <X className="h-5 w-5" />
        </button>
      )}

      {/* Close button — once form is visible */}
      {showForm && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 z-20 h-10 w-10 grid place-items-center rounded-full bg-black/60 backdrop-blur text-white hover:bg-black/80 transition"
        >
          <X className="h-5 w-5" />
        </button>
      )}

      {/* Form — appears after video ends, styled like an open journal page */}
      {showForm && (
        <div className="absolute inset-0 z-10 overflow-y-auto bg-black/55 backdrop-blur-sm animate-in fade-in duration-500">
          <div className="min-h-full flex items-start sm:items-center justify-center p-3 sm:p-6">
            <div
              className="relative w-full max-w-md sm:max-w-lg rounded-[20px] p-5 sm:p-8 shadow-2xl border animate-in zoom-in-95 slide-in-from-bottom-4 duration-500"
              style={{
                background:
                  "linear-gradient(180deg, #f6ecd8 0%, #efe1c4 100%)",
                borderColor: "rgba(120, 80, 30, 0.35)",
                boxShadow:
                  "0 25px 60px -10px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.5)",
              }}
            >
              {/* Decorative book spine line */}
              <div className="absolute left-0 top-6 bottom-6 w-1 rounded-r bg-[rgba(120,80,30,0.25)]" />

              <div className="text-center mb-5 sm:mb-6">
                <div className="inline-flex items-center gap-2 text-[10px] sm:text-xs uppercase tracking-[0.3em] text-[#6b4a1f]">
                  <CalendarDays className="h-3.5 w-3.5" />
                  Schedule a Tour
                </div>
                <h2
                  className="font-serif text-2xl sm:text-3xl mt-2 text-[#1a1a1a]"
                  style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                >
                  Reserve Your Visit
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4">
                <Field label="Full Name">
                  <Input
                    name="name"
                    required
                    placeholder="Jane Doe"
                    className="bg-transparent border-[#1a1a1a]/70 text-[#1a1a1a] placeholder:text-[#1a1a1a]/40 rounded-lg h-11"
                  />
                </Field>

                <Field label="Phone Number">
                  <Input
                    name="phone"
                    type="tel"
                    required
                    placeholder="(555) 555-5555"
                    className="bg-transparent border-[#1a1a1a]/70 text-[#1a1a1a] placeholder:text-[#1a1a1a]/40 rounded-lg h-11"
                  />
                </Field>

                <Field label="Email">
                  <Input
                    name="email"
                    type="email"
                    required
                    placeholder="you@email.com"
                    className="bg-transparent border-[#1a1a1a]/70 text-[#1a1a1a] placeholder:text-[#1a1a1a]/40 rounded-lg h-11"
                  />
                </Field>

                <Field label="Desired Move-In Date">
                  <Input
                    name="movein"
                    type="date"
                    required
                    className="bg-transparent border-[#1a1a1a]/70 text-[#1a1a1a] rounded-lg h-11"
                  />
                </Field>

                <Field label="Proof of Income">
                  <Select name="income">
                    <SelectTrigger className="bg-transparent border-[#1a1a1a]/70 text-[#1a1a1a] rounded-lg h-11">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="paystub">Pay stub available</SelectItem>
                      <SelectItem value="offer">Offer letter</SelectItem>
                      <SelectItem value="bank">Bank statement</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>

                <Field label="Message">
                  <Textarea
                    name="message"
                    rows={3}
                    placeholder="Anything we should know?"
                    className="bg-transparent border-[#1a1a1a]/70 text-[#1a1a1a] placeholder:text-[#1a1a1a]/40 rounded-lg resize-none"
                  />
                </Field>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full mt-2 rounded-xl py-3.5 font-semibold text-[#1a1a1a] text-base sm:text-lg shadow-md hover:shadow-lg transition active:scale-[0.99] disabled:opacity-70"
                  style={{
                    background:
                      "linear-gradient(180deg, #e8a93a 0%, #d18a1e 100%)",
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
  <div className="space-y-1.5">
    <Label className="text-[#1a1a1a] font-semibold text-sm">{label}</Label>
    {children}
  </div>
);
