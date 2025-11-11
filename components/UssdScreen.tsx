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
      <div className="empty-state">
        <div className="typing-indicator">
          <div className="typing-dot"></div>
          <div className="typing-dot"></div>
          <div className="typing-dot"></div>
        </div>
        <div className="empty-text" style={{ marginTop: '12px' }}>
          Loading...
        </div>
      </div>
    );
  }

  if (!response) {
    return (
      <div className="empty-state">
        <svg className="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
          />
        </svg>
        <div className="empty-text">
          Dial a USSD code to start
        </div>
        <div className="empty-hint">
          Example: *721#
        </div>
      </div>
    );
  }

  const { USSDResp } = response;
  const action = USSDResp.action.toLowerCase();

  // Parse menus if it's a string representation of an array
  const parseMenus = (menus: string | string[]): { isArray: boolean; items: string[] } => {
    if (Array.isArray(menus)) {
      return { isArray: true, items: menus };
    }
    
    // Check if it's a string that looks like an array: [ "item1", "item2" ]
    if (typeof menus === 'string') {
      const trimmed = menus.trim();
      if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
        try {
          // Try JSON parsing first
          const parsed = JSON.parse(trimmed);
          if (Array.isArray(parsed)) {
            return { isArray: true, items: parsed };
          }
        } catch (e) {
          // If JSON parsing fails, try manual parsing
          const cleaned = trimmed.slice(1, -1); // Remove [ and ]
          const items = cleaned.split(',').map(item => {
            // Remove quotes and trim
            let cleaned = item.trim();
            // Remove surrounding quotes (both single and double)
            if ((cleaned.startsWith('"') && cleaned.endsWith('"')) || 
                (cleaned.startsWith("'") && cleaned.endsWith("'"))) {
              cleaned = cleaned.slice(1, -1);
            }
            return cleaned;
          }).filter(item => item.length > 0);
          
          if (items.length > 0) {
            return { isArray: true, items };
          }
        }
      }
    }
    
    // Return as single item if not parseable
    return { isArray: false, items: [String(menus)] };
  };

  const parsedMenus = parseMenus(USSDResp.menus);
  const shouldDisplayAsMenu = parsedMenus.isArray || (action === 'menu' && parsedMenus.items.length > 0);

  return (
    <div className="response-card">
      {/* Title */}
      {USSDResp.title && (
        <div className="response-title">
          {USSDResp.title}
        </div>
      )}

      {/* Content */}
      <div>
        {shouldDisplayAsMenu ? (
          // Menu Response - Display as individual menu items
          <div className="menu-list">
            {parsedMenus.items.map((menuItem, index) => (
              <div 
                key={`menu-${menuItem}-${index}`} 
                className="menu-item"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                {menuItem}
              </div>
            ))}
          </div>
        ) : action === 'prompt' && typeof USSDResp.menus === 'string' ? (
          // Prompt Response
          <div className="prompt-message">
            {USSDResp.menus}
          </div>
        ) : action === 'end' && typeof USSDResp.menus === 'string' ? (
          // End Response
          <div className="end-message">
            <svg className="success-icon" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              {USSDResp.menus}
            </div>
          </div>
        ) : (
          // Fallback for unknown format
          <div className="prompt-message">
            {typeof USSDResp.menus === 'string'
              ? USSDResp.menus
              : JSON.stringify(USSDResp.menus, null, 2)}
          </div>
        )}
      </div>

      {/* Key/Footer */}
      {USSDResp.key && (
        <div className="response-footer">
          {USSDResp.key}
        </div>
      )}

      {/* Action Badge */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <span className={`status-badge ${action}`}>
          {action}
        </span>
      </div>
    </div>
  );
};

export default UssdScreen;
