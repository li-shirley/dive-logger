import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthContext } from './hooks/useAuthContext'
import NavBar from './components/NavBar'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Home from './pages/Home'
import LogDive from './pages/LogDive'

function App() {
  const { user, loading } = useAuthContext();

  return (
    <div className="flex flex-col min-h-screen font-inter bg-sand-light text-gray-900">
      <BrowserRouter>
        <NavBar />

        <main className="flex-1 flex flex-col gap-8 px-4 md:px-8">
          <div className="max-w-[1200px] w-full mx-auto flex-1 flex flex-col gap-8">
            <Routes>
              <Route
                path="/"
                element={
                  <ProtectedRoute user={user} loading={loading}>
                    <Home />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/log-dive"
                element={
                  <ProtectedRoute user={user} loading={loading}>
                    <LogDive />
                  </ProtectedRoute>
                }
              />
              <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
              <Route path="/signup" element={user ? <Navigate to="/" /> : <Signup />} />
            </Routes>
          </div>
        </main>
      </BrowserRouter>
    </div>
  );
}

export default App

const ProtectedRoute = ({ user, loading, children }) => {
  if (loading) return <div className="text-center py-8 text-ocean-mid text-lg font-medium">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return children;
};
