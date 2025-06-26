import { Data } from 'effect';

export class DatabaseError extends Data.TaggedError('DatabaseError')<{
  cause?: unknown;
  message: string;
}> {}

export class AuthError extends Data.TaggedError('AuthError')<{
  cause?: unknown;
  message: string;
}> {}