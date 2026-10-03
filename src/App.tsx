import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AppStateProvider } from './contexts/AppStateContext';
import ProtectedRoute from './components/ProtectedRoute';
import AppShell from './layouts/AppShell';
import Login from './pages/Login';
import CommandCenter from './pages/CommandCenter';
import Roadmap from './pages/Roadmap';
import Team from './pages/Team';
import LearningPaths from './pages/LearningPaths';
import SkillMatrix from './pages/SkillMatrix';
import Resources from './pages/Resources';
import Tasks from './pages/Tasks';
import Notes from './pages/Notes';
import ProblemMode from './pages/ProblemMode';
import Architecture from './pages/Architecture';
import Progress from './pages/Progress';

export default function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <AppStateProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              element={
                <ProtectedRoute>
                  <AppShell />
                </ProtectedRoute>
              }
            >
              <Route index element={<CommandCenter />} />
              <Route path="/roadmap" element={<Roadmap />} />
              <Route path="/learning" element={<LearningPaths />} />
              <Route path="/skills" element={<SkillMatrix />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/team" element={<Team />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/notes" element={<Notes />} />
              <Route path="/problem" element={<ProblemMode />} />
              <Route path="/architecture" element={<Architecture />} />
              <Route path="/progress" element={<Progress />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </AppStateProvider>
      </AuthProvider>
    </HashRouter>
  );
}
