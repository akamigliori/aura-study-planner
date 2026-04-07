import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { LoginPage } from '../features/auth/LoginPage'
import { RegisterPage } from '../features/auth/RegisterPage'
import { ProtectedRoute } from './ProtectedRoute'
import { MainLayout } from '../components/layout/MainLayout'
import { DashboardPage } from '../features/dashboard/DashboardPage'
import { SubjectPage } from '../features/subjects/SubjectPage'
import { SubjectDetailsPage } from '../features/topics/SubjectDetailsPage'
import { SchedulePage } from '../features/schedule/SchedulePage'
import { KanbanPage } from '../features/kanban/KanbanPage'

function PlaceholderPage({ title }: { title: string }) {
  return (
    <MainLayout>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
      <p className="mt-2 text-gray-500 dark:text-gray-400">Em desenvolvimento</p>
    </MainLayout>
  )
}

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<ProtectedRoute><MainLayout><DashboardPage /></MainLayout></ProtectedRoute>} />
        <Route path="/subjects" element={<ProtectedRoute><MainLayout><SubjectPage /></MainLayout></ProtectedRoute>} />
        <Route path="/subjects/:id" element={<ProtectedRoute><MainLayout><SubjectDetailsPage /></MainLayout></ProtectedRoute>} />
        {/* Real Routes */}
        <Route
          path="/schedule"
          element={
            <ProtectedRoute>
              <MainLayout>
                <SchedulePage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/reviews"
          element={
            <ProtectedRoute>
              <PlaceholderPage title="Revisões" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/kanban"
          element={
            <ProtectedRoute>
              <MainLayout>
                <KanbanPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/notes"
          element={
            <ProtectedRoute>
              <PlaceholderPage title="Anotações" />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
