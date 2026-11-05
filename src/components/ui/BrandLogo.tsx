export function BrandLogo() {
  return (
    <div className="flex items-center gap-2.5">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-linear-to-br from-brand-400 to-brand-600 text-white shadow-[0_6px_20px_-6px_rgb(10_147_224/0.8),inset_0_1px_0_0_rgb(255_255_255/0.3)]">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
          aria-hidden="true"
        >
          <rect x="3" y="7" width="18" height="13" rx="2" />
          <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18" />
        </svg>
      </span>
      <span className="text-base font-semibold tracking-tight text-slate-900 dark:text-slate-100">
        Plataforma <span className="text-brand-600 dark:text-brand-400">RH</span>
      </span>
    </div>
  )
}
