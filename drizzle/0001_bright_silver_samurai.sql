CREATE TABLE `link` (
	`id` text PRIMARY KEY NOT NULL,
	`url` text NOT NULL,
	`short_url` text NOT NULL,
	`click_count` integer NOT NULL,
	`is_active` integer NOT NULL,
	`created_at` integer,
	`updated_at` integer,
	`user_id` text,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `short_url_idx` ON `link` (`short_url`);--> statement-breakpoint
CREATE INDEX `user_id_idx` ON `link` (`user_id`);