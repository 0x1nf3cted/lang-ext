import React, { useState, useEffect } from 'react';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const SentenceConstructor = ({ sentence, highlightedElement, hideBox, change }: any) => {
  const [shuffledWords, setShuffledWords] = useState<string[]>([]);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  // Shuffle the sentence words initially
  useEffect(() => {
    const words = sentence.split(' ');
    const shuffled = [...words].sort(() => Math.random() - 0.5); // Simple random shuffle
    setShuffledWords(shuffled);
  }, [sentence]);

  // Handle selecting a word to build the sentence
  const handleWordClick = (word: string) => {
    setSelectedWords([...selectedWords, word]);
  };

  // Handle resetting the sentence construction
  const handleReset = () => {
    setSelectedWords([]);
    setIsCorrect(null);
    setShowFeedback(false);
  };

  // Check if the constructed sentence is correct
  const handleCheckSentence = () => {
    const constructedSentence = selectedWords.join(' ');
    if (constructedSentence === sentence) {
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
    }
    setShowFeedback(true);
  };

  // Handle reordering words by drag-and-drop
  const moveWord = (dragIndex: number, hoverIndex: number) => {
    const updatedWords = [...selectedWords];
    const [draggedWord] = updatedWords.splice(dragIndex, 1);
    updatedWords.splice(hoverIndex, 0, draggedWord);
    setSelectedWords(updatedWords);
  };

  // Handle removing a word from the constructed sentence
  const handleWordRemove = (index: number) => {
    const updatedWords = [...selectedWords];
    updatedWords.splice(index, 1); // Remove the word at the clicked index
    setSelectedWords(updatedWords);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div
        className="p-4 bg-white border rounded-md shadow-md mt-4 w-[400px]"
        style={{
          position: 'absolute',
          top: `${highlightedElement.getBoundingClientRect().top + window.scrollY}px`,
          left: `${highlightedElement.getBoundingClientRect().left + window.scrollX + highlightedElement.offsetWidth + 10}px`,
          fontSize: '14px',
          lineHeight: '1.5',
          fontFamily: 'Arial, sans-serif',
          textAlign: 'left',
          color: '#333',
        }}>
        {/* Header */}
        <div className="flex justify-between items-center mb-2">
          <div>
            <strong>Sentence Construction</strong>
          </div>
          <div className="flex space-x-2">
            <button className="px-2 py-1 bg-gray-100 border rounded text-md" onClick={hideBox}>
              Hide box
            </button>
          </div>
        </div>

        {/* Instruction */}
        <div className="mb-3">
          <p className="font-bold text-gray-600">Arrange the words to form a correct sentence:</p>
          <p className="text-gray-800">{sentence}</p>
        </div>

        {/* Word Pool */}
        <div className="mb-3">
          <p className="font-bold text-gray-600">Shuffled Words:</p>
          <div className="flex flex-wrap">
            {shuffledWords.map((word, index) => (
              <button
                key={index}
                className="px-2 py-1 bg-gray-100 border rounded text-md m-1 hover:bg-blue-100"
                onClick={() => handleWordClick(word)}>
                {word}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Words with Drag-and-Drop and Remove Button */}
        <div className="mb-3">
          <p className="font-bold text-gray-600">Your Sentence (Drag to Reorder):</p>
          <div className="flex flex-wrap border p-2 bg-gray-50 rounded">
            {selectedWords.map((word, index) => (
              <DraggableWord
                key={index}
                index={index}
                word={word}
                moveWord={moveWord}
                handleWordRemove={handleWordRemove} // Pass the remove handler
              />
            ))}
          </div>
        </div>

        {/* Check and Reset Buttons */}
        <div className="flex justify-between mb-3">
          <button
            className="px-3 py-2 bg-blue-100 border rounded-md text-md"
            onClick={handleCheckSentence}
            disabled={selectedWords.length === 0}>
            Check Sentence
          </button>
          <button className="px-3 py-2 bg-gray-100 border rounded-md text-md" onClick={handleReset}>
            Reset
          </button>
        </div>

        {/* Feedback */}
        {showFeedback && (
          <div className="mb-3">
            {isCorrect ? (
              <p className="text-green-600">✅ Correct! The sentence is "{sentence}".</p>
            ) : (
              <p className="text-red-600">❌ Incorrect! Try again.</p>
            )}
          </div>
        )}
        <div className="mb-3">
          <button
            className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            onClick={change} // Calls the change function
          >
            Next
          </button>
        </div>
      </div>
    </DndProvider>
  );
};

// DraggableWord Component with Remove Feature
const DraggableWord = ({ word, index, moveWord, handleWordRemove }: any) => {
  const [, ref] = useDrag({
    type: 'word',
    item: { index },
  });

  const [, drop] = useDrop({
    accept: 'word',
    hover: (item: any) => {
      if (item.index !== index) {
        moveWord(item.index, index);
        item.index = index; // Update index after moving
      }
    },
  });

  return (
    <div ref={node => ref(drop(node))} className="relative flex items-center ml-2 mb-1">
      <span className="px-2 py-1 bg-blue-100 border rounded text-md cursor-pointer">{word}</span>
      <button
        onClick={() => handleWordRemove(index)} // Remove word when the "✖" is clicked
        className="px-2 py-1 bg-blue-100 text-black rounded-tr rounded-br ">
        ×
      </button>
    </div>
  );
};

export default SentenceConstructor;
