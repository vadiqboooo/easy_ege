import React from 'react';

const Statistics = ({ statistics, onStartAgain }) => {
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hours > 0 ? `${hours} ч ` : ''}${minutes} мин ${secs} сек`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-center mb-6">Ваши результаты</h2>
      
      <div className="space-y-4">
        <div className="flex justify-between py-2 border-b">
          <span className="font-medium">Общее время:</span>
          <span>{formatTime(statistics.totalTime)}</span>
        </div>
        
        <div className="flex justify-between py-2 border-b">
          <span className="font-medium">Решено задач:</span>
          <span>{statistics.completedTasks}</span>
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
          onClick={onStartAgain}
          className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Начать заново
        </button>
      </div>
    </div>
  );
};

export default Statistics;