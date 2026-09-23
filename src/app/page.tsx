import Image from "next/image";

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center bg-cream px-6 text-center">
      <Image
        src="/logo.svg"
        alt="HomeBaked AI Ideas"
        width={96}
        height={96}
        className="mb-8 h-24 w-24 rounded-2xl shadow-lg"
        priority
      />
      <h1 className="font-serif text-3xl font-semibold text-charcoal sm:text-4xl">
        HomeBaked AI Ideas
      </h1>
      <p className="mt-4 animated-gradient-text text-lg font-medium sm:text-xl">
        Baking, Baking&hellip;
      </p>
    </main>
  );
}
