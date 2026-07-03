CREATE TABLE `app_users` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`email` varchar(254) NOT NULL,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `app_users_id` PRIMARY KEY(`id`),
	CONSTRAINT `app_users_email` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `export_queue` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`email` varchar(254) NOT NULL,
	`state` varchar(2),
	`zip` varchar(5),
	`delimiter` varchar(1) NOT NULL,
	`enclosure` varchar(1) NOT NULL,
	`status` varchar(20) NOT NULL DEFAULT 'pending',
	`file_name` varchar(255),
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`processed_at` datetime,
	CONSTRAINT `export_queue_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `magic_link_tokens` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`email` varchar(254) NOT NULL,
	`token` varchar(64) NOT NULL,
	`expires_at` datetime NOT NULL,
	`used_at` datetime,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `magic_link_tokens_id` PRIMARY KEY(`id`),
	CONSTRAINT `magic_link_tokens_token` UNIQUE(`token`)
);
--> statement-breakpoint
CREATE INDEX `export_queue_status` ON `export_queue` (`status`);--> statement-breakpoint
CREATE INDEX `export_queue_email` ON `export_queue` (`email`);--> statement-breakpoint
CREATE INDEX `magic_link_tokens_email` ON `magic_link_tokens` (`email`);