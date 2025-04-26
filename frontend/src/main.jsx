import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/style.css';
import App from './App';

// Подключение Telegram WebApp API
const script = document.createElement('script');
script.src = 'https://telegram.org/js/telegram-web-app.js';
script.async = true;
document.head.appendChild(script);

// Инициализация после загрузки скрипта
script.onload = () => {
  window.Telegram.WebApp.ready();
  window.Telegram.WebApp.expand();
  
  // Сохраняем данные пользователя в localStorage
  const user = window.Telegram.WebApp.initDataUnsafe?.user;
  if (user) {
    localStorage.setItem('telegramUser', JSON.stringify(user));
  }

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
}