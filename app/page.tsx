'use client';

import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import ConfigPanel from '@/components/ConfigPanel';
import PhoneSimulator from '@/components/PhoneSimulator';
import RequestResponseLogger from '@/components/RequestResponseLogger';
import { sessionStore } from '@/lib/sessionStore';
import { UssdApiClient } from '@/lib/ussdApi';
import {
  NetworkOperator,
  SessionState,
  RootUSSDRequest,
  RootResponse,
  LogEntry,
  ConversationEntry,
} from '@/lib/types';

export default function Home() {
  // Configuration state
  const [hostUrl, setHostUrl] = useState('http://localhost:8080/api/v1/loans/ussd');
  const [network, setNetwork] = useState<NetworkOperator>('MTN');
  const [phoneNumber, setPhoneNumber] = useState('0546628393');

  // Session state
  const [sessions, setSessions] = useState<SessionState[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [currentResponse, setCurrentResponse] = useState<RootResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Logger state
  const [logs, setLogs] = useState<LogEntry[]>([]);

  // API client
  const [apiClient] = useState(() => new UssdApiClient(hostUrl));

  // Update API client when host URL changes
  useEffect(() => {
    apiClient.setBaseUrl(hostUrl);
  }, [hostUrl, apiClient]);

  // Load sessions on mount
  useEffect(() => {
    const loadedSessions = sessionStore.getAllSessions();
    setSessions(loadedSessions);
  }, []);

  // Get current session
  const currentSession = currentSessionId
    ? sessionStore.getSession(currentSessionId)
    : null;

  // Create new session
  const handleNewSession = () => {
    if (!phoneNumber || !network) {
      alert('Please enter phone number and select network');
      return;
    }

    const newSession = sessionStore.createSession(phoneNumber, network);
    setSessions(sessionStore.getAllSessions());
    setCurrentSessionId(newSession.id);
    setCurrentResponse(null);
  };

  // Switch session
  const handleSessionChange = (sessionId: string) => {
    setCurrentSessionId(sessionId);
    const session = sessionStore.getSession(sessionId);
    if (session) {
      setPhoneNumber(session.phoneNumber);
      setNetwork(session.network as NetworkOperator);
      
      // Load last response if available
      const lastEntry =
        session.conversationHistory[session.conversationHistory.length - 1];
      if (lastEntry && lastEntry.response) {
        setCurrentResponse(lastEntry.response);
      } else {
        setCurrentResponse(null);
      }
    }
  };

  // Delete session
  const handleDeleteSession = (sessionId: string) => {
    sessionStore.deleteSession(sessionId);
    setSessions(sessionStore.getAllSessions());
    if (currentSessionId === sessionId) {
      setCurrentSessionId(null);
      setCurrentResponse(null);
    }
  };

  // Send USSD request
  const handleSend = async (userInput: string) => {
    let session = currentSession;

    // If no session exists or input is a USSD code (starts with *), create new session
    if (!session || userInput.startsWith('*')) {
      if (!phoneNumber || !network) {
        alert('Please enter phone number and select network');
        return;
      }
      session = sessionStore.createSession(phoneNumber, network);
      setCurrentSessionId(session.id);
      setSessions(sessionStore.getAllSessions());
    }

    setIsLoading(true);

    // Build request
    const request: RootUSSDRequest = {
      USSDReq: {
        msisdn: session.phoneNumber,
        msg: userInput,
        network: session.network,
        UserSessionId: session.sessionId,
      },
    };

    // Send request
    const { response, error, duration } = await apiClient.sendUssdRequest(request);

    // Create log entry
    const logEntry: LogEntry = {
      id: uuidv4(),
      timestamp: new Date(),
      sessionId: session.id,
      request,
      response,
      success: response !== null,
      error: error || undefined,
      duration,
    };

    setLogs((prev) => [logEntry, ...prev]);

    // Create conversation entry
    const conversationEntry: ConversationEntry = {
      timestamp: new Date(),
      request,
      response,
      userInput,
      error: error || undefined,
    };

    sessionStore.addConversationEntry(session.id, conversationEntry);

    if (response) {
      setCurrentResponse(response);
      
      // Update current screen based on response
      if (response.USSDResp.title) {
        sessionStore.updateSession(session.id, {
          currentScreen: response.USSDResp.title,
        });
      }
    } else {
      // Show error
      alert(`Error: ${error}`);
    }

    setIsLoading(false);
    setSessions(sessionStore.getAllSessions());
  };

  // Reset session
  const handleReset = () => {
    if (currentSessionId) {
      sessionStore.resetSession(currentSessionId);
      setCurrentResponse(null);
      setSessions(sessionStore.getAllSessions());
    } else {
      // Just clear the screen
      setCurrentResponse(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-500">
      {/* Header */}
      <header className="bg-purple-700/50 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <h1 className="text-3xl font-bold text-white italic">Speso</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-10 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12 items-start">
          {/* Left Side - Config Panel */}
          <div className="space-y-8">
            <div className="text-white space-y-4">
              <h2 className="text-xl font-medium leading-relaxed">
                Intended for use by developers to test their endpoint
                implementations before integration.
              </h2>
            </div>

            <div className="space-y-6">
              <ConfigPanel
                hostUrl={hostUrl}
                setHostUrl={setHostUrl}
                network={network}
                setNetwork={setNetwork}
                phoneNumber={phoneNumber}
                setPhoneNumber={setPhoneNumber}
                sessions={sessions}
                currentSessionId={currentSessionId}
                onSessionChange={handleSessionChange}
                onNewSession={handleNewSession}
              />
            </div>
          </div>

          {/* Right Side - Phone Simulator (Picture in Picture) */}
          <div className="flex justify-center lg:justify-end sticky top-8">
            <PhoneSimulator
              currentResponse={currentResponse}
              onSend={handleSend}
              onReset={handleReset}
              isLoading={isLoading}
              sessionActive={currentSessionId !== null}
            />
          </div>
        </div>
      </main>

      {/* Logger - Fixed to bottom */}
      <RequestResponseLogger logs={logs} />

      {/* Footer */}
      <footer className="bg-white/10 backdrop-blur-sm border-t border-white/10 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-4 text-center text-white/80 text-sm">
          © 2025. Speso Technologies Limited
        </div>
      </footer>
    </div>
  );
}
