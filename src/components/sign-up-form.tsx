'use client'

import { User, Mail, EyeOff, Eye, Lock } from 'lucide-react'
import { Input } from './ui/input'
import { useState, useTransition } from 'react'
import { Button } from './ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from './ui/form'
import { useForm } from 'react-hook-form'
import { z } from 'zod/v4'
import { zodResolver } from '@hookform/resolvers/zod'
import { authClient } from '@/lib/auth-client'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

const signUpSchema = z
	.object({
		name: z.string().min(1, { error: 'Name is required' }),
		email: z.email({ error: 'Invalid email address' }),
		password: z
			.string()
			.min(8, { error: 'Password must be at least 6 characters' }),
		confirmPassword: z
			.string()
			.min(8, { error: 'Confirm password is required' }),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Passwords do not match',
		path: ['confirmPassword'],
	})

type TSignUpSchema = z.infer<typeof signUpSchema>

export const SignUpForm = () => {
	const router = useRouter()
	const form = useForm<TSignUpSchema>({
		defaultValues: {
			name: '',
			email: '',
			password: '',
			confirmPassword: '',
		},
		resolver: zodResolver(signUpSchema),
	})
	const [showPassword, setShowPassword] = useState(false)
	const [showConfirmPassword, setShowConfirmPassword] = useState(false)
	const [isLoading, startTransition] = useTransition()

	const handleSignUp = (data: TSignUpSchema) => {
		startTransition(async () => {
			await authClient.signUp.email(
				{
					email: data.email,
					password: data.password,
					name: data.name,
				},
				{
					onError: (ctx) => {
						if (ctx.error.status === 403) {
							toast('Please verify your email address')
						}

						toast(ctx.error.message)
					},
					onSuccess: () => {
						router.push('/dashboard')
					},
				}
			)
		})
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(handleSignUp)} className='space-y-4'>
				<FormField
					control={form.control}
					name='name'
					render={({ field }) => (
						<FormItem className='gap-0'>
							<label
								htmlFor='name'
								className='text-sm font-medium text-gray-700'
							>
								Full name
							</label>
							<div className='relative'>
								<User className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400' />
								<FormControl>
									<Input
										{...field}
										className='pl-10 h-11'
										placeholder='Enter your full name'
									/>
								</FormControl>
							</div>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='email'
					render={({ field }) => (
						<FormItem className='gap-0'>
							<label
								htmlFor='email'
								className='text-sm font-medium text-gray-700'
							>
								Email address
							</label>
							<div className='relative'>
								<Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400' />
								<FormControl>
									<Input
										{...field}
										className='pl-10 h-11'
										placeholder='Enter your email address'
									/>
								</FormControl>
							</div>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='password'
					render={({ field }) => (
						<FormItem className='gap-0'>
							<label
								htmlFor='password'
								className='text-sm font-medium text-gray-700'
							>
								Password
							</label>
							<div className='relative'>
								<Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400' />
								<FormControl>
									<Input
										{...field}
										className='pl-10 h-11'
										placeholder='Create a password'
										type={showPassword ? 'text' : 'password'}
									/>
								</FormControl>
								<button
									type='button'
									onClick={() => setShowPassword(!showPassword)}
									className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600'
								>
									{showPassword ? (
										<EyeOff className='w-4 h-4' />
									) : (
										<Eye className='w-4 h-4' />
									)}
								</button>
							</div>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='confirmPassword'
					render={({ field }) => (
						<FormItem className='gap-0'>
							<label
								htmlFor='confirmPassword'
								className='text-sm font-medium text-gray-700'
							>
								Confirm password
							</label>
							<div className='relative'>
								<Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400' />
								<FormControl>
									<Input
										{...field}
										className='pl-10 h-11'
										placeholder='Create a password'
										type={showConfirmPassword ? 'text' : 'password'}
									/>
								</FormControl>
								<button
									type='button'
									onClick={() => setShowConfirmPassword(!showPassword)}
									className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600'
								>
									{showPassword ? (
										<EyeOff className='w-4 h-4' />
									) : (
										<Eye className='w-4 h-4' />
									)}
								</button>
							</div>
						</FormItem>
					)}
				/>

				{/* <div className='flex items-start space-x-2'>
					<Checkbox
						id='terms'
						checked={agreeToTerms}
						onCheckedChange={(e) => setAgreeToTerms(e.target.checked)}
						className='mt-1'
					/>
					<label
						htmlFor='terms'
						className='text-sm text-gray-600 cursor-pointer leading-5'
					>
						I agree to the{' '}
						<Link
							href='/terms'
							className='text-blue-600 hover:text-blue-700 font-medium'
						>
							Terms of Service
						</Link>{' '}
						and{' '}
						<Link
							href='/privacy'
							className='text-blue-600 hover:text-blue-700 font-medium'
						>
							Privacy Policy
						</Link>
					</label>
				</div> */}

				<Button
					type='submit'
					className='w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium'
					disabled={isLoading}
				>
					{isLoading ? (
						<div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
					) : (
						'Create Account'
					)}
				</Button>
			</form>
		</Form>
	)
}
