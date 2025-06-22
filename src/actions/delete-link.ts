'use server'

import { AuthError, DBError } from "@/errors"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db/connection"
import { link } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { Effect } from "effect"
import { revalidatePath } from "next/cache"
import { headers } from "next/headers"

export const deleteLink = async (id: string) => {
  const effect = Effect.gen(function* () {
    const sessionEffect = yield* Effect.promise(async () => {
      const session = await auth.api.getSession({
        headers: await headers()
      })

      return session
    })

    if (!sessionEffect) {
      return yield* Effect.fail(new AuthError('Unauthorized'))
    }

    yield* Effect.tryPromise({
      try: async () => {
        await db
          .delete(link)
          .where(
            eq(link.id, id)
          )
      },
      catch: () => new DBError('Error deleting link')
    })

    return yield* Effect.succeed({ data: 'Link successfully deleted', error: null })
  })

  const program = Effect.catchTags(effect, {
    AuthError: (authError) => Effect.succeed({ data: null, error: authError.reason }),
    DBError: (dbError) => Effect.succeed({ data: null, error: dbError.reason })
  })

  return Effect.runPromise(program).then(res => {
    revalidatePath('/dashboard/links')
    return res
  })
}