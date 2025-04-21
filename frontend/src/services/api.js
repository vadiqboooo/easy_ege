const API_URL = 'http://127.0.0.1:8000';

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