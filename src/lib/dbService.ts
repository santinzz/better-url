import { Client, createClient } from "@libsql/client";
import { drizzle, LibSQLDatabase } from "drizzle-orm/libsql";
import { Context, Effect, Layer } from "effect";
import * as schema from "./db/schema";
import { env } from "@/env";
import { eq, sql } from "drizzle-orm";
import { DatabaseError } from "./errors";
import shortid from "shortid";
import { Link } from "./db/schema";

type Connection = LibSQLDatabase<typeof schema> & {
    $client: Client;
}

class DbService extends Context.Tag("DbService")<
  DbService,
  {
    getDbConnection: Effect.Effect<Connection, DatabaseError>;
  }
>() {}

let dbConnection: Connection | undefined

export const DbServiceLayer = Layer.scoped(
  DbService,
  Effect.gen(function* () {
    if (dbConnection) {
      yield* Effect.logDebug('Using existing database connection');
      return DbService.of({
        getDbConnection: Effect.succeed(dbConnection),
      })
    }

    return DbService.of({
      getDbConnection: Effect.try({
        try: () => {
          const client = createClient({
            url: env.TURSO_DATABASE_URL,
            authToken: env.TURSO_AUTH_TOKEN,
          })

          return drizzle({ client, schema })
        },
        catch: (error) => 
          new DatabaseError({
            cause: error,
            message: 'Failed to connect to database',
          }),
      })
    })
  })
)

export const DB = {
  query: {
    getUserLinks: (userId: string) => 
      Effect.gen(function* () {
        const dbService = yield* DbService
        const db = yield* dbService.getDbConnection

        const result = yield* Effect.tryPromise({
          try: () => db
            .select()
            .from(schema.link)
            .where(
              eq(schema.link.userId, userId)
            ),
          catch: (error) => 
            new DatabaseError({
              cause: error,
              message: 'Failed to query database',
            }),
        })

        return result
      }),
    getLinkByShortUrl: (shortUrl: string) =>
      Effect.gen(function* () {
        const dbService = yield* DbService
        const db = yield* dbService.getDbConnection

        const result = yield* Effect.tryPromise({
          try: () => db
            .select()
            .from(schema.link)
            .where(
              eq(schema.link.shortUrl, shortUrl)
            ),
          catch: (error) => 
            new DatabaseError({
              cause: error,
              message: 'Failed to query database',
            }),
        })

        const link = result[0]

        return link
      }),
  },
  mutate: {
    createShortUrl: ({
      url,
      alias,
      userId,
    }: {
      url: string;
      alias?: string;
      userId: string;
    }) =>
      Effect.gen(function* () {
        const dbService = yield* DbService

        const db = yield* dbService.getDbConnection
        const shortUrl = alias || shortid.generate()

        const [result] = yield* Effect.tryPromise({
          try: () => db
            .insert(schema.link)
            .values({
              url,
              shortUrl,
              userId,
            })
            .returning({
              shortUrl: schema.link.shortUrl,
              url: schema.link.url,
            }),
          catch: (error) => 
            new DatabaseError({
              cause: error,
              message: 'Failed to mutate database',
            }),
        })
        
        return result
      }),
      updateAnalytics: (link: Link) =>
        Effect.gen(function* () {
          const dbService = yield* DbService

          const db = yield* dbService.getDbConnection
          const shortUrl = link.shortUrl

          yield* Effect.tryPromise({
            try: () => db
              .update(schema.link)
              .set({
                clickCount: sql`${schema.link.clickCount} + 1`,
                lastClick: new Date(),
                expiresAt: new Date(new Date().getTime() + 60 * 1000),
                isActive: true,
                updatedAt: new Date(),
              })
              .where(eq(schema.link.shortUrl, shortUrl)),
            catch: (error) => 
              new DatabaseError({
                cause: error,
                message: 'Failed to mutate database',
              }),
          })
        }),
      incrementAnalyticsOnly: (shortUrl: string) =>
        Effect.gen(function* () {
          const dbService = yield* DbService

          const db = yield* dbService.getDbConnection

          yield* Effect.tryPromise({
            try: () => db
              .update(schema.link)
              .set({
                clickCount: sql`${schema.link.clickCount} + 1`,
                lastClick: new Date(),
                updatedAt: new Date(),
              })
              .where(eq(schema.link.shortUrl, shortUrl)),
            catch: (error) => 
              new DatabaseError({
                cause: error,
                message: 'Failed to mutate database',
              }),
          })
        }),
  }
}
