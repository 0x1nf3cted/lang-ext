import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const SavedWordsPage = ({ savedWords }: any) => {
  const [words, setWords] = useState(savedWords);

  const handleDelete = (index: number) => {
    const newSavedWords = [...savedWords];
    newSavedWords.splice(index, 1); // Remove the word at the specified index
    setWords(newSavedWords);
  };
  return (
    <div
      className="p-6 bg-white border rounded-md shadow-md mt-4"
      style={{
        fontSize: '14px',
        lineHeight: '1.5',
        fontFamily: 'Arial, sans-serif',
        textAlign: 'left',
        color: '#333',
      }}>
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Full List of Saved Words</h1>
        <Link to="/" className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600">
          Back
        </Link>
      </div>

      {/* List of saved words */}
      {words.length > 0 ? (
        <ul className="list-none p-0">
          {words.map((item, index) => (
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
    </div>
  );
};

export default SavedWordsPage;
