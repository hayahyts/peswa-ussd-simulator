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
    <div className="space-y-4">
      <div>
        <label className="block text-white text-sm font-medium mb-2">
          Host URL
        </label>
        <input
          type="text"
          value={hostUrl}
          onChange={(e) => setHostUrl(e.target.value)}
          placeholder="eg. https://a924d784.ngrok.io"
          className="w-full rounded-xl bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/60 border-2 border-gray-200 shadow-sm transition-all text-base"
          style={{ padding: '8px 16px' }}
        />
      </div>

      <div>
        <label className="block text-white text-sm font-medium mb-2">
          Method
        </label>
        <select
          disabled
          className="w-full rounded-xl bg-white/80 text-gray-600 cursor-not-allowed appearance-none border-2 border-gray-200/60 shadow-sm text-base"
          style={{ padding: '8px 16px' }}
        >
          <option>Select request method</option>
        </select>
      </div>

      <div>
        <label className="block text-white text-sm font-medium mb-2">
          Network
        </label>
        <select
          value={network}
          onChange={(e) => setNetwork(e.target.value as NetworkOperator)}
          className="w-full rounded-xl bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-200 border-2 border-gray-200 appearance-none cursor-pointer transition-all shadow-sm text-base"
          style={{ padding: '8px 16px' }}
        >
          <option value="">Select network operator</option>
          {networks.map((net) => (
            <option key={net} value={net}>
              {net}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-white text-sm font-medium mb-2">
          Phone Number
        </label>
        <input
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="eg. 0546628393"
          className="w-full rounded-xl bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/60 border-2 border-gray-200 shadow-sm transition-all text-base"
          style={{ padding: '8px 16px' }}
        />
      </div>

      <div>
        <label className="block text-white text-sm font-medium mb-2">
          Aggregator
        </label>
        <select
          disabled
          className="w-full rounded-xl bg-white/80 text-gray-600 cursor-not-allowed appearance-none border-2 border-gray-200/60 shadow-sm text-base"
          style={{ padding: '8px 16px' }}
        >
          <option>Select aggregator</option>
        </select>
      </div>
    </div>
  );
};

export default ConfigPanel;