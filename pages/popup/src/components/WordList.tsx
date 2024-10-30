import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const WordList = () => {
  const [savedWords, setSavedWords] = useState([
    { word: 'Hello', translation: 'Bonjour' },
    { word: 'Goodbye', translation: 'Au revoir' },
    { word: 'Thank you', translation: 'Merci' },
  ]);

  const wordLimit = 5;

  const handleDelete = (index: number) => {
    const newSavedWords = [...savedWords];
    newSavedWords.splice(index, 1); // Remove the word at the specified index
    setSavedWords(newSavedWords);
  };

  const handleAddWord = () => {
    if (savedWords.length >= wordLimit) {
      alert('Word limit reached! You can only save up to 5 words.');
      return;
    }

    // Add a new word (you can replace this with a form input or dynamic input)
    const newWord = { word: 'New Word', translation: 'Nouvelle Parole' };
    setSavedWords([...savedWords, newWord]);
  };

  const handleCheckList = () => {
    // Log the entire list to the console or show it in an alert
    console.log('Saved words list:', savedWords);
    alert(savedWords.map(item => `${item.word} → ${item.translation}`).join('\n'));
  };

  return (
    <div
      className="p-4 bg-white border rounded-md shadow-md text-sm"
      style={{
        fontSize: '14px',
        lineHeight: '1.5',
        fontFamily: 'Arial, sans-serif',
        textAlign: 'left',
        color: '#333',
      }}>
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <div>
          <strong>Saved Words</strong> (English → French)
        </div>
        {/* <button
                    className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    onClick={handleCheckList}
                >
                    Check List
                </button> */}
      </div>
      {/* List of saved words */}
      {savedWords.length > 0 ? (
        <ul className="list-none p-0">
          {savedWords.map((item, index) => (
            <li key={index} className="flex justify-between items-center mb-2 p-2 bg-gray-100 rounded-md">
              <div>
                <strong>{item.word}</strong> → {item.translation}
              </div>
              <button
                key={index}
                className="px-2 py-1 bg-gray-100 border rounded text-md m-1 hover:bg-blue-100"
                onClick={() => handleDelete(index)}>
                🗑️
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600">No saved words.</p>
      )}
      {/* Add Word Button */}
      {/* <div className="mt-4">
                <button
                    className="px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                    onClick={handleAddWord}
                    disabled={savedWords.length >= wordLimit} // Disable if word limit is reached
                >
                    {savedWords.length >= wordLimit ? 'Limit Reached' : 'Add Word'}
                </button>
            </div> */}
      <Link to="/wordlist">
        {' '}
        <p className="text-green-500">more</p>
      </Link>{' '}
    </div>
  );
};

export default WordList;
