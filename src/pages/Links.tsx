import React from "react";
import { Globe, CalendarDays, Instagram } from "lucide-react";

/* ── SVG logos ──────────────────────────────────────────────────── */
const AppleLogo = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
  </svg>
);

const PlayStoreLogo = () => (
  <svg width="20" height="20" viewBox="0 0 512 512" fill="none">
    <path d="M48 432 L48 80 L304 256 Z" fill="#34A853" />
    <path d="M48 80 L304 256 L384 176 L96 16 Q64 0 48 80Z" fill="#4285F4" />
    <path
      d="M48 432 L304 256 L384 336 L96 496 Q64 512 48 432Z"
      fill="#EA4335"
    />
    <path
      d="M304 256 L384 176 L448 216 Q480 240 448 296 L384 336 Z"
      fill="#FBBC05"
    />
  </svg>
);

/* ── Link data ──────────────────────────────────────────────────── */
type LinkItem = {
  label: string;
  sublabel?: string;
  href: string;
  external: boolean;
  icon: React.ReactNode;
  variant: "primary" | "store" | "event";
};

const links: LinkItem[] = [
  {
    label: "Visit our Website",
    href: "/",
    external: false,
    icon: <Globe className="w-5 h-5 text-white" />,
    variant: "primary",
  },
  {
    label: "Google Play",
    sublabel: "Download for Android",
    href: "https://play.google.com/store/apps/details?id=com.convooapp.convoo",
    external: true,
    icon: <PlayStoreLogo />,
    variant: "store",
  },
  {
    label: "App Store",
    sublabel: "Download for iOS",
    href: "https://apps.apple.com/us/app/convoo/id6746660683",
    external: true,
    icon: <AppleLogo />,
    variant: "store",
  },
  {
    label: "Attend our next In-Person Event",
    href: "https://docs.google.com/forms/d/e/1FAIpQLSe0yc7uAKOl1qPBD7mgRDKg0InDBWTvXSSrS9_oF8B13I13tg/viewform?usp=dialog",
    external: true,
    icon: <CalendarDays className="w-5 h-5 text-pink-400" />,
    variant: "event",
  },
];

/* ── Variant styles ─────────────────────────────────────────────── */
const variantClass: Record<LinkItem["variant"], string> = {
  primary:
    "bg-gradient-to-r from-pink-600 to-pink-500 text-white shadow-[0_0_20px_rgba(236,72,153,0.35)] hover:shadow-[0_0_28px_rgba(236,72,153,0.55)]",
  store:
    "bg-white/8 border border-white/12 text-white hover:bg-white/14 hover:border-white/20",
  event:
    "bg-transparent border-2 border-pink-500/70 text-pink-300 hover:bg-pink-500/10 hover:border-pink-400",
};

/* ── Component ──────────────────────────────────────────────────── */
const Links: React.FC = () => {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-5 py-14"
      style={{
        background:
          "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(190,24,93,0.18) 0%, transparent 70%), #0B0B0F",
      }}
    >
      {/* ── Profile / Brand ── */}
      <div className="flex flex-col items-center mb-10">
        {/* Logo ring */}

        <img
          src="assets/Convoo-logo-removebg-preview.png"
          alt="Convoo"
          className="w-28 h-28 object-contain mb-1"
        />

        {/* Brand name */}
        <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-pink-600 mb-1">
          Convoo
        </h1>

        {/* Tagline */}
        <p className="text-white/50 text-sm text-center max-w-[220px] leading-relaxed">
          It starts with a conversation.
        </p>
      </div>

      {/* ── Link Buttons ── */}
      <div className="w-full max-w-[340px] flex flex-col gap-3">
        {links.map(({ label, sublabel, href, external, icon, variant }) => (
          <a
            key={label}
            href={href}
            {...(external
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
            className={`
              flex items-center gap-3 px-5 py-[14px] rounded-2xl
              font-medium text-sm backdrop-blur-sm
              transition-all duration-200 ease-out
              hover:scale-[1.025] active:scale-[0.98]
              ${variantClass[variant]}
            `}
          >
            {/* Icon container */}
            <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-xl bg-white/10">
              {icon}
            </span>

            {/* Text */}
            {sublabel ? (
              <span className="flex flex-col flex-1 text-center">
                <span className="text-white/50 text-[10px] font-normal leading-none mb-0.5">
                  {sublabel}
                </span>
                <span className="font-semibold text-[15px] leading-tight">
                  {label}
                </span>
              </span>
            ) : (
              <span className="flex-1 text-center font-semibold text-[15px]">
                {label}
              </span>
            )}
          </a>
        ))}
      </div>

      {/* ── Footer ── */}
      <div className="mt-12 flex flex-col items-center gap-1.5">
        <div className="flex items-center gap-1.5 text-white/35 text-xs">
          <Instagram className="w-3.5 h-3.5" />
          <span>@convooapp</span>
        </div>
        <span className="text-white/18 text-[11px]">
          © {new Date().getFullYear()} Convoo
        </span>
      </div>
    </div>
  );
};

export default Links;
