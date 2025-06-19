import { getSession } from '@/actions/getSession'
import { db } from '@/lib/db/connection'
import { link, Link } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { Effect, pipe } from 'effect'

export const getLinks = async (): Promise<Link[]> => {
	const linksEffect = pipe(
		getSession,
		Effect.andThen(async (session) => {
			return await db
				.select()
				.from(link)
				.where(eq(link.userId, session.user.id))
		})
	)

	return Effect.runPromise(linksEffect).then((res) => res)
}
