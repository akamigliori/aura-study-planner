import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Plus, Settings, Trash2, Kanban } from 'lucide-react'
import { useKanbanStore } from '../../store/kanban.store'
import type { KanbanBoard, KanbanColumnConfig } from '../../types/kanban.types'

interface BoardSelectorProps {
  onCreateBoard: () => void
  onEditBoard: (board: KanbanBoard) => void
  onDeleteBoard: (boardId: string) => void
}

export function BoardSelector({ onCreateBoard, onEditBoard, onDeleteBoard }: BoardSelectorProps) {
  const { boards, activeBoard, setActiveBoard } = useKanbanStore()
  const [isOpen, setIsOpen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelectBoard = (board: KanbanBoard) => {
    setActiveBoard(board)
    setIsOpen(false)
  }

  return (
    <div className="flex items-center gap-2">
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-primary-400 dark:hover:border-primary-500 transition-colors"
        >
          <Kanban size={18} className="text-primary-600 dark:text-primary-400" />
          <span className="font-medium text-gray-900 dark:text-white max-w-[150px] truncate">
            {activeBoard?.name || 'Selecionar Quadro'}
          </span>
          <ChevronDown size={16} className="text-gray-500" />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 mt-1 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 overflow-hidden">
            <div className="p-2 border-b border-gray-100 dark:border-gray-700">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                Meus Quadros
              </span>
            </div>
            <div className="max-h-60 overflow-y-auto">
              {boards.length === 0 ? (
                <div className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm">
                  Nenhum quadro encontrado
                </div>
              ) : (
                boards.map((board) => (
                  <button
                    key={board.id}
                    onClick={() => handleSelectBoard(board)}
                    className={`w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                      activeBoard?.id === board.id 
                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300' 
                        : 'text-gray-700 dark:text-gray-200'
                    }`}
                  >
                    <Kanban size={16} />
                    <span className="truncate">{board.name}</span>
                  </button>
                ))
              )}
            </div>
            <div className="p-2 border-t border-gray-100 dark:border-gray-700">
              <button
                onClick={() => {
                  setIsOpen(false)
                  onCreateBoard()
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-md transition-colors"
              >
                <Plus size={16} />
                Criar novo quadro
              </button>
            </div>
          </div>
        )}
      </div>

      {activeBoard && (
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors"
            title="Configurações do quadro"
          >
            <Settings size={18} />
          </button>

          {isMenuOpen && (
            <div className="absolute top-full right-0 mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 overflow-hidden">
              <button
                onClick={() => {
                  setIsMenuOpen(false)
                  onEditBoard(activeBoard)
                }}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <Settings size={16} />
                Editar quadro
              </button>
              <button
                onClick={() => {
                  setIsMenuOpen(false)
                  onDeleteBoard(activeBoard.id)
                }}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <Trash2 size={16} />
                Excluir quadro
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
