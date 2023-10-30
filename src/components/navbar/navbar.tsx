import DesktopNav from "./desktop-nav"
import MobileNav from "./mobile-nav"

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-muted bg-gradient-to-b from-background/10 via-background/50 to-background/80 backdrop-blur-xl">
      <nav
        className="container flex h-16 max-w-7xl items-center justify-between px-4 py-6 sm:px-6 lg:px-8"
        aria-label="Global"
      >
        <DesktopNav />
        <MobileNav />
      </nav>
    </header>
  )
}
