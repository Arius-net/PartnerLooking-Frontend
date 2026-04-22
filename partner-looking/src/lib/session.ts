export type StoredSession = {
  token: string;
  role: string;
  userId: string;
};

export const TOKEN_KEY = "partnerlooking_token";
export const ROLE_KEY = "partnerlooking_role";
export const USER_ID_KEY = "partnerlooking_user_id";
export const SESSION_EVENT_NAME = "partnerlooking:session-changed";

function canUseStorage(): boolean {
  return typeof window !== "undefined";
}

export function emitSessionChange(): void {
  if (!canUseStorage()) {
    return;
  }

  window.dispatchEvent(new Event(SESSION_EVENT_NAME));
}

export function saveSession(partial: Partial<StoredSession>): void {
  if (!canUseStorage()) {
    return;
  }

  if (partial.token) {
    window.localStorage.setItem(TOKEN_KEY, partial.token);
  }
  if (partial.role) {
    window.localStorage.setItem(ROLE_KEY, partial.role);
  }
  if (partial.userId) {
    window.localStorage.setItem(USER_ID_KEY, partial.userId);
  }

  emitSessionChange();
}

export function getStoredToken(): string {
  if (!canUseStorage()) {
    return "";
  }
  return window.localStorage.getItem(TOKEN_KEY) || "";
}

export function getStoredRole(): string {
  if (!canUseStorage()) {
    return "";
  }
  return window.localStorage.getItem(ROLE_KEY) || "";
}

export function getStoredUserId(): string {
  if (!canUseStorage()) {
    return "";
  }
  return window.localStorage.getItem(USER_ID_KEY) || "";
}

export function clearSession(): void {
  if (!canUseStorage()) {
    return;
  }
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(ROLE_KEY);
  window.localStorage.removeItem(USER_ID_KEY);
  emitSessionChange();
}
