'use server'

import { formSchema, FormSchema } from '@/lib/schemas/short-url-form'
import { Effect } from 'effect'
import { ParsingError } from '@/errors'
import { revalidatePath } from 'next/cache'
import { DB, DbServiceLayer } from '@/lib/dbService'
import { SessionService, SessionServiceLayer } from '@/lib/sessionService'
import { AuthError } from '@/lib/errors'

export const createShortUrl = async ({ url, alias }: FormSchema) => {
  const effect = Effect.gen(function* () {
    const parsedData = yield* Effect.try({
      try: () => formSchema.parse({ url, alias }),
      catch: (error) =>
        new ParsingError({
          cause: error,
          message: 'Failed to parse form data',
        }),
    })

    const sessionService = yield* SessionService
    const session = yield* sessionService.getSession

    if (!session) {
      return yield* Effect.fail(new AuthError({ message: 'Unauthorized' }))
    }

    const result = yield* DB.mutate.createShortUrl({
      url: parsedData.url,
      alias: parsedData.alias,
      userId: session.user.id,
    })

    return { data: result, error: null }
  })

  const runnable = Effect.catchTags(effect, {
    AuthError: (authError) =>
      Effect.succeed({ data: null, error: authError.message }),
    ParsingError: (parsingError) =>
      Effect.succeed({ data: null, error: parsingError.message }),
    DatabaseError: () =>
      Effect.succeed({ data: null, error: 'Alias already exists' }),
  })

  const program = runnable.pipe(
    Effect.provide(DbServiceLayer),
    Effect.provide(SessionServiceLayer)
  )

  return Effect.runPromise(program).then((res) => {
    revalidatePath('/dashboard/links')
    return res
  })
}
