import { EmergencyContacts } from "@/components/EmergencyContacts";
import { EmergencyGrid } from "@/components/EmergencyGrid";
import { Layout } from "@/components/Layout";
import { LocationShare } from "@/components/LocationShare";
import { useContacts } from "@/hooks/useContacts";
import { useTheme } from "@/hooks/useTheme";
import { AlertTriangle, Moon, Sun } from "lucide-react";

export default function App() {
  const [theme, toggleTheme] = useTheme();
  const [contacts, addContact, deleteContact] = useContacts();

  return (
    <Layout>
      {/* ── Header ─────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <AlertTriangle
              className="h-6 w-6 text-destructive"
              aria-hidden="true"
            />
            <span className="font-display text-lg font-bold tracking-tight text-foreground">
              EMERGENCY{" "}
              <span className="text-muted-foreground font-normal">HELP</span>
            </span>
          </div>

          {/* Dark/Light mode toggle */}
          <button
            type="button"
            data-ocid="theme.toggle"
            onClick={toggleTheme}
            aria-label={
              theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
            }
            className="flex items-center justify-center rounded-full bg-muted p-2 transition-smooth hover:bg-muted/80 active:scale-95 min-w-[44px] min-h-[44px]"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5 text-foreground" />
            ) : (
              <Moon className="h-5 w-5 text-foreground" />
            )}
          </button>
        </div>
      </header>

      {/* ── Page sections ──────────────────────────────────── */}
      <div className="space-y-6 pt-6">
        {/* Section heading */}
        <section className="text-center">
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-foreground uppercase">
            Tap the Service You Need
          </h1>
        </section>

        {/* Emergency services grid */}
        <EmergencyGrid />

        {/* Location sharing */}
        <div className="px-4">
          <LocationShare />
        </div>

        {/* Emergency contacts */}
        <EmergencyContacts
          contacts={contacts}
          addContact={addContact}
          deleteContact={deleteContact}
        />
      </div>
    </Layout>
  );
}
