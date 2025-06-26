import { Session, User } from "better-auth";
import { Context, Effect, Layer } from "effect";
import { auth } from "./auth";
import { headers } from "next/headers";

export class SessionService extends Context.Tag("SessionService")<
  SessionService,
  {
    getSession: Effect.Effect<{
      session: Session;
      user: User;
    } | null, never>;
  }
>() {}

let session: Session & User | null = null

export const SessionServiceLayer = Layer.scoped(
  SessionService,
  Effect.gen(function* () {
    if (session) {
      yield* Effect.logDebug("Using existing session");
      return SessionService.of({
        getSession: Effect.succeed(session),
      })
    }

    return SessionService.of({
      getSession: Effect.promise(async () => {
        const session = await auth.api.getSession({
          headers: await headers(),
        })

        return session
      })
    })

  })
)