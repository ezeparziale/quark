import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex flex-row items-center">
        <Image src="/logo/logo-dark.png" alt={"logo"} width={32} height={32} />
        <p className="font-bold text-lg px-2">Quark</p>
      </div>
    </main>
  );
}
