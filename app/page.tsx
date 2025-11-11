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
    <div className="flex flex-col min-h-screen h-screen overflow-hidden">
      {/* Row 1: Header - 5vh */}
      <header 
        style={{
          height: '5vh',
          minHeight: '50px',
          background: 'linear-gradient(135deg, #543d9a 0%, #6b4fb8 100%)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 3rem',
          position: 'relative',
          zIndex: 10
        }}
      >
        <div style={{
          fontSize: '1.75rem',
          fontWeight: 700,
          color: '#FFFFFF',
          fontStyle: 'italic',
          letterSpacing: '-0.5px'
        }}>
          Peswa
        </div>
      </header>

      {/* Row 2: Main Content - 72.5vh */}
      <main 
        style={{
          height: '72.5vh',
          minHeight: '500px',
          background: 'linear-gradient(135deg, #543d9a 0%, #6b4fb8 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '3rem',
          padding: '0 3rem 1.5rem 3rem',
          position: 'relative',
          overflow: 'visible'
        }}
      >
        {/* Config Panel */}
        <div 
          style={{
            flex: '0 0 45%',
            maxWidth: '550px',
            background: '#FFFFFF',
            borderRadius: '1rem',
            padding: '2.5rem',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
            height: 'fit-content',
            animation: 'slideInLeft 0.6s ease-out'
          }}
        >
          <p 
            style={{
              fontSize: '0.9rem',
              lineHeight: 1.6,
              color: '#6B7280',
              marginBottom: '1.25rem',
              paddingBottom: '1.25rem',
              borderBottom: '1px solid #E5E7EB'
            }}
          >
            Intended for use by developers to test their endpoint implementations before integration.
          </p>
          
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

        {/* Phone Simulator */}
        <div 
          className="flex justify-center relative"
          style={{
            flex: '0 0 35%',
            maxWidth: '380px',
            zIndex: 1
          }}
        >
          <PhoneSimulator
            currentResponse={currentResponse}
            onSend={handleSend}
            onReset={handleReset}
            isLoading={isLoading}
            sessionActive={currentSessionId !== null}
            network={network}
          />
        </div>
      </main>

      {/* Row 3: Footer - 7.5vh */}
      <footer 
        style={{
          height: '7.5vh',
          minHeight: '60px',
          background: '#F9FAFB',
          borderTop: '1px solid #E5E7EB',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 3rem',
          position: 'relative',
          zIndex: 0
        }}
      >
        <span style={{ fontSize: '0.875rem', color: '#6B7280' }}>© 2025. Peswa Finance</span>
        <span style={{ fontSize: '0.875rem', color: '#9CA3AF', fontWeight: 500 }}>v1.0</span>
      </footer>

      {/* Row 4: Logger - Fixed Bottom */}
      <RequestResponseLogger logs={logs} />
    </div>
  );
}
