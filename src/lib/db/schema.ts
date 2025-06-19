import { sqliteTable, text, integer, uniqueIndex, index } from 'drizzle-orm/sqlite-core'
import { createSelectSchema } from 'drizzle-zod'
import { z } from 'zod/v4'

export const user = sqliteTable('user', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	email: text('email').notNull().unique(),
	emailVerified: integer('email_verified', { mode: 'boolean' })
		.$defaultFn(() => false)
		.notNull(),
	image: text('image'),
	createdAt: integer('created_at', { mode: 'timestamp' })
		.$defaultFn(() => /* @__PURE__ */ new Date())
		.notNull(),
	updatedAt: integer('updated_at', { mode: 'timestamp' })
		.$defaultFn(() => /* @__PURE__ */ new Date())
		.notNull(),
})

export const userSelectSchema = createSelectSchema(user)
export type User = z.infer<typeof userSelectSchema>

export const session = sqliteTable('session', {
	id: text('id').primaryKey(),
	expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
	token: text('token').notNull().unique(),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
	ipAddress: text('ip_address'),
	userAgent: text('user_agent'),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
})

export const account = sqliteTable('account', {
	id: text('id').primaryKey(),
	accountId: text('account_id').notNull(),
	providerId: text('provider_id').notNull(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	accessToken: text('access_token'),
	refreshToken: text('refresh_token'),
	idToken: text('id_token'),
	accessTokenExpiresAt: integer('access_token_expires_at', {
		mode: 'timestamp',
	}),
	refreshTokenExpiresAt: integer('refresh_token_expires_at', {
		mode: 'timestamp',
	}),
	scope: text('scope'),
	password: text('password'),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
})

export const verification = sqliteTable('verification', {
	id: text('id').primaryKey(),
	identifier: text('identifier').notNull(),
	value: text('value').notNull(),
	expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
	createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(
		() => /* @__PURE__ */ new Date()
	),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(
		() => /* @__PURE__ */ new Date()
	),
})

export const link = sqliteTable('link', {
	id: text('id').primaryKey().$defaultFn(crypto.randomUUID),
	url: text('url').notNull(),
	shortUrl: text('short_url').notNull(),
	clickCount: integer('click_count').notNull().default(0),
	isActive: integer('is_active', { mode: 'boolean' }).notNull().default(false),
	createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => /* @__PURE__ */ new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => /* @__PURE__ */ new Date()),
	userId: text('user_id').references(() => user.id, { onDelete: 'cascade' }).notNull(),
}, (table) => [
	uniqueIndex('short_url_idx').on(table.shortUrl),
	index('user_id_idx').on(table.userId),
])

export const linkSelectSchema = createSelectSchema(link)
export type Link = z.infer<typeof linkSelectSchema>