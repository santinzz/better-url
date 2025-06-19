'use client'

import { Input } from './ui/input'
import { Button } from './ui/button'
import { Zap } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel } from './ui/form'
import { useEffect } from 'react'
import { toast } from 'sonner'
import { FormSchema, formSchema } from '@/lib/schemas/short-url-form'
import { useTransition } from 'react'
import { createShortUrl } from '@/actions/createShortUrl'

export const UrlShortener = () => {
  const [isPending, startTransition] = useTransition()
	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			url: '',
      alias: '',
		},
	})

  const handleShortUrl = async (data: FormSchema) => {
    startTransition(async () => {
      const shortUrl = await createShortUrl(data)

      if (!shortUrl.data) {
        toast.error(shortUrl.error)
      }

      if (shortUrl.data) {
        toast.success(`Short URL created: ${shortUrl.data.shortUrl}`)
      }

      form.reset()
    })
  }

  useEffect(() => {
    if (form.formState.errors.url?.message) {
      toast.error(form.formState.errors.url.message)
    }
  }, [form.formState.errors.url?.message])

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(handleShortUrl)} className='flex gap-2 items-center'>
				<FormField
					control={form.control}
					name='url'
					render={({ field }) => (
						<FormItem className='w-full'>
							<FormLabel>URL</FormLabel>
							<FormControl>
								<Input
									placeholder='https://example.com'
									{...field}
								/>
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
                <Input
                  placeholder='my-custom-link'
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
				<Button className='bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700l mt-5'>
					{isPending && <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />}
					<Zap className='w-4 h-4' />
					Shorten
				</Button>
			</form>
		</Form>
	)
}
