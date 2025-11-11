'use client';
import React, { useState } from 'react';
import { NetworkOperator, SessionState } from '@/lib/types';

interface ConfigPanelProps {
  hostUrl: string;
  setHostUrl: (url: string) => void;
  network: NetworkOperator;
  setNetwork: (network: NetworkOperator) => void;
  phoneNumber: string;
  setPhoneNumber: (phone: string) => void;
  sessions: SessionState[];
  currentSessionId: string | null;
  onSessionChange: (sessionId: string) => void;
  onNewSession: () => void;
}

const ConfigPanel: React.FC<ConfigPanelProps> = ({
  hostUrl,
  setHostUrl,
  network,
  setNetwork,
  phoneNumber,
  setPhoneNumber,
  sessions,
  currentSessionId,
  onSessionChange,
  onNewSession,
}) => {
  const networks: NetworkOperator[] = ['MTN', 'Vodafone', 'AirtelTigo'];

  return (
    <form>
      {/* Host URL */}
      <div 
        className="flex items-center"
        style={{
          marginBottom: '1.5rem',
          gap: '1.5rem'
        }}
      >
        <label 
          htmlFor="hostUrl" 
          className="font-semibold text-gray-800"
          style={{
            display: 'block',
            fontSize: '0.875rem',
            minWidth: '120px',
            flexShrink: 0,
            marginBottom: 0
          }}
        >
          Host URL
        </label>
        <input
          id="hostUrl"
          type="url"
          value={hostUrl}
          onChange={(e) => setHostUrl(e.target.value)}
          placeholder="eg. https://a924d784.ngrok.io"
          style={{
            flex: 1,
            padding: '0.75rem 1rem',
            fontSize: '0.95rem',
            border: '1.5px solid #E5E7EB',
            borderRadius: '0.5rem',
            background: '#FFFFFF',
            transition: 'all 0.2s ease'
          }}
          className="text-gray-800 placeholder-gray-400 focus:outline-none"
          onFocus={(e) => {
            e.target.style.borderColor = '#543D9A';
            e.target.style.boxShadow = '0 0 0 3px rgba(84, 61, 154, 0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#E5E7EB';
            e.target.style.boxShadow = 'none';
          }}
        />
      </div>

      {/* Method */}
      <div 
        className="flex items-center"
        style={{
          marginBottom: '1.5rem',
          gap: '1.5rem'
        }}
      >
        <label 
          htmlFor="method" 
          className="font-semibold text-gray-800"
          style={{
            display: 'block',
            fontSize: '0.875rem',
            minWidth: '120px',
            flexShrink: 0,
            marginBottom: 0
          }}
        >
          Method
        </label>
        <select
          id="method"
          disabled
          style={{
            flex: 1,
            padding: '0.75rem 1rem',
            fontSize: '0.95rem',
            border: '1.5px solid #E5E7EB',
            borderRadius: '0.5rem',
            background: '#FFFFFF',
            transition: 'all 0.2s ease',
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16' fill='none'%3E%3Cpath d='M4 6L8 10L12 6' stroke='%236B7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 1rem center',
            paddingRight: '2.5rem',
            opacity: 0.8
          }}
          className="text-gray-600 cursor-not-allowed appearance-none"
        >
          <option>Select request method</option>
        </select>
      </div>

      {/* Network */}
      <div 
        className="flex items-center"
        style={{
          marginBottom: '1.5rem',
          gap: '1.5rem'
        }}
      >
        <label 
          htmlFor="network" 
          className="font-semibold text-gray-800"
          style={{
            display: 'block',
            fontSize: '0.875rem',
            minWidth: '120px',
            flexShrink: 0,
            marginBottom: 0
          }}
        >
          Network
        </label>
        <select
          id="network"
          value={network}
          onChange={(e) => setNetwork(e.target.value as NetworkOperator)}
          style={{
            flex: 1,
            padding: '0.75rem 1rem',
            fontSize: '0.95rem',
            border: '1.5px solid #E5E7EB',
            borderRadius: '0.5rem',
            background: '#FFFFFF',
            transition: 'all 0.2s ease',
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16' fill='none'%3E%3Cpath d='M4 6L8 10L12 6' stroke='%236B7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 1rem center',
            paddingRight: '2.5rem'
          }}
          className="text-gray-800 cursor-pointer appearance-none focus:outline-none"
          onFocus={(e) => {
            e.target.style.borderColor = '#543D9A';
            e.target.style.boxShadow = '0 0 0 3px rgba(84, 61, 154, 0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#E5E7EB';
            e.target.style.boxShadow = 'none';
          }}
        >
          <option value="">Select network operator</option>
          {networks.map((net) => (
            <option key={net} value={net}>
              {net}
            </option>
          ))}
        </select>
      </div>

      {/* Phone Number */}
      <div 
        className="flex items-center"
        style={{
          marginBottom: '1.5rem',
          gap: '1.5rem'
        }}
      >
        <label 
          htmlFor="phoneNumber" 
          className="font-semibold text-gray-800"
          style={{
            display: 'block',
            fontSize: '0.875rem',
            minWidth: '120px',
            flexShrink: 0,
            marginBottom: 0
          }}
        >
          Phone Number
        </label>
        <input
          id="phoneNumber"
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="eg. 0546662893"
          style={{
            flex: 1,
            padding: '0.75rem 1rem',
            fontSize: '0.95rem',
            border: '1.5px solid #E5E7EB',
            borderRadius: '0.5rem',
            background: '#FFFFFF',
            transition: 'all 0.2s ease'
          }}
          className="text-gray-800 placeholder-gray-400 focus:outline-none"
          onFocus={(e) => {
            e.target.style.borderColor = '#543D9A';
            e.target.style.boxShadow = '0 0 0 3px rgba(84, 61, 154, 0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#E5E7EB';
            e.target.style.boxShadow = 'none';
          }}
        />
      </div>

      {/* Aggregator */}
      <div 
        className="flex items-center"
        style={{
          marginBottom: '1.5rem',
          gap: '1.5rem'
        }}
      >
        <label 
          htmlFor="aggregator" 
          className="font-semibold text-gray-800"
          style={{
            display: 'block',
            fontSize: '0.875rem',
            minWidth: '120px',
            flexShrink: 0,
            marginBottom: 0
          }}
        >
          Aggregator
        </label>
        <select
          id="aggregator"
          disabled
          style={{
            flex: 1,
            padding: '0.75rem 1rem',
            fontSize: '0.95rem',
            border: '1.5px solid #E5E7EB',
            borderRadius: '0.5rem',
            background: '#FFFFFF',
            transition: 'all 0.2s ease',
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16' fill='none'%3E%3Cpath d='M4 6L8 10L12 6' stroke='%236B7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 1rem center',
            paddingRight: '2.5rem',
            opacity: 0.8
          }}
          className="text-gray-600 cursor-not-allowed appearance-none"
        >
          <option>Select aggregator</option>
        </select>
      </div>
    </form>
  );
};

export default ConfigPanel;