import Image from "next/image"
import Link from "next/link"

export default function Logo() {
  return (
    <div className="flex items-center justify-center">
      <Link href="/">
        <div className="flex items-center space-x-2">
          <div>
            <Image
              src={`/logo/logo-light.png`}
              alt={"logo"}
              width={32}
              height={32}
              className="block dark:hidden"
            />
            <Image
              src={`/logo/logo-dark.png`}
              alt={"logo"}
              width={32}
              height={32}
              className="hidden dark:block"
            />
          </div>
          <span className="sr-only">quark</span>
          <p className="hidden font-bold text-primary antialiased sm:text-sm md:block md:text-2xl lg:text-2xl">
            quark
          </p>
        </div>
      </Link>
    </div>
  )
}
