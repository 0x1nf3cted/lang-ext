import React, { useEffect, useState } from 'react';

const TranslationBox = ({ originalText, replacedText, highlightedElement, hideBox, change }: any) => {
  const [showTranslation, setShowTranslation] = useState(true);
  const [savedWords, setSavedWords] = useState([]);
  const [boxPosition, setBoxPosition] = useState({ top: 0, left: 0 });

  const toggleTranslation = () => setShowTranslation(!showTranslation);

  const handleWordSave = (word: any) => {
    if (!savedWords.includes(word)) {
      setSavedWords([...savedWords, word]);
    }
  };

  useEffect(() => {
    if (highlightedElement) {
      const rect = highlightedElement.getBoundingClientRect();
      setBoxPosition({
        top: rect.top + window.scrollY + highlightedElement.offsetHeight,
        left: rect.left + highlightedElement.offsetWidth + 10,
      });
      console.log(rect);
    }
  }, [highlightedElement]); // Recalculate when highlightedElement changes

  const words = originalText.split(' ');

  return (
    <div
      className="p-4 bg-white border rounded-md shadow-md mt-4 w-[400px]"
      style={{
        position: 'absolute',
        top: `${boxPosition.top}px`,
        left: `${boxPosition.left}px`,
        fontSize: '14px',
        lineHeight: '1.5',
        fontFamily: 'Arial, sans-serif',
        textAlign: 'left',
        color: '#333',
      }}>
      {/* Header with Language Info */}
      <div className="flex justify-between items-center mb-2">
        <div>
          <strong>Translation</strong> (English → French)
        </div>
        <div className="flex space-x-2">
          <button className="px-2 py-1 bg-gray-100 border rounded text-md" onClick={hideBox}>
            Hide box
          </button>
        </div>
      </div>

      {/* Original & Translated Text */}
      <div className="mb-3">
        <p className="font-bold text-gray-600">Original:</p>
        <p className="text-gray-800">
          {words.map((word, index) => (
            <span key={index} className="relative group">
              <span>{word} </span>
              <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 hidden group-hover:inline-block bg-gray-800 text-white text-md rounded p-1">
                {`Translation of "${word}"`}
              </span>
            </span>
          ))}
        </p>
      </div>

      {showTranslation && (
        <div className="mb-3">
          <p className="font-bold text-gray-600">Translation:</p>
          <p className="text-gray-800">{replacedText}</p>
        </div>
      )}

      <div className="mb-3">
        <button
          className="flex items-center px-3 py-1 bg-gray-100 border rounded-md text-md"
          onClick={() => alert('Playing audio...')}>
          <span role="img" aria-label="speaker" className="mr-1">
            🔊
          </span>
          Listen to Pronunciation
        </button>
      </div>

      <div className="mb-3">
        <p className="font-bold text-gray-600">Save Words:</p>
        <div className="flex flex-wrap">
          {words.map((word, index) => (
            <button
              key={index}
              className="px-2 py-1 bg-gray-100 border rounded text-md m-1 hover:bg-blue-100"
              onClick={() => handleWordSave(word)}>
              {word}
            </button>
          ))}
        </div>
      </div>

      {savedWords.length > 0 && (
        <div className="mb-3">
          <p className="font-bold text-gray-600">Saved Words:</p>
          <ul className="list-disc list-inside text-gray-800">
            {savedWords.map((word, index) => (
              <li key={index}>{word}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Next Page Button */}
      <div className="mb-3">
        <button
          className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          onClick={change} // Calls the change function
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TranslationBox;
