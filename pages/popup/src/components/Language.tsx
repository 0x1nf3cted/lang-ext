import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { options, difficulty } from "../data/languages";

function Language() {
    const [language, setLanguage] = useState<{ value: string; label: string; }>(options[11]);
    const [diff, setDiff] = useState<{ value: string; label: string; }>(difficulty[0]);

    useEffect(() => {
        // Fetch saved language
        chrome.storage.sync.get(['language'], (result) => {
            if (result.language) {
                const savedLanguage = options.find(a => a.value === result.language);
                if (savedLanguage) {
                    setLanguage(savedLanguage);
                }
            }
        });

        // Fetch saved difficulty
        chrome.storage.sync.get(['difficulty'], (result) => {
            if (result.difficulty) {
                const savedDifficulty = difficulty.find(a => a.value === result.difficulty);
                if (savedDifficulty) {
                    setDiff(savedDifficulty);
                }
            }
        });
    }, []);

    // Handle language change
    const handleLanguageChange = (selectedOption: { value: string; label: string; }) => {
        setLanguage(selectedOption);
        // Save the selected language to Chrome storage
        chrome.storage.sync.set({ language: selectedOption.value }, () => {
            if (chrome.runtime.lastError) {
                console.error("Error saving language:", chrome.runtime.lastError);
            } else {
                console.log("Selected language:", selectedOption.value);
            }
        });
    };

    // Handle difficulty change
    const handleDifficultyChange = (selectedOption: { value: string; label: string; }) => {
        setDiff(selectedOption);
        // Save the selected difficulty to Chrome storage
        chrome.storage.sync.set({ difficulty: selectedOption.value }, () => {
            if (chrome.runtime.lastError) {
                console.error("Error saving difficulty:", chrome.runtime.lastError);
            } else {
                console.log("Selected difficulty:", selectedOption.value);
            }
        });
    };

    return (
        <div className='flex flex-col w-full bg-blue-700 gap-y-6 rounded-md p-2 mt-4'>
            <h1 className='text-xl text-white'>Language</h1>
            <div className='flex w-full flex-row justify-between items-center'>
                <p className='text-white text-md'>Language</p>
                <Select
                    className="w-32"
                    classNamePrefix="select"
                    value={language}
                    isSearchable={true}
                    name="Languages"
                    options={options}
                    onChange={handleLanguageChange}  // Capture the value change
                />
            </div>
            <div className='flex w-full flex-row justify-between items-center'>
                <p className='text-white text-md'>Difficulty</p>
                <Select
                    className='inline-block text-left w-32'
                    value={diff}
                    options={difficulty}
                    onChange={handleDifficultyChange}
                />
            </div>
        </div>
    );
}

export default Language;
