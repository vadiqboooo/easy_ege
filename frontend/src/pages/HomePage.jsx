import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTaskContext } from '../context/TaskContext';

const HomePage = () => {
  const { variants, selectVariant } = useTaskContext();
  const navigate = useNavigate();

  const handleVariantSelect = async (variantId) => {
    await selectVariant(variantId);
    navigate(`/variant/${variantId}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-center text-blue-600">ЕГЭ информатика</h1>
        <p className="text-center text-gray-600 mt-2">Выберите вариант заданий</p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {variants.map((variant) => (
          <div 
            key={variant.id} 
            onClick={() => handleVariantSelect(variant.id)}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-blue-500"
          >
            <h2 className="text-xl font-semibold mb-2">{variant.title}</h2>
            <p>{variant.description}</p>
            <div className="flex justify-between text-gray-600">
              <span>{variant.task_count} задач</span>
              <span>{variant.time_limit} мин.</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;