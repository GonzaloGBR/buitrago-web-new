import Link from "next/link";

type Props = {
  title: string;
  description?: string;
  backHref?: string;
  backLabel?: string;
  action?: React.ReactNode;
};

export default function AdminPageHeader({
  title,
  description,
  backHref = "/admin",
  backLabel = "← Volver al panel",
  action,
}: Props) {
  return (
    <header className="space-y-3 border-b border-charcoal/10 pb-6">
      <Link
        href={backHref}
        className="inline-block font-sans text-sm text-warm-gray hover:text-charcoal"
      >
        {backLabel}
      </Link>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-2xl">
          <h1 className="font-serif text-2xl text-charcoal sm:text-3xl">{title}</h1>
          {description ? (
            <p className="mt-2 font-sans text-sm leading-relaxed text-warm-gray">
              {description}
            </p>
          ) : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
    </header>
  );
}

export function AdminFlash({
  variant,
  children,
}: {
  variant: "success" | "error";
  children: React.ReactNode;
}) {
  const styles =
    variant === "success"
      ? "border-green-200 bg-green-50 text-green-900"
      : "border-red-200 bg-red-50 text-red-800";
  return (
    <p
      className={`rounded-md border px-4 py-3 font-sans text-sm ${styles}`}
      role="status"
    >
      {children}
    </p>
  );
}
