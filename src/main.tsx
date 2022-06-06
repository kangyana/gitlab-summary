import React from 'react';
import ReactDOM from 'react-dom/client';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import 'antd/dist/antd.less';
import App from './App';
import './index.less';

dayjs.extend(isBetween);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
