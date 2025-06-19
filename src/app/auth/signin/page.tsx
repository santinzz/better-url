'use client'

import { Link2 } from 'lucide-react'
import Link from 'next/link'
import { SignInCard } from '@/components/sign-in-card'

export default function SignInPage() {
	return (
		<div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4'>
			{/* Background Pattern */}
			<div className='absolute inset-0 bg-grid-pattern opacity-5'></div>

			<div className='w-full max-w-md relative z-10'>
				{/* Logo Header */}
				<div className='text-center mb-8'>
					<Link href='/' className='inline-flex items-center gap-2 mb-4'>
						<div className='w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center'>
							<Link2 className='w-5 h-5 text-white' />
						</div>
						<h1 className='text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
							better-url
						</h1>
					</Link>
					<p className='text-gray-600'>Welcome back! Sign in to your account</p>
				</div>

				{/* Sign In Card */}
				<SignInCard />

				{/* Footer */}
				<div className='text-center mt-8 text-sm text-gray-500'>
					<p>
						By signing in, you agree to our{' '}
						<Link href='/terms' className='text-blue-600 hover:text-blue-700'>
							Terms of Service
						</Link>{' '}
						and{' '}
						<Link href='/privacy' className='text-blue-600 hover:text-blue-700'>
							Privacy Policy
						</Link>
					</p>
				</div>
			</div>
		</div>
	)
}
