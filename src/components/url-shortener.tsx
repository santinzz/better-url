'use client'

import { Input } from './ui/input'
import { Button } from './ui/button'
import { Zap } from 'lucide-react'
import { Form, FormControl, FormField, FormItem, FormLabel } from './ui/form'
import { useShortenUrlForm } from '@/hooks/use-short-url'
import { cn } from '@/lib/utils'

export const UrlShortener = ({ vertical }: { vertical?: boolean }) => {
	const { form, isPending, handleShortUrl } = useShortenUrlForm()

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(handleShortUrl)}
				className={cn(
					vertical ? 'flex flex-col gap-4' : 'flex items-center gap-4'
				)}
			>
				<FormField
					control={form.control}
					name='url'
					render={({ field }) => (
						<FormItem className='w-full'>
							<FormLabel>URL</FormLabel>
							<FormControl>
								<Input placeholder='https://example.com' {...field} />
							</FormControl>
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='alias'
					render={({ field }) => (
						<FormItem className='w-full'>
							<FormLabel>Custom Alias (Optional)</FormLabel>
							<FormControl>
								<Input placeholder='my-custom-link' {...field} />
							</FormControl>
						</FormItem>
					)}
				/>
				<Button className='bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700l mt-5'>
					{isPending && (
						<div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
					)}
					<Zap className='w-4 h-4' />
					Shorten
				</Button>
			</form>
		</Form>
	)
}
