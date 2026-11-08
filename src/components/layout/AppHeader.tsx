import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { ROLE_LABELS } from '../../lib/roles'
import { HeaderNav } from './HeaderNav'
import { BrandLogo } from '../ui/BrandLogo'
import { Button } from '../ui/Button'
import { ThemeToggle } from '../ui/ThemeToggle'

export function AppHeader() {
  const { profile, signOut } = useAuth()
  const [signingOut, setSigningOut] = useState(false)

  async function handleSignOut() {
    setSigningOut(true)
    try {
      await signOut()
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
      setSigningOut(false)
    }
  }

  return (
    <header className="sticky top-3 z-30 px-3 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-4 gap-y-2 rounded-[1.75rem] border border-bistre/10 bg-[#cfcfc8]/75 px-4 py-2.5 shadow-[inset_0_0_10px_rgba(0,0,0,0.08)] backdrop-blur-xl backdrop-saturate-150 transition-colors duration-300 sm:flex-nowrap sm:rounded-full sm:px-6 dark:border-white/10 dark:bg-slate-900/70 dark:shadow-[inset_0_0_10px_rgba(255,255,255,0.04)]">
        <BrandLogo />
        {profile && (
          <div className="order-3 w-full sm:order-none sm:w-auto sm:flex-1 sm:pl-2">
            <HeaderNav role={profile.role} />
          </div>
        )}
        <div className="flex items-center gap-3">
          {profile && (
            <div className="mr-1 hidden text-right lg:block">
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{profile.full_name}</p>
              <p className="eyebrow">
                {ROLE_LABELS[profile.role]}
                {profile.company_name ? ` · ${profile.company_name}` : ''}
              </p>
            </div>
          )}
          <ThemeToggle />
          <Button variant="secondary" loading={signingOut} onClick={handleSignOut}>
            <span className="sm:hidden">Salir</span>
            <span className="hidden sm:inline">Cerrar sesión</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
