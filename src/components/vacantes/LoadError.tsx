import { Alert } from '../ui/Alert'
import { Button } from '../ui/Button'

interface LoadErrorProps {
  message: string
  onRetry: () => void
}

export function LoadError({ message, onRetry }: LoadErrorProps) {
  return (
    <div className="space-y-3">
      <Alert variant="error">{message}</Alert>
      <Button variant="secondary" onClick={onRetry}>
        Reintentar
      </Button>
    </div>
  )
}
