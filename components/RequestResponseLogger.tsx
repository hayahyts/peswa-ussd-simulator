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
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div 
      className={`fixed bottom-0 left-0 right-0 bg-white shadow-2xl transition-transform duration-300 ease-in-out z-50 ${
        isExpanded ? 'translate-y-0' : 'translate-y-full'
      }`}
      style={{ maxHeight: isExpanded ? '70vh' : 'auto' }}
    >
      {/* Header - Always visible */}
      <div
        className={`flex items-center justify-between px-6 py-5 cursor-pointer hover:bg-gray-50 border-t-4 border-purple-500 shadow-lg ${
          !isExpanded ? 'absolute bottom-full left-0 right-0 bg-white rounded-t-xl' : ''
        }`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-gray-800">
            Request/Response Logger
          </h3>
          <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full font-medium">
            {logs.length} {logs.length === 1 ? 'entry' : 'entries'}
          </span>
        </div>
        <svg
          className={`w-6 h-6 text-gray-600 transition-transform ${
            isExpanded ? 'rotate-0' : 'rotate-180'
          }`}
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
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="border-t border-gray-200 overflow-hidden" style={{ height: 'calc(70vh - 80px)' }}>
          {logs.length === 0 ? (
            <div className="p-10 text-center text-gray-500">
              <svg
                className="w-16 h-16 mx-auto mb-4 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="text-lg font-medium">No logs yet</p>
              <p className="text-sm mt-2">
                Send a USSD request to see logs here
              </p>
            </div>
          ) : (
            <div className="flex h-full">
              {/* Log List */}
              <div className="w-1/3 border-r border-gray-200 overflow-y-auto">
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedLog?.id === log.id ? 'bg-purple-50 border-l-4 border-l-purple-500' : ''
                    }`}
                    onClick={() => setSelectedLog(log)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-500 font-medium">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium ${
                          log.success
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {log.success ? 'Success' : 'Error'}
                      </span>
                    </div>
                    <div className="text-sm text-gray-800 truncate font-medium">
                      {log.request.USSDReq.msisdn}
                    </div>
                    {log.duration && (
                      <div className="text-xs text-gray-500 mt-1">
                        {log.duration}ms
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Log Details */}
              <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                {selectedLog ? (
                  <div className="space-y-5">
                    {/* Request */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-gray-800 text-base">Request</h4>
                        <button
                          onClick={() =>
                            copyToClipboard(
                              JSON.stringify(selectedLog.request, null, 2)
                            )
                          }
                          className="text-sm px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 flex items-center gap-2 transition-colors"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                            />
                          </svg>
                          Copy
                        </button>
                      </div>
                      <pre className="bg-gray-800 text-green-400 p-4 rounded-lg text-xs overflow-x-auto font-mono">
                        {JSON.stringify(selectedLog.request, null, 2)}
                      </pre>
                    </div>

                    {/* Response */}
                    {selectedLog.response ? (
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold text-gray-800 text-base">
                            Response
                          </h4>
                          <button
                            onClick={() =>
                              copyToClipboard(
                                JSON.stringify(selectedLog.response, null, 2)
                              )
                            }
                            className="text-sm px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 flex items-center gap-2 transition-colors"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                              />
                            </svg>
                            Copy
                          </button>
                        </div>
                        <pre className="bg-gray-800 text-blue-400 p-4 rounded-lg text-xs overflow-x-auto font-mono">
                          {JSON.stringify(selectedLog.response, null, 2)}
                        </pre>
                      </div>
                    ) : selectedLog.error ? (
                      <div>
                        <h4 className="font-semibold text-red-600 mb-3 text-base">
                          Error
                        </h4>
                        <pre className="bg-red-50 text-red-800 p-4 rounded-lg text-sm overflow-x-auto border border-red-200">
                          {selectedLog.error}
                        </pre>
                      </div>
                    ) : null}

                    {/* Metadata */}
                    <div className="text-sm text-gray-600 space-y-2 pt-3 border-t border-gray-200">
                      <div>
                        <span className="font-medium">Timestamp:</span>{' '}
                        {new Date(selectedLog.timestamp).toLocaleString()}
                      </div>
                      <div>
                        <span className="font-medium">Session ID:</span>{' '}
                        {selectedLog.sessionId}
                      </div>
                      {selectedLog.duration && (
                        <div>
                          <span className="font-medium">Duration:</span>{' '}
                          {selectedLog.duration}ms
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <svg
                        className="w-12 h-12 mx-auto mb-3 text-gray-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
                        />
                      </svg>
                      <p>Select a log entry to view details</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RequestResponseLogger;

