import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTaskContext } from '../context/TaskContext';

const HomePage = () => {
  const { variants, selectVariant, user } = useTaskContext();
  const [completedVariants, setCompletedVariants] = useState([]);
  const navigate = useNavigate();

  const handleVariantSelect = async (variantId) => {
    await selectVariant(variantId);
    navigate(`/variant/${variantId}`);
  };

  const isVariantCompleted = (variantId) => {
    return completedVariants.some(v => v.id === variantId);
  };

  return (
    <div className="container mx-auto px-4 py-8">
    <header className="mb-8">
      <h1 className="text-3xl font-bold text-center text-blue-600">ЕГЭ информатика</h1>
      <p className="text-center text-gray-600 mt-2">Выберите вариант заданий</p>
    </header>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {variants.map((variant) => {
        const isCompleted = isVariantCompleted(variant.id);
        
        return (
          <div 
            key={variant.id} 
            onClick={() => !isCompleted && handleVariantSelect(variant.id)}
            className={`
              bg-white rounded-lg shadow-md p-6 transition-shadow 
              ${isCompleted ? 'cursor-not-allowed opacity-70' : 'cursor-pointer hover:shadow-lg'}
              border-2 ${isCompleted ? 'border-green-500' : 'border-transparent hover:border-blue-500'}
              relative
            `}
          >
            {isCompleted && (
              <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                Решено
              </div>
            )}
            <h2 className="text-xl font-semibold mb-2">{variant.title}</h2>
            <p>{variant.description}</p>
            <div className="flex justify-between text-gray-600">
              <span>{variant.task_count} задач</span>
              <span>{variant.time_limit} мин.</span>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);
};

export default HomePage;