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
    <div 
      style={{
        width: '320px',
        height: '650px',
        background: '#1F2937',
        borderRadius: '40px',
        padding: '15px',
        boxShadow: '0 20px 40px -10px rgba(84, 61, 154, 0.2), 0 10px 20px -5px rgba(0, 0, 0, 0.1), 0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        position: 'relative',
        transform: 'translateY(50px)',
        animation: 'slideInRight 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s both, float 3s ease-in-out 1.5s infinite'
      }}
    >
      {/* Phone Notch */}
      <div 
        style={{
          position: 'absolute',
          top: '15px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '140px',
          height: '28px',
          background: '#1F2937',
          borderRadius: '0 0 20px 20px',
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px'
        }}
      >
        <div style={{
          width: '10px',
          height: '10px',
          background: '#0F172A',
          borderRadius: '50%'
        }}></div>
        <div style={{
          width: '50px',
          height: '5px',
          background: '#0F172A',
          borderRadius: '10px'
        }}></div>
      </div>

      {/* Phone Screen */}
      <div 
        style={{
          width: '100%',
          height: '100%',
          background: 'linear-gradient(180deg, #F9FAFB 0%, #F3F4F6 100%)',
          borderRadius: '28px',
          padding: '50px 25px 25px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* USSD Interface */}
        <div style={{ width: '100%', textAlign: 'center' }}>
          <h2 style={{
            fontSize: '1.15rem',
            fontWeight: 600,
            color: '#1F2937',
            marginBottom: '2rem'
          }}>
            Enter USSD Code
          </h2>

          {/* USSD Input Wrapper */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '0.75rem',
            padding: '1.5rem',
            marginBottom: '1.5rem',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)'
          }}>
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="eg.*721#"
              disabled={isLoading}
              maxLength={20}
              style={{
                padding: '1rem',
                fontSize: '1.5rem',
                fontWeight: 600,
                letterSpacing: '2px',
                borderRadius: '0.5rem',
                background: '#F9FAFB',
                transition: 'all 0.2s ease'
              }}
              className="w-full text-center text-gray-800 border-2 border-gray-200 focus:outline-none focus:border-purple-600 disabled:bg-gray-100 disabled:cursor-not-allowed placeholder:text-gray-400 placeholder:font-medium"
              onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(84, 61, 154, 0.1)'}
              onBlur={(e) => e.target.style.boxShadow = 'none'}
            />
          </div>

          {/* USSD Actions */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}>
            <button
              onClick={handleSend}
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '1rem 1.5rem',
                fontSize: '1rem',
                fontWeight: 600,
                borderRadius: '0.5rem',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s ease',
                fontFamily: 'var(--font-family)',
                background: '#543d9a',
                color: '#FFFFFF',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)'
              }}
              className={isLoading ? 'opacity-50 cursor-not-allowed' : ''}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.background = '#3d2c70';
                  e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#543d9a';
                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
              onMouseDown={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <svg
                style={{ width: '18px', height: '18px' }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 12h14m-7-7l7 7-7 7"
                />
              </svg>
              <span>Send</span>
            </button>

            <button
              onClick={onReset}
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '1rem 1.5rem',
                fontSize: '1rem',
                fontWeight: 600,
                borderRadius: '0.5rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s ease',
                fontFamily: 'var(--font-family)',
                background: '#FFFFFF',
                color: '#6B7280',
                border: '2px solid #E5E7EB'
              }}
              className={isLoading ? 'opacity-50 cursor-not-allowed' : ''}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.background = '#F9FAFB';
                  e.currentTarget.style.borderColor = '#D1D5DB';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#FFFFFF';
                e.currentTarget.style.borderColor = '#E5E7EB';
              }}
            >
              <svg
                style={{ width: '18px', height: '18px' }}
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

