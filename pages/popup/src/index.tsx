import { createRoot } from 'react-dom/client';
import '@src/index.css';
import Popup, { Tabs } from '@src/Popup';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import SettingsPage from './pages/SettingsPage';


function init() {
  const appContainer = document.querySelector('#app-container');
  if (!appContainer) {
    throw new Error('Can not find #app-container');
  }
  const root = createRoot(appContainer);

  root.render(


    <Router>
      <Tabs />
    </Router>

  );
}

init();
