'use client';

import React from 'react';
import { RootResponse } from '@/lib/types';

interface UssdScreenProps {
  response: RootResponse | null;
  isLoading: boolean;
}

const UssdScreen: React.FC<UssdScreenProps> = ({ response, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!response) {
    return (
      <div className="flex items-center justify-center h-full text-center p-4">
        <div>
          <svg
            className="w-16 h-16 text-gray-300 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
          <p className="text-gray-500 text-sm">
            Dial a USSD code to start
            <br />
            <span className="text-xs text-gray-400">Example: *721#</span>
          </p>
        </div>
      </div>
    );
  }

  const { USSDResp } = response;
  const action = USSDResp.action.toLowerCase();

  return (
    <div className="space-y-5">
      {/* Title */}
      {USSDResp.title && (
        <div className="font-semibold text-gray-800 text-base pb-3">
          {USSDResp.title}
        </div>
      )}

      {/* Content */}
      <div className="text-gray-700 text-sm">
        {action === 'menu' && Array.isArray(USSDResp.menus) ? (
          // Menu Response - Clean list format
          <div className="space-y-3">
            {USSDResp.menus.map((menuItem, index) => (
              <div
                key={index}
                className="py-4 px-5 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
              >
                <span className="text-gray-800 leading-relaxed">{menuItem}</span>
              </div>
            ))}
          </div>
        ) : action === 'prompt' && typeof USSDResp.menus === 'string' ? (
          // Prompt Response
          <div className="py-5 px-5 bg-blue-50 rounded-lg border border-blue-200">
            <p className="whitespace-pre-wrap leading-relaxed">{USSDResp.menus}</p>
          </div>
        ) : action === 'end' && typeof USSDResp.menus === 'string' ? (
          // End Response
          <div className="py-5 px-5 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-start gap-3">
              <svg
                className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="whitespace-pre-wrap flex-1 leading-relaxed">{USSDResp.menus}</p>
            </div>
          </div>
        ) : (
          // Fallback for unknown format
          <div className="py-5 px-5 bg-gray-50 rounded-lg border border-gray-200">
            <p className="whitespace-pre-wrap leading-relaxed">
              {typeof USSDResp.menus === 'string'
                ? USSDResp.menus
                : JSON.stringify(USSDResp.menus, null, 2)}
            </p>
          </div>
        )}
      </div>

      {/* Key/Footer */}
      {USSDResp.key && (
        <div className="text-xs text-gray-500 border-t border-gray-200 pt-3 mt-4">
          {USSDResp.key}
        </div>
      )}

      {/* Action Badge */}
      <div className="flex justify-end pt-2">
        <span
          className={`text-xs px-3 py-1 rounded-full font-medium ${
            action === 'end'
              ? 'bg-green-100 text-green-700'
              : action === 'menu'
              ? 'bg-blue-100 text-blue-700'
              : 'bg-purple-100 text-purple-700'
          }`}
        >
          {action.toUpperCase()}
        </span>
      </div>
    </div>
  );
};

export default UssdScreen;
