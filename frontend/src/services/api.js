const API_URL = '/api';

// Выполнение кода Python
export const executeCode = async (code) => {
  try {
    const response = await fetch(`${API_URL}/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to execute code');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Execute code error:', error);
    throw error;
  }
};

// Получение всех вариантов
export const getVariants = async () => {
  try {
    const response = await fetch(`${API_URL}/variants`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch variants');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Get variants error:', error);
    throw error;
  }
};

// Получение задач для конкретного варианта
export const getTasks = async (variantId) => {
  try {
    const response = await fetch(`${API_URL}/variants/${variantId}/tasks`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch tasks');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Get tasks error:', error);
    throw error;
  }
};

// Сохранение результатов
export const saveResults = async (variantId, statistics) => {
  try {
    const response = await fetch(`${API_URL}/results`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        variantId,
        ...statistics
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to save results');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Save results error:', error);
    throw error;
  }
};

export const check_answer = async (variant_id, answers) => {
  const response = await fetch(`${API_URL}/check-answers`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    variant_id,
    answers
  }),
  });
  
  return await response.json();

}

// Получение нерешенных вариантов для пользователя
export const getUserVariants = async (userId) => {
  try {
    const response = await fetch(`${API_URL}/user/${userId}/variants`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch user variants');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Get user variants error:', error);
    throw error;
  }
};

export const saveUserResults = async (userId, variantId, taskResults) => {
  try {
    // Ensure taskResults is in the correct format expected by the backend
    // Convert it to a simple object with string keys and boolean values if needed
    const formattedTaskResults = {}; 
    
    // If taskResults is already an object of task IDs to booleans, use it directly
    // Otherwise, format it according to your needs
    Object.keys(taskResults).forEach(taskId => {
      formattedTaskResults[taskId.toString()] = Boolean(taskResults[taskId]);
    });
    
    console.log("Sending data:", {
      variant_id: variantId,
      task_results: formattedTaskResults
    });
    
    const response = await fetch(`${API_URL}/user/${userId}/results`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        variant_id: variantId,
        task_results: formattedTaskResults
      }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Server response:', errorText);
      throw new Error(`Failed to save user results: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Save user results error:', error);
    throw error;
  }
};