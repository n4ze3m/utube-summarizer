import Link from "next/link";

type Props = {
  children: React.ReactNode;
};

export const AppLayout = ({ children }: Props) => {
  return (
    <div>
      <nav
        className="mx-auto border-b border-gray-600 flex  items-center justify-between p-4 lg:px-8"
        aria-label="Global"
      >
        <Link
          href="/"
          className="focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-700 flex items-center gap-2"
        >
          <img src="/logo.png" alt="logo" className="h-8 w-auto" />
          <span className="text-xl font-semibold">Utube Summarizer</span>
        </Link>
      </nav>
      <main>{children}</main>
    </div>
  );
};
