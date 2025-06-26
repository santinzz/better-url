import { Data } from "effect"

export class AuthError {
  readonly _tag = 'AuthError'
  constructor(readonly reason: string) {}
}

export class DBError {
  readonly _tag = 'DBError'
  constructor(readonly reason: string) {}
}

export class ParsingError extends Data.TaggedError('ParsingError')<{
  cause?: unknown
  message: string
}> {}

export class CacheError {
  readonly _tag = 'CacheError'
  constructor(readonly reason: string) {}
}