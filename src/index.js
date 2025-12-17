import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './BrainGamesForSeniors'; // 导入主应用组件
import './index.css'; // 导入样式和 Tailwind 配置

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);