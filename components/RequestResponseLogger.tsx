'use client';

import React, { useState } from 'react';
import { LogEntry } from '@/lib/types';

interface RequestResponseLoggerProps {
  logs: LogEntry[];
}

const RequestResponseLogger: React.FC<RequestResponseLoggerProps> = ({
  logs,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div 
      style={{ 
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: '#FFFFFF',
        borderTop: '2px solid #E5E7EB',
        zIndex: 30,
        transition: 'all 0.3s ease-in-out',
        boxShadow: '0 -4px 6px -1px rgba(0, 0, 0, 0.1)'
      }}
    >
      {/* Logger Header */}
      <div
        style={{
          padding: '1rem 3rem',
          background: '#F9FAFB',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          fontWeight: 600,
          color: '#1F2937',
          transition: 'background 0.2s ease',
          userSelect: 'none'
        }}
        onClick={() => setIsExpanded(!isExpanded)}
        onMouseEnter={(e) => e.currentTarget.style.background = '#F3F4F6'}
        onMouseLeave={(e) => e.currentTarget.style.background = '#F9FAFB'}
      >
        <svg
          style={{
            width: '20px',
            height: '20px',
            transition: 'transform 0.2s ease',
            transform: isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)'
          }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
        <span>REQUEST/RESPONSE LOGGER</span>
      </div>

      {/* Logger Content */}
      {isExpanded && (
        <div 
          style={{ 
            maxHeight: '300px',
            overflowY: 'auto',
            padding: '1.5rem 3rem',
            display: 'block',
            animation: 'expandLogger 0.3s ease-out'
          }}
        >
          {logs.length === 0 ? (
            <div 
              className="text-center text-gray-500"
              style={{ padding: '3rem' }}
            >
              <p>No requests logged yet. Send a USSD code to see request/response data here.</p>
            </div>
          ) : (
            <table 
              className="w-full"
              style={{ 
                borderCollapse: 'collapse',
                fontSize: '0.875rem'
              }}
            >
              <thead>
                <tr>
                  <th 
                    className="text-left font-semibold text-gray-600"
                    style={{
                      background: '#F9FAFB',
                      padding: '0.75rem 1rem',
                      borderBottom: '2px solid #D1D5DB'
                    }}
                  >
                    Timestamp
                  </th>
                  <th 
                    className="text-left font-semibold text-gray-600"
                    style={{
                      background: '#F9FAFB',
                      padding: '0.75rem 1rem',
                      borderBottom: '2px solid #D1D5DB'
                    }}
                  >
                    Request
                  </th>
                  <th 
                    className="text-left font-semibold text-gray-600"
                    style={{
                      background: '#F9FAFB',
                      padding: '0.75rem 1rem',
                      borderBottom: '2px solid #D1D5DB'
                    }}
                  >
                    Response
                  </th>
                  <th 
                    className="text-left font-semibold text-gray-600"
                    style={{
                      background: '#F9FAFB',
                      padding: '0.75rem 1rem',
                      borderBottom: '2px solid #D1D5DB'
                    }}
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => {
                  const requestPreview = JSON.stringify(log.request).substring(0, 50);
                  const responsePreview = log.response 
                    ? JSON.stringify(log.response).substring(0, 50)
                    : log.error?.substring(0, 50);
                  
                  return (
                    <tr 
                      key={log.id}
                      style={{ animation: 'slideInLeft 0.4s ease-out' }}
                    >
                      <td 
                        className="text-gray-800"
                        style={{
                          padding: '0.75rem 1rem',
                          borderBottom: '1px solid #E5E7EB'
                        }}
                      >
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td 
                        className="text-gray-800"
                        style={{
                          padding: '0.75rem 1rem',
                          borderBottom: '1px solid #E5E7EB'
                        }}
                      >
                        <code style={{ fontSize: '0.8rem' }}>
                          {requestPreview}
                          {requestPreview.length >= 50 ? '...' : ''}
                        </code>
                      </td>
                      <td 
                        className="text-gray-800"
                        style={{
                          padding: '0.75rem 1rem',
                          borderBottom: '1px solid #E5E7EB'
                        }}
                      >
                        <code style={{ fontSize: '0.8rem' }}>
                          {responsePreview}
                          {responsePreview && responsePreview.length >= 50 ? '...' : ''}
                        </code>
                      </td>
                      <td style={{
                        padding: '0.75rem 1rem',
                        borderBottom: '1px solid #E5E7EB'
                      }}>
                        <span 
                          style={{ 
                            color: log.success ? '#10B981' : '#EF4444',
                            fontWeight: 600
                          }}
                        >
                          {log.success ? 'Success' : 'Error'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default RequestResponseLogger;

