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
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/75 backdrop-blur-xl transition-colors duration-300 dark:border-slate-800/80 dark:bg-slate-950/70">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-4">
          <BrandLogo />
          {profile && <HeaderNav role={profile.role} />}
        </div>
        <div className="flex items-center gap-3">
          {profile && (
            <div className="mr-1 hidden text-right sm:block">
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                {profile.full_name}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {ROLE_LABELS[profile.role]}
                {profile.company_name ? ` · ${profile.company_name}` : ''}
              </p>
            </div>
          )}
          <ThemeToggle />
          <Button variant="secondary" loading={signingOut} onClick={handleSignOut}>
            Cerrar sesión
          </Button>
        </div>
      </div>
    </header>
  )
}
