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
      {/* Subtle bottom fade only — keep hero video unobstructed */}
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-b from-transparent to-background/80 pointer-events-none" />
    </div>
  );
};
