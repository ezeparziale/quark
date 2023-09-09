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
              width={24}
              height={24}
              className="block dark:hidden"
            />
            <Image
              src={`/logo/logo-dark.png`}
              alt={"logo"}
              width={24}
              height={24}
              className="hidden dark:block"
            />
          </div>
          <span className="sr-only">Quark</span>
          <p className="hidden font-bold text-black antialiased dark:text-white sm:text-sm md:block md:text-base lg:text-base">
            Quark
          </p>
        </div>
      </Link>
    </div>
  )
}
