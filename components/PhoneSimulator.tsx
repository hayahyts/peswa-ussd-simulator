'use client';

import React, { useState, useEffect } from 'react';
import UssdScreen from './UssdScreen';
import { RootResponse } from '@/lib/types';

interface PhoneSimulatorProps {
  currentResponse: RootResponse | null;
  onSend: (input: string) => void;
  onReset: () => void;
  isLoading: boolean;
  sessionActive: boolean;
}

const PhoneSimulator: React.FC<PhoneSimulatorProps> = ({
  currentResponse,
  onSend,
  onReset,
  isLoading,
  sessionActive,
}) => {
  const [userInput, setUserInput] = useState('');

  useEffect(() => {
    // Clear input after sending
    if (!isLoading) {
      setUserInput('');
    }
  }, [isLoading]);

  const handleSend = () => {
    if (userInput.trim() || !sessionActive) {
      onSend(userInput.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="relative w-full max-w-sm mx-auto">
      {/* Phone Frame with shadow and border */}
      <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl border-8 border-gray-100">
        {/* USSD Screen Area */}
        <div className="bg-gray-50 rounded-2xl min-h-[500px] p-8 flex flex-col">
          <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">
            Enter USSD Code
          </h2>

          {/* USSD Display */}
          <div className="flex-1 bg-white rounded-xl p-5 mb-5 overflow-y-auto shadow-sm border border-gray-100">
            <UssdScreen response={currentResponse} isLoading={isLoading} />
          </div>

          {/* Input Field */}
          <div className="mb-4">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={sessionActive ? "Enter your response" : "eg.*721#"}
              disabled={isLoading}
              className="w-full px-6 py-5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 text-gray-800 disabled:bg-gray-100 disabled:cursor-not-allowed transition-all shadow-sm text-base"
            />
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleSend}
              disabled={isLoading}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white font-semibold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:cursor-not-allowed shadow-sm text-base"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                  <span>Send</span>
                </>
              )}
            </button>

            <button
              onClick={onReset}
              disabled={isLoading}
              className="w-full bg-white hover:bg-gray-50 disabled:bg-gray-100 text-gray-800 font-semibold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:cursor-not-allowed border-2 border-gray-200 text-base"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhoneSimulator;

