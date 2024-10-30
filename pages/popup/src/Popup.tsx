// import '@src/Popup.css';
// import { useStorage, withErrorBoundary, withSuspense } from '@extension/shared';
// import { exampleThemeStorage } from '@extension/storage';
// import type { ComponentPropsWithoutRef } from 'react';
// import Language from './components/Language';
// import Settings from './components/Settings';
// import Tools from './components/Tools';
// import Privacy from './components/Privacy';
// import { Route, Routes } from 'react-router-dom';
// import SettingsPage from './pages/SettingsPage';
// import BlockedWebsites from './pages/BlockedWebsites';
// import BlackListWords from './pages/BlackListWords';

// const notificationOptions = {
//   type: 'basic',
//   iconUrl: chrome.runtime.getURL('icon-34.png'),
//   title: 'Injecting content script error',
//   message: 'You cannot inject script here!',
// } as const;

// const Popup = () => {
//   const theme = useStorage(exampleThemeStorage);
//   const isLight = theme === 'light';
//   const logo = isLight ? 'popup/logo_vertical.svg' : 'popup/logo_vertical_dark.svg';
//   const goGithubSite = () =>
//     chrome.tabs.create({ url: 'https://github.com/Jonghakseo/chrome-extension-boilerplate-react-vite' });

//   const injectContentScript = async () => {
//     const [tab] = await chrome.tabs.query({ currentWindow: true, active: true });

//     if (tab.url!.startsWith('about:') || tab.url!.startsWith('chrome:')) {
//       chrome.notifications.create('inject-error', notificationOptions);
//     }

//     await chrome.scripting
//       .executeScript({
//         target: { tabId: tab.id! },
//         files: ['/content-runtime/index.iife.js'],
//       })
//       .catch(err => {
//         // Handling errors related to other paths
//         if (err.message.includes('Cannot access a chrome:// URL')) {
//           chrome.notifications.create('inject-error', notificationOptions);
//         }
//       });
//   };

//   return (
//     //    <div className={`App ${isLight ? 'bg-slate-50' : 'bg-gray-500'}`}>

//     <div className={`App`}>
//       <Settings />
//       <Language />
//       <Privacy />
//       <Tools />
//       {/* <header className={`App-header ${isLight ? 'text-gray-900' : 'text-gray-100'}`}>
//         <button onClick={goGithubSite}>
//           <img src={chrome.runtime.getURL(logo)} className="App-logo" alt="logo" />
//         </button>
//         <p>
//           Edit <code>pages/popup/src/Popup.tsx</code>
//         </p>
//         <button
//           className={
//             'font-bold mt-4 py-1 px-4 rounded shadow hover:scale-105 ' +
//             (isLight ? 'bg-blue-200 text-black' : 'bg-gray-700 text-white')
//           }
//           onClick={injectContentScript}>
//           Click to inject Content Script
//         </button>
//         <ToggleButton>Toggle theme nnnn</ToggleButton>
//       </header> */}
//     </div>
//   );
// };

// export const Tabs = () => {
//   return (
//     <Routes>
//       <Route path="/" element={<Popup />} />
//       <Route path="/settings" element={<SettingsPage />} />
//       <Route path="/blocked" element={<BlockedWebsites />} />
//       <Route path="/blacklist" element={<BlackListWords />} />

//     </Routes>
//   )
// }

// const ToggleButton = (props: ComponentPropsWithoutRef<'button'>) => {
//   const theme = useStorage(exampleThemeStorage);
//   return (
//     <button
//       className={
//         props.className +
//         ' ' +
//         'font-bold mt-4 py-1 px-4 rounded shadow hover:scale-105 ' +
//         (theme === 'light' ? 'bg-white text-black shadow-black' : 'bg-black text-white')
//       }
//       onClick={exampleThemeStorage.toggle}>
//       {props.children}
//     </button>
//   );
// };

// export default withErrorBoundary(withSuspense(Popup, <div> Loading ... </div>), <div> Error Occur </div>);

