import Link from "next/link";
import { Home, Store, SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-brand-cream px-4 text-center">
      <div className="mb-6 flex size-20 items-center justify-center rounded-full bg-brand-purple-50">
        <SearchX className="size-10 text-brand-purple-400" />
      </div>
      <p className="mb-2 text-6xl font-extrabold text-brand-purple-600">404</p>
      <h1 className="mb-3 text-2xl font-bold text-gray-900">
        الصفحة غير موجودة
      </h1>
      <p className="mb-8 max-w-md text-gray-500">
        عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها. يمكنك العودة
        للرئيسية أو تصفح منتجاتنا.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl bg-brand-purple-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-purple-700"
        >
          <Home className="size-4" />
          الرئيسية
        </Link>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 font-semibold text-gray-700 transition-colors hover:bg-brand-cream"
        >
          <Store className="size-4" />
          تصفح المتجر
        </Link>
      </div>
    </div>
  );
}
