import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { SignInForm } from './sign-in-form'
import { Chrome, Github } from 'lucide-react'
import Link from 'next/link'

export const SignInCard = () => {
	const handleSocialSignIn = (provider: string) => {
		console.log(`Sign in with ${provider}`)
	}

	return (
		<Card className='shadow-2xl border-0 bg-white/90 backdrop-blur-sm'>
			<CardHeader className='text-center pb-6'>
				<CardTitle className='text-2xl font-semibold'>Sign In</CardTitle>
				<CardDescription>
					Enter your credentials to access your dashboard
				</CardDescription>
			</CardHeader>

			<CardContent className='space-y-6'>
				{/* Social Sign In */}
				<div className='space-y-3'>
					<Button
						variant='outline'
						className='w-full h-11 border-gray-200 hover:bg-gray-50'
						onClick={() => handleSocialSignIn('google')}
					>
						<Chrome className='w-5 h-5 mr-3 text-red-500' />
						Continue with Google
					</Button>

					<Button
						variant='outline'
						className='w-full h-11 border-gray-200 hover:bg-gray-50'
						onClick={() => handleSocialSignIn('github')}
					>
						<Github className='w-5 h-5 mr-3' />
						Continue with GitHub
					</Button>
				</div>

				<div className='relative'>
					<Separator />
					<div className='absolute inset-0 flex items-center justify-center'>
						<span className='bg-white px-4 text-sm text-gray-500'>
							or continue with email
						</span>
					</div>
				</div>

				{/* Email/Password Form */}
				<SignInForm />

				{/* Sign Up Link */}
				<div className='text-center pt-4 border-t'>
					<p className='text-sm text-gray-600'>
						Don't have an account?{' '}
						<Link
							href='/auth/signup'
							className='text-blue-600 hover:text-blue-700 font-medium'
						>
							Sign up for free
						</Link>
					</p>
				</div>
			</CardContent>
		</Card>
	)
}
