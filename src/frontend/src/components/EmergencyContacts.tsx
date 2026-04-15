import { useLocation } from "@/hooks/useLocation";
import type { EmergencyContact } from "@/types";
import { MapPin, Phone, Trash2, User, UserPlus, Users } from "lucide-react";
import { useCallback, useState } from "react";

interface Props {
  contacts: EmergencyContact[];
  addContact: (name: string, phone: string) => void;
  deleteContact: (id: string) => void;
}

// ─── Types ────────────────────────────────────────────────────────────────────

/** State for the "Send Location" flow per contact */
type SendState = "idle" | "loading" | "success" | "error";

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Silently vibrate when the API is supported */
function vibrate(ms = 100) {
  if ("vibrate" in navigator) navigator.vibrate(ms);
}

/** Open a WhatsApp link; fall back to SMS if WhatsApp cannot be detected */
function shareLocation(phone: string, mapsUrl: string) {
  const message = encodeURIComponent(
    `🚨 Emergency! I need help. My location: ${mapsUrl}`,
  );
  // WhatsApp deep-link (works on Android, iOS, and WhatsApp Web)
  const waUrl = `https://wa.me/${phone.replace(/\D/g, "")}?text=${message}`;
  // SMS fallback — opens the default SMS app with the body pre-filled
  const smsUrl = `sms:${phone}?body=${message}`;

  const opened = window.open(waUrl, "_blank");
  // If the browser blocked the pop-up (or WhatsApp isn't installed),
  // fall back gracefully to the SMS link in the same tab
  if (!opened) {
    window.location.href = smsUrl;
  }
}

// ─── ContactCard ──────────────────────────────────────────────────────────────

