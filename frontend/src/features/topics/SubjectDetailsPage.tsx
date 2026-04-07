import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Plus, Trash2, Edit2, ArrowLeft } from 'lucide-react'
import { useTopicStore } from '../../store/topic.store'
import { useSubjectStore } from '../../store/subject.store'
import { TopicForm } from './TopicForm'
import { Modal } from '../../components/ui/Modal'
import { Button } from '../../components/ui/Button'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import type { Topic } from '../../types/topic.types'

export function SubjectDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { subjects, fetchSubjects } = useSubjectStore()
  const { topics, fetchTopics, addTopic, updateTopic, deleteTopic, isLoading } = useTopicStore()

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null)
  
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [topicToDelete, setTopicToDelete] = useState<Topic | null>(null)

  useEffect(() => {
    if (subjects.length === 0) {
      fetchSubjects()
    }
  }, [fetchSubjects, subjects.length])

  useEffect(() => {
    if (id) {
      fetchTopics(id)
    }
  }, [id, fetchTopics])

  const subject = subjects.find(s => s.id === id)

  if (!id) return <div>ID inválido.</div>
  
  if (subjects.length > 0 && !subject) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Matéria não encontrada</h2>
        <Button onClick={() => navigate('/subjects')} className="mt-4">
          Voltar para matérias
        </Button>
      </div>
    )
  }

  const handleCreateOrUpdate = async (data: any) => {
    if (editingTopic) {
      await updateTopic(id, editingTopic.id, data)
    } else {
      await addTopic(id, data)
    }
    setIsFormOpen(false)
    setEditingTopic(null)
  }

  const handleDelete = async () => {
    if (topicToDelete && id) {
      await deleteTopic(id, topicToDelete.id)
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/subjects')}
            className="p-2 border border-gray-200 dark:border-white/10 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
          {subject && (
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center shadow-lg"
                style={{ backgroundColor: subject.color }}
              >
                <span className="text-white font-bold">{subject.name.charAt(0).toUpperCase()}</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {subject.name}
              </h1>
            </div>
          )}
        </div>
        <Button onClick={() => { setEditingTopic(null); setIsFormOpen(true) }} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Novo Tópico
        </Button>
      </div>

      {/* Content */}
      {isLoading && topics.length === 0 ? (
        <div className="flex justify-center p-12">
          <div className="w-8 h-8 rounded-full border-b-2 border-primary-500 animate-spin" />
        </div>
      ) : topics.length === 0 ? (
        <div className="glass-panel rounded-2xl p-12 text-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Nenhum tópico criado
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Adicione tópicos de estudo para esta matéria para começar a revisá-los.
          </p>
          <Button variant="secondary" onClick={() => { setEditingTopic(null); setIsFormOpen(true) }}>
            Adicionar Primeiro Tópico
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {topics.map(topic => (
            <div key={topic.id} className="glass-panel p-6 rounded-xl hover:shadow-xl transition-shadow flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{topic.name}</h3>
                {topic.description && (
                  <p className="text-sm text-gray-500 mt-2 line-clamp-3">{topic.description}</p>
                )}
              </div>
              
              <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-gray-100 dark:border-white/5">
                <button
                  onClick={() => { setEditingTopic(topic); setIsFormOpen(true) }}
                  className="p-2 text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                  aria-label={`Editar ${topic.name}`}
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => { setTopicToDelete(topic); setIsConfirmOpen(true) }}
                  className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  aria-label={`Excluir ${topic.name}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      <Modal 
        isOpen={isFormOpen} 
        onClose={() => { setIsFormOpen(false); setEditingTopic(null) }}
        title={editingTopic ? "Editar Tópico" : "Novo Tópico"}
      >
        <TopicForm 
          initialData={editingTopic || undefined}
          onSubmit={handleCreateOrUpdate}
          onCancel={() => { setIsFormOpen(false); setEditingTopic(null) }}
        />
      </Modal>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        title="Excluir Tópico"
        description={<>Tem certeza que deseja excluir o tópico <strong>{topicToDelete?.name}</strong>? Esta ação não pode ser desfeita e excluirá as futuras revisões atreladas a este tópico.</>}
        onConfirm={handleDelete}
        onClose={() => { setIsConfirmOpen(false); setTopicToDelete(null) }}
      />
    </div>
  )
}
