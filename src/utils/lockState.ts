export interface LockState {
  failedAttempts: number;
  lockoutUntil: number | null;
}

const LOCK_STATE_KEY = 'wealthpulse_lock_state';

export function getLockState(): LockState {
  try {
    const raw = localStorage.getItem(LOCK_STATE_KEY);
    if (!raw) return { failedAttempts: 0, lockoutUntil: null };
    const parsed = JSON.parse(raw);
    return {
      failedAttempts: typeof parsed.failedAttempts === 'number' ? parsed.failedAttempts : 0,
      lockoutUntil: typeof parsed.lockoutUntil === 'number' ? parsed.lockoutUntil : null,
    };
  } catch {
    return { failedAttempts: 0, lockoutUntil: null };
  }
}

export function saveLockState(state: LockState): void {
  try {
    localStorage.setItem(LOCK_STATE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save lock state:', e);
  }
}

export function clearLockState(): void {
  try {
    localStorage.setItem(
      LOCK_STATE_KEY,
      JSON.stringify({ failedAttempts: 0, lockoutUntil: null })
    );
  } catch (e) {
    console.error('Failed to clear lock state:', e);
  }
}
