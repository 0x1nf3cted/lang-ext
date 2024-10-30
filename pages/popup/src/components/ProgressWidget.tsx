import React from 'react';

const ProgressWidget = ({ progress, totalWords, streak, totalPoints, practiceDays }: any) => {
  // Calculate progress percentage
  const progressPercentage = Math.round((progress / totalWords) * 100);

  return (
    <div
      className="p-4 bg-gray-100 border border-gray-300 rounded-md shadow-md mt-4 "
      style={{
        fontSize: '14px',
        lineHeight: '1.5',
        fontFamily: 'Arial, sans-serif',
        textAlign: 'left',
        color: '#333',
      }}>
      {/* Stats Section */}
      <div className="mb-3">
        <p className="text-gray-800">
          <strong>Daily Progress:</strong> {progressPercentage}%
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-2">
        <div className="relative w-full bg-gray-300 rounded-full h-3 mb-1">
          <div
            className={`h-full rounded-full ${progress > 0 ? 'bg-green-500' : 'bg-gray-400'}`}
            style={{ width: `${progress > 0 ? progressPercentage : 0}%` }}
          />
        </div>
      </div>

      {/* Streak Visualization */}
      <div className="mb-3 w-full">
        <p className="font-bold text-gray-600">Last 7 Days:</p>
        <div className="flex w-full justify-between ">
          {practiceDays.map((day: { date: string; practiced: boolean }, index: number) => (
            <div
              key={index}
              className={`px-2 h-8 flex items-center justify-center rounded-md border ${
                day.practiced ? 'bg-green-500' : 'bg-gray-200'
              }`}>
              <span className="text-white text-sm">{day.date}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Motivational Message */}
      <div>
        <p className="text-gray-800">{progress >= totalWords ? '🚀 Goal Reached! 🎉' : '💪 Keep Learning! ✨'}</p>
      </div>
    </div>
  );
};

export default ProgressWidget;
