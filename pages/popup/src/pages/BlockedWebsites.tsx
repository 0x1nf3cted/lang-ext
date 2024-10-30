import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MdArrowBack } from 'react-icons/md';
import Input from '@mui/joy/Input';
import Button from '@mui/joy/Button';
import { FiPlus } from 'react-icons/fi';
import BlockWebsiteCard from '@src/widgets/BlockWebsiteCard';
import { v4 as uuidv4 } from 'uuid'; // Import UUID function

export interface BlockedWebsite {
  website: string;
  id: string;
}

const BlockedWebsites = () => {
  const [blockedWebsites, setBlockedWebsites] = useState<BlockedWebsite[]>([]);
  const [inputWord, setInputWord] = useState('');

  // Load blocked websites from Chrome storage when the component mounts
  useEffect(() => {
    chrome.storage.sync.get(['blockedWebsite'], result => {
      if (chrome.runtime.lastError) {
        console.error('Error loading blocked websites:', chrome.runtime.lastError);
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
      id: uuidv4(),
    };

    chrome.storage.sync.get(['blockedWebsite'], result => {
      const existingWebsites: BlockedWebsite[] = result.blockedWebsite || [];
      const updatedWebsites = [...existingWebsites, newWebsite];

      chrome.storage.sync.set({ blockedWebsite: updatedWebsites }, () => {
        if (chrome.runtime.lastError) {
          console.error('Error saving website:', chrome.runtime.lastError);
          return;
        }
        setBlockedWebsites(updatedWebsites);
      });
    });

    setInputWord(''); // Clear the input after adding
  };

  const handleDelete = (id: string) => {
    setBlockedWebsites(prevWebsites => prevWebsites.filter(website => website.id !== id));
  };

  return (
    <div className="p-4 bg-white border rounded-md shadow-md w-96 text-sm">
      {/* Back button */}
      <Link to="/" className="mb-4 inline-block">
        <MdArrowBack size={24} className="text-gray-600 cursor-pointer" />
      </Link>

      {/* Input and Add Button */}
      <div className="flex flex-row justify-between items-center mb-4">
        <Input
          placeholder="Block a website..."
          value={inputWord}
          onChange={e => setInputWord(e.target.value)}
          variant="outlined"
          className="w-full mr-2"
        />
        <Button className="w-32" startDecorator={<FiPlus />} onClick={addWebsite}>
          Add
        </Button>
      </div>

      {/* Blocked Websites List */}
      <div className="flex flex-col gap-y-4">
        {blockedWebsites.length > 0 ? (
          blockedWebsites.map(website => (
            <BlockWebsiteCard key={website.id} website={website} onDelete={handleDelete} />
          ))
        ) : (
          <p className="text-gray-600">Blacklist is empty.</p>
        )}
      </div>
    </div>
  );
};

export default BlockedWebsites;
