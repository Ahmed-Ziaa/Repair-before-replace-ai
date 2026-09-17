import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppSidebar, MobileAppHeader, Navbar } from './components'
import { NotFoundPage, ProtectedRoute } from './AppStates'
import DiagnoseFlow from './DiagnoseFlow'
import { ApiDashboardPage, ApiDetailPage, ApiHistoryPage, ApiMaintenancePage } from './ApiWorkspacePages'
import AuthPage from './AuthPages'
import { LandingPage } from './pages'
import SettingsPage from './SettingsPage'
import { ToastProvider } from './Toast'

function App() {
  return <ToastProvider><BrowserRouter><Routes>
    <Route path="/" element={<><Navbar /><LandingPage /></>} />
    <Route path="/login" element={<AuthPage mode="login" />} />
    <Route path="/register" element={<AuthPage mode="register" />} />
    <Route element={<ProtectedRoute />}>
      <Route path="/dashboard" element={<ApiDashboardPage />} />
      <Route path="/history" element={<ApiHistoryPage />} />
      <Route path="/history/:id" element={<ApiDetailPage />} />
      <Route path="/maintenance" element={<ApiMaintenancePage />} />
      <Route path="/diagnose" element={<DiagnoseFlow />} />
      <Route path="/settings" element={<WorkspaceSettings />} />
    </Route>
    <Route path="*" element={<NotFoundPage />} />
  </Routes></BrowserRouter></ToastProvider>
}

function WorkspaceSettings() {
  return <div className="min-h-screen bg-[#f7f9f6] text-slate-950"><AppSidebar /><div className="lg:pl-60"><MobileAppHeader /><SettingsPage /></div></div>
}

export default App
