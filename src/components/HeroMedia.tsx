interface HeroMediaProps {
  /** Optional video src. When provided, renders a looping video. */
  videoSrc?: string;
  poster?: string;
}

/**
 * Cinematic hero media container.
 * Renders a looping muted video. No fallback poster image is used so the
 * previous lobby placeholder never flashes during loading.
 */
export const HeroMedia = ({ videoSrc }: HeroMediaProps) => {
  return (
    <div className="absolute inset-0 overflow-hidden bg-background">
      {videoSrc && (
        <video
          className="h-full w-full object-cover"
          src={videoSrc}
          autoPlay
          loop
          muted
          playsInline
        />
      )}
      {/* Subtle bottom fade only — keep hero video unobstructed */}
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-b from-transparent to-background/80 pointer-events-none" />
    </div>
  );
};
