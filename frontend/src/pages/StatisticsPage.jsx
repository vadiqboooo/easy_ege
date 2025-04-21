import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTaskContext } from '../context/TaskContext';

const StatisticsPage = () => {
  const { statistics, currentVariant, resetVariant } = useTaskContext();
  const { variantId } = useParams();
  const navigate = useNavigate();

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hours > 0 ? `${hours} ч ` : ''}${minutes} мин ${secs} сек`;
  };

  const handleStartAgain = () => {
    resetVariant();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-lg w-full">
        <h1 className="text-2xl font-bold text-center mb-6">Результаты</h1>
        
        {currentVariant && (
          <h2 className="text-xl font-semibold text-center text-blue-600 mb-6">
            {currentVariant.title}
          </h2>
        )}
        
        <div className="space-y-4">
          <div className="flex justify-between py-2 border-b">
            <span className="font-medium">Общее время:</span>
            <span>{formatTime(statistics.totalTime)}</span>
          </div>
          
          <div className="flex justify-between py-2 border-b">
            <span className="font-medium">Решено задач:</span>
            <span>{statistics.completedTasks} из {currentVariant?.task_count || '?'}</span>
          </div>
          
          <div className="flex justify-between py-2 border-b">
            <span className="font-medium">Правильные ответы:</span>
            <span>{statistics.correctAnswers}</span>
          </div>
          
          <div className="flex justify-between py-2 border-b">
            <span className="font-medium">Неправильные ответы:</span>
            <span>{statistics.incorrectAnswers}</span>
          </div>
        </div>
        
        <div className="mt-8 flex justify-center">
          <button
            onClick={handleStartAgain}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Начать заново
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatisticsPage;