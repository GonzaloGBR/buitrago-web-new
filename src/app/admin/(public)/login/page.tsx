import LoginForm from "@/components/admin/LoginForm";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#faf9f6] px-6 py-16">
      {error === "config" ? (
        <p className="mb-6 max-w-md rounded-sm border border-amber-200 bg-amber-50 px-4 py-3 text-center font-sans text-sm text-amber-950">
          Falta configurar{" "}
          <code className="font-mono text-xs">ADMIN_SESSION_SECRET</code> (mín.
          16 caracteres) en las variables de entorno del servidor.
        </p>
      ) : null}
      <LoginForm />
    </div>
  );
}
