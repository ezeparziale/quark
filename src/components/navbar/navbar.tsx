import DesktopNav from "./desktop-nav"
import MobileNav from "./mobile-nav"

export interface INavigation {
  name: string
  href: string
}
const navigation: INavigation[] = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
]

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav
        className="container flex h-14 max-w-7xl items-center justify-between px-4 py-6 sm:px-6 lg:px-8"
        aria-label="Global"
      >
        <DesktopNav navigation={navigation} />
        <MobileNav navigation={navigation} />
      </nav>
    </header>
  )
}
