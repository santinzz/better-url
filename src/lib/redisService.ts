import { Redis } from '@upstash/redis'
import { Context, Data, Effect, Layer } from 'effect'

export class RedisError extends Data.TaggedError('RedisError')<{
	cause?: unknown
	message: string
}> {}

interface RedisImpl {
	use: <T>(
		fn: (client: Redis) => T
	) => Effect.Effect<Awaited<T>, RedisError, never>
}

export class RedisService extends Context.Tag('RedisService')<
	RedisService,
	RedisImpl
>() {}

const make = () =>
	Effect.gen(function* () {
		const client = yield* Effect.try({
			try: () => Redis.fromEnv(),
			catch: (error) =>
				new RedisError({ cause: error, message: 'Failed to connect to Redis' }),
		})

		return RedisService.of({
			use: (fn) =>
				Effect.gen(function* () {
					const result = yield* Effect.try({
						try: () => fn(client),
						catch: (error) =>
							new RedisError({
								cause: error,
								message: 'Synchronous error in Redis.use',
							}),
					})
					if (result instanceof Promise) {
						return yield* Effect.tryPromise({
							try: () => result,
							catch: (error) =>
								new RedisError({
									cause: error,
									message: 'Asynchronous error in Redis.use',
								}),
						})
					} else {
						return result
					}
				}),
		})
	})

export const RedisServiceLayer = Layer.scoped(RedisService, make())

