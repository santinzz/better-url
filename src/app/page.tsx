'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
	Copy,
	Link2,
	BarChart3,
	Clock,
	Globe,
	Zap,
	CheckCircle,
	ExternalLink,
	TrendingUp,
} from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

export default function Home() {
	const [url, setUrl] = useState('')
	const [shortenedUrl, setShortenedUrl] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const [copied, setCopied] = useState(false)

	const handleShorten = async () => {
		if (!url) return

		setIsLoading(true)
		// Simulate API call
		setTimeout(() => {
			setShortenedUrl(
				`https://bttr.ly/${Math.random().toString(36).substr(2, 8)}`
			)
			setIsLoading(false)
		}, 1000)
	}

	const handleCopy = async () => {
		if (shortenedUrl) {
			await navigator.clipboard.writeText(shortenedUrl)
			setCopied(true)
			toast('Copied!', {
				description: 'Short URL copied to clipboard',
			})
			setTimeout(() => setCopied(false), 2000)
		}
	}

	const recentUrls = [
		{
			original: 'https://example.com/very-long-url-that-needs-shortening',
			short: 'bttr.ly/abc123',
			clicks: 42,
			created: '2 hours ago',
		},
		{
			original: 'https://github.com/user/repository-name',
			short: 'bttr.ly/def456',
			clicks: 18,
			created: '1 day ago',
		},
		{
			original: 'https://docs.example.com/documentation/guide',
			short: 'bttr.ly/ghi789',
			clicks: 7,
			created: '3 days ago',
		},
	]

	return (
		<div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50'>
			{/* Header */}
			<header className='border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50'>
				<div className='container mx-auto px-4 py-4'>
					<div className='flex items-center justify-between'>
						<div className='flex items-center gap-2'>
							<div className='w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center'>
								<Link2 className='w-4 h-4 text-white' />
							</div>
							<h1 className='text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
								better-url
							</h1>
						</div>
						<div className='flex items-center gap-4'>
							<Button variant='ghost' size='sm'>
								<BarChart3 className='w-4 h-4 mr-2' />
								Analytics
							</Button>
							<Button variant='ghost' size='sm' asChild>
								<Link href='/auth/signin'>Sign In</Link>
							</Button>
						</div>
					</div>
				</div>
			</header>

			<main className='container mx-auto px-4 py-12'>
				{/* Hero Section */}
				<div className='text-center mb-12'>
					<h2 className='text-4xl md:text-6xl font-bold text-gray-900 mb-4'>
						Shorten URLs.
						<br />
						<span className='bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
							Track Everything.
						</span>
					</h2>
					<p className='text-xl text-gray-600 max-w-2xl mx-auto mb-8'>
						Create short, memorable links and get detailed analytics on every
						click. Perfect for social media, marketing campaigns, and more.
					</p>
				</div>

				{/* URL Shortener Card */}
				<Card className='max-w-4xl mx-auto mb-12 shadow-xl border-0 bg-white/80 backdrop-blur-sm'>
					<CardHeader className='text-center pb-6'>
						<CardTitle className='text-2xl'>Shorten Your URL</CardTitle>
						<CardDescription>
							Paste your long URL below and get a short, shareable link
							instantly
						</CardDescription>
					</CardHeader>
					<CardContent className='space-y-6'>
						<div className='flex gap-2'>
							<Input
								placeholder='https://example.com/your-very-long-url-here'
								value={url}
								onChange={(e) => setUrl(e.target.value)}
								className='text-lg h-12'
								onKeyPress={(e) => e.key === 'Enter' && handleShorten()}
							/>
							<Button
								onClick={handleShorten}
								disabled={!url || isLoading}
								className='h-12 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
							>
								{isLoading ? (
									<div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
								) : (
									<>
										<Zap className='w-4 h-4 mr-2' />
										Shorten
									</>
								)}
							</Button>
						</div>

						{shortenedUrl && (
							<div className='p-4 bg-green-50 border border-green-200 rounded-lg'>
								<div className='flex items-center justify-between'>
									<div className='flex items-center gap-2'>
										<CheckCircle className='w-5 h-5 text-green-600' />
										<span className='font-medium text-green-800'>
											Your shortened URL:
										</span>
									</div>
								</div>
								<div className='flex items-center gap-2 mt-2'>
									<code className='flex-1 p-2 bg-white border rounded text-lg font-mono'>
										{shortenedUrl}
									</code>
									<Button
										variant='outline'
										size='sm'
										onClick={handleCopy}
										className={copied ? 'text-green-600 border-green-600' : ''}
									>
										{copied ? (
											<CheckCircle className='w-4 h-4' />
										) : (
											<Copy className='w-4 h-4' />
										)}
									</Button>
									<Button variant='outline' size='sm'>
										<ExternalLink className='w-4 h-4' />
									</Button>
								</div>
							</div>
						)}
					</CardContent>
				</Card>

				{/* Features Grid */}
				<div className='grid md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto'>
					<Card className='text-center p-6 border-0 bg-white/60 backdrop-blur-sm'>
						<div className='w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4'>
							<BarChart3 className='w-6 h-6 text-blue-600' />
						</div>
						<h3 className='font-semibold mb-2'>Detailed Analytics</h3>
						<p className='text-sm text-gray-600'>
							Track clicks, locations, devices, and more with comprehensive
							analytics
						</p>
					</Card>

					<Card className='text-center p-6 border-0 bg-white/60 backdrop-blur-sm'>
						<div className='w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4'>
							<Globe className='w-6 h-6 text-purple-600' />
						</div>
						<h3 className='font-semibold mb-2'>Custom Domains</h3>
						<p className='text-sm text-gray-600'>
							Use your own domain for branded short links that build trust
						</p>
					</Card>

					<Card className='text-center p-6 border-0 bg-white/60 backdrop-blur-sm'>
						<div className='w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4'>
							<Zap className='w-6 h-6 text-green-600' />
						</div>
						<h3 className='font-semibold mb-2'>Lightning Fast</h3>
						<p className='text-sm text-gray-600'>
							Instant redirects with 99.9% uptime and global CDN coverage
						</p>
					</Card>
				</div>

				{/* Recent URLs */}
				<Card className='max-w-4xl mx-auto border-0 bg-white/80 backdrop-blur-sm'>
					<CardHeader>
						<div className='flex items-center justify-between'>
							<div>
								<CardTitle className='flex items-center gap-2'>
									<Clock className='w-5 h-5' />
									Recent URLs
								</CardTitle>
								<CardDescription>
									Your recently shortened URLs and their performance
								</CardDescription>
							</div>
							<Button variant='outline' size='sm'>
								View All
							</Button>
						</div>
					</CardHeader>
					<CardContent>
						<div className='space-y-4'>
							{recentUrls.map((item, index) => (
								<div
									key={index}
									className='flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors'
								>
									<div className='flex-1 min-w-0'>
										<div className='flex items-center gap-2 mb-1'>
											<code className='font-mono text-sm font-medium text-blue-600'>
												{item.short}
											</code>
											<Badge variant='secondary' className='text-xs'>
												<TrendingUp className='w-3 h-3 mr-1' />
												{item.clicks} clicks
											</Badge>
										</div>
										<p className='text-sm text-gray-600 truncate'>
											{item.original}
										</p>
										<p className='text-xs text-gray-400 mt-1'>
											Created {item.created}
										</p>
									</div>
									<div className='flex items-center gap-2 ml-4'>
										<Button variant='ghost' size='sm'>
											<Copy className='w-4 h-4' />
										</Button>
										<Button variant='ghost' size='sm'>
											<BarChart3 className='w-4 h-4' />
										</Button>
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			</main>

			{/* Footer */}
			<footer className='border-t bg-white/80 backdrop-blur-sm mt-20'>
				<div className='container mx-auto px-4 py-8'>
					<div className='flex items-center justify-between'>
						<div className='flex items-center gap-2'>
							<div className='w-6 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded flex items-center justify-center'>
								<Link2 className='w-3 h-3 text-white' />
							</div>
							<span className='font-semibold text-gray-900'>better-url</span>
						</div>
						<p className='text-sm text-gray-600'>
							© 2024 better-url. All rights reserved.
						</p>
					</div>
				</div>
			</footer>
		</div>
	)
}
