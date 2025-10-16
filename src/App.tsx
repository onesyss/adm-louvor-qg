import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './components/Notification';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Scales from './pages/Scales';
import Agenda from './pages/Agenda';
import Repertoire from './pages/Repertoire';
import Archive from './pages/Archive';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Musicians from './pages/Musicians';
import Songs from './pages/Songs';

function App() {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <AppProvider>
          <Router>
          <div className="App">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="scales" element={<Scales />} />
                <Route path="agenda" element={<Agenda />} />
                <Route path="repertoire" element={<Repertoire />} />
                <Route path="archive" element={<Archive />} />
                <Route path="musicians" element={<Musicians />} />
                <Route path="songs" element={<Songs />} />
                <Route path="admin" element={
                  <ProtectedRoute>
                    <Admin />
                  </ProtectedRoute>
                } />
              </Route>
            </Routes>
          </div>
          </Router>
        </AppProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;
