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
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <DesktopNav navigation={navigation} />
        <MobileNav navigation={navigation} />
      </div>
    </header>
  )
}
