import type { ReactNode } from 'react'
import { Modal } from './Modal'
import { Button } from './Button'

interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  description: ReactNode
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'primary'
  onConfirm: () => void
  onClose: () => void
}

export function ConfirmDialog({
  isOpen,
  title,
  description,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'danger',
  onConfirm,
  onClose
}: ConfirmDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-6">
        <div className="text-gray-600 dark:text-gray-300">
          {description}
        </div>
        
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>
            {cancelText}
          </Button>
          <Button 
            variant="primary" 
            onClick={() => {
              onConfirm()
              onClose()
            }}
            className={variant === 'danger' ? 'bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 font-bold border-none' : ''}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
