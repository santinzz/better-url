'use server'

import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { Effect } from 'effect'
import { redirect } from 'next/navigation'

export const signOut = async () => {
	const signOutEffect = Effect.tryPromise({
		try: async () => {
			return await auth.api.signOut({
				headers: await headers(),
			})
		},
		catch: (_error) => {
			return new Error('Failed to sign out')
		},
	})

	const result = await Effect.runPromise(signOutEffect).then(
		(response) => response.success
	)

	if (result) {
		redirect('/auth/sign-in')
	}
}
