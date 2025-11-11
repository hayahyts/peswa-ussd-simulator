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
  network: string;
}

const PhoneSimulator: React.FC<PhoneSimulatorProps> = ({
  currentResponse,
  onSend,
  onReset,
  isLoading,
  sessionActive,
  network,
}) => {
  const [userInput, setUserInput] = useState('');
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    // Update time display
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

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
    <div className="phone-frame">
      {/* Notch */}
      <div className="phone-notch">
        <div className="notch-camera"></div>
        <div className="notch-speaker"></div>
      </div>

      {/* Phone Screen */}
      <div className="phone-screen">
        {/* Status Bar */}
        <div className="status-bar">
          <div className="network-info">
            <div className="signal-icon">
              <div className="signal-bar"></div>
              <div className="signal-bar"></div>
              <div className="signal-bar"></div>
              <div className="signal-bar"></div>
            </div>
            <span>{network}</span>
          </div>
          <div className="time-display">{currentTime}</div>
        </div>

        {/* USSD Response Container */}
        <div className="ussd-response-container">
          <UssdScreen response={currentResponse} isLoading={isLoading} />
        </div>

        {/* Input Area */}
        <div className="input-area">
          <div className="input-wrapper">
            <input
              type="text"
              className="ussd-input"
              placeholder="eg. *721#"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              maxLength={20}
            />
          </div>
          <div className="button-area">
            <button
              className="btn btn-reset"
              onClick={onReset}
              disabled={isLoading}
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Reset</span>
            </button>
            <button
              className="btn btn-send"
              onClick={handleSend}
              disabled={isLoading}
            >
              <span>Send</span>
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14m-7-7l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhoneSimulator;
