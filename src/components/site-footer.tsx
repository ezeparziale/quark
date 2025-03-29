import { CommandMenu } from "./command-menu"
import HealthStatusButton from "./health-status-button"
import Logo from "./logo"
import MaxWidthWrapper from "./max-width-wrapper"
import ThemeSwitch from "./theme-switch"

export function SiteFooter() {
  return (
    <footer className="border-t">
      <MaxWidthWrapper className="py-6 md:px-8 md:py-0">
        <div className="flex flex-row items-center justify-between md:h-24 md:flex-row">
          <div className="flex items-center justify-center space-x-3">
            <Logo disableScale disableName />
            <p className="text-sm">2025</p>
            <HealthStatusButton />
          </div>
          <div className="flex items-center justify-between space-x-3">
            <div className="hidden justify-center space-x-3 lg:flex">
              <CommandMenu />
            </div>
            <ThemeSwitch isDropDown={false} />
          </div>
        </div>
      </MaxWidthWrapper>
    </footer>
  )
}
