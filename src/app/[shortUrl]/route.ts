import { CacheError, DBError, ParsingError } from '@/errors'
import { db } from '@/lib/db/connection'
import { redis } from '@/lib/db/redis'
import { Link, link } from '@/lib/db/schema'
import { eq, sql } from 'drizzle-orm'
import { Effect } from 'effect'
import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod/v4'

const shortUrlSchema = z.object({
	shortUrl: z.string(),
})

const updateAnalyticsEffect = ({ id }: Link) =>
	Effect.tryPromise({
		try: async () => {
			const data = await db
				.update(link)
				.set({
					clickCount: sql`${link.clickCount} + 1`,
					lastClick: new Date(),
					expiresAt: new Date(new Date().getTime() + 60 * 1000),
					isActive: true,
					updatedAt: new Date(),
				})
				.where(eq(link.id, id))
        .returning()

			return data[0].url
		},
		catch: () => new DBError('Error updating short URL'),
	})

const getLinkByShortUrlEffect = (shortUrl: string) =>
	Effect.tryPromise({
		try: async () => {
			return await db.select().from(link).where(eq(link.shortUrl, shortUrl))
		},
		catch: () => new DBError('Error fetching short URL'),
	})

const incrementAnalyticsOnlyEffect = (shortUrl: string) =>
	Effect.tryPromise({
		try: async () => {
			await db
				.update(link)
				.set({
					clickCount: sql`${link.clickCount} + 1`,
					lastClick: new Date(),
					updatedAt: new Date(),
				})
				.where(eq(link.shortUrl, shortUrl))
		},
		catch: () => new DBError('Error updating analytics for cached URL'),
	})

export const GET = async (
	req: NextRequest,
	{ params }: { params: Promise<{ shortUrl: string }> }
) => {
	if (req.url.includes('.')) {
		return new NextResponse(null, { status: 204 })
	}

	const paramsEffect = Effect.promise(async () => {
		return await params
	})

	const parsedParamsEffect = paramsEffect.pipe(
		Effect.flatMap((params) =>
			Effect.try({
				try: () => {
					return shortUrlSchema.parse(params)
				},
				catch: (error) => new ParsingError((error as z.ZodError).message),
			})
		)
	)

	const effect = Effect.gen(function* () {
		const params = yield* parsedParamsEffect

		const result = yield* Effect.tryPromise({
			try: async () => {
				const cachedUrl = await redis.get(`short:${params.shortUrl}`)
				const parsedUrl = z.url().safeParse(cachedUrl)

				if (parsedUrl.success) {
					return { fromCache: true, url: parsedUrl.data, shortUrl: params.shortUrl } as const
				}

				return { fromCache: false, shortUrl: params.shortUrl } as const
			},
			catch: () => new CacheError('Redis Look up failed'),
		})

		if (result.fromCache) {
			yield* incrementAnalyticsOnlyEffect(result.shortUrl)
			return result.url
		}

		if (!result.shortUrl) {
			return yield* Effect.fail('[DB Error] Short URL not found')
		}

		const [link] = yield* getLinkByShortUrlEffect(result.shortUrl)

    if (!link) {
      return yield* Effect.fail('[DB Error] Short URL not found')
    }

		const url = yield* updateAnalyticsEffect(link)

		yield* Effect.promise(async () => {
		 	await redis.set(`short:${result.shortUrl}`, url, { ex: 60 })
		})

		return url
	})

	const program = Effect.catchTags(effect, {
		DBError: () => Effect.succeed('[DB Error] Short URL not found'),
		CacheError: () => Effect.succeed('[Cache Error] Redis Look up failed'),
		ParsingError: () => Effect.succeed('[Parsing Error] Short URL not found'),
	})

	return Effect.runPromise(program).then((res) => {
		if (z.url().safeParse(res).success) {
			revalidatePath('/dashboard/links')
			return NextResponse.redirect(res)
		}

		return NextResponse.json({ error: res }, { status: 500 })
	})
}
