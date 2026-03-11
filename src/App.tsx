import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Scene3D from './components/Scene3D';
import Sidebar from './components/Sidebar';
import LandingPage from './pages/LandingPage';
import Home from './pages/Home';
import PromptFlood from './pages/PromptFlood';
import TokenExhaustion from './pages/TokenExhaustion';
import BatchAttack from './pages/BatchAttack';
import ModelExploit from './pages/ModelExploit';
import Reports from './pages/Reports';

function DashboardLayout() {
  return (
    <div className="app-layout">
      <Scene3D />
      <Sidebar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/prompt-flood" element={<PromptFlood />} />
          <Route path="/token-exhaustion" element={<TokenExhaustion />} />
          <Route path="/batch-attack" element={<BatchAttack />} />
          <Route path="/model-exploit" element={<ModelExploit />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing page at root */}
        <Route path="/" element={<LandingPage />} />

        {/* Dashboard nested under /dashboard */}
        <Route path="/dashboard/*" element={<DashboardLayout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;