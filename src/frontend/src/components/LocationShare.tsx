import { useLocation } from "@/hooks/useLocation";
import {
  AlertCircle,
  Loader2,
  MapPin,
  MessageCircle,
  Share2,
} from "lucide-react";

// Vibrate on tap if supported
function vibrate() {
  if (typeof navigator !== "undefined" && navigator.vibrate) {
    navigator.vibrate(100);
  }
}

export function LocationShare() {
  const [location, fetchLocation, isLoading, error] = useLocation();

  const mapsUrl = location?.mapsUrl ?? null;

  const handleFetchLocation = () => {
    vibrate();
    fetchLocation();
  };

  const handleWhatsApp = () => {
    if (!mapsUrl) return;
    vibrate();
    const text = encodeURIComponent(`My current location: ${mapsUrl}`);
    window.open(`https://wa.me/?text=${text}`, "_blank", "noopener,noreferrer");
  };

  const handleSMS = () => {
    if (!mapsUrl) return;
    vibrate();
    const body = encodeURIComponent(`My current location: ${mapsUrl}`);
    window.open(`sms:?body=${body}`, "_self");
  };

  return (
    <section
      data-ocid="location.card"
      className="card-elevated p-5 space-y-4"
      aria-label="Share My Location"
    >
      {/* Section title */}
      <div className="flex items-center gap-2">
        <MapPin
          className="h-5 w-5 shrink-0 text-orange-500"
          aria-hidden="true"
        />
        <h2 className="font-display text-base font-bold tracking-tight text-foreground uppercase">
          Share My Location
        </h2>
      </div>

      {/* Send location button */}
      <button
        type="button"
        data-ocid="location.send_button"
        onClick={handleFetchLocation}
        disabled={isLoading}
        aria-label="Send my location"
        className={`button-emergency w-full flex items-center justify-center gap-3 px-4 font-display font-bold text-base tracking-wide text-white uppercase disabled:opacity-60 disabled:cursor-not-allowed ${isLoading ? "bg-blue-600" : "bg-orange-500 hover:bg-orange-600"}`}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
            <span data-ocid="location.loading_state">
              Getting your location…
            </span>
          </>
        ) : (
          <>
            <MapPin className="h-5 w-5" aria-hidden="true" />
            <span>{location ? "Refresh Location" : "Send My Location"}</span>
          </>
        )}
      </button>

      {/* Error state */}
      {error && (
        <div
          data-ocid="location.error_state"
          role="alert"
          className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3"
        >
          <AlertCircle
            className="mt-0.5 h-4 w-4 shrink-0 text-destructive"
            aria-hidden="true"
          />
          <p className="text-sm font-medium text-destructive leading-snug">
            {error === "Location access denied. Please allow location access."
              ? "Location access denied. Please enable location in your browser settings."
              : error}
          </p>
        </div>
      )}

      {/* Success: maps link + share buttons */}
      {mapsUrl && !error && (
        <div data-ocid="location.success_state" className="space-y-3">
          {/* Maps link */}
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-ocid="location.maps_link"
            className="flex items-center gap-2 rounded-lg bg-muted px-4 py-3 text-sm font-mono text-foreground break-all hover:bg-muted/70 transition-smooth"
            aria-label="Open location in Google Maps"
          >
            <Share2
              className="h-4 w-4 shrink-0 text-muted-foreground"
              aria-hidden="true"
            />
            <span className="truncate">{mapsUrl}</span>
          </a>

          {/* Share buttons */}
          <div className="grid grid-cols-2 gap-3">
            {/* WhatsApp */}
            <button
              type="button"
              data-ocid="location.whatsapp_button"
              onClick={handleWhatsApp}
              aria-label="Share location via WhatsApp"
              className="button-emergency flex items-center justify-center gap-2 px-3 font-display font-bold text-sm tracking-wide text-white uppercase bg-green-600 hover:bg-green-700"
            >
              <MessageCircle className="h-5 w-5" aria-hidden="true" />
              <span>WhatsApp</span>
            </button>

            {/* SMS */}
            <button
              type="button"
              data-ocid="location.sms_button"
              onClick={handleSMS}
              aria-label="Share location via SMS"
              className="button-emergency flex items-center justify-center gap-2 px-3 font-display font-bold text-sm tracking-wide text-white uppercase bg-blue-600 hover:bg-blue-700"
            >
              <MessageCircle className="h-5 w-5" aria-hidden="true" />
              <span>SMS</span>
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
