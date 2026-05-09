import Link from "next/link";

export default function AdminHomePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl text-charcoal">Panel</h1>
        <p className="mt-2 max-w-lg font-sans text-sm text-warm-gray">
          Editá categorías, productos y las piezas destacadas del inicio sin
          tocar código. Las fotos nuevas se guardan en{" "}
          <code className="rounded bg-charcoal/5 px-1 font-mono text-xs">
            /public/uploads
          </code>
          .
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/admin/categories"
          className="rounded-sm border border-charcoal/10 bg-white p-6 shadow-sm transition hover:border-charcoal/25"
        >
          <h2 className="font-serif text-xl text-charcoal">Categorías</h2>
          <p className="mt-2 font-sans text-sm text-warm-gray">
            Crear, editar o eliminar categorías del catálogo.
          </p>
        </Link>
        <Link
          href="/admin/products"
          className="rounded-sm border border-charcoal/10 bg-white p-6 shadow-sm transition hover:border-charcoal/25"
        >
          <h2 className="font-serif text-xl text-charcoal">Productos</h2>
          <p className="mt-2 font-sans text-sm text-warm-gray">
            Precios, medidas, textos, imágenes y galería.
          </p>
        </Link>
        <Link
          href="/admin/featured"
          className="rounded-sm border border-charcoal/10 bg-white p-6 shadow-sm transition hover:border-charcoal/25"
        >
          <h2 className="font-serif text-xl text-charcoal">Piezas destacadas</h2>
          <p className="mt-2 font-sans text-sm text-warm-gray">
            Las cuatro fichas del inicio enlazan a cada ficha de producto.
          </p>
        </Link>
      </div>
    </div>
  );
}