import '@src/Popup.css';
import { useStorage, withErrorBoundary, withSuspense } from '@extension/shared';
import { exampleThemeStorage } from '@extension/storage';
import Language from './components/Language';
import Settings from './components/Settings';
import Tools from './components/Tools';
import Privacy from './components/Privacy';
import { Link, Route, Routes } from 'react-router-dom';
import SettingsPage from './pages/SettingsPage';
import BlockedWebsites from './pages/BlockedWebsites';
import BlackListWords from './pages/BlackListWords';
import { RiSettings3Line } from 'react-icons/ri';
import { IoPersonSharp } from 'react-icons/io5';
import ProgressWidget from './components/ProgressWidget';
import WordWidget from './components/WordList';
import SavedWordsPage from './pages/SavedWordsPage';
import Login from './pages/auth/Login';
import SignUp from './pages/auth/Signup';

const Popup = () => {
  const progress = 75; // Number of words learned
  const totalWords = 100; // Total words to learn
  const streak = 5; // Example streak
  const totalPoints = 120; // Total points earned

  // Example practice days for the last week
  const practiceDays = [
    { date: 'Mon', practiced: true }, // Monday
    { date: 'Tue', practiced: true }, // Tuesday
    { date: 'Wed', practiced: false }, // Wednesday
    { date: 'Thu', practiced: true }, // Thursday
    { date: 'Fri', practiced: false }, // Friday
    { date: 'Sat', practiced: true }, // Saturday
    { date: 'Sun', practiced: true }, // Sunday
  ];

  const theme = useStorage(exampleThemeStorage);
  const isLight = theme === 'light';
  const logo = isLight ? 'popup/logo_vertical.svg' : 'popup/logo_vertical_dark.svg';

  const goGithubSite = () =>
    chrome.tabs.create({ url: 'https://github.com/Jonghakseo/chrome-extension-boilerplate-react-vite' });

  const injectContentScript = async () => {
    const [tab] = await chrome.tabs.query({ currentWindow: true, active: true });

    if (tab.url!.startsWith('about:') || tab.url!.startsWith('chrome:')) {
      chrome.notifications.create('inject-error', {
        type: 'basic',
        iconUrl: chrome.runtime.getURL('icon-34.png'),
        title: 'Injecting content script error',
        message: 'You cannot inject script here!',
      });
    }

    await chrome.scripting
      .executeScript({
        target: { tabId: tab.id! },
        files: ['/content-runtime/index.iife.js'],
      })
      .catch(err => {
        if (err.message.includes('Cannot access a chrome:// URL')) {
          chrome.notifications.create('inject-error', {
            type: 'basic',
            iconUrl: chrome.runtime.getURL('icon-34.png'),
            title: 'Injecting content script error',
            message: 'You cannot inject script here!',
          });
        }
      });
  };

  return (
    <div className="App p-4 bg-gray-100 dark:bg-gray-900 shadow-lg rounded-md text-gray-800 dark:text-white w-96">
      {/* Header */}

      {/* Sections */}
      <div className="mb-4">
        <Settings />
      </div>
      <div className="mb-4">
        <ProgressWidget
          progress={progress}
          totalWords={totalWords}
          streak={streak}
          totalPoints={totalPoints}
          practiceDays={practiceDays} // Pass the practice days
        />
      </div>
      <div className="mb-4">
        <WordWidget />
      </div>

      {/* <div className="mb-4">
        <Tools />
      </div> */}
    </div>
  );
};

export const Tabs = () => {
  const savedWords = [
    { word: 'Hello', translation: 'Bonjour' },
    { word: 'Goodbye', translation: 'Au revoir' },
    { word: 'Thank you', translation: 'Merci' },
  ];
  return (
    <Routes>
      <Route path="/" element={<Popup />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/blocked" element={<BlockedWebsites />} />
      <Route path="/wordlist" element={<SavedWordsPage savedWords={savedWords} />} />
      <Route path="/blacklist" element={<BlackListWords />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<SignUp />} />
    </Routes>
  );
};

export default withErrorBoundary(withSuspense(Popup, <div>Loading...</div>), <div>Error occurred</div>);
