import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { TaskProvider } from './context/TaskContext';
import HomePage from './pages/HomePage';
import TaskPage from './pages/TaskPage';
import StatisticsPage from './pages/StatisticsPage';

function App() {
  return (
    <TaskProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/variant/:variantId" element={<TaskPage />} />
            <Route path="/statistics/:variantId" element={<StatisticsPage />} />
          </Routes>
        </div>
      </Router>
    </TaskProvider>
  );
}

export default App;