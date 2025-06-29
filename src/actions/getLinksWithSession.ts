import { Data, Effect } from 'effect'
import { DB, DbServiceLayer } from '@/lib/dbService'
import { SessionService, SessionServiceLayer } from '@/lib/sessionService'

class UnauthorizedError extends Data.TaggedError('UnauthorizedError')<{
  message: string
  cause?: unknown
}> {}

const loadEffect = Effect.gen(function* () {
  const sessionService = yield* SessionService
  const session = yield* sessionService.getSession

  if (!session) {
    return yield* Effect.fail(
      new UnauthorizedError({ message: 'Unauthorized' })
    )
  }

  yield* Effect.logInfo('Loading user links for', session.user.id)

  const links = yield* DB.query.getUserLinks(session.user.id)

  return {
    links,
    session,
  }
})

const runnable = loadEffect.pipe(
  Effect.provide(DbServiceLayer),
  Effect.provide(SessionServiceLayer)
)

export const getLinksWithSession = () => Effect.runPromise(runnable)
