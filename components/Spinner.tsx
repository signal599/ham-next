// The classic spoke wheel, drawn rather than animated frame by frame: twelve
// static spokes whose opacity steps down around the ring, with the whole SVG
// rotated by CSS. A GIF would be the other way round — a fixed grid of pixels
// at one size and one colour, baked in at export time.
//
// Drawing it instead means it stays crisp at any size or device pixel ratio,
// inherits its colour from the text around it via currentColor, costs no
// network request, and stops moving for anyone who has asked their system to
// reduce motion. Nothing about a spinner needs a raster.

const SPOKES = 12;

export default function Spinner({
  className = "",
  ...props
}: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`size-8 animate-spin motion-reduce:animate-none ${className}`}
      {...props}
    >
      {Array.from({ length: SPOKES }, (_, i) => (
        <line
          key={i}
          x1="12"
          y1="3"
          x2="12"
          y2="7"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          // The trailing spokes fade rather than vanish, so the wheel reads as
          // one object turning instead of a light jumping between twelve.
          opacity={0.15 + (0.85 * i) / (SPOKES - 1)}
          transform={`rotate(${(360 / SPOKES) * i} 12 12)`}
        />
      ))}
    </svg>
  );
}
