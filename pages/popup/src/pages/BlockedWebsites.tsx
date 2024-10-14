import '@src/styles/SettingsPage.css';
import { useStorage, withErrorBoundary, withSuspense } from '@extension/shared';
import { exampleThemeStorage } from '@extension/storage';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MdArrowBack } from "react-icons/md";
import Input from '@mui/joy/Input';
import Button from '@mui/joy/Button';
import { FiPlus } from "react-icons/fi";
import BlockWebsiteCard from '@src/widgets/BlockWebsiteCard';
import { v4 as uuidv4 } from 'uuid'; // Import UUID function


const notificationOptions = {
  type: 'basic',
  iconUrl: chrome.runtime.getURL('icon-34.png'),
  title: 'Injecting content script error',
  message: 'You cannot inject script here!',
} as const;


export interface BlockedWebsite {
  website: string,
  id: string,
}

const BlockedWebsites = () => {
  const [blockedWebsites, setBlockedWebsites] = useState<BlockedWebsite[]>([]);
  const [inputWord, setInputWord] = useState('');

  // Load blocked websites from Chrome storage when the component mounts
  useEffect(() => {
      chrome.storage.sync.get(['blockedWebsite'], (result) => {
          if (chrome.runtime.lastError) {
              console.error("Error loading blocked websites:", chrome.runtime.lastError);
              return;
          }
          const existingWebsites = result.blockedWebsite || [];
          setBlockedWebsites(existingWebsites);
      });
  }, []);

  const addWebsite = () => {
      if (inputWord.trim() === '') return; // Ignore empty input

      const newWebsite: BlockedWebsite = {
          website: inputWord,
          id: uuidv4(), // Generate a new UUID
      };

      chrome.storage.sync.get(['blockedWebsite'], (result) => {
          const existingWebsites: BlockedWebsite[] = result.blockedWebsite || [];
          const updatedWebsites = [...existingWebsites, newWebsite];

          chrome.storage.sync.set({ blockedWebsite: updatedWebsites }, () => {
              if (chrome.runtime.lastError) {
                  console.error("Error saving website:", chrome.runtime.lastError);
                  return;
              }
              setBlockedWebsites(updatedWebsites); // Update the blockedWebsites state with the new list
          });
      });

      setInputWord(''); // Clear the input after adding
  };
  const handleDelete = (id: string) => {
    setBlockedWebsites(prevWebsites => prevWebsites.filter(website => website.id !== id));
};

  const theme = useStorage(exampleThemeStorage);
  const isLight = theme === 'light';
  const logo = isLight ? 'popup/logo_vertical.svg' : 'popup/logo_vertical_dark.svg';

  return (
    <div className={`App ${isLight ? 'bg-slate-50' : 'bg-gray-800'}`}>
      <Link to="/"><MdArrowBack size={24} color='white' /></Link>
      <div className="flex flex-col">

        <div className="w-full flex flex-row mt-4 justify-between">
          <Input
            placeholder="Block a website..."
            value={inputWord}
            onChange={(e) => setInputWord(e.target.value)} // Update state on input change
            variant="outlined"
          />
          <Button
            className="w-32"
            startDecorator={<FiPlus />}
            onClick={addWebsite} // Attach the addWord function to button click
          >
            Add
          </Button>
        </div>

        <div className="flex flex-col mt-4 gap-y-4">
          {blockedWebsites.length > 0 ? (
            blockedWebsites.map((word, index) => (
              <BlockWebsiteCard key={index} website={word} onDelete={handleDelete}/>
            ))
          ) : (
            <p className="text-white">Blacklist is empty.</p>
          )}
        </div>

      </div>
    </div>
  );
};

export default withErrorBoundary(withSuspense(BlockedWebsites, <div>Loading...</div>), <div>Error Occurred</div>);
