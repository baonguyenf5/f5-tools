import NextLogo from "./next-logo";
import SupabaseLogo from "./supabase-logo";

export default function Header() {
  return (
    <div className="flex flex-col gap-2 items-center">
      <h1 className="sr-only">Supabase and Next.js Starter Template</h1>
      <p className="text-3xl lg:text-4xl !leading-tight mx-auto max-w-xl text-center">
        Internal tools of{" "}
        <a
          href="https://f5techglobal.com"
          target="_blank"
          className="font-bold hover:underline"
          rel="noreferrer"
        >
          Fantastic5
        </a>
      </p>
      <p className="text-sm">Sign in to get started</p>
      <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent my-8" />
    </div>
  );
}
