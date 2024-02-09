import Logo from "../logo"

export default function AuthTemplate({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background md:h-screen md:flex-row-reverse">
      <section className="mx-auto flex w-full items-start px-8 md:w-1/3 md:items-center md:px-0">
        <div className="relative mx-auto my-auto flex w-full min-w-min max-w-sm origin-left transform flex-row items-center py-4 pt-4 md:-left-4 md:mx-0 md:py-4">
          <div className="flex items-center bg-background py-8">
            <Logo disableScale={true} />
          </div>
        </div>
      </section>
      <section className="justify-center border-border px-8 md:flex md:w-2/3 md:border-r md:px-0">
        <div className="mx-auto my-auto w-full min-w-min max-w-sm py-4 md:w-7/12 md:py-8">
          {children}
        </div>
      </section>
    </div>
  )
}
