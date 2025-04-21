import React from 'react';
import { useNavigate } from 'react-router-dom';

const TaskItem = ({ task, index, totalTasks, currentTaskId, onTaskSelect }) => {
  const navigate = useNavigate();
  
  const isActive = task.id === currentTaskId;
  
  const handleTaskClick = () => {
    onTaskSelect(task.id);
    navigate(`/task/${task.id}`);
  };

  return (
    <div 
      className={`task-item px-4 py-2 rounded-md cursor-pointer transition-all ${
        isActive ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
      }`}
      onClick={handleTaskClick}
    >
      <div className="flex justify-between items-center">
        <div className="font-medium">Задача {index + 1}/{totalTasks}</div>
        <div className={`task-status text-sm ${
          task.completed ? 'text-green-500' : 'text-gray-400'
        }`}>
          {task.completed ? 'Решена' : 'Не решена'}
        </div>
      </div>
      <div className="text-sm mt-1 truncate">
        {task.title}
      </div>
    </div>
  );
};

export default TaskItem;