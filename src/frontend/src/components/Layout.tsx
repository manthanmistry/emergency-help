import type React from "react";

interface LayoutProps {
  children: React.ReactNode;
}

/**
 * Page wrapper with responsive max-width container and consistent
 * section spacing. Used to wrap the full app content.
 */
export function Layout({ children }: LayoutProps) {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";
  const caffeineUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <main className="mx-auto w-full max-w-2xl px-4 pb-28 flex-1">
        {children}
      </main>
      <footer className="bg-muted/40 border-t border-border py-4 text-center text-xs text-muted-foreground">
        © {year}. Built with love using{" "}
        <a
          href={caffeineUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-foreground transition-colors"
        >
          caffeine.ai
        </a>
      </footer>
    </div>
  );
}
