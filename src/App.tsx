import { Navigate, Route, Routes } from 'react-router'

import RequireAuth from '@/components/auth/RequireAuth'
import ArchivePage from '@/pages/ArchivePage'
import AudienceSessionPage from '@/pages/AudienceSessionPage'
import FaqPage from '@/pages/FaqPage'
import LoginPage from '@/pages/LoginPage'
import PresenterSessionPage from '@/pages/PresenterSessionPage'
import PrivacyPolicyPage from '@/pages/PrivacyPolicyPage'
import SessionFormPage from '@/pages/SessionFormPage'
import SessionJoinPage from '@/pages/SessionJoinPage'
import SessionMaterialsPage from '@/pages/SessionMaterialsPage'
import SignupPage from '@/pages/SignupPage'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/privacy" element={<PrivacyPolicyPage />} />
      <Route path="/faq" element={<FaqPage />} />

      <Route element={<RequireAuth />}>
        <Route path="/" element={<SessionJoinPage />} />
        <Route path="/archive" element={<ArchivePage />} />
        <Route path="/sessions/new" element={<SessionFormPage />} />
        <Route path="/sessions/:sessionId" element={<AudienceSessionPage />} />
        <Route path="/sessions/:sessionId/edit" element={<SessionFormPage />} />
        <Route
          path="/sessions/:sessionId/materials"
          element={<SessionMaterialsPage />}
        />
        <Route
          path="/sessions/:sessionId/present"
          element={<PresenterSessionPage />}
        />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
