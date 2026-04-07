import { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSubjectStore } from '../../store/subject.store'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Modal } from '../../components/ui/Modal'
import { SubjectForm } from './SubjectForm'
import type { Subject } from '../../types/subject.types'
import { Pencil, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'

export function SubjectPage() {
  const navigate = useNavigate()
  const { subjects, isLoading, error, fetchSubjects, createSubject, updateSubject, deleteSubject } = useSubjectStore()
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  useEffect(() => {
    fetchSubjects()
  }, [fetchSubjects])

  const paginatedSubjects = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return subjects.slice(start, start + itemsPerPage)
  }, [subjects, currentPage])

  const totalPages = Math.ceil(subjects.length / itemsPerPage)

  const handleOpenNew = () => {
    setEditingSubject(null)
    setIsModalOpen(true)
  }

  const handleOpenEdit = (e: React.MouseEvent, subject: Subject) => {
    e.stopPropagation()
    setEditingSubject(subject)
    setIsModalOpen(true)
  }

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    if (window.confirm('Tem certeza que deseja remover esta matéria?')) {
      await deleteSubject(id)
      // Ajustar a página se a última matéria da página for apagada
      if (paginatedSubjects.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1)
      }
    }
  }

  const handleSubmit = async (data: any) => {
    if (editingSubject) {
      await updateSubject(editingSubject.id, data)
    } else {
      await createSubject(data)
    }
    setIsModalOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Minhas Matérias
          </h1>
          <p className="text-gray-500 text-sm mt-1">Gerencie suas disciplinas e áreas de estudo.</p>
        </div>
        <Button onClick={handleOpenNew}>Nova Matéria</Button>
      </div>

      {isLoading && subjects.length === 0 && (
        <div className="flex justify-center p-8">
          <div className="w-8 h-8 rounded-full border-4 border-primary-500 border-t-transparent animate-spin" />
        </div>
      )}
      
      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      {!isLoading && !error && subjects.length === 0 && (
        <div className="text-center py-16 px-4 glass-panel rounded-2xl">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Nenhuma matéria por aqui</h3>
          <p className="text-gray-500 mb-6">Comece adicionando disciplinas que farão parte do seu estudo.</p>
          <Button onClick={handleOpenNew}>Adicionar Primeira Matéria</Button>
        </div>
      )}

      {subjects.length > 0 && (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {paginatedSubjects.map((subject) => (
              <Card 
                key={subject.id} 
                onClick={() => navigate(`/subjects/${subject.id}`)}
                className="relative group overflow-hidden border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-all duration-300 cursor-pointer"
              >
                <div className="absolute top-4 right-4 flex opacity-0 group-hover:opacity-100 transition-opacity gap-1">
                  <button 
                    onClick={(e) => handleOpenEdit(e, subject)}
                    className="p-2 text-gray-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-full transition-colors"
                  >
                    <Pencil size={18} />
                  </button>
                  <button 
                    onClick={(e) => handleDelete(e, subject.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                
                <div className="p-1">
                  <div className="flex items-center gap-4 mb-2">
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm" 
                      style={{ backgroundColor: `${subject.color}20` }} 
                    >
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: subject.color }}
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{subject.name}</h3>
                      {subject.icon && (
                        <p className="text-xs text-gray-500">{subject.icon}</p>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-8">
              <Button 
                variant="secondary" 
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
                className="w-10 px-0 flex justify-center"
              >
                <ChevronLeft size={18} />
              </Button>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {currentPage} de {totalPages}
              </span>
              <Button 
                variant="secondary" 
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => p + 1)}
                className="w-10 px-0 flex justify-center"
              >
                <ChevronRight size={18} />
              </Button>
            </div>
          )}
        </>
      )}

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={editingSubject ? 'Editar Matéria' : 'Nova Matéria'}
      >
        <SubjectForm 
          initialData={editingSubject || undefined}
          onSubmit={handleSubmit} 
          onCancel={() => setIsModalOpen(false)} 
        />
      </Modal>
    </div>
  )
}
