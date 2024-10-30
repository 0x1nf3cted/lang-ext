import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { options, difficulty } from '../data/languages';

function Language() {
  const [language, setLanguage] = useState(options[11]);
  const [difficultyLevel, setDifficultyLevel] = useState(difficulty[0]);

  useEffect(() => {
    chrome.storage.sync.get(['language'], result => {
      if (result.language) {
        const savedLanguage = options.find(a => a.value === result.language);
        if (savedLanguage) setLanguage(savedLanguage);
      }
    });

    chrome.storage.sync.get(['difficulty'], result => {
      if (result.difficulty) {
        const savedDifficulty = difficulty.find(a => a.value === result.difficulty);
        if (savedDifficulty) setDifficultyLevel(savedDifficulty);
      }
    });
  }, []);

  const handleLanguageChange = selectedOption => {
    setLanguage(selectedOption);
    chrome.storage.sync.set({ language: selectedOption.value });
  };

  const handleDifficultyChange = selectedOption => {
    setDifficultyLevel(selectedOption);
    chrome.storage.sync.set({ difficulty: selectedOption.value });
  };

  return (
    <div className="p-4 bg-white border rounded-md shadow-md text-sm">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <strong className="text-gray-700">Language Settings</strong>
      </div>

      {/* Language Selector */}
      <div className="mb-4">
        <label className="block text-gray-600 font-bold mb-2">Select Language:</label>
        <Select
          value={language}
          isSearchable={true}
          name="Languages"
          options={options}
          onChange={handleLanguageChange}
          className="text-black"
        />
      </div>

      {/* Difficulty Selector */}
      <div className="mb-4">
        <label className="block text-gray-600 font-bold mb-2">Select Difficulty:</label>
        <Select value={difficultyLevel} options={difficulty} onChange={handleDifficultyChange} className="text-black" />
      </div>
    </div>
  );
}

export default Language;
