import Image from "next/image";

type Props = { src?: string; alt: string; label: string; className?: string; sizes?: string };

// Thin-bezel phone, 38px radius (§5.2). Without a screenshot it renders an honest "screenshot pending" frame.
export function PhoneMockup({ src, alt, label, className = "", sizes = "200px" }: Props) {
  return (
    <div className={`phone ${className}`}>
      <div className="phone__screen">
        {src ? (
          <Image src={src} alt={alt} fill sizes={sizes} unoptimized className="phone__img" />
        ) : (
          <div className="phone__pending" role="img" aria-label={`${alt}: screenshot pending`}>
            <span className="phone__notch" aria-hidden="true" />
            <span className="label">{label}</span>
            <span className="phone__pending-text">screenshot pending</span>
          </div>
        )}
      </div>
    </div>
  );
}
