import { SessionState, ConversationEntry } from './types';
import { v4 as uuidv4 } from 'uuid';

class SessionStore {
  private sessions: Map<string, SessionState> = new Map();

  createSession(phoneNumber: string, network: string): SessionState {
    const sessionId = uuidv4();
    const session: SessionState = {
      id: sessionId,
      phoneNumber,
      network,
      sessionId,
      conversationHistory: [],
      currentScreen: 'INITIAL',
      isActive: true,
      createdAt: new Date(),
      lastActivity: new Date(),
    };
    this.sessions.set(sessionId, session);
    return session;
  }

  getSession(sessionId: string): SessionState | undefined {
    return this.sessions.get(sessionId);
  }

  getAllSessions(): SessionState[] {
    return Array.from(this.sessions.values()).sort(
      (a, b) => b.lastActivity.getTime() - a.lastActivity.getTime()
    );
  }

  updateSession(sessionId: string, updates: Partial<SessionState>): void {
    const session = this.sessions.get(sessionId);
    if (session) {
      Object.assign(session, { ...updates, lastActivity: new Date() });
    }
  }

  addConversationEntry(sessionId: string, entry: ConversationEntry): void {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.conversationHistory.push(entry);
      session.lastActivity = new Date();
    }
  }

  resetSession(sessionId: string): void {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.conversationHistory = [];
      session.currentScreen = 'INITIAL';
      session.lastActivity = new Date();
    }
  }

  deleteSession(sessionId: string): void {
    this.sessions.delete(sessionId);
  }

  getActiveSessions(): SessionState[] {
    return Array.from(this.sessions.values())
      .filter((s) => s.isActive)
      .sort((a, b) => b.lastActivity.getTime() - a.lastActivity.getTime());
  }
}

// Export a singleton instance
export const sessionStore = new SessionStore();
