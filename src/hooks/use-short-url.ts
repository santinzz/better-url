import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTransition, useEffect } from 'react'
import { toast } from 'sonner' // or your toast lib
import { createShortUrl } from '@/actions/createShortUrl'
import { FormSchema, formSchema } from '@/lib/schemas/short-url-form'

export function useShortenUrlForm() {
  const [isPending, startTransition] = useTransition()

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: '',
      alias: '',
      title: '',
    },
  })

  const handleShortUrl = async (data: FormSchema) => {
    startTransition(async () => {
      const shortUrl = await createShortUrl(data)

      if (!shortUrl.data) {
        toast.error(shortUrl.error, {
          richColors: true,
        })
      } else {
        toast.success(`Short URL created: ${shortUrl.data.shortUrl}`)
        form.reset()
      }

    })
  }

  useEffect(() => {
    if (form.formState.errors.url?.message) {
      toast.error(form.formState.errors.url.message)
    }
  }, [form.formState.errors.url?.message])

  return {
    form,
    isPending,
    handleShortUrl,
  }
}
