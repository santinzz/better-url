PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_link` (
	`id` text PRIMARY KEY NOT NULL,
	`url` text NOT NULL,
	`short_url` text NOT NULL,
	`click_count` integer DEFAULT 0 NOT NULL,
	`is_active` integer DEFAULT false NOT NULL,
	`created_at` integer,
	`updated_at` integer,
	`user_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_link`("id", "url", "short_url", "click_count", "is_active", "created_at", "updated_at", "user_id") SELECT "id", "url", "short_url", "click_count", "is_active", "created_at", "updated_at", "user_id" FROM `link`;--> statement-breakpoint
DROP TABLE `link`;--> statement-breakpoint
ALTER TABLE `__new_link` RENAME TO `link`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `short_url_idx` ON `link` (`short_url`);--> statement-breakpoint
CREATE INDEX `user_id_idx` ON `link` (`user_id`);