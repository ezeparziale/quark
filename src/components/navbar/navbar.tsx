import Link from "next/link"

import Logo from "../logo"
import ThemeSwitch from "../themeSwitch"

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b dark:border-b-neutral-800">
      <nav
        className="container flex h-14 max-w-7xl items-center justify-between px-4 py-6 sm:px-6 lg:px-8"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <Logo />
        </div>
        <ThemeSwitch />
      </nav>
    </header>
  )
}
