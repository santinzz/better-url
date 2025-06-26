import { ParsingError } from '@/errors'
import { DB, DbServiceLayer } from '@/lib/dbService'
import { RedisService, RedisServiceLayer } from '@/lib/redisService'
import { Effect } from 'effect'
import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod/v4'

const shortUrlSchema = z.object({
	shortUrl: z.string(),
})

export const GET = async (
	req: NextRequest,
	{ params }: { params: Promise<{ shortUrl: string }> }
) => {
	if (req.url.includes('.') || req.url.includes('dashboard')) {
		return new NextResponse(null, { status: 204 })
	}

	const effect = Effect.gen(function* () {
		const parameters = yield* Effect.promise(() => params)

		const parsedParams = yield* Effect.try({
			try: () => shortUrlSchema.parse(parameters),
			catch: (error) => new ParsingError({ cause: error, message: 'Failed to parse parameters' }),
		})

		const redis = yield* RedisService

		const cachedUrl = yield* redis.use((client) => client.get(`short:${parsedParams.shortUrl}`))
		const result = yield* Effect.sync(() => {
			const parsedUrl = z.url().safeParse(cachedUrl)

			if (parsedUrl.success) {
				return { fromCache: true, url: parsedUrl.data, shortUrl: parsedParams.shortUrl } as const
			}
			return { fromCache: false, shortUrl: parsedParams.shortUrl } as const
		})
		

		if (result.fromCache) {
			yield* DB.mutate.incrementAnalyticsOnly(result.shortUrl)
			return result.url
		}

		const link = yield* DB.query.getLinkByShortUrl(result.shortUrl)

		yield* DB.mutate.updateAnalytics(link)

		return link.url
	})

	const effectWithServices = effect.pipe(
		Effect.provide(RedisServiceLayer),
		Effect.provide(DbServiceLayer),
	)

	const runnable = Effect.catchTags(effectWithServices, {
		DatabaseError: (dbError) => Effect.succeed({ error: dbError.message, cause: dbError.cause }),
		ParsingError: (parsingError) => Effect.succeed({ error: parsingError.message, cause: parsingError.cause }),
		RedisError: (redisError) => Effect.succeed({ error: redisError.message, cause: redisError.cause }),
	})

	return Effect.runPromise(runnable).then((res) => {
		if (z.url().safeParse(res).success) {
			revalidatePath('/dashboard/links')
			return NextResponse.redirect(res as string)
		}

		if (typeof res !== 'string') {
			return NextResponse.json({ error: res.error as string, cause: res.cause }, { status: 500 })
		}

		return NextResponse.json({ error: res }, { status: 500 })
	})
}
