DROP INDEX "short_url_idx";--> statement-breakpoint
DROP INDEX "user_id_idx";--> statement-breakpoint
DROP INDEX "session_token_unique";--> statement-breakpoint
DROP INDEX "user_email_unique";--> statement-breakpoint
ALTER TABLE `link` ALTER COLUMN "click_count" TO "click_count" integer NOT NULL DEFAULT 0;--> statement-breakpoint
CREATE UNIQUE INDEX `short_url_idx` ON `link` (`short_url`);--> statement-breakpoint
CREATE INDEX `user_id_idx` ON `link` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `session_token_unique` ON `session` (`token`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
ALTER TABLE `link` ALTER COLUMN "is_active" TO "is_active" integer NOT NULL DEFAULT false;