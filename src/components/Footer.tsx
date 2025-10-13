
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} ImageResizerNow. All rights reserved.
        </p>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <Link href="/terms" className="hover:text-foreground">
            Terms of Service
          </Link>
          <Link href="/privacy" className="hover:text-foreground">
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}
