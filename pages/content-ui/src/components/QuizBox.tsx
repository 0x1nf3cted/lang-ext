import React, { useState, useEffect } from 'react';

const QuizBox = ({ phrase, translatedPhrase, highlightedElement, hideBox, change }: any) => {
  const [timeLeft, setTimeLeft] = useState(30); // 30-second timer
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [quizComplete, setQuizComplete] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState('');

  // Timer countdown effect
  useEffect(() => {
    if (timeLeft > 0 && !quizComplete) {
      const timerId = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearInterval(timerId); // Cleanup
    } else if (timeLeft === 0) {
      alert('Time is up!'); // Time's up alert
      setQuizComplete(true);
    }
  }, [timeLeft, quizComplete]);

  // Example quiz options (you could dynamically generate these)
  const options = [
    { text: 'Correct translation', value: translatedPhrase },
    { text: 'Wrong translation 1', value: 'Wrong Answer 1' },
    { text: 'Wrong translation 2', value: 'Wrong Answer 2' },
    { text: 'Wrong translation 3', value: 'Wrong Answer 3' },
  ];

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
    setQuizComplete(true);
    setCorrectAnswer(translatedPhrase);
  };

  const handleRetry = () => {
    setQuizComplete(false);
    setSelectedAnswer(null);
    setTimeLeft(30); // Reset timer
  };

  return (
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
      {/* Header with Timer */}
      <div className="flex justify-between items-center mb-2">
        <div>
          <strong>Quiz</strong> (English → French)
        </div>
        <div className={timeLeft <= 10 ? 'text-red-600' : 'text-green-600'}>
          <strong>{timeLeft}s</strong> left
        </div>
      </div>

      {/* Question */}
      <div className="mb-3">
        <p className="font-bold text-gray-600">What is the correct translation of the following phrase?</p>
        <p className="text-gray-800">{phrase}</p>
      </div>

      {/* Quiz Options */}
      {!quizComplete ? (
        <div className="mb-3">
          {options.map((option, index) => (
            <button
              key={index}
              className={`w-full px-3 py-2 my-1 border rounded-md text-md ${
                selectedAnswer === option.value ? 'bg-blue-200 border-blue-400' : 'bg-gray-100 hover:bg-blue-100'
              }`}
              onClick={() => handleAnswerSelect(option.value)}
              disabled={quizComplete}>
              {option.text}
            </button>
          ))}
        </div>
      ) : (
        <div className="mb-3">
          {selectedAnswer === translatedPhrase ? (
            <p className="text-green-600">✅ Correct! The translation is "{correctAnswer}".</p>
          ) : (
            <p className="text-red-600">❌ Incorrect! The correct translation was "{correctAnswer}".</p>
          )}
        </div>
      )}

      {/* Retry & Close Buttons */}
      {quizComplete && (
        <div className="flex justify-between mt-3">
          <button className="px-3 py-2 bg-blue-100 border rounded-md text-md" onClick={handleRetry}>
            Retry
          </button>
          <button className="px-3 py-2 bg-gray-100 border rounded-md text-md" onClick={hideBox}>
            Close
          </button>
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
  );
};

export default QuizBox;