function ContactCard({
  contact,
  index,
  onDelete,
}: {
  contact: EmergencyContact;
  index: number;
  onDelete: () => void;
}) {
  // Each card manages its own location state — no prop drilling needed
  const [, fetchLocation, isLocationLoading] = useLocation();
  const [sendState, setSendState] = useState<SendState>("idle");

  // ── Call handler ────────────────────────────────────────────────────────────
  const handleCall = () => {
    vibrate(100);
    window.location.href = `tel:${contact.phone}`;
  };

  // ── Delete handler ──────────────────────────────────────────────────────────
  const handleDelete = () => {
    if (window.confirm(`Remove "${contact.name}" from emergency contacts?`)) {
      vibrate(50);
      onDelete();
    }
  };

  // ── Send Location handler ───────────────────────────────────────────────────
  const handleSendLocation = useCallback(() => {
    if (sendState === "loading" || isLocationLoading) return;

    vibrate(80);
    setSendState("loading");

    // Request fresh GPS coordinates directly instead of using cached state
    if (!navigator.geolocation) {
      setSendState("error");
      setTimeout(() => setSendState("idle"), 3000);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude: lat, longitude: lng } = position.coords;
        const mapsUrl = `https://maps.google.com/?q=${lat},${lng}`;
        // Also sync the shared hook so LocationShare section stays current
        fetchLocation();
        shareLocation(contact.phone, mapsUrl);
        setSendState("success");
        setTimeout(() => setSendState("idle"), 3000);
      },
      () => {
        setSendState("error");
        setTimeout(() => setSendState("idle"), 3000);
      },
      { timeout: 10000, maximumAge: 30000 },
    );
  }, [contact.phone, fetchLocation, isLocationLoading, sendState]);

  // ── Button label & styles based on send state ───────────────────────────────
  const sendBtnMeta: Record<
    SendState,
    { label: string; ariaLabel: string; extraClass: string }
  > = {
    idle: {
      label: "Send Location",
      ariaLabel: `Send location to ${contact.name}`,
      extraClass: "bg-teal-600 text-white hover:brightness-110 active:scale-95",
    },
    loading: {
      label: "Locating…",
      ariaLabel: "Fetching your GPS location",
      extraClass: "bg-teal-400 text-white cursor-wait opacity-80",
    },
    success: {
      label: "Sent ✓",
      ariaLabel: "Location sent successfully",
      extraClass: "bg-emerald-500 text-white scale-95",
    },
    error: {
      label: "Failed ✗",
      ariaLabel: "Failed to get location — tap to retry",
      extraClass:
        "bg-destructive text-destructive-foreground hover:brightness-110",
    },
  };

  const meta = sendBtnMeta[sendState];

  return (
    <div
      data-ocid={`contacts.item.${index}`}
      className="card-elevated px-4 py-3 space-y-3"
    >
      {/* ── Top row: avatar + info + delete ─────────────────────────────────── */}
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="flex-shrink-0 flex items-center justify-center w-11 h-11 rounded-full bg-primary/15 border border-primary/25">
          <User className="h-5 w-5 text-primary" aria-hidden="true" />
        </div>

        {/* Name & phone */}
        <div className="flex-1 min-w-0">
          <p className="font-display font-semibold text-foreground truncate leading-tight">
            {contact.name}
          </p>
          <p className="text-sm text-muted-foreground truncate">
            {contact.phone}
          </p>
        </div>

        {/* Delete */}
        <button
          type="button"
          data-ocid={`contacts.delete_button.${index}`}
          onClick={handleDelete}
          aria-label={`Delete ${contact.name}`}
          className="flex items-center justify-center min-h-[44px] min-w-[44px] rounded-lg
            bg-destructive/10 text-destructive border border-destructive/20
            transition-smooth hover:bg-destructive hover:text-destructive-foreground active:scale-95 focus-visible:outline-2"
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      {/* ── Bottom row: Call + Send Location ────────────────────────────────── */}
      <div className="flex gap-2">
        {/* Call button — blue/green (kept from original palette) */}
        <button
          type="button"
          data-ocid={`contacts.call_button.${index}`}
          onClick={handleCall}
          aria-label={`Call ${contact.name}`}
          className="flex-1 flex items-center justify-center gap-2 min-h-[64px] rounded-xl
            bg-green-600 text-white font-bold text-sm uppercase tracking-wide
            shadow-md transition-smooth hover:brightness-110 active:scale-95 focus-visible:outline-2"
        >
          <Phone className="h-5 w-5" aria-hidden="true" />
          Call
        </button>

        {/* Send Location button — teal, distinct from Call */}
        <button
          type="button"
          data-ocid={`contacts.send_location_button.${index}`}
          onClick={handleSendLocation}
          aria-label={meta.ariaLabel}
          disabled={sendState === "loading"}
          className={`flex-1 flex items-center justify-center gap-2 min-h-[64px] rounded-xl
            font-bold text-sm uppercase tracking-wide
            shadow-md transition-smooth focus-visible:outline-2
            ${meta.extraClass}`}
        >
          {sendState === "loading" ? (
            /* Spinner */
            <svg
              className="h-5 w-5 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
          ) : (
            <MapPin className="h-5 w-5" aria-hidden="true" />
          )}
          <span className="hidden sm:inline">{meta.label}</span>
          <span className="sm:hidden">
            {sendState === "loading"
              ? "…"
              : sendState === "success"
                ? "✓"
                : sendState === "error"
                  ? "✗"
                  : "Loc."}
          </span>
        </button>
      </div>

      {/* ── Inline feedback text (shown briefly after send attempt) ─────────── */}
      {sendState === "error" && (
        <p
          data-ocid={`contacts.send_location_error_state.${index}`}
          className="text-xs text-destructive font-medium text-center animate-fade-in"
        >
          Could not get your location. Check browser permissions and try again.
        </p>
      )}
      {sendState === "success" && (
        <p
          data-ocid={`contacts.send_location_success_state.${index}`}
          className="text-xs text-emerald-600 font-medium text-center animate-fade-in"
        >
          Location sent to {contact.name} via WhatsApp / SMS.
        </p>
      )}
    </div>
  );
}

// ─── AddContactForm ───────────────────────────────────────────────────────────

