import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { AvatarFallback, AvatarImage, Avatar } from "@/components/ui/avatar"
import { PopoverContent, PopoverTrigger, Popover } from "@/components/ui/popover"
import { LogOutButton } from "./log-out-button"

const UserAvatar = ({ src, alt, name }: { src: string; alt: string, name: string }) => {
  return (
    <Avatar>
      <AvatarImage src={src} alt={alt} />
      <AvatarFallback className="bg-blue-400 text-white size-8 grid place-items-center">{name?.[0]}</AvatarFallback>
    </Avatar>
  )
}

export const UserButton = async () => {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    throw new Error("User not authenticated");
  }
   
  return (
    <Popover>
      <PopoverTrigger asChild>
        <UserAvatar src={session.user.image!} alt={session.user.name} name={session.user.name} />
      </PopoverTrigger>
      <PopoverContent className="w-80 shadow-lg">
        <div className="flex gap-x-4">
          <UserAvatar
            src={session.user.image!}
            alt={session.user.name}
            name={session.user.name}
          />
          <div className='flex flex-col gap-y-2'>
            <div>
              <p className="text-sm">{session.user.name}</p>
              <p className="text-sm text-foreground/60">{session.user.email}</p>   
            </div>
            <div>
              <LogOutButton />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}