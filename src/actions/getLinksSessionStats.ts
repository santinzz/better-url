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

  const [stats, links] = yield* Effect.all([
    DB.query.getBasicStats(session.user.id),
    DB.query.getUserLinks(session.user.id),
  ], { concurrency: 'unbounded' })

  return {
    links,
    session,
    stats,
  }
})

const runnable = loadEffect.pipe(
  Effect.provide(DbServiceLayer),
  Effect.provide(SessionServiceLayer)
)

export const getLinksSessionStats = () => Effect.runPromise(runnable)
