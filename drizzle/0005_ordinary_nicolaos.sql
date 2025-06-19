DROP INDEX "short_url_idx";--> statement-breakpoint
DROP INDEX "user_id_idx";--> statement-breakpoint
DROP INDEX "session_token_unique";--> statement-breakpoint
DROP INDEX "user_email_unique";--> statement-breakpoint
ALTER TABLE `link` ALTER COLUMN "created_at" TO "created_at" integer NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `short_url_idx` ON `link` (`short_url`);--> statement-breakpoint
CREATE INDEX `user_id_idx` ON `link` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `session_token_unique` ON `session` (`token`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
ALTER TABLE `link` ALTER COLUMN "updated_at" TO "updated_at" integer NOT NULL;