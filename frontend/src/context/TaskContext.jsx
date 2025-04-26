import React, { createContext, useState, useEffect, useContext } from 'react';
import { getVariants, getTasksForVariant, check_task , getUserVariants, saveUserResults } from '../services/taskService';

const TaskContext = createContext();

export const useTaskContext = () => useContext(TaskContext);

export const TaskProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [variants, setVariants] = useState([]);
  const [currentVariant, setCurrentVariant] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [timeIsUp, setTimeIsUp] = useState(false);
  const [answers, setAnswers] = useState({});
  const [statistics, setStatistics] = useState({
    totalTime: 0,
    completedTasks: 0,
    correctAnswers: 0,
    incorrectAnswers: 0
  });

  useEffect(() => {
    const telegramUser = localStorage.getItem('telegramUser');
    if (telegramUser) {
      const userData = JSON.parse(telegramUser);
      setUser(userData);
    }
  }, []);

  // Загрузка вариантов при инициализации
  useEffect(() => {
    const loadVariants = async () => {
      try {
        // Если пользователь авторизован через Telegram, загружаем только его нерешенные варианты
        if (user) {
          const variantsData = await getUserVariants(user.id);
          setVariants(variantsData);
        } else {
          // Иначе загружаем все варианты (для тестирования)
          const variantsData = await getVariants();
          setVariants(variantsData);
        }
      } catch (error) {
        console.error('Failed to load variants:', error);
      }
    };
    loadVariants();
  }, [user]);




   // Расчет статистики и сохранение результатов
  const calculateStatistics = async () => {
    const totalTimeSpent = currentVariant.time_limit * 60 - timeLeft;
    const completedTasksCount = Object.values(answers).filter(code => code.trim().length > 0).length;
    let correct;
    let incorrect;
    
    await check_task(currentVariant.id, answers).then(value => {
      correct = value.filter(x => x == true).length;
      incorrect = value.filter(x => x == false).length;
      
      // Если пользователь авторизован, сохраняем результаты
      if (user) {
        saveUserResults(user.id, currentVariant.id, value);
      }
    });
    
    setStatistics({
      totalTime: totalTimeSpent,
      completedTasks: completedTasksCount,
      correctAnswers: correct,
      incorrectAnswers: incorrect
    });
  };

  // Выбор варианта и загрузка задач
  const selectVariant = async (variantId) => {
    try {
      const variantData = variants.find(v => v.id === variantId);
      setCurrentVariant(variantData);
      
      const tasksData = await getTasksForVariant(variantId);
      setTasks(tasksData);
      
      
      // Сброс индекса текущей задачи
      setCurrentTaskIndex(0);
      
      // Установка таймера

      setTimeLeft(variantData.time_limit * 60); // перевод в секунды
      setTimerActive(true);
      setTimeIsUp(false);
    } catch (error) {
      console.error('Failed to load tasks:', error);
    }
  };

  // Обработка таймера
  useEffect(() => {
    if (!timerActive || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setTimerActive(false);
          setTimeIsUp(true);
          calculateStatistics();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  // Навигация по задачам
  const goToNextTask = () => {
    if (currentTaskIndex < tasks.length - 1) {
      setCurrentTaskIndex(prev => prev + 1);
    } else {
      calculateStatistics();
    }
  };

  const goToPreviousTask = () => {
    if (currentTaskIndex > 0) {
      setCurrentTaskIndex(prev => prev - 1);
    }
  };

  const goToTask = (index) => {
    if (index >= 0 && index < tasks.length) {
      setCurrentTaskIndex(index);
    }
  };

  const saveAnswer = (taskId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [taskId]: answer
    }));
  };

  

  // Расчет статистики


  // Завершение варианта досрочно
  const finishVariant = () => {
    setTimerActive(false);
    calculateStatistics();
  };

  // Сброс и начало заново
  const resetVariant = () => {
    setCurrentVariant(null);
    setTasks([]);
    setCurrentTaskIndex(0);
    setTimeLeft(0);
    setTimerActive(false);
    setTimeIsUp(false);
    setStatistics({
      totalTime: 0,
      completedTasks: 0,
      correctAnswers: 0,
      incorrectAnswers: 0
    });
  };

  const value = {
    variants,
    currentVariant,
    tasks,
    currentTaskIndex,
    currentTask: tasks[currentTaskIndex],
    timeLeft,
    timerActive,
    timeIsUp,
    statistics,
    selectVariant,
    goToNextTask,
    goToPreviousTask,
    goToTask,
    finishVariant,
    answers,
    saveAnswer,
    resetVariant
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};