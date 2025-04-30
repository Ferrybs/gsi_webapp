import { ChevronRight } from "lucide-react";
import Link from "next/link";

function StreamersGuideFooter() {
  return (
    <footer className="border-t border-border/30 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-foreground/60">
            © 2025 CS2 Bits. All rights reserved.
          </div>
          <div className="flex gap-6">
            <Link href="/" className="text-foreground/60 hover:text-foreground">
              Home
            </Link>
            <Link
              href="/faq"
              className="text-foreground/60 hover:text-foreground"
            >
              FAQ
            </Link>
            <Link
              href="/legal/terms-of-use"
              className="text-foreground/60 hover:text-foreground"
            >
              Terms of Use
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default StreamersGuideFooter;
