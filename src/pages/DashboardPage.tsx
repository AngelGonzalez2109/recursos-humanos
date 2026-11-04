import { useCallback, useState } from 'react'
import { AppLayout } from '../components/layout/AppLayout'
import { Alert } from '../components/ui/Alert'
import { Button } from '../components/ui/Button'
import { Modal } from '../components/ui/Modal'
import { MisVacantesList } from '../components/vacantes/MisVacantesList'
import { VacanteForm } from '../components/vacantes/VacanteForm'
import { useAuth } from '../hooks/useAuth'
import { useMisVacantes } from '../hooks/useVacantes'
import type { Vacante } from '../types/vacante'

/** Panel del publicador (reclutador) */
export function DashboardPage() {
  const { profile } = useAuth()
  const { data, loading, error, reload } = useMisVacantes(profile?.id ?? null)
  const [formOpen, setFormOpen] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)

  const openForm = useCallback(() => {
    setNotice(null)
    setFormOpen(true)
  }, [])
  const closeForm = useCallback(() => setFormOpen(false), [])

  function handleCreated(vacante: Vacante) {
    setFormOpen(false)
    setNotice(`La vacante «${vacante.titulo}» se publicó correctamente.`)
    reload()
  }

  return (
    <AppLayout
      title="Panel de vacantes"
      description="Gestiona las ofertas de trabajo que publicas."
      actions={<Button onClick={openForm}>Publicar vacante</Button>}
    >
      {notice && (
        <div className="mb-6">
          <Alert variant="success">{notice}</Alert>
        </div>
      )}

      <MisVacantesList
        vacantes={data ?? []}
        loading={loading}
        error={error}
        onRetry={reload}
        onChanged={reload}
        onCreate={openForm}
      />

      <Modal open={formOpen} title="Publicar nueva vacante" onClose={closeForm}>
        <VacanteForm
          defaultEmpresa={profile?.company_name ?? ''}
          onCreated={handleCreated}
          onCancel={closeForm}
        />
      </Modal>
    </AppLayout>
  )
}
