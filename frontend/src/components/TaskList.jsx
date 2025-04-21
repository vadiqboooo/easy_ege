import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TaskItem from './TaskItem';

const TaskList = ({ tasks, variantId, currentTaskId, onTaskSelect }) => {
  const navigate = useNavigate();
  const [completedTasks, setCompletedTasks] = useState([]);
  
  useEffect(() => {
    // Тут можно загрузить статус выполнения задач из localStorage или с сервера
    const savedCompletedTasks = localStorage.getItem(`completedTasks_${variantId}`);
    if (savedCompletedTasks) {
      setCompletedTasks(JSON.parse(savedCompletedTasks));
    }
  }, [variantId]);

  if (!tasks || tasks.length === 0) {
    return <div className="text-center py-8 text-gray-500">Задачи не найдены</div>;
  }

  const handleTaskClick = (taskId) => {
    onTaskSelect(taskId);
  };

  return (
    <div className="task-list">
      <h2 className="text-xl font-bold mb-4">Список задач</h2>
      
      <div className="flex mb-4 overflow-x-auto py-2 task-navbar">
        {tasks.map((_, idx) => (
          <button
            key={idx}
            onClick={() => onTaskSelect(tasks[idx].id)}
            className={`flex-shrink-0 w-8 h-8 rounded-full mx-1 flex items-center justify-center ${
              tasks[idx].id === currentTaskId
                ? 'bg-blue-500 text-white'
                : completedTasks.includes(tasks[idx].id)
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200'
            }`}
          >
            {idx + 1}
          </button>
        ))}
      </div>
      
      <div className="space-y-3">
        {tasks.map((task, index) => (
          <TaskItem
            key={task.id}
            task={{
              ...task,
              completed: completedTasks.includes(task.id)
            }}
            index={index}
            totalTasks={tasks.length}
            currentTaskId={currentTaskId}
            onTaskSelect={handleTaskClick}
          />
        ))}
      </div>

      <div className="mt-6 flex justify-between">
        <button
          onClick={() => {
            const currentIndex = tasks.findIndex(task => task.id === currentTaskId);
            if (currentIndex > 0) {
              onTaskSelect(tasks[currentIndex - 1].id);
            }
          }}
          disabled={tasks.findIndex(task => task.id === currentTaskId) === 0}
          className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50 hover:bg-gray-300"
        >
          Предыдущая
        </button>
        
        <button
          onClick={() => {
            const currentIndex = tasks.findIndex(task => task.id === currentTaskId);
            if (currentIndex < tasks.length - 1) {
              onTaskSelect(tasks[currentIndex + 1].id);
            } else {
              // Если последняя задача, можно показать статистику
              navigate(`/variant/${variantId}/stats`);
            }
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          {tasks.findIndex(task => task.id === currentTaskId) === tasks.length - 1 
            ? "Завершить" 
            : "Следующая"}
        </button>
      </div>
    </div>
  );
};

export default TaskList;