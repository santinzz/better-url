import { DBError, ParsingError } from '@/errors'
import { db } from '@/lib/db/connection'
import { link } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { Effect } from 'effect'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod/v4'

const shortUrlSchema = z.object({
  shortUrl: z.string()
})

export const GET = async (_req: NextRequest, { params }: { params: Promise<{ shortUrl: string }> }) => {
  const paramsEffect = 
    Effect.promise(async () => {
      return await params
    })
  paramsEffect.pipe(
    Effect.flatMap((params) =>
      Effect.try({
        try: () => {
          return shortUrlSchema.parse(params)
        },
        catch: (error) => new ParsingError((error as z.ZodError).message)
      })
    )
  )

  const effect = paramsEffect.pipe(
    Effect.flatMap((params) => 
      Effect.tryPromise({
        try: async () => {
          const url = await db
            .select()
            .from(link)
            .where(
              eq(link.shortUrl, params.shortUrl)
            )
            .limit(1)
          return url
        },
        catch: () => new DBError('Error fetching short URL')
      })
    ),
    Effect.flatMap((url) =>
      Effect.tryPromise({
        try: async () => {
          if (url.length === 0) {
            return new NextResponse(null, { status: 404 })
          }


          return NextResponse.redirect(url[0].url)
        },
        catch: () => new DBError('Error fetching short URL')
      })
    )
  )

  const program = Effect.catchTags(effect, {
    DBError: () => 
      Effect.succeed(new NextResponse(null, { status: 404 }))
  })

  return Effect.runPromise(program).then(res => res)
}