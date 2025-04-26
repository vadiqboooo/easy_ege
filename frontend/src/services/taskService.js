import { 
  getVariants as fetchVariants, 
  getTasks, 
  check_answer, 
  getUserVariants as fetchUserVariants,
  saveUserResults
} from './api';

// Локальные данные для демонстрации (при отсутствии связи с API)
const demoVariants = [
  { id: 1, title: 'Вариант 1', taskCount: 5, timeLimit: 60 },
  { id: 2, title: 'Вариант 2', taskCount: 7, timeLimit: 90 },
  { id: 3, title: 'Вариант 3', taskCount: 10, timeLimit: 120 }
];

const demoTasks = {
  1: [
    {
      id: 1,
      title: 'Переменные и типы данных',
      description: `# Задача 1: Переменные и типы данных\n\nНапишите программу, которая создает переменные разных типов (int, float, str, bool) и выводит их значения и типы.`,
      variantId: 1
    },
    {
      id: 2,
      title: 'Условные операторы',
      description: `# Задача 2: Условные операторы\n\nНапишите программу, которая принимает число и проверяет, положительное оно, отрицательное или ноль. Также проверьте, четное оно или нечетное (если не ноль).`,
      variantId: 1
    },
    {
      id: 3,
      title: 'Циклы',
      description: `# Задача 3: Циклы\n\nНапишите программу, которая выводит все числа от 1 до 20, которые делятся либо на 3, либо на 5.`,
      variantId: 1
    },
    {
      id: 4,
      title: 'Списки',
      description: `# Задача 4: Списки\n\nНапишите программу, которая создает список чисел от 1 до 10, затем удаляет все четные числа из списка, и выводит результат.`,
      variantId: 1
    },
    {
      id: 5,
      title: 'Функции',
      description: `# Задача 5: Функции\n\nНапишите функцию, которая принимает два аргумента и возвращает их сумму, разность, произведение и частное. Вызовите функцию с различными аргументами.`,
      variantId: 1
    }
  ],
  2: [
    {
      id: 6,
      title: 'Словари',
      description: `# Задача 1: Словари\n\nСоздайте словарь, содержащий информацию о студенте (имя, возраст, курс, средний балл). Добавьте новое поле, измените существующее и удалите одно поле. Выведите все ключи и значения.`,
      variantId: 2
    },
    // Другие задачи для второго варианта...
  ]
};

// Получение нерешенных вариантов для пользователя
export const getUserVariants = async (userId) => {
  try {
    const variants = await fetchUserVariants(userId);
    return variants;
  } catch (error) {
    console.error('Error fetching user variants, using demo data:', error);
    return demoVariants;
  }
};

// Сохранение результатов пользователя
export const saveResults = async (userId, variantId, taskResults) => {
  try {
    return await saveUserResults(userId, variantId, taskResults);
  } catch (error) {
    console.error('Error saving user results:', error);
    return { status: 'error', message: error.message };
  }
};

// Получение всех вариантов
export const getVariants = async () => {
  try {
    const variants = await fetchVariants();
    return variants;
  } catch (error) {
    console.error('Error fetching variants, using demo data:', error);
    return demoVariants;
  }
};

// Получение задач для варианта
export const getTasksForVariant = async (variantId) => {
  try {
    const tasks = await getTasks(variantId);
    return tasks;
  } catch (error) {
    console.error(`Error fetching tasks for variant ${variantId}, using demo data:`, error);
    return demoTasks[variantId] || [];
  }
};

export const check_task = async (variantId, answers) => {
  const check = await check_answer(variantId, answers);
  return check
  // check.then(value => {
  //     let correct = value.filter(x => x === true).length;
  //     let incorrect = value.filter(x => x === false).length;
  //     return {correct, incorrect}
  // })
  
}