import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/common/Header';
import { Dashboard } from './pages/Dashboard';
import { BatchList } from './pages/BatchList';
import { ScannerInterface } from './pages/ScannerInterface';

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-gray-900">
        <Header />
        <main className="max-w-4xl mx-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/batches" element={<BatchList />} />
            <Route path="/scanner/:id" element={<ScannerInterface />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;