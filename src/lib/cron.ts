import cron from 'node-cron'
import { db } from './db/connection'
import { link } from './db/schema'
import { lt } from 'drizzle-orm'
import { redis } from './db/redis'

cron.schedule('*/1 * * * *', async () => {
  console.log('Uncaching expired links')
	const links = await db
		.update(link)
		.set({
			isActive: false,
		})
		.where(lt(link.expiresAt, new Date()))
    .returning({ shortUrl: link.shortUrl })

  links.forEach(async (link) => {
    await redis.del(`short:${link.shortUrl}`)
  })
})
