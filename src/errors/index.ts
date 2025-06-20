export class AuthError {
  readonly _tag = 'AuthError'
  constructor(readonly reason: string) {}
}

export class DBError {
  readonly _tag = 'DBError'
  constructor(readonly reason: string) {}
}

export class ParsingError {
  readonly _tag = 'ParsingError'
  constructor(readonly reason: string) {}
}

export class CacheError {
  readonly _tag = 'CacheError'
  constructor(readonly reason: string) {}
}