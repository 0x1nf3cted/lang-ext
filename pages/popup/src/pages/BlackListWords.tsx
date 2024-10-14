
import '@src/styles/SettingsPage.css';
import { useStorage, withErrorBoundary, withSuspense } from '@extension/shared';
import { exampleThemeStorage } from '@extension/storage';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MdArrowBack } from "react-icons/md";
import Input from '@mui/joy/Input';
import Button from '@mui/joy/Button';
import { FiPlus } from "react-icons/fi";

const notificationOptions = {
  type: 'basic',
  iconUrl: chrome.runtime.getURL('icon-34.png'),
  title: 'Injecting content script error',
  message: 'You cannot inject script here!',
} as const;

const BlackListWords = () => {
  const [blockedWords, setBlockedWords] = useState<string[]>([]);
  const [inputWord, setInputWord] = useState('');

  // Load blocked words from Chrome storage when the component mounts
  useEffect(() => {
    chrome.storage.sync.get(['blockedWords'], (result) => {
      if (chrome.runtime.lastError) {
        console.error("Error loading blocked words:", chrome.runtime.lastError);
        return;
      }
      const existingWords = result.blockedWords || [];
      setBlockedWords(existingWords);
    });
  }, []);

  const addWord = () => {
    if (inputWord.trim() === '') return; // Ignore empty input

    chrome.storage.sync.get(['blockedWords'], (result) => {
      const existingWords: string[] = result.blockedWords || [];
      const updatedWords = [...existingWords, inputWord];

      chrome.storage.sync.set({ blockedWords: updatedWords }, () => {
        if (chrome.runtime.lastError) {
          console.error("Error saving word:", chrome.runtime.lastError);
          return;
        }
        setBlockedWords(updatedWords); // Update the blockedWords state with the new list
      });
    });

    setInputWord(''); // Clear the input after adding
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
            placeholder="Add new words..."
            value={inputWord}
            onChange={(e) => setInputWord(e.target.value)} // Update state on input change
            variant="outlined"
          />
          <Button
            className="w-32"
            startDecorator={<FiPlus />}
            onClick={addWord} // Attach the addWord function to button click
          >
            Add
          </Button>
        </div>

        <div className="flex flex-col mt-4">
          {blockedWords.length > 0 ? (
            blockedWords.map((word, index) => (
              <p key={index} className="text-white">{word}</p>
            ))
          ) : (
            <p className="text-white">Blacklist is empty.</p>
          )}
        </div>

      </div>
    </div>
  );
};

export default withErrorBoundary(withSuspense(BlackListWords, <div>Loading...</div>), <div>Error Occurred</div>);
