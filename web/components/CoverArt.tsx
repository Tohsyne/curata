import Image from "next/image";
import { Placeholder } from "./Placeholder";

export function CoverArt({
  src,
  alt,
  ratio,
  radius,
  sizes,
  className = "",
}: {
  src?: string;
  alt: string;
  ratio: "2/3" | "4/3" | "1/1";
  radius: string;
  sizes: string;
  className?: string;
}) {
  if (!src) {
    return <Placeholder ratio={ratio} radius={radius} className={className} />;
  }
  return (
    <div
      className={`relative overflow-hidden ${radius} ${className}`}
      style={{ aspectRatio: ratio }}
    >
      <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" />
    </div>
  );
}
