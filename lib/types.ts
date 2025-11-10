// USSD API Request Types
export interface USSDRequest {
  msisdn: string;
  msg: string;
  network: string;
  UserSessionId: string;
}

export interface RootUSSDRequest {
  USSDReq: USSDRequest;
}

// USSD API Response Types
export interface USSDResponse {
  action: string;
  menus: string | string[];
  title: string;
  key: string;
}

export interface RootResponse {
  USSDResp: USSDResponse;
}

// Session State Types
export interface SessionState {
  id: string;
  phoneNumber: string;
  network: string;
  sessionId: string;
  conversationHistory: ConversationEntry[];
  currentScreen: string;
  isActive: boolean;
  createdAt: Date;
  lastActivity: Date;
}

export interface ConversationEntry {
  timestamp: Date;
  request: RootUSSDRequest;
  response: RootResponse | null;
  userInput: string;
  error?: string;
}

// UI State Types
export interface ConfigState {
  hostUrl: string;
  method: 'POST';
  network: string;
  phoneNumber: string;
  aggregator: string;
}

// Network Options
export type NetworkOperator = 'MTN' | 'Vodafone' | 'AirtelTigo';

// Response Action Types
export type ResponseAction = 'prompt' | 'menu' | 'end';

// Logger Entry
export interface LogEntry {
  id: string;
  timestamp: Date;
  sessionId: string;
  request: RootUSSDRequest;
  response: RootResponse | null;
  success: boolean;
  error?: string;
  duration?: number;
}
