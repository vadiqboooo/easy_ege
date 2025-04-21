import React from 'react';

const TaskNavigation = ({ 
  currentIndex, 
  totalTasks, 
  onGoTo, 
  disabled,
  answers,
  tasksIds
}) => {
  // Функция для проверки наличия ответа для задачи
  const hasAnswer = (taskIndex) => {
    const taskId = tasksIds[taskIndex];
    return answers[taskId] !== undefined && answers[taskId] !== '';
  };

  return (
    <div className="flex justify-center">
      {/* Индикаторы задач */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {Array.from({ length: totalTasks }).map((_, index) => (
          <button
            key={index}
            onClick={() => onGoTo(index)}
            disabled={disabled}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors
              ${index === currentIndex 
                ? 'bg-blue-600 text-white' 
                : hasAnswer(index)
                  ? 'bg-blue-300 text-white hover:bg-blue-500'
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
            aria-label={`Перейти к задаче ${index + 1}`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TaskNavigation;