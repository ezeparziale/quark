import { CommandMenu } from "./command-menu"
import Logo from "./logo"
import MaxWidthWrapper from "./max-width-wrapper"

export function SiteFooter() {
  return (
    <footer className="border-t">
      <MaxWidthWrapper className="py-6 md:px-8 md:py-0">
        <div className="flex flex-row items-center justify-between md:h-24 md:flex-row">
          <div className="flex items-center justify-center space-x-3">
            <Logo disableScale disableName />
            <p className="text-sm">2024</p>
          </div>
          <div className="flex justify-center space-x-3">
            <CommandMenu />
          </div>
        </div>
      </MaxWidthWrapper>
    </footer>
  )
}
