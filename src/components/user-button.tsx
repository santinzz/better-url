'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SidebarMenuButton } from '@/components/ui/sidebar'
import { ChevronUp, CreditCard, LogOut, Settings, User } from 'lucide-react'
import { authClient } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import { Effect } from 'effect'
import { Skeleton } from './ui/skeleton'

export const UserButton = () => {
	const session = authClient.useSession()
	const router = useRouter()

	if (session.isPending) {
		return (
			<SidebarMenuButton
				size='lg'
				className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
			>
				<Skeleton className='size-8 rounded-lg bg-neutral-800/30' />
				<div className='grid flex-1 text-left text-sm leading-tight space-y-2'>
					<Skeleton className='h-4 w-24 rounded bg-neutral-800/30' />
					<Skeleton className='h-3 w-32 rounded bg-neutral-800/30' />
				</div>
				<ChevronUp className='ml-auto size-4' />
			</SidebarMenuButton>
		)
	}

	if (!session.data) {
		throw new Error('User session not found')
	}

	const handleSignOut = async () => {
		const signOutEffect = Effect.promise(async () => {
			await authClient.signOut({
				fetchOptions: {
					onSuccess: () => {
						router.push('/auth/signin')
					},
				},
			})
		})

		Effect.runPromise(signOutEffect)
	}

	const user = session.data.user

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<SidebarMenuButton
					size='lg'
					className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
				>
					<Avatar className='h-8 w-8 rounded-lg'>
						<AvatarImage src='/placeholder.svg?height=32&width=32' alt='User' />
						<AvatarFallback className='rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white'>
							{user.name.toUpperCase().slice(0, 2)}
						</AvatarFallback>
					</Avatar>
					<div className='grid flex-1 text-left text-sm leading-tight'>
						<span className='truncate font-semibold'>{user.name}</span>
						<span className='truncate text-xs text-muted-foreground'>
							{user.email}
						</span>
					</div>
					<ChevronUp className='ml-auto size-4' />
				</SidebarMenuButton>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg'
				side='bottom'
				align='end'
				sideOffset={4}
			>
				<DropdownMenuLabel className='p-0 font-normal'>
					<div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
						<Avatar className='h-8 w-8 rounded-lg'>
							<AvatarImage
								src='/placeholder.svg?height=32&width=32'
								alt='User'
							/>
							<AvatarFallback className='rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white'>
								{user.name.toUpperCase().slice(0, 2)}
							</AvatarFallback>
						</Avatar>
						<div className='grid flex-1 text-left text-sm leading-tight'>
							<span className='truncate font-semibold'>{user.name}</span>
							<span className='truncate text-xs text-muted-foreground'>
								{user.email}
							</span>
						</div>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem>
					<User className='mr-2 h-4 w-4' />
					Profile
				</DropdownMenuItem>
				<DropdownMenuItem>
					<CreditCard className='mr-2 h-4 w-4' />
					Billing
				</DropdownMenuItem>
				<DropdownMenuItem>
					<Settings className='mr-2 h-4 w-4' />
					Settings
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={handleSignOut}>
					<LogOut className='mr-2 h-4 w-4' />
					Log Out
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
