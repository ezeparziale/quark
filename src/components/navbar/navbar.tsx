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
    <header className="flex h-16 w-full">
      <DesktopNav navigation={navigation} />
      <MobileNav navigation={navigation} />
    </header>
  )
}
