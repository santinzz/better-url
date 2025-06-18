'use client'

import { authClient } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import { Button } from './ui/button'
import { LogOut } from 'lucide-react'

export const LogOutButton = () => {
	const router = useRouter()

	const handleLogout = async () => {
		await authClient.signOut({
			fetchOptions: {
				onSuccess: () => {
					router.push('/auth/signin')
				},
			},
		})
	}

	return (
		<Button
			onClick={handleLogout}
			size='sm'
			className='text-xs px-20'
			variant='outline'
		>
			<LogOut className='size-4' /> Log out
		</Button>
	)
}
