import type { Session } from 'hono-sessions';

type SessionData = {
  success?: string;
  error?: string;
  info?: string;
  warning?: string;
};

export type AppEnv = {
  Variables: {
    session: Session<SessionData>;
  };
};
