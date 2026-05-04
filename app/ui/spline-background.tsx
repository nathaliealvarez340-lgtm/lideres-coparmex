export function SplineBackground() {
  return (
    <div className="background-wrapper" aria-hidden="true">
      <video
        className="background-video"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src="/background.mp4" type="video/mp4" />
      </video>
    </div>
  );
}