function AddContactForm({
  onAdd,
}: {
  onAdd: (name: string, phone: string) => void;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});

  const validate = () => {
    const next: { name?: string; phone?: string } = {};
    if (!name.trim()) next.name = "Name is required";
    if (!phone.trim()) next.phone = "Phone number is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    vibrate(80);
    onAdd(name.trim(), phone.trim());
    setName("");
    setPhone("");
    setErrors({});
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="card-elevated p-4 space-y-3"
      data-ocid="contacts.add_form"
    >
      <h3 className="font-display font-semibold text-foreground text-sm uppercase tracking-wide flex items-center gap-2">
        <UserPlus className="h-4 w-4 text-primary" aria-hidden="true" />
        Add New Contact
      </h3>

      {/* Name field */}
      <div className="space-y-1">
        <label
          htmlFor="contact-name"
          className="text-xs font-semibold text-muted-foreground uppercase tracking-wide"
        >
          Name
        </label>
        <input
          id="contact-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={() => {
            if (!name.trim())
              setErrors((p) => ({ ...p, name: "Name is required" }));
            else setErrors((p) => ({ ...p, name: undefined }));
          }}
          placeholder="Contact name"
          autoComplete="name"
          data-ocid="contacts.name_input"
          className={`w-full min-h-[48px] rounded-lg border px-4 py-2 text-foreground bg-input
            placeholder:text-muted-foreground/60 text-base
            focus:outline-none focus:ring-2 focus:ring-ring transition-smooth
            ${errors.name ? "border-destructive ring-1 ring-destructive" : "border-border"}`}
        />
        {errors.name && (
          <p
            data-ocid="contacts.name_field_error"
            className="text-xs text-destructive font-medium"
          >
            {errors.name}
          </p>
        )}
      </div>

      {/* Phone field */}
      <div className="space-y-1">
        <label
          htmlFor="contact-phone"
          className="text-xs font-semibold text-muted-foreground uppercase tracking-wide"
        >
          Phone Number
        </label>
        <input
          id="contact-phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          onBlur={() => {
            if (!phone.trim())
              setErrors((p) => ({ ...p, phone: "Phone number is required" }));
            else setErrors((p) => ({ ...p, phone: undefined }));
          }}
          placeholder="e.g. 9876543210"
          autoComplete="tel"
          inputMode="tel"
          data-ocid="contacts.phone_input"
          className={`w-full min-h-[48px] rounded-lg border px-4 py-2 text-foreground bg-input
            placeholder:text-muted-foreground/60 text-base
            focus:outline-none focus:ring-2 focus:ring-ring transition-smooth
            ${errors.phone ? "border-destructive ring-1 ring-destructive" : "border-border"}`}
        />
        {errors.phone && (
          <p
            data-ocid="contacts.phone_field_error"
            className="text-xs text-destructive font-medium"
          >
            {errors.phone}
          </p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        data-ocid="contacts.add_button"
        className="w-full min-h-[52px] rounded-lg bg-primary text-primary-foreground
          font-display font-bold text-base tracking-wide uppercase
          shadow-md transition-smooth hover:brightness-110 active:scale-95 focus-visible:outline-2
          flex items-center justify-center gap-2"
      >
        <UserPlus className="h-5 w-5" aria-hidden="true" />
        Add Contact
      </button>
    </form>
  );
}

// ─── EmergencyContacts (exported) ─────────────────────────────────────────────

export function EmergencyContacts({
  contacts,
  addContact,
  deleteContact,
}: Props) {
  return (
    <section
      data-ocid="contacts.section"
      aria-labelledby="contacts-heading"
      className="space-y-4 px-4 pb-4"
    >
      {/* Section title */}
      <div className="flex items-center gap-2 pt-2">
        <Users className="h-5 w-5 text-primary" aria-hidden="true" />
        <h2
          id="contacts-heading"
          className="font-display text-xl font-extrabold tracking-tight text-foreground uppercase"
        >
          Emergency Contacts
        </h2>
      </div>

      {/* Add form */}
      <AddContactForm onAdd={addContact} />

      {/* Contact list */}
      {contacts.length === 0 ? (
        <div
          data-ocid="contacts.empty_state"
          className="card-elevated flex flex-col items-center justify-center gap-3 py-10 px-6 text-center"
        >
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-muted">
            <Users
              className="h-7 w-7 text-muted-foreground"
              aria-hidden="true"
            />
          </div>
          <p className="font-display font-semibold text-foreground text-base">
            No emergency contacts yet
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
            Add contacts who should be alerted in emergencies — tap{" "}
            <strong>Send Location</strong> on any card to instantly share your
            GPS coordinates via WhatsApp or SMS.
          </p>
        </div>
      ) : (
        <ul
          data-ocid="contacts.list"
          className="space-y-3 list-none p-0 m-0"
          aria-label="Saved emergency contacts"
        >
          {contacts.map((contact, i) => (
            <li key={contact.id} className="list-none">
              <ContactCard
                contact={contact}
                index={i + 1}
                onDelete={() => deleteContact(contact.id)}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
