ALTER TABLE `cache_access_policy` MODIFY COLUMN `expire` bigint NOT NULL;--> statement-breakpoint
ALTER TABLE `cache_access_policy` MODIFY COLUMN `serialized` smallint NOT NULL;--> statement-breakpoint
ALTER TABLE `cache_bootstrap` MODIFY COLUMN `expire` bigint NOT NULL;--> statement-breakpoint
ALTER TABLE `cache_bootstrap` MODIFY COLUMN `serialized` smallint NOT NULL;--> statement-breakpoint
ALTER TABLE `cache_config` MODIFY COLUMN `expire` bigint NOT NULL;--> statement-breakpoint
ALTER TABLE `cache_config` MODIFY COLUMN `serialized` smallint NOT NULL;--> statement-breakpoint
ALTER TABLE `cache_container` MODIFY COLUMN `expire` bigint NOT NULL;--> statement-breakpoint
ALTER TABLE `cache_container` MODIFY COLUMN `serialized` smallint NOT NULL;--> statement-breakpoint
ALTER TABLE `cache_data` MODIFY COLUMN `expire` bigint NOT NULL;--> statement-breakpoint
ALTER TABLE `cache_data` MODIFY COLUMN `serialized` smallint NOT NULL;--> statement-breakpoint
ALTER TABLE `cache_default` MODIFY COLUMN `expire` bigint NOT NULL;--> statement-breakpoint
ALTER TABLE `cache_default` MODIFY COLUMN `serialized` smallint NOT NULL;--> statement-breakpoint
ALTER TABLE `cache_discovery` MODIFY COLUMN `expire` bigint NOT NULL;--> statement-breakpoint
ALTER TABLE `cache_discovery` MODIFY COLUMN `serialized` smallint NOT NULL;--> statement-breakpoint
ALTER TABLE `cache_dynamic_page_cache` MODIFY COLUMN `expire` bigint NOT NULL;--> statement-breakpoint
ALTER TABLE `cache_dynamic_page_cache` MODIFY COLUMN `serialized` smallint NOT NULL;--> statement-breakpoint
ALTER TABLE `cache_entity` MODIFY COLUMN `expire` bigint NOT NULL;--> statement-breakpoint
ALTER TABLE `cache_entity` MODIFY COLUMN `serialized` smallint NOT NULL;--> statement-breakpoint
ALTER TABLE `cache_menu` MODIFY COLUMN `expire` bigint NOT NULL;--> statement-breakpoint
ALTER TABLE `cache_menu` MODIFY COLUMN `serialized` smallint NOT NULL;--> statement-breakpoint
ALTER TABLE `cache_page` MODIFY COLUMN `expire` bigint NOT NULL;--> statement-breakpoint
ALTER TABLE `cache_page` MODIFY COLUMN `serialized` smallint NOT NULL;--> statement-breakpoint
ALTER TABLE `cache_render` MODIFY COLUMN `expire` bigint NOT NULL;--> statement-breakpoint
ALTER TABLE `cache_render` MODIFY COLUMN `serialized` smallint NOT NULL;--> statement-breakpoint
ALTER TABLE `cache_toolbar` MODIFY COLUMN `expire` bigint NOT NULL;--> statement-breakpoint
ALTER TABLE `cache_toolbar` MODIFY COLUMN `serialized` smallint NOT NULL;--> statement-breakpoint
ALTER TABLE `comment_entity_statistics` MODIFY COLUMN `last_comment_timestamp` bigint NOT NULL;--> statement-breakpoint
ALTER TABLE `flood` MODIFY COLUMN `timestamp` bigint NOT NULL;--> statement-breakpoint
ALTER TABLE `flood` MODIFY COLUMN `expiration` bigint NOT NULL;--> statement-breakpoint
ALTER TABLE `history` MODIFY COLUMN `timestamp` bigint NOT NULL;--> statement-breakpoint
ALTER TABLE `menu_tree` MODIFY COLUMN `discovered` smallint NOT NULL;--> statement-breakpoint
ALTER TABLE `menu_tree` MODIFY COLUMN `expanded` smallint NOT NULL;--> statement-breakpoint
ALTER TABLE `menu_tree` MODIFY COLUMN `has_children` smallint NOT NULL;--> statement-breakpoint
ALTER TABLE `menu_tree` MODIFY COLUMN `depth` smallint NOT NULL;--> statement-breakpoint
ALTER TABLE `queue` MODIFY COLUMN `expire` bigint NOT NULL;--> statement-breakpoint
ALTER TABLE `queue` MODIFY COLUMN `created` bigint NOT NULL;--> statement-breakpoint
ALTER TABLE `router` MODIFY COLUMN `number_parts` smallint NOT NULL;--> statement-breakpoint
ALTER TABLE `sessions` MODIFY COLUMN `timestamp` bigint NOT NULL;--> statement-breakpoint
ALTER TABLE `watchdog` MODIFY COLUMN `timestamp` bigint NOT NULL;--> statement-breakpoint
ALTER TABLE `batch` DROP COLUMN `batch`;--> statement-breakpoint
ALTER TABLE `cache_access_policy` DROP COLUMN `data`;--> statement-breakpoint
ALTER TABLE `cache_bootstrap` DROP COLUMN `data`;--> statement-breakpoint
ALTER TABLE `cache_config` DROP COLUMN `data`;--> statement-breakpoint
ALTER TABLE `cache_container` DROP COLUMN `data`;--> statement-breakpoint
ALTER TABLE `cache_data` DROP COLUMN `data`;--> statement-breakpoint
ALTER TABLE `cache_default` DROP COLUMN `data`;--> statement-breakpoint
ALTER TABLE `cache_discovery` DROP COLUMN `data`;--> statement-breakpoint
ALTER TABLE `cache_dynamic_page_cache` DROP COLUMN `data`;--> statement-breakpoint
ALTER TABLE `cache_entity` DROP COLUMN `data`;--> statement-breakpoint
ALTER TABLE `cache_menu` DROP COLUMN `data`;--> statement-breakpoint
ALTER TABLE `cache_page` DROP COLUMN `data`;--> statement-breakpoint
ALTER TABLE `cache_render` DROP COLUMN `data`;--> statement-breakpoint
ALTER TABLE `cache_toolbar` DROP COLUMN `data`;--> statement-breakpoint
ALTER TABLE `config` DROP COLUMN `data`;--> statement-breakpoint
ALTER TABLE `config_export` DROP COLUMN `data`;--> statement-breakpoint
ALTER TABLE `config_import` DROP COLUMN `data`;--> statement-breakpoint
ALTER TABLE `config_snapshot` DROP COLUMN `data`;--> statement-breakpoint
ALTER TABLE `key_value` DROP COLUMN `value`;--> statement-breakpoint
ALTER TABLE `key_value_expire` DROP COLUMN `value`;--> statement-breakpoint
ALTER TABLE `menu_link_content_data` DROP COLUMN `link__options`;--> statement-breakpoint
ALTER TABLE `menu_link_content_field_revision` DROP COLUMN `link__options`;--> statement-breakpoint
ALTER TABLE `menu_tree` DROP COLUMN `route_parameters`;--> statement-breakpoint
ALTER TABLE `menu_tree` DROP COLUMN `title`;--> statement-breakpoint
ALTER TABLE `menu_tree` DROP COLUMN `description`;--> statement-breakpoint
ALTER TABLE `menu_tree` DROP COLUMN `options`;--> statement-breakpoint
ALTER TABLE `menu_tree` DROP COLUMN `metadata`;--> statement-breakpoint
ALTER TABLE `queue` DROP COLUMN `data`;--> statement-breakpoint
ALTER TABLE `redirect` DROP COLUMN `redirect_source__query`;--> statement-breakpoint
ALTER TABLE `redirect` DROP COLUMN `redirect_redirect__options`;--> statement-breakpoint
ALTER TABLE `router` DROP COLUMN `route`;--> statement-breakpoint
ALTER TABLE `sessions` DROP COLUMN `session`;--> statement-breakpoint
ALTER TABLE `shortcut_field_data` DROP COLUMN `link__options`;--> statement-breakpoint
ALTER TABLE `users_data` DROP COLUMN `value`;--> statement-breakpoint
ALTER TABLE `watchdog` DROP COLUMN `variables`;