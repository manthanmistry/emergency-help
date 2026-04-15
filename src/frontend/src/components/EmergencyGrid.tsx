import {
  AlertTriangle,
  Baby,
  Brain,
  Car,
  Flame,
  Heart,
  Monitor,
  Shield,
  Siren,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

interface EmergencyServiceDef {
  id: string;
  name: string;
  subtitle: string;
  phone: string;
  Icon: LucideIcon;
  /** Tailwind bg class for the button */
  bgClass: string;
  /** Tailwind bg hover class */
  hoverClass: string;
}

// ── Service definitions ───────────────────────────────────────────────────────

const SERVICES: EmergencyServiceDef[] = [
  {
    id: "ambulance",
    name: "Ambulance",
    subtitle: "Medical Emergency",
    phone: "108",
    Icon: Siren,
    bgClass: "bg-red-600",
    hoverClass: "hover:bg-red-700",
  },
  {
    id: "police",
    name: "Police",
    subtitle: "Report Crime or Danger",
    phone: "100",
    Icon: Shield,
    bgClass: "bg-blue-600",
    hoverClass: "hover:bg-blue-700",
  },
  {
    id: "fire",
    name: "Fire Brigade",
    subtitle: "Report a Fire",
    phone: "101",
    Icon: Flame,
    bgClass: "bg-orange-500",
    hoverClass: "hover:bg-orange-600",
  },
  {
    id: "women",
    name: "Women Helpline",
    subtitle: "Safety & Support",
    phone: "1091",
    Icon: Heart,
    bgClass: "bg-pink-500",
    hoverClass: "hover:bg-pink-600",
  },
  {
    id: "child",
    name: "Child Helpline",
    subtitle: "Child Safety",
    phone: "1098",
    Icon: Baby,
    bgClass: "bg-pink-400",
    hoverClass: "hover:bg-pink-500",
  },
  {
    id: "disaster",
    name: "Disaster Mgmt",
    subtitle: "Earthquake, Flood",
    phone: "1078",
    Icon: AlertTriangle,
    bgClass: "bg-orange-600",
    hoverClass: "hover:bg-orange-700",
  },
  {
    id: "road",
    name: "Road Accident",
    subtitle: "Accident Emergency",
    phone: "1073",
    Icon: Car,
    bgClass: "bg-orange-500",
    hoverClass: "hover:bg-orange-600",
  },
  {
    id: "senior",
    name: "Senior Citizen",
    subtitle: "Elder Care Helpline",
    phone: "14567",
    Icon: Users,
    bgClass: "bg-blue-500",
    hoverClass: "hover:bg-blue-600",
  },
  {
    id: "mental",
    name: "KIRAN Mental Health",
    subtitle: "Emotional Support",
    phone: "18005990019",
    Icon: Brain,
    bgClass: "bg-violet-600",
    hoverClass: "hover:bg-violet-700",
  },
  {
    id: "cyber",
    name: "Cyber Crime",
    subtitle: "Online Crime Help",
    phone: "1930",
    Icon: Monitor,
    bgClass: "bg-blue-700",
    hoverClass: "hover:bg-blue-800",
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function vibrate() {
  if ("vibrate" in navigator) {
    navigator.vibrate(100);
  }
}

function dial(phone: string) {
  vibrate();
  window.location.href = `tel:${phone}`;
}

// ── ServiceButton ─────────────────────────────────────────────────────────────

interface ServiceButtonProps {
  service: EmergencyServiceDef;
  index: number;
}

function ServiceButton({ service, index }: ServiceButtonProps) {
  const { name, subtitle, phone, Icon, bgClass, hoverClass } = service;

  // Display phone: format long toll-free numbers nicely
  const displayPhone =
    phone.length >= 10
      ? phone.replace(/^(\d{4})(\d{3})(\d{4})$/, "$1-$2-$3")
      : phone;

  return (
    <button
      type="button"
      data-ocid={`services.item.${index + 1}`}
      aria-label={`Call ${name} at ${displayPhone}`}
      onClick={() => dial(phone)}
      className={[
        "button-emergency",
        bgClass,
        hoverClass,
        "flex flex-col items-center justify-center gap-1.5",
        "w-full px-3 py-4 min-h-[80px]",
        "rounded-2xl shadow-md",
        "hover:scale-105 active:scale-95",
        "transition-all duration-200 ease-out",
        "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/60",
        "select-none cursor-pointer",
      ].join(" ")}
    >
      {/* Icon */}
      <Icon
        className="h-8 w-8 text-white drop-shadow"
        aria-hidden="true"
        strokeWidth={2}
      />

      {/* Service name */}
      <span className="font-display text-xs font-extrabold uppercase tracking-wide text-white leading-tight text-center line-clamp-1">
        {name}
      </span>

      {/* Subtitle */}
      <span className="text-[10px] font-medium text-white/85 leading-tight text-center line-clamp-2 min-w-0">
        {subtitle}
      </span>

      {/* Phone number */}
      <span className="mt-0.5 rounded-full bg-black/20 px-2 py-0.5 text-[10px] font-bold text-white/95 tracking-wider">
        {displayPhone}
      </span>
    </button>
  );
}

// ── EmergencyGrid ─────────────────────────────────────────────────────────────

export function EmergencyGrid() {
  return (
    <section
      data-ocid="services.section"
      aria-label="Emergency Services"
      className="px-4 pb-2"
    >
      {/* Section title */}
      <h2 className="mb-4 text-center font-display text-xl font-extrabold uppercase tracking-tight text-foreground">
        Emergency Services
      </h2>

      {/* Responsive grid: 2 cols mobile → 3 tablet → 4 desktop */}
      <div
        data-ocid="services.list"
        className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
      >
        {SERVICES.map((service, index) => (
          <ServiceButton key={service.id} service={service} index={index} />
        ))}
      </div>
    </section>
  );
}

export default EmergencyGrid;
