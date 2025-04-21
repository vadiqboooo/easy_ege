import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTaskContext } from '../context/TaskContext';
import TaskNavigation from '../components/TaskNavigation';
import Timer from '../components/Timer';
import parse from 'html-react-parser';
import '../pages/TaskPage.css'

const TaskPage = () => {
  const { variantId } = useParams();
  const navigate = useNavigate();
  const { 
    currentVariant, 
    tasks, 
    currentTaskIndex, 
    currentTask,
    timeLeft, 
    timeIsUp, 
    selectVariant,
    goToNextTask,
    goToTask,
    goToPreviousTask,
    answers,
    saveAnswer,
    finishVariant
  } = useTaskContext();

  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  
  useEffect(() => {
    if (!currentVariant && variantId) {
      selectVariant(parseInt(variantId));
    }
  }, [currentVariant, variantId, selectVariant]);
  
  useEffect(() => {
    if (currentTask) {
      setCurrentAnswer(answers[currentTask.id] || '');
    }
  }, [currentTask, answers]);
  
  useEffect(() => {
    if (timeIsUp) {
      navigate(`/statistics/${variantId}`);
    }
  }, [timeIsUp, navigate, variantId]);

  if (!currentTask) {
    return <div className="flex justify-center items-center h-screen">Загрузка задания...</div>;
  }

  const handleAnswerChange = (e) => {
    setCurrentAnswer(e.target.value);
  };

  const handleSaveAnswer = () => {
    if (currentTask) {
      saveAnswer(currentTask.id, currentAnswer);
    }
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleFinish = () => {
    finishVariant();
    navigate(`/statistics/${variantId}`);
  };
  return (
    <div className="min-h-screen bg-gray-100 pb-6">
      {/* Хедер с адаптивным заголовком */}
      <header className="bg-white shadow-md p-4">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <h1 className="text-xl sm:text-2xl font-bold text-blue-600 text-center sm:text-left">
            {currentVariant?.title}
          </h1>
          <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto justify-between sm:justify-normal">
            <Timer timeLeft={timeLeft} />
            <button
              onClick={handleFinish}
              className="px-3 sm:px-4 py-1 sm:py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors whitespace-nowrap text-sm sm:text-base"
            >
              Завершить
            </button>
          </div>
        </div>
      </header>

      {/* Навигация по задачам */}
      <div className="container mx-auto mt-4 px-2 sm:px-4">
        <TaskNavigation 
          currentIndex={currentTaskIndex}
          totalTasks={tasks.length}
          onGoTo={goToTask}
          disabled={timeIsUp}
          answers={answers}
          tasksIds={tasks.map(task => task.id)}
        />
      </div>

      {/* Основной контент */}
      <div className="container mx-auto mt-4 px-2 sm:px-4">
        <div className="flex items-stretch">
          {/* Стрелка "Назад" - скрыта на мобильных */}
          <button
            onClick={goToPreviousTask}
            disabled={currentTaskIndex === 0}
            className={`hidden sm:block p-2 mr-2 rounded-full ${currentTaskIndex === 0 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-8 sm:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Блок с задачей */}
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-4 flex-1">
           
            
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">{currentTask.title}</h2>
            
            <div className="prose max-w-none text-sm sm:text-base">
              {parse(currentTask.description)}
            </div>

            <div className="mt-4 sm:mt-6">
              <label htmlFor="answer" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Ваш ответ (число):
              </label>
              <div className="flex items-center gap-2 w-full">
                <input
                  type="number"
                  id="answer"
                  className="flex-1 px-3 py-1 sm:py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                  value={currentAnswer}
                  onChange={handleAnswerChange}
                  onBlur={handleSaveAnswer}
                  inputMode="numeric"
                  pattern="[0-9]*"
                />
                <button
                  type="button"
                  onClick={handleSaveAnswer}
                  className="px-3 sm:px-4 py-1 sm:py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 active:scale-95 transition-transform text-sm sm:text-base"
                >
                  {isSaved ? "✓" : "OK"}
                </button>
              </div>
              {isSaved && (
                <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-green-600">Ответ сохранён!</p>
              )}
            </div>
          </div>

          {/* Стрелка "Вперед" - скрыта на мобильных */}
          <button
            onClick={goToNextTask}
            disabled={currentTaskIndex === tasks.length - 1}
            className={`hidden sm:block p-2 ml-2 rounded-full ${currentTaskIndex === tasks.length - 1 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-8 sm:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Мобильная навигация (стрелки) */}
        <div className="sm:hidden flex justify-between mt-4">
          <button
            onClick={goToPreviousTask}
            disabled={currentTaskIndex === 0}
            className={`px-4 py-2 rounded-lg ${currentTaskIndex === 0 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white'}`}
          >
            Назад
          </button>
          <button
            onClick={goToNextTask}
            disabled={currentTaskIndex === tasks.length - 1}
            className={`px-4 py-2 rounded-lg ${currentTaskIndex === tasks.length - 1 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white'}`}
          >
            Далее
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskPage;