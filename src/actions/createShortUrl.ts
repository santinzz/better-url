'use server'

import { db } from '@/lib/db/connection'
import { link } from '@/lib/db/schema'
import { formSchema, FormSchema } from '@/lib/schemas/short-url-form'
import { Effect } from 'effect'
import { z } from 'zod/v4'
import short from 'shortid'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { AuthError, DBError, ParsingError } from '@/errors'
import { revalidatePath } from 'next/cache'
import { eq } from 'drizzle-orm'

export const createShortUrl = async ({ url, alias }: FormSchema) => {
	const getSessionEffect = Effect.promise(async () => {
		return await auth.api.getSession({
			headers: await headers(),
		})
	})

	const parsedUrlEffect = Effect.try({
		try: () => {
			return formSchema.parse({ url, alias })
		},
		catch: (error) => new ParsingError((error as z.ZodError).message)
	})

	const effect = Effect.gen(function* () {
		const session = yield* getSessionEffect

		if (!session) {
			yield* Effect.fail<AuthError>(new AuthError('You must be signed in to create a short URL'))
		}

		const parsedForm = yield* parsedUrlEffect

		const alias = yield* Effect.succeed(parsedForm.alias || short.generate())

		const isExistingUrl = yield* Effect.tryPromise({
			try: async () => {
				const existingUrl = await db.select().from(link).where(eq(link.shortUrl, alias))

				return existingUrl.length > 0
			},
			catch: () => new DBError('Alias already exists')
		})

		if (isExistingUrl) {
			yield* Effect.fail<DBError>(new DBError('Alias already exists'))
		}

		const shortUrl = yield* Effect.tryPromise({
			try: async () => {
				const [shortUrl] = await db
					.insert(link)
					.values({
						url: parsedForm.url,
						shortUrl: alias,
						userId: session?.user.id as string,
					})
					.returning({
						shortUrl: link.shortUrl,
						url: link.url,
					})

					console.log({ shortUrl })

				return shortUrl
			},
			catch: () => new DBError('Error creating short URL')
		})

		Effect.runSync(
			Effect.sync(() => revalidatePath('/dashboard/links'))
		)

		return { data: shortUrl, error: null }
	})

	const program = Effect.catchTags(effect, {
		AuthError: (authError) => 
			Effect.succeed({ data: null, error: authError.reason }),
	  ParsingError: (parsingError) => 
			Effect.succeed({ data: null, error: parsingError.reason }),
		DBError: (dbError) => 
			Effect.succeed({ data: null, error: dbError.reason })
	})

	return Effect.runPromise(program).then(res => res)
}