import { auth } from '@/lib/auth'
import { Effect } from 'effect'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export const getSession = Effect.promise(async () => {
	const session = await auth.api.getSession({
		headers: await headers()
	})

	if (!session) {
		return redirect('/auth/signin')
	}

	return session
})
