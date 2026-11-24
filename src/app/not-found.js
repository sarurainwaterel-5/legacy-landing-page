import Link from "next/link";
export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-wine-950 px-6 text-center">
      <h1 className="text-4xl font-black">Page not found</h1>
      <p className="text-zinc-300">The page you're looking for doesn't exist.</p>
      <Link href="/" className="btn-gold">Go to the homepage</Link>
    </main>
  );
}
