'use client'

import { Separator } from '@/components/ui/separator'
import { Chrome, Github } from 'lucide-react'
import { Button } from './ui/button'
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from './ui/card'
import Link from 'next/link'
import { SignUpForm } from './sign-up-form'

export const SignUpCard = () => {
	const handleSocialSignUp = (provider: string) => {
		console.log(`Sign up with ${provider}`)
	}

	return (
		<Card className='shadow-2xl border-0 bg-white/90 backdrop-blur-sm'>
			<CardHeader className='text-center pb-6'>
				<CardTitle className='text-2xl font-semibold'>Create Account</CardTitle>
				<CardDescription>
					Join thousands of users who trust better-url
				</CardDescription>
			</CardHeader>

			<CardContent className='space-y-6'>
				{/* Social Sign Up */}
				<div className='space-y-3'>
					<Button
						variant='outline'
						className='w-full h-11 border-gray-200 hover:bg-gray-50'
						onClick={() => handleSocialSignUp('google')}
					>
						<Chrome className='w-5 h-5 mr-3 text-red-500' />
						Sign up with Google
					</Button>

					<Button
						variant='outline'
						className='w-full h-11 border-gray-200 hover:bg-gray-50'
						onClick={() => handleSocialSignUp('github')}
					>
						<Github className='w-5 h-5 mr-3' />
						Sign up with GitHub
					</Button>
				</div>

				<div className='relative'>
					<Separator />
					<div className='absolute inset-0 flex items-center justify-center'>
						<span className='bg-white px-4 text-sm text-gray-500'>
							or create with email
						</span>
					</div>
				</div>

				<SignUpForm />
				
				{/* Sign In Link */}
				<div className='text-center pt-4 border-t'>
					<p className='text-sm text-gray-600'>
						Already have an account?{' '}
						<Link
							href='/auth/signin'
							className='text-blue-600 hover:text-blue-700 font-medium'
						>
							Sign in
						</Link>
					</p>
				</div>
			</CardContent>
		</Card>
	)
}
