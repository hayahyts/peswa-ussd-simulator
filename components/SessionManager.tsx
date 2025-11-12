'use client';

import React from 'react';
import { SessionState } from '@/lib/types';

interface SessionManagerProps {
  sessions: SessionState[];
  currentSessionId: string | null;
  onSelectSession: (sessionId: string) => void;
  onDeleteSession: (sessionId: string) => void;
}

const SessionManager: React.FC<SessionManagerProps> = ({
  sessions,
  currentSessionId,
  onSelectSession,
  onDeleteSession,
}) => {
  if (sessions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No active sessions</p>
        <p className="text-sm mt-2">Create a new session to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {sessions.map((session) => (
        <div
          key={session.id}
          className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
            session.id === currentSessionId
              ? 'border-purple-500 bg-purple-50'
              : 'border-gray-200 bg-white hover:border-purple-300'
          }`}
          onClick={() => onSelectSession(session.id)}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-800">
                  {session.phoneNumber}
                </span>
                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                  {session.network}
                </span>
              </div>
              <div className="mt-1 text-sm text-gray-600">
                <span>{session.conversationHistory.length} messages</span>
                <span className="mx-2">•</span>
                <span className="text-xs">
                  {new Date(session.lastActivity).toLocaleTimeString()}
                </span>
              </div>
              {session.currentScreen && (
                <div className="mt-1 text-xs text-gray-500">
                  Current: {session.currentScreen}
                </div>
              )}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteSession(session.id);
              }}
              className="text-red-500 hover:text-red-700 p-1"
              title="Delete session"
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
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SessionManager;


