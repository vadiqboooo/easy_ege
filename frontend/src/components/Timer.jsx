import React from 'react';

const Timer = ({ timeLeft }) => {
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Определение цвета в зависимости от оставшегося времени
  const getTimerColor = () => {
    if (timeLeft <= 300) { // меньше 5 минут
      return 'text-red-600';
    } else if (timeLeft <= 600) { // меньше 10 минут
      return 'text-yellow-600';
    }
    return 'text-green-600';
  };

  return (
    <div className="px-4 py-2 bg-gray-100 rounded-lg">
      <div className="font-mono text-lg font-bold tracking-wide flex items-center">
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <span className={getTimerColor()}>{formatTime(timeLeft)}</span>
      </div>
    </div>
  );
};

export default Timer;