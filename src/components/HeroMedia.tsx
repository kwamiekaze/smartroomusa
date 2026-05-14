import heroImage from "@/assets/hero-lobby.jpg";

interface HeroMediaProps {
  /** Optional video src for future swap-in. When provided, renders a looping video instead of the image. */
  videoSrc?: string;
  poster?: string;
}

/**
 * Cinematic hero media container.
 * Maintains stable aspect ratio + overlay so an image can later be swapped for a looped video
 * without breaking the layout.
 */
export const HeroMedia = ({ videoSrc, poster = heroImage }: HeroMediaProps) => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {videoSrc ? (
        <video
          className="h-full w-full object-cover"
          src={videoSrc}
          poster={poster}
          autoPlay
          loop
          muted
          playsInline
        />
      ) : (
        <img
          src={heroImage}
          alt="Smart Room USA luxury lobby with warm gold lighting"
          className="h-full w-full object-cover"
          width={1536}
          height={1024}
        />
      )}
      {/* Cinematic gradient overlays */}
      <div className="absolute inset-0 bg-gradient-hero" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,hsl(var(--background)/0.7)_100%)]" />
    </div>
  );
};
