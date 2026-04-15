import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AlertTriangle, BellRing, CheckCircle2 } from "lucide-react";
import { useCallback, useState } from "react";

type AlertState = "idle" | "sent";

export function PanicButton() {
  const [open, setOpen] = useState(false);
  const [alertState, setAlertState] = useState<AlertState>("idle");

  // Vibration pattern for panic signal
  const vibrate = useCallback(() => {
    if ("vibrate" in navigator) {
      navigator.vibrate([200, 100, 200, 100, 200]);
    }
  }, []);

  const handleConfirm = useCallback(() => {
    setOpen(false);
    vibrate();

    // Call Police (100)
    window.open("tel:100", "_self");

    setAlertState("sent");

    // Reset visual feedback after 4 seconds
    setTimeout(() => setAlertState("idle"), 4000);
  }, [vibrate]);

  const isSent = alertState === "sent";

  return (
    <section data-ocid="panic.section" aria-labelledby="panic-heading">
      <div className="card-elevated mx-auto w-full max-w-md p-4">
        <h2
          id="panic-heading"
          className="mb-3 text-center font-display text-base font-bold uppercase tracking-widest text-foreground"
        >
          Emergency
        </h2>

        <Dialog open={open} onOpenChange={setOpen}>
          {/* ── Panic trigger button ──────────────────────────── */}
          <DialogTrigger asChild>
            <button
              data-ocid="panic.open_modal_button"
              type="button"
              disabled={isSent}
              aria-label="Panic — Call Police (100)"
              className={[
                "button-panic",
                "relative w-full flex items-center justify-center gap-3 px-6",
                "font-display text-2xl font-extrabold uppercase tracking-widest text-white",
                "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-red-400 focus-visible:ring-offset-2",
                isSent
                  ? "bg-red-800 animate-none cursor-default"
                  : "bg-red-600 hover:bg-red-500 active:bg-red-700",
              ].join(" ")}
            >
              {/* Ripple rings behind button text */}
              {!isSent && (
                <>
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 rounded-xl border-2 border-red-400/60 animate-ping"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 rounded-xl border-2 border-red-300/30 animate-ping [animation-delay:0.3s]"
                  />
                </>
              )}

              {isSent ? (
                <>
                  <CheckCircle2
                    className="h-7 w-7 shrink-0"
                    aria-hidden="true"
                  />
                  Calling Police…
                </>
              ) : (
                <>
                  <BellRing
                    className="h-7 w-7 shrink-0 animate-bounce"
                    aria-hidden="true"
                  />
                  PANIC
                </>
              )}
            </button>
          </DialogTrigger>

          {/* ── Confirmation dialog ────────────────────────────── */}
          <DialogContent
            data-ocid="panic.dialog"
            className="mx-auto max-w-sm rounded-2xl"
          >
            <DialogHeader>
              <div className="flex justify-center mb-2">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
                  <AlertTriangle
                    className="h-8 w-8 text-destructive"
                    aria-hidden="true"
                  />
                </div>
              </div>
              <DialogTitle className="text-center font-display text-xl font-extrabold text-foreground">
                Call Police?
              </DialogTitle>
              <DialogDescription className="text-center text-base text-muted-foreground leading-relaxed">
                This will immediately{" "}
                <span className="font-semibold text-foreground">
                  call Police (100)
                </span>
                .
              </DialogDescription>
            </DialogHeader>

            <DialogFooter className="mt-4 flex-col gap-3 sm:flex-col">
              <Button
                data-ocid="panic.confirm_button"
                type="button"
                onClick={handleConfirm}
                className="h-14 w-full rounded-xl bg-red-600 text-white text-lg font-bold hover:bg-red-500 active:bg-red-700 focus-visible:ring-red-400"
              >
                <BellRing className="mr-2 h-5 w-5" aria-hidden="true" />
                Yes, Call Police
              </Button>
              <Button
                data-ocid="panic.cancel_button"
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                className="h-12 w-full rounded-xl text-base"
              >
                Cancel — I'm Safe
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Subtext below button */}
        <p className="mt-2 text-center text-xs text-muted-foreground">
          Tap to call Police (100) immediately
        </p>
      </div>
    </section>
  );
}
