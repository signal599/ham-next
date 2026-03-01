-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE `batch` (
	`bid` int unsigned AUTO_INCREMENT NOT NULL,
	`token` varchar(64) NOT NULL,
	`timestamp` int NOT NULL,
	`batch` longblob,
	CONSTRAINT `batch_bid` PRIMARY KEY(`bid`)
);
--> statement-breakpoint
CREATE TABLE `block_content` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`revision_id` int unsigned,
	`type` varchar(32) NOT NULL,
	`uuid` varchar(128) NOT NULL,
	`langcode` varchar(12) NOT NULL,
	CONSTRAINT `block_content_id` PRIMARY KEY(`id`),
	CONSTRAINT `block_content__revision_id` UNIQUE(`revision_id`),
	CONSTRAINT `block_content_field__uuid__value` UNIQUE(`uuid`)
);
--> statement-breakpoint
CREATE TABLE `block_content__body` (
	`bundle` varchar(128) NOT NULL DEFAULT '',
	`deleted` tinyint NOT NULL DEFAULT 0,
	`entity_id` int unsigned NOT NULL,
	`revision_id` int unsigned NOT NULL,
	`langcode` varchar(32) NOT NULL DEFAULT '',
	`delta` int unsigned NOT NULL,
	`body_value` longtext NOT NULL,
	`body_summary` longtext,
	`body_format` varchar(255),
	CONSTRAINT `block_content__body_entity_id_deleted_delta_langcode` PRIMARY KEY(`entity_id`,`deleted`,`delta`,`langcode`)
);
--> statement-breakpoint
CREATE TABLE `block_content_field_data` (
	`id` int unsigned NOT NULL,
	`revision_id` int unsigned NOT NULL,
	`type` varchar(32) NOT NULL,
	`langcode` varchar(12) NOT NULL,
	`status` tinyint NOT NULL,
	`info` varchar(255),
	`changed` int,
	`reusable` tinyint,
	`default_langcode` tinyint NOT NULL,
	`revision_translation_affected` tinyint,
	CONSTRAINT `block_content_field_data_id_langcode` PRIMARY KEY(`id`,`langcode`)
);
--> statement-breakpoint
CREATE TABLE `block_content_field_revision` (
	`id` int unsigned NOT NULL,
	`revision_id` int unsigned NOT NULL,
	`langcode` varchar(12) NOT NULL,
	`status` tinyint NOT NULL,
	`info` varchar(255),
	`changed` int,
	`default_langcode` tinyint NOT NULL,
	`revision_translation_affected` tinyint,
	CONSTRAINT `block_content_field_revision_revision_id_langcode` PRIMARY KEY(`revision_id`,`langcode`)
);
--> statement-breakpoint
CREATE TABLE `block_content_revision` (
	`id` int unsigned NOT NULL,
	`revision_id` int unsigned AUTO_INCREMENT NOT NULL,
	`langcode` varchar(12) NOT NULL,
	`revision_user` int unsigned,
	`revision_created` int,
	`revision_log` longtext,
	`revision_default` tinyint,
	CONSTRAINT `block_content_revision_revision_id` PRIMARY KEY(`revision_id`)
);
--> statement-breakpoint
CREATE TABLE `block_content_revision__body` (
	`bundle` varchar(128) NOT NULL DEFAULT '',
	`deleted` tinyint NOT NULL DEFAULT 0,
	`entity_id` int unsigned NOT NULL,
	`revision_id` int unsigned NOT NULL,
	`langcode` varchar(32) NOT NULL DEFAULT '',
	`delta` int unsigned NOT NULL,
	`body_value` longtext NOT NULL,
	`body_summary` longtext,
	`body_format` varchar(255),
	CONSTRAINT `block_content_revision__body_entity_id_revision_id_deleted_delta_langcode` PRIMARY KEY(`entity_id`,`revision_id`,`deleted`,`delta`,`langcode`)
);
--> statement-breakpoint
CREATE TABLE `cache_access_policy` (
	`cid` varchar(255) NOT NULL DEFAULT '',
	`data` longblob,
	`expire` bigint NOT NULL DEFAULT 0,
	`created` decimal(14,3) NOT NULL DEFAULT '0.000',
	`serialized` smallint NOT NULL DEFAULT 0,
	`tags` longtext,
	`checksum` varchar(255) NOT NULL,
	CONSTRAINT `cache_access_policy_cid` PRIMARY KEY(`cid`)
);
--> statement-breakpoint
CREATE TABLE `cache_bootstrap` (
	`cid` varchar(255) NOT NULL DEFAULT '',
	`data` longblob,
	`expire` bigint NOT NULL DEFAULT 0,
	`created` decimal(14,3) NOT NULL DEFAULT '0.000',
	`serialized` smallint NOT NULL DEFAULT 0,
	`tags` longtext,
	`checksum` varchar(255) NOT NULL,
	CONSTRAINT `cache_bootstrap_cid` PRIMARY KEY(`cid`)
);
--> statement-breakpoint
CREATE TABLE `cache_config` (
	`cid` varchar(255) NOT NULL DEFAULT '',
	`data` longblob,
	`expire` bigint NOT NULL DEFAULT 0,
	`created` decimal(14,3) NOT NULL DEFAULT '0.000',
	`serialized` smallint NOT NULL DEFAULT 0,
	`tags` longtext,
	`checksum` varchar(255) NOT NULL,
	CONSTRAINT `cache_config_cid` PRIMARY KEY(`cid`)
);
--> statement-breakpoint
CREATE TABLE `cache_container` (
	`cid` varchar(255) NOT NULL DEFAULT '',
	`data` longblob,
	`expire` bigint NOT NULL DEFAULT 0,
	`created` decimal(14,3) NOT NULL DEFAULT '0.000',
	`serialized` smallint NOT NULL DEFAULT 0,
	`tags` longtext,
	`checksum` varchar(255) NOT NULL,
	CONSTRAINT `cache_container_cid` PRIMARY KEY(`cid`)
);
--> statement-breakpoint
CREATE TABLE `cache_data` (
	`cid` varchar(255) NOT NULL DEFAULT '',
	`data` longblob,
	`expire` bigint NOT NULL DEFAULT 0,
	`created` decimal(14,3) NOT NULL DEFAULT '0.000',
	`serialized` smallint NOT NULL DEFAULT 0,
	`tags` longtext,
	`checksum` varchar(255) NOT NULL,
	CONSTRAINT `cache_data_cid` PRIMARY KEY(`cid`)
);
--> statement-breakpoint
CREATE TABLE `cache_default` (
	`cid` varchar(255) NOT NULL DEFAULT '',
	`data` longblob,
	`expire` bigint NOT NULL DEFAULT 0,
	`created` decimal(14,3) NOT NULL DEFAULT '0.000',
	`serialized` smallint NOT NULL DEFAULT 0,
	`tags` longtext,
	`checksum` varchar(255) NOT NULL,
	CONSTRAINT `cache_default_cid` PRIMARY KEY(`cid`)
);
--> statement-breakpoint
CREATE TABLE `cache_discovery` (
	`cid` varchar(255) NOT NULL DEFAULT '',
	`data` longblob,
	`expire` bigint NOT NULL DEFAULT 0,
	`created` decimal(14,3) NOT NULL DEFAULT '0.000',
	`serialized` smallint NOT NULL DEFAULT 0,
	`tags` longtext,
	`checksum` varchar(255) NOT NULL,
	CONSTRAINT `cache_discovery_cid` PRIMARY KEY(`cid`)
);
--> statement-breakpoint
CREATE TABLE `cache_dynamic_page_cache` (
	`cid` varchar(255) NOT NULL DEFAULT '',
	`data` longblob,
	`expire` bigint NOT NULL DEFAULT 0,
	`created` decimal(14,3) NOT NULL DEFAULT '0.000',
	`serialized` smallint NOT NULL DEFAULT 0,
	`tags` longtext,
	`checksum` varchar(255) NOT NULL,
	CONSTRAINT `cache_dynamic_page_cache_cid` PRIMARY KEY(`cid`)
);
--> statement-breakpoint
CREATE TABLE `cache_entity` (
	`cid` varchar(255) NOT NULL DEFAULT '',
	`data` longblob,
	`expire` bigint NOT NULL DEFAULT 0,
	`created` decimal(14,3) NOT NULL DEFAULT '0.000',
	`serialized` smallint NOT NULL DEFAULT 0,
	`tags` longtext,
	`checksum` varchar(255) NOT NULL,
	CONSTRAINT `cache_entity_cid` PRIMARY KEY(`cid`)
);
--> statement-breakpoint
CREATE TABLE `cache_menu` (
	`cid` varchar(255) NOT NULL DEFAULT '',
	`data` longblob,
	`expire` bigint NOT NULL DEFAULT 0,
	`created` decimal(14,3) NOT NULL DEFAULT '0.000',
	`serialized` smallint NOT NULL DEFAULT 0,
	`tags` longtext,
	`checksum` varchar(255) NOT NULL,
	CONSTRAINT `cache_menu_cid` PRIMARY KEY(`cid`)
);
--> statement-breakpoint
CREATE TABLE `cache_page` (
	`cid` varchar(255) NOT NULL DEFAULT '',
	`data` longblob,
	`expire` bigint NOT NULL DEFAULT 0,
	`created` decimal(14,3) NOT NULL DEFAULT '0.000',
	`serialized` smallint NOT NULL DEFAULT 0,
	`tags` longtext,
	`checksum` varchar(255) NOT NULL,
	CONSTRAINT `cache_page_cid` PRIMARY KEY(`cid`)
);
--> statement-breakpoint
CREATE TABLE `cache_render` (
	`cid` varchar(255) NOT NULL DEFAULT '',
	`data` longblob,
	`expire` bigint NOT NULL DEFAULT 0,
	`created` decimal(14,3) NOT NULL DEFAULT '0.000',
	`serialized` smallint NOT NULL DEFAULT 0,
	`tags` longtext,
	`checksum` varchar(255) NOT NULL,
	CONSTRAINT `cache_render_cid` PRIMARY KEY(`cid`)
);
--> statement-breakpoint
CREATE TABLE `cache_toolbar` (
	`cid` varchar(255) NOT NULL DEFAULT '',
	`data` longblob,
	`expire` bigint NOT NULL DEFAULT 0,
	`created` decimal(14,3) NOT NULL DEFAULT '0.000',
	`serialized` smallint NOT NULL DEFAULT 0,
	`tags` longtext,
	`checksum` varchar(255) NOT NULL,
	CONSTRAINT `cache_toolbar_cid` PRIMARY KEY(`cid`)
);
--> statement-breakpoint
CREATE TABLE `cachetags` (
	`tag` varchar(255) NOT NULL DEFAULT '',
	`invalidations` int NOT NULL DEFAULT 0,
	CONSTRAINT `cachetags_tag` PRIMARY KEY(`tag`)
);
--> statement-breakpoint
CREATE TABLE `comment` (
	`cid` int unsigned AUTO_INCREMENT NOT NULL,
	`comment_type` varchar(32) NOT NULL,
	`uuid` varchar(128) NOT NULL,
	`langcode` varchar(12) NOT NULL,
	CONSTRAINT `comment_cid` PRIMARY KEY(`cid`),
	CONSTRAINT `comment_field__uuid__value` UNIQUE(`uuid`)
);
--> statement-breakpoint
CREATE TABLE `comment__comment_body` (
	`bundle` varchar(128) NOT NULL DEFAULT '',
	`deleted` tinyint NOT NULL DEFAULT 0,
	`entity_id` int unsigned NOT NULL,
	`revision_id` int unsigned NOT NULL,
	`langcode` varchar(32) NOT NULL DEFAULT '',
	`delta` int unsigned NOT NULL,
	`comment_body_value` longtext NOT NULL,
	`comment_body_format` varchar(255),
	CONSTRAINT `comment__comment_body_entity_id_deleted_delta_langcode` PRIMARY KEY(`entity_id`,`deleted`,`delta`,`langcode`)
);
--> statement-breakpoint
CREATE TABLE `comment_entity_statistics` (
	`entity_id` int unsigned NOT NULL DEFAULT 0,
	`entity_type` varchar(32) NOT NULL DEFAULT 'node',
	`field_name` varchar(32) NOT NULL DEFAULT '',
	`cid` int NOT NULL DEFAULT 0,
	`last_comment_timestamp` bigint NOT NULL DEFAULT 0,
	`last_comment_name` varchar(60),
	`last_comment_uid` int unsigned NOT NULL DEFAULT 0,
	`comment_count` int unsigned NOT NULL DEFAULT 0,
	CONSTRAINT `comment_entity_statistics_entity_id_entity_type_field_name` PRIMARY KEY(`entity_id`,`entity_type`,`field_name`)
);
--> statement-breakpoint
CREATE TABLE `comment_field_data` (
	`cid` int unsigned NOT NULL,
	`comment_type` varchar(32) NOT NULL,
	`langcode` varchar(12) NOT NULL,
	`status` tinyint NOT NULL,
	`uid` int unsigned NOT NULL,
	`pid` int unsigned,
	`entity_id` int unsigned,
	`subject` varchar(64),
	`name` varchar(60),
	`mail` varchar(254),
	`homepage` varchar(255),
	`hostname` varchar(128),
	`created` int NOT NULL,
	`changed` int,
	`thread` varchar(255) NOT NULL,
	`entity_type` varchar(32) NOT NULL,
	`field_name` varchar(32) NOT NULL,
	`default_langcode` tinyint NOT NULL,
	CONSTRAINT `comment_field_data_cid_langcode` PRIMARY KEY(`cid`,`langcode`)
);
--> statement-breakpoint
CREATE TABLE `config` (
	`collection` varchar(255) NOT NULL DEFAULT '',
	`name` varchar(255) NOT NULL DEFAULT '',
	`data` longblob,
	CONSTRAINT `config_collection_name` PRIMARY KEY(`collection`,`name`)
);
--> statement-breakpoint
CREATE TABLE `config_export` (
	`collection` varchar(255) NOT NULL DEFAULT '',
	`name` varchar(255) NOT NULL DEFAULT '',
	`data` longblob,
	CONSTRAINT `config_export_collection_name` PRIMARY KEY(`collection`,`name`)
);
--> statement-breakpoint
CREATE TABLE `config_import` (
	`collection` varchar(255) NOT NULL DEFAULT '',
	`name` varchar(255) NOT NULL DEFAULT '',
	`data` longblob,
	CONSTRAINT `config_import_collection_name` PRIMARY KEY(`collection`,`name`)
);
--> statement-breakpoint
CREATE TABLE `config_snapshot` (
	`collection` varchar(255) NOT NULL DEFAULT '',
	`name` varchar(255) NOT NULL DEFAULT '',
	`data` longblob,
	CONSTRAINT `config_snapshot_collection_name` PRIMARY KEY(`collection`,`name`)
);
--> statement-breakpoint
CREATE TABLE `fcc_license_am` (
	`record_type` char(2) NOT NULL,
	`unique_system_identifier` decimal(9,0) NOT NULL,
	`uls_file_num` char(14),
	`ebf_number` varchar(30),
	`callsign` char(10),
	`operator_class` char(1),
	`group_code` char(1),
	`region_code` tinyint,
	`trustee_callsign` char(10),
	`trustee_indicator` char(1),
	`physician_certification` char(1),
	`ve_signature` char(1),
	`systematic_callsign_change` char(1),
	`vanity_callsign_change` char(1),
	`vanity_relationship` char(12),
	`previous_callsign` char(10),
	`previous_operator_class` char(1),
	`trustee_name` varchar(50),
	`row_hash` varchar(40),
	CONSTRAINT `fcc_license_am_unique_system_identifier` PRIMARY KEY(`unique_system_identifier`)
);
--> statement-breakpoint
CREATE TABLE `fcc_license_en` (
	`record_type` char(2) NOT NULL,
	`unique_system_identifier` decimal(9,0) NOT NULL,
	`uls_file_number` char(14),
	`ebf_number` varchar(30),
	`call_sign` char(10),
	`entity_type` char(2),
	`licensee_id` char(9),
	`entity_name` varchar(200),
	`first_name` varchar(20),
	`mi` char(1),
	`last_name` varchar(20),
	`suffix` char(3),
	`phone` char(10),
	`fax` char(10),
	`email` varchar(50),
	`street_address` varchar(82),
	`city` varchar(20),
	`state` char(2),
	`zip_code` char(10),
	`po_box` varchar(20),
	`attention_line` varchar(35),
	`sgin` char(3),
	`frn` char(10),
	`applicant_type_code` char(1),
	`applicant_type_other` char(40),
	`status_code` char(1),
	`status_date` char(10),
	`row_hash` varchar(40),
	`address_hash` varchar(40),
	CONSTRAINT `fcc_license_en_unique_system_identifier` PRIMARY KEY(`unique_system_identifier`)
);
--> statement-breakpoint
CREATE TABLE `fcc_license_hd` (
	`record_type` char(2) NOT NULL,
	`unique_system_identifier` decimal(9,0) NOT NULL,
	`uls_file_number` char(14),
	`ebf_number` varchar(30),
	`call_sign` char(10),
	`license_status` char(1),
	`radio_service_code` char(2),
	`grant_date` char(10),
	`expired_date` char(10),
	`cancellation_date` char(10),
	`eligibility_rule_num` char(10),
	`applicant_type_code_reserved` char(1),
	`alien` char(1),
	`alien_government` char(1),
	`alien_corporation` char(1),
	`alien_officer` char(1),
	`alien_control` char(1),
	`revoked` char(1),
	`convicted` char(1),
	`adjudged` char(1),
	`involved_reserved` char(1),
	`common_carrier` char(1),
	`non_common_carrier` char(1),
	`private_comm` char(1),
	`fixed` char(1),
	`mobile` char(1),
	`radiolocation` char(1),
	`satellite` char(1),
	`developmental_or_sta` char(1),
	`interconnected_service` char(1),
	`certifier_first_name` varchar(20),
	`certifier_mi` char(1),
	`certifier_last_name` varchar(20),
	`certifier_suffix` char(3),
	`certifier_title` char(40),
	`gender` char(1),
	`african_american` char(1),
	`native_american` char(1),
	`hawaiian` char(1),
	`asian` char(1),
	`white` char(1),
	`ethnicity` char(1),
	`effective_date` char(10),
	`last_action_date` char(10),
	`auction_id` int,
	`reg_stat_broad_serv` char(1),
	`band_manager` char(1),
	`type_serv_broad_serv` char(1),
	`alien_ruling` char(1),
	`licensee_name_change` char(1),
	`row_hash` varchar(40),
	`total_hash` varchar(40),
	CONSTRAINT `fcc_license_hd_unique_system_identifier` PRIMARY KEY(`unique_system_identifier`)
);
--> statement-breakpoint
CREATE TABLE `file_managed` (
	`fid` int unsigned AUTO_INCREMENT NOT NULL,
	`uuid` varchar(128) NOT NULL,
	`langcode` varchar(12) NOT NULL,
	`uid` int unsigned,
	`filename` varchar(255),
	`uri` varchar(255) NOT NULL,
	`filemime` varchar(255),
	`filesize` bigint unsigned,
	`status` tinyint NOT NULL,
	`created` int,
	`changed` int NOT NULL,
	CONSTRAINT `file_managed_fid` PRIMARY KEY(`fid`),
	CONSTRAINT `file_field__uuid__value` UNIQUE(`uuid`)
);
--> statement-breakpoint
CREATE TABLE `file_usage` (
	`fid` int unsigned NOT NULL,
	`module` varchar(50) NOT NULL DEFAULT '',
	`type` varchar(64) NOT NULL DEFAULT '',
	`id` varchar(64) NOT NULL DEFAULT '0',
	`count` int unsigned NOT NULL DEFAULT 0,
	CONSTRAINT `file_usage_fid_type_id_module` PRIMARY KEY(`fid`,`type`,`id`,`module`)
);
--> statement-breakpoint
CREATE TABLE `flood` (
	`fid` int AUTO_INCREMENT NOT NULL,
	`event` varchar(64) NOT NULL DEFAULT '',
	`identifier` varchar(128) NOT NULL DEFAULT '',
	`timestamp` bigint NOT NULL DEFAULT 0,
	`expiration` bigint NOT NULL DEFAULT 0,
	CONSTRAINT `flood_fid` PRIMARY KEY(`fid`)
);
--> statement-breakpoint
CREATE TABLE `ham_address` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`uuid` varchar(128) NOT NULL,
	`langcode` varchar(12) NOT NULL,
	`hash` varchar(40),
	`address__langcode` varchar(32),
	`address__country_code` varchar(2),
	`address__administrative_area` varchar(255),
	`address__locality` varchar(255),
	`address__dependent_locality` varchar(255),
	`address__postal_code` varchar(255),
	`address__sorting_code` varchar(255),
	`address__address_line1` varchar(255),
	`address__address_line2` varchar(255),
	`address__address_line3` varchar(255),
	`address__organization` varchar(255),
	`address__given_name` varchar(255),
	`address__additional_name` varchar(255),
	`address__family_name` varchar(255),
	`geocode_provider` varchar(2),
	`geocode_status` int,
	`geocode_response` longtext,
	`location_id` int unsigned,
	`osm_geocode_status` int,
	`osm_geocode_response` longtext,
	`osm_latitude` decimal(10,7),
	`osm_longitude` decimal(10,7),
	`user_id` int unsigned NOT NULL,
	`status` tinyint NOT NULL,
	`created` int,
	`changed` int,
	`geocode_time` int,
	`geocode_priority` int,
	CONSTRAINT `ham_address_id` PRIMARY KEY(`id`),
	CONSTRAINT `ham_address_field__hash` UNIQUE(`hash`),
	CONSTRAINT `ham_address_field__uuid__value` UNIQUE(`uuid`)
);
--> statement-breakpoint
CREATE TABLE `ham_location` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`uuid` varchar(128) NOT NULL,
	`langcode` varchar(12) NOT NULL,
	`user_id` int unsigned NOT NULL,
	`latitude` decimal(10,7),
	`longitude` decimal(10,7),
	`status` tinyint NOT NULL,
	`created` int,
	`changed` int,
	CONSTRAINT `ham_location_id` PRIMARY KEY(`id`),
	CONSTRAINT `ham_location__latlng` UNIQUE(`latitude`,`longitude`),
	CONSTRAINT `ham_location_field__uuid__value` UNIQUE(`uuid`)
);
--> statement-breakpoint
CREATE TABLE `ham_station` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`uuid` varchar(128) NOT NULL,
	`langcode` varchar(12) NOT NULL,
	`callsign` varchar(20) NOT NULL,
	`first_name` varchar(255),
	`middle_name` varchar(255),
	`last_name` varchar(255),
	`suffix` varchar(3),
	`organization` varchar(255),
	`operator_class` varchar(1),
	`previous_callsign` varchar(20),
	`total_hash` varchar(40),
	`address_hash` varchar(40) NOT NULL,
	`user_id` int unsigned NOT NULL,
	`status` tinyint NOT NULL,
	`created` int,
	`changed` int,
	CONSTRAINT `ham_station_id` PRIMARY KEY(`id`),
	CONSTRAINT `ham_station_field__uuid__value` UNIQUE(`uuid`)
);
--> statement-breakpoint
CREATE TABLE `ham_station_export` (
	`batch_uuid` varchar(255) NOT NULL,
	`id` int unsigned NOT NULL,
	`callsign` varchar(255),
	`first_name` varchar(255),
	`last_name` varchar(255),
	`address` varchar(255),
	`city` varchar(255),
	`state` varchar(2),
	`zip` varchar(10),
	`operator_class` varchar(1),
	`is_club` tinyint unsigned,
	`latitude` decimal(10,7),
	`longitude` decimal(10,7),
	`timestamp` int unsigned NOT NULL,
	CONSTRAINT `ham_station_export_batch_uuid_id` PRIMARY KEY(`batch_uuid`,`id`)
);
--> statement-breakpoint
CREATE TABLE `ham_station_sort` (
	`batch_uuid` varchar(255) NOT NULL,
	`id` int unsigned NOT NULL,
	`sort_order` int unsigned,
	CONSTRAINT `ham_station_sort_batch_uuid_id` PRIMARY KEY(`batch_uuid`,`id`),
	CONSTRAINT `sort_order` UNIQUE(`batch_uuid`,`sort_order`)
);
--> statement-breakpoint
CREATE TABLE `help_search_items` (
	`sid` int unsigned AUTO_INCREMENT NOT NULL,
	`section_plugin_id` varchar(255) NOT NULL DEFAULT '',
	`permission` varchar(255) NOT NULL DEFAULT '',
	`topic_id` varchar(255) NOT NULL DEFAULT '',
	CONSTRAINT `help_search_items_sid` PRIMARY KEY(`sid`)
);
--> statement-breakpoint
CREATE TABLE `history` (
	`uid` int NOT NULL DEFAULT 0,
	`nid` int unsigned NOT NULL DEFAULT 0,
	`timestamp` bigint NOT NULL DEFAULT 0,
	CONSTRAINT `history_uid_nid` PRIMARY KEY(`uid`,`nid`)
);
--> statement-breakpoint
CREATE TABLE `key_value` (
	`collection` varchar(128) NOT NULL DEFAULT '',
	`name` varchar(128) NOT NULL DEFAULT '',
	`value` longblob NOT NULL,
	CONSTRAINT `key_value_collection_name` PRIMARY KEY(`collection`,`name`)
);
--> statement-breakpoint
CREATE TABLE `key_value_expire` (
	`collection` varchar(128) NOT NULL DEFAULT '',
	`name` varchar(128) NOT NULL DEFAULT '',
	`value` longblob NOT NULL,
	`expire` int NOT NULL DEFAULT 2147483647,
	CONSTRAINT `key_value_expire_collection_name` PRIMARY KEY(`collection`,`name`)
);
--> statement-breakpoint
CREATE TABLE `menu_link_content` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`revision_id` int unsigned,
	`bundle` varchar(32) NOT NULL,
	`uuid` varchar(128) NOT NULL,
	`langcode` varchar(12) NOT NULL,
	CONSTRAINT `menu_link_content_id` PRIMARY KEY(`id`),
	CONSTRAINT `menu_link_content__revision_id` UNIQUE(`revision_id`),
	CONSTRAINT `menu_link_content_field__uuid__value` UNIQUE(`uuid`)
);
--> statement-breakpoint
CREATE TABLE `menu_link_content_data` (
	`id` int unsigned NOT NULL,
	`revision_id` int unsigned NOT NULL,
	`bundle` varchar(32) NOT NULL,
	`langcode` varchar(12) NOT NULL,
	`enabled` tinyint NOT NULL,
	`title` varchar(255),
	`description` varchar(255),
	`menu_name` varchar(255),
	`link__uri` varchar(2048),
	`link__title` varchar(255),
	`link__options` longblob,
	`external` tinyint,
	`rediscover` tinyint,
	`weight` int,
	`expanded` tinyint,
	`parent` varchar(255),
	`changed` int,
	`default_langcode` tinyint NOT NULL,
	`revision_translation_affected` tinyint,
	CONSTRAINT `menu_link_content_data_id_langcode` PRIMARY KEY(`id`,`langcode`)
);
--> statement-breakpoint
CREATE TABLE `menu_link_content_field_revision` (
	`id` int unsigned NOT NULL,
	`revision_id` int unsigned NOT NULL,
	`langcode` varchar(12) NOT NULL,
	`enabled` tinyint NOT NULL,
	`title` varchar(255),
	`description` varchar(255),
	`link__uri` varchar(2048),
	`link__title` varchar(255),
	`link__options` longblob,
	`external` tinyint,
	`changed` int,
	`default_langcode` tinyint NOT NULL,
	`revision_translation_affected` tinyint,
	CONSTRAINT `menu_link_content_field_revision_revision_id_langcode` PRIMARY KEY(`revision_id`,`langcode`)
);
--> statement-breakpoint
CREATE TABLE `menu_link_content_revision` (
	`id` int unsigned NOT NULL,
	`revision_id` int unsigned AUTO_INCREMENT NOT NULL,
	`langcode` varchar(12) NOT NULL,
	`revision_user` int unsigned,
	`revision_created` int,
	`revision_log_message` longtext,
	`revision_default` tinyint,
	CONSTRAINT `menu_link_content_revision_revision_id` PRIMARY KEY(`revision_id`)
);
--> statement-breakpoint
CREATE TABLE `menu_tree` (
	`menu_name` varchar(32) NOT NULL DEFAULT '',
	`mlid` int unsigned AUTO_INCREMENT NOT NULL,
	`id` varchar(255) NOT NULL,
	`parent` varchar(255) NOT NULL DEFAULT '',
	`route_name` varchar(255),
	`route_param_key` varchar(2048),
	`route_parameters` longblob,
	`url` varchar(2048) NOT NULL DEFAULT '',
	`title` longblob,
	`description` longblob,
	`class` text,
	`options` longblob,
	`provider` varchar(50) NOT NULL DEFAULT 'system',
	`enabled` smallint NOT NULL DEFAULT 1,
	`discovered` smallint NOT NULL DEFAULT 0,
	`expanded` smallint NOT NULL DEFAULT 0,
	`weight` int NOT NULL DEFAULT 0,
	`metadata` longblob,
	`has_children` smallint NOT NULL DEFAULT 0,
	`depth` smallint NOT NULL DEFAULT 0,
	`p1` int unsigned NOT NULL DEFAULT 0,
	`p2` int unsigned NOT NULL DEFAULT 0,
	`p3` int unsigned NOT NULL DEFAULT 0,
	`p4` int unsigned NOT NULL DEFAULT 0,
	`p5` int unsigned NOT NULL DEFAULT 0,
	`p6` int unsigned NOT NULL DEFAULT 0,
	`p7` int unsigned NOT NULL DEFAULT 0,
	`p8` int unsigned NOT NULL DEFAULT 0,
	`p9` int unsigned NOT NULL DEFAULT 0,
	`form_class` varchar(255),
	CONSTRAINT `menu_tree_mlid` PRIMARY KEY(`mlid`),
	CONSTRAINT `id` UNIQUE(`id`)
);
--> statement-breakpoint
CREATE TABLE `node` (
	`nid` int unsigned AUTO_INCREMENT NOT NULL,
	`vid` int unsigned,
	`type` varchar(32) NOT NULL,
	`uuid` varchar(128) NOT NULL,
	`langcode` varchar(12) NOT NULL,
	CONSTRAINT `node_nid` PRIMARY KEY(`nid`),
	CONSTRAINT `node__vid` UNIQUE(`vid`),
	CONSTRAINT `node_field__uuid__value` UNIQUE(`uuid`)
);
--> statement-breakpoint
CREATE TABLE `node__body` (
	`bundle` varchar(128) NOT NULL DEFAULT '',
	`deleted` tinyint NOT NULL DEFAULT 0,
	`entity_id` int unsigned NOT NULL,
	`revision_id` int unsigned NOT NULL,
	`langcode` varchar(32) NOT NULL DEFAULT '',
	`delta` int unsigned NOT NULL,
	`body_value` longtext NOT NULL,
	`body_summary` longtext,
	`body_format` varchar(255),
	CONSTRAINT `node__body_entity_id_deleted_delta_langcode` PRIMARY KEY(`entity_id`,`deleted`,`delta`,`langcode`)
);
--> statement-breakpoint
CREATE TABLE `node__comment` (
	`bundle` varchar(128) NOT NULL DEFAULT '',
	`deleted` tinyint NOT NULL DEFAULT 0,
	`entity_id` int unsigned NOT NULL,
	`revision_id` int unsigned NOT NULL,
	`langcode` varchar(32) NOT NULL DEFAULT '',
	`delta` int unsigned NOT NULL,
	`comment_status` int NOT NULL DEFAULT 0,
	CONSTRAINT `node__comment_entity_id_deleted_delta_langcode` PRIMARY KEY(`entity_id`,`deleted`,`delta`,`langcode`)
);
--> statement-breakpoint
CREATE TABLE `node__field_image` (
	`bundle` varchar(128) NOT NULL DEFAULT '',
	`deleted` tinyint NOT NULL DEFAULT 0,
	`entity_id` int unsigned NOT NULL,
	`revision_id` int unsigned NOT NULL,
	`langcode` varchar(32) NOT NULL DEFAULT '',
	`delta` int unsigned NOT NULL,
	`field_image_target_id` int unsigned NOT NULL,
	`field_image_alt` varchar(512),
	`field_image_title` varchar(1024),
	`field_image_width` int unsigned,
	`field_image_height` int unsigned,
	CONSTRAINT `node__field_image_entity_id_deleted_delta_langcode` PRIMARY KEY(`entity_id`,`deleted`,`delta`,`langcode`)
);
--> statement-breakpoint
CREATE TABLE `node__field_tags` (
	`bundle` varchar(128) NOT NULL DEFAULT '',
	`deleted` tinyint NOT NULL DEFAULT 0,
	`entity_id` int unsigned NOT NULL,
	`revision_id` int unsigned NOT NULL,
	`langcode` varchar(32) NOT NULL DEFAULT '',
	`delta` int unsigned NOT NULL,
	`field_tags_target_id` int unsigned NOT NULL,
	CONSTRAINT `node__field_tags_entity_id_deleted_delta_langcode` PRIMARY KEY(`entity_id`,`deleted`,`delta`,`langcode`)
);
--> statement-breakpoint
CREATE TABLE `node_access` (
	`nid` int unsigned NOT NULL DEFAULT 0,
	`langcode` varchar(12) NOT NULL DEFAULT '',
	`fallback` tinyint unsigned NOT NULL DEFAULT 1,
	`gid` int unsigned NOT NULL DEFAULT 0,
	`realm` varchar(255) NOT NULL DEFAULT '',
	`grant_view` tinyint unsigned NOT NULL DEFAULT 0,
	`grant_update` tinyint unsigned NOT NULL DEFAULT 0,
	`grant_delete` tinyint unsigned NOT NULL DEFAULT 0,
	CONSTRAINT `node_access_nid_gid_realm_langcode` PRIMARY KEY(`nid`,`gid`,`realm`,`langcode`)
);
--> statement-breakpoint
CREATE TABLE `node_field_data` (
	`nid` int unsigned NOT NULL,
	`vid` int unsigned NOT NULL,
	`type` varchar(32) NOT NULL,
	`langcode` varchar(12) NOT NULL,
	`status` tinyint NOT NULL,
	`uid` int unsigned NOT NULL,
	`title` varchar(255) NOT NULL,
	`created` int NOT NULL,
	`changed` int NOT NULL,
	`promote` tinyint NOT NULL,
	`sticky` tinyint NOT NULL,
	`default_langcode` tinyint NOT NULL,
	`revision_translation_affected` tinyint,
	CONSTRAINT `node_field_data_nid_langcode` PRIMARY KEY(`nid`,`langcode`)
);
--> statement-breakpoint
CREATE TABLE `node_field_revision` (
	`nid` int unsigned NOT NULL,
	`vid` int unsigned NOT NULL,
	`langcode` varchar(12) NOT NULL,
	`status` tinyint NOT NULL,
	`uid` int unsigned NOT NULL,
	`title` varchar(255),
	`created` int,
	`changed` int,
	`promote` tinyint,
	`sticky` tinyint,
	`default_langcode` tinyint NOT NULL,
	`revision_translation_affected` tinyint,
	CONSTRAINT `node_field_revision_vid_langcode` PRIMARY KEY(`vid`,`langcode`)
);
--> statement-breakpoint
CREATE TABLE `node_revision` (
	`nid` int unsigned NOT NULL,
	`vid` int unsigned AUTO_INCREMENT NOT NULL,
	`langcode` varchar(12) NOT NULL,
	`revision_uid` int unsigned,
	`revision_timestamp` int,
	`revision_log` longtext,
	`revision_default` tinyint,
	CONSTRAINT `node_revision_vid` PRIMARY KEY(`vid`)
);
--> statement-breakpoint
CREATE TABLE `node_revision__body` (
	`bundle` varchar(128) NOT NULL DEFAULT '',
	`deleted` tinyint NOT NULL DEFAULT 0,
	`entity_id` int unsigned NOT NULL,
	`revision_id` int unsigned NOT NULL,
	`langcode` varchar(32) NOT NULL DEFAULT '',
	`delta` int unsigned NOT NULL,
	`body_value` longtext NOT NULL,
	`body_summary` longtext,
	`body_format` varchar(255),
	CONSTRAINT `node_revision__body_entity_id_revision_id_deleted_delta_langcode` PRIMARY KEY(`entity_id`,`revision_id`,`deleted`,`delta`,`langcode`)
);
--> statement-breakpoint
CREATE TABLE `node_revision__comment` (
	`bundle` varchar(128) NOT NULL DEFAULT '',
	`deleted` tinyint NOT NULL DEFAULT 0,
	`entity_id` int unsigned NOT NULL,
	`revision_id` int unsigned NOT NULL,
	`langcode` varchar(32) NOT NULL DEFAULT '',
	`delta` int unsigned NOT NULL,
	`comment_status` int NOT NULL DEFAULT 0,
	CONSTRAINT `node_revision__comment_entity_id_revision_id_deleted_delta_langcode` PRIMARY KEY(`entity_id`,`revision_id`,`deleted`,`delta`,`langcode`)
);
--> statement-breakpoint
CREATE TABLE `node_revision__field_image` (
	`bundle` varchar(128) NOT NULL DEFAULT '',
	`deleted` tinyint NOT NULL DEFAULT 0,
	`entity_id` int unsigned NOT NULL,
	`revision_id` int unsigned NOT NULL,
	`langcode` varchar(32) NOT NULL DEFAULT '',
	`delta` int unsigned NOT NULL,
	`field_image_target_id` int unsigned NOT NULL,
	`field_image_alt` varchar(512),
	`field_image_title` varchar(1024),
	`field_image_width` int unsigned,
	`field_image_height` int unsigned,
	CONSTRAINT `node_revision__field_image_entity_id_revision_id_deleted_delta_langcode` PRIMARY KEY(`entity_id`,`revision_id`,`deleted`,`delta`,`langcode`)
);
--> statement-breakpoint
CREATE TABLE `node_revision__field_tags` (
	`bundle` varchar(128) NOT NULL DEFAULT '',
	`deleted` tinyint NOT NULL DEFAULT 0,
	`entity_id` int unsigned NOT NULL,
	`revision_id` int unsigned NOT NULL,
	`langcode` varchar(32) NOT NULL DEFAULT '',
	`delta` int unsigned NOT NULL,
	`field_tags_target_id` int unsigned NOT NULL,
	CONSTRAINT `node_revision__field_tags_entity_id_revision_id_deleted_delta_langcode` PRIMARY KEY(`entity_id`,`revision_id`,`deleted`,`delta`,`langcode`)
);
--> statement-breakpoint
CREATE TABLE `path_alias` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`revision_id` int unsigned,
	`uuid` varchar(128) NOT NULL,
	`langcode` varchar(12) NOT NULL,
	`path` varchar(255),
	`alias` varchar(255),
	`status` tinyint NOT NULL,
	CONSTRAINT `path_alias_id` PRIMARY KEY(`id`),
	CONSTRAINT `path_alias__revision_id` UNIQUE(`revision_id`),
	CONSTRAINT `path_alias_field__uuid__value` UNIQUE(`uuid`)
);
--> statement-breakpoint
CREATE TABLE `path_alias_revision` (
	`id` int unsigned NOT NULL,
	`revision_id` int unsigned AUTO_INCREMENT NOT NULL,
	`langcode` varchar(12) NOT NULL,
	`path` varchar(255),
	`alias` varchar(255),
	`status` tinyint NOT NULL,
	`revision_default` tinyint,
	CONSTRAINT `path_alias_revision_revision_id` PRIMARY KEY(`revision_id`)
);
--> statement-breakpoint
CREATE TABLE `queue` (
	`item_id` int unsigned AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL DEFAULT '',
	`data` longblob,
	`expire` bigint NOT NULL DEFAULT 0,
	`created` bigint NOT NULL DEFAULT 0,
	CONSTRAINT `queue_item_id` PRIMARY KEY(`item_id`)
);
--> statement-breakpoint
CREATE TABLE `redirect` (
	`rid` int AUTO_INCREMENT NOT NULL,
	`type` varchar(255) NOT NULL,
	`uuid` varchar(128) NOT NULL,
	`language` varchar(12) NOT NULL,
	`hash` varchar(64),
	`uid` int unsigned,
	`redirect_source__path` varchar(2048),
	`redirect_source__query` longblob,
	`redirect_redirect__uri` varchar(2048),
	`redirect_redirect__title` varchar(255),
	`redirect_redirect__options` longblob,
	`status_code` int,
	`created` int,
	`enabled` tinyint NOT NULL,
	CONSTRAINT `redirect_rid` PRIMARY KEY(`rid`),
	CONSTRAINT `hash` UNIQUE(`hash`),
	CONSTRAINT `redirect_field__uuid__value` UNIQUE(`uuid`)
);
--> statement-breakpoint
CREATE TABLE `router` (
	`name` varchar(255) NOT NULL DEFAULT '',
	`path` varchar(255) NOT NULL DEFAULT '',
	`pattern_outline` varchar(255) NOT NULL DEFAULT '',
	`fit` int NOT NULL DEFAULT 0,
	`route` longblob,
	`number_parts` smallint NOT NULL DEFAULT 0,
	`alias` varchar(255),
	CONSTRAINT `router_name` PRIMARY KEY(`name`)
);
--> statement-breakpoint
CREATE TABLE `search_dataset` (
	`sid` int unsigned NOT NULL DEFAULT 0,
	`langcode` varchar(12) NOT NULL DEFAULT '',
	`type` varchar(64) NOT NULL,
	`data` longtext NOT NULL,
	`reindex` int unsigned NOT NULL DEFAULT 0,
	CONSTRAINT `search_dataset_sid_langcode_type` PRIMARY KEY(`sid`,`langcode`,`type`)
);
--> statement-breakpoint
CREATE TABLE `search_index` (
	`word` varchar(50) NOT NULL DEFAULT '',
	`sid` int unsigned NOT NULL DEFAULT 0,
	`langcode` varchar(12) NOT NULL DEFAULT '',
	`type` varchar(64) NOT NULL,
	`score` float,
	CONSTRAINT `search_index_word_sid_langcode_type` PRIMARY KEY(`word`,`sid`,`langcode`,`type`)
);
--> statement-breakpoint
CREATE TABLE `search_total` (
	`word` varchar(50) NOT NULL DEFAULT '',
	`count` float,
	CONSTRAINT `search_total_word` PRIMARY KEY(`word`)
);
--> statement-breakpoint
CREATE TABLE `semaphore` (
	`name` varchar(255) NOT NULL DEFAULT '',
	`value` varchar(255) NOT NULL DEFAULT '',
	`expire` double NOT NULL,
	CONSTRAINT `semaphore_name` PRIMARY KEY(`name`)
);
--> statement-breakpoint
CREATE TABLE `sequences` (
	`value` int unsigned AUTO_INCREMENT NOT NULL,
	CONSTRAINT `sequences_value` PRIMARY KEY(`value`)
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`uid` int unsigned NOT NULL,
	`sid` varchar(128) NOT NULL,
	`hostname` varchar(128) NOT NULL DEFAULT '',
	`timestamp` bigint NOT NULL DEFAULT 0,
	`session` longblob,
	CONSTRAINT `sessions_sid` PRIMARY KEY(`sid`)
);
--> statement-breakpoint
CREATE TABLE `shortcut` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`shortcut_set` varchar(32) NOT NULL,
	`uuid` varchar(128) NOT NULL,
	`langcode` varchar(12) NOT NULL,
	CONSTRAINT `shortcut_id` PRIMARY KEY(`id`),
	CONSTRAINT `shortcut_field__uuid__value` UNIQUE(`uuid`)
);
--> statement-breakpoint
CREATE TABLE `shortcut_field_data` (
	`id` int unsigned NOT NULL,
	`shortcut_set` varchar(32) NOT NULL,
	`langcode` varchar(12) NOT NULL,
	`title` varchar(255),
	`weight` int,
	`link__uri` varchar(2048),
	`link__title` varchar(255),
	`link__options` longblob,
	`default_langcode` tinyint NOT NULL,
	CONSTRAINT `shortcut_field_data_id_langcode` PRIMARY KEY(`id`,`langcode`)
);
--> statement-breakpoint
CREATE TABLE `shortcut_set_users` (
	`uid` int unsigned NOT NULL DEFAULT 0,
	`set_name` varchar(32) NOT NULL DEFAULT '',
	CONSTRAINT `shortcut_set_users_uid` PRIMARY KEY(`uid`)
);
--> statement-breakpoint
CREATE TABLE `taxonomy_index` (
	`nid` int unsigned NOT NULL DEFAULT 0,
	`tid` int unsigned NOT NULL DEFAULT 0,
	`status` int NOT NULL DEFAULT 1,
	`sticky` tinyint DEFAULT 0,
	`created` int NOT NULL DEFAULT 0,
	CONSTRAINT `taxonomy_index_nid_tid` PRIMARY KEY(`nid`,`tid`)
);
--> statement-breakpoint
CREATE TABLE `taxonomy_term__parent` (
	`bundle` varchar(128) NOT NULL DEFAULT '',
	`deleted` tinyint NOT NULL DEFAULT 0,
	`entity_id` int unsigned NOT NULL,
	`revision_id` int unsigned NOT NULL,
	`langcode` varchar(32) NOT NULL DEFAULT '',
	`delta` int unsigned NOT NULL,
	`parent_target_id` int unsigned NOT NULL,
	CONSTRAINT `taxonomy_term__parent_entity_id_deleted_delta_langcode` PRIMARY KEY(`entity_id`,`deleted`,`delta`,`langcode`)
);
--> statement-breakpoint
CREATE TABLE `taxonomy_term_data` (
	`tid` int unsigned AUTO_INCREMENT NOT NULL,
	`revision_id` int unsigned,
	`vid` varchar(32) NOT NULL,
	`uuid` varchar(128) NOT NULL,
	`langcode` varchar(12) NOT NULL,
	CONSTRAINT `taxonomy_term_data_tid` PRIMARY KEY(`tid`),
	CONSTRAINT `taxonomy_term__revision_id` UNIQUE(`revision_id`),
	CONSTRAINT `taxonomy_term_field__uuid__value` UNIQUE(`uuid`)
);
--> statement-breakpoint
CREATE TABLE `taxonomy_term_field_data` (
	`tid` int unsigned NOT NULL,
	`revision_id` int unsigned NOT NULL,
	`vid` varchar(32) NOT NULL,
	`langcode` varchar(12) NOT NULL,
	`status` tinyint NOT NULL,
	`name` varchar(255) NOT NULL,
	`description__value` longtext,
	`description__format` varchar(255),
	`weight` int NOT NULL,
	`changed` int,
	`default_langcode` tinyint NOT NULL,
	`revision_translation_affected` tinyint,
	CONSTRAINT `taxonomy_term_field_data_tid_langcode` PRIMARY KEY(`tid`,`langcode`)
);
--> statement-breakpoint
CREATE TABLE `taxonomy_term_field_revision` (
	`tid` int unsigned NOT NULL,
	`revision_id` int unsigned NOT NULL,
	`langcode` varchar(12) NOT NULL,
	`status` tinyint NOT NULL,
	`name` varchar(255),
	`description__value` longtext,
	`description__format` varchar(255),
	`changed` int,
	`default_langcode` tinyint NOT NULL,
	`revision_translation_affected` tinyint,
	CONSTRAINT `taxonomy_term_field_revision_revision_id_langcode` PRIMARY KEY(`revision_id`,`langcode`)
);
--> statement-breakpoint
CREATE TABLE `taxonomy_term_revision` (
	`tid` int unsigned NOT NULL,
	`revision_id` int unsigned AUTO_INCREMENT NOT NULL,
	`langcode` varchar(12) NOT NULL,
	`revision_user` int unsigned,
	`revision_created` int,
	`revision_log_message` longtext,
	`revision_default` tinyint,
	CONSTRAINT `taxonomy_term_revision_revision_id` PRIMARY KEY(`revision_id`)
);
--> statement-breakpoint
CREATE TABLE `taxonomy_term_revision__parent` (
	`bundle` varchar(128) NOT NULL DEFAULT '',
	`deleted` tinyint NOT NULL DEFAULT 0,
	`entity_id` int unsigned NOT NULL,
	`revision_id` int unsigned NOT NULL,
	`langcode` varchar(32) NOT NULL DEFAULT '',
	`delta` int unsigned NOT NULL,
	`parent_target_id` int unsigned NOT NULL,
	CONSTRAINT `taxonomy_term_revision__parent_entity_id_revision_id_deleted_delta_langcode` PRIMARY KEY(`entity_id`,`revision_id`,`deleted`,`delta`,`langcode`)
);
--> statement-breakpoint
CREATE TABLE `user__roles` (
	`bundle` varchar(128) NOT NULL DEFAULT '',
	`deleted` tinyint NOT NULL DEFAULT 0,
	`entity_id` int unsigned NOT NULL,
	`revision_id` int unsigned NOT NULL,
	`langcode` varchar(32) NOT NULL DEFAULT '',
	`delta` int unsigned NOT NULL,
	`roles_target_id` varchar(255) NOT NULL,
	CONSTRAINT `user__roles_entity_id_deleted_delta_langcode` PRIMARY KEY(`entity_id`,`deleted`,`delta`,`langcode`)
);
--> statement-breakpoint
CREATE TABLE `user__user_picture` (
	`bundle` varchar(128) NOT NULL DEFAULT '',
	`deleted` tinyint NOT NULL DEFAULT 0,
	`entity_id` int unsigned NOT NULL,
	`revision_id` int unsigned NOT NULL,
	`langcode` varchar(32) NOT NULL DEFAULT '',
	`delta` int unsigned NOT NULL,
	`user_picture_target_id` int unsigned NOT NULL,
	`user_picture_alt` varchar(512),
	`user_picture_title` varchar(1024),
	`user_picture_width` int unsigned,
	`user_picture_height` int unsigned,
	CONSTRAINT `user__user_picture_entity_id_deleted_delta_langcode` PRIMARY KEY(`entity_id`,`deleted`,`delta`,`langcode`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`uid` int unsigned AUTO_INCREMENT NOT NULL,
	`uuid` varchar(128) NOT NULL,
	`langcode` varchar(12) NOT NULL,
	CONSTRAINT `users_uid` PRIMARY KEY(`uid`),
	CONSTRAINT `user_field__uuid__value` UNIQUE(`uuid`)
);
--> statement-breakpoint
CREATE TABLE `users_data` (
	`uid` int unsigned NOT NULL DEFAULT 0,
	`module` varchar(50) NOT NULL DEFAULT '',
	`name` varchar(128) NOT NULL DEFAULT '',
	`value` longblob,
	`serialized` tinyint unsigned DEFAULT 0,
	CONSTRAINT `users_data_uid_module_name` PRIMARY KEY(`uid`,`module`,`name`)
);
--> statement-breakpoint
CREATE TABLE `users_field_data` (
	`uid` int unsigned NOT NULL,
	`langcode` varchar(12) NOT NULL,
	`preferred_langcode` varchar(12),
	`preferred_admin_langcode` varchar(12),
	`name` varchar(60) NOT NULL,
	`pass` varchar(255),
	`mail` varchar(254),
	`timezone` varchar(32),
	`status` tinyint,
	`created` int NOT NULL,
	`changed` int,
	`access` int NOT NULL,
	`login` int,
	`init` varchar(254),
	`default_langcode` tinyint NOT NULL,
	CONSTRAINT `users_field_data_uid_langcode` PRIMARY KEY(`uid`,`langcode`),
	CONSTRAINT `user__name` UNIQUE(`name`,`langcode`)
);
--> statement-breakpoint
CREATE TABLE `watchdog` (
	`wid` bigint AUTO_INCREMENT NOT NULL,
	`uid` int unsigned NOT NULL DEFAULT 0,
	`type` varchar(64) NOT NULL DEFAULT '',
	`message` longtext NOT NULL,
	`variables` longblob NOT NULL,
	`severity` tinyint unsigned NOT NULL DEFAULT 0,
	`link` text,
	`location` text NOT NULL,
	`referer` text,
	`hostname` varchar(128) NOT NULL DEFAULT '',
	`timestamp` bigint NOT NULL DEFAULT 0,
	CONSTRAINT `watchdog_wid` PRIMARY KEY(`wid`)
);
--> statement-breakpoint
CREATE INDEX `token` ON `batch` (`token`);--> statement-breakpoint
CREATE INDEX `block_content_field__type__target_id` ON `block_content` (`type`);--> statement-breakpoint
CREATE INDEX `body_format` ON `block_content__body` (`body_format`);--> statement-breakpoint
CREATE INDEX `bundle` ON `block_content__body` (`bundle`);--> statement-breakpoint
CREATE INDEX `revision_id` ON `block_content__body` (`revision_id`);--> statement-breakpoint
CREATE INDEX `block_content__id__default_langcode__langcode` ON `block_content_field_data` (`id`,`default_langcode`,`langcode`);--> statement-breakpoint
CREATE INDEX `block_content__revision_id` ON `block_content_field_data` (`revision_id`);--> statement-breakpoint
CREATE INDEX `block_content__status_type` ON `block_content_field_data` (`status`,`type`,`id`);--> statement-breakpoint
CREATE INDEX `block_content_field__reusable` ON `block_content_field_data` (`reusable`);--> statement-breakpoint
CREATE INDEX `block_content_field__type__target_id` ON `block_content_field_data` (`type`);--> statement-breakpoint
CREATE INDEX `block_content__id__default_langcode__langcode` ON `block_content_field_revision` (`id`,`default_langcode`,`langcode`);--> statement-breakpoint
CREATE INDEX `block_content__id` ON `block_content_revision` (`id`);--> statement-breakpoint
CREATE INDEX `block_content_field__revision_user__target_id` ON `block_content_revision` (`revision_user`);--> statement-breakpoint
CREATE INDEX `body_format` ON `block_content_revision__body` (`body_format`);--> statement-breakpoint
CREATE INDEX `bundle` ON `block_content_revision__body` (`bundle`);--> statement-breakpoint
CREATE INDEX `revision_id` ON `block_content_revision__body` (`revision_id`);--> statement-breakpoint
CREATE INDEX `created` ON `cache_access_policy` (`created`);--> statement-breakpoint
CREATE INDEX `expire` ON `cache_access_policy` (`expire`);--> statement-breakpoint
CREATE INDEX `created` ON `cache_bootstrap` (`created`);--> statement-breakpoint
CREATE INDEX `expire` ON `cache_bootstrap` (`expire`);--> statement-breakpoint
CREATE INDEX `created` ON `cache_config` (`created`);--> statement-breakpoint
CREATE INDEX `expire` ON `cache_config` (`expire`);--> statement-breakpoint
CREATE INDEX `created` ON `cache_container` (`created`);--> statement-breakpoint
CREATE INDEX `expire` ON `cache_container` (`expire`);--> statement-breakpoint
CREATE INDEX `created` ON `cache_data` (`created`);--> statement-breakpoint
CREATE INDEX `expire` ON `cache_data` (`expire`);--> statement-breakpoint
CREATE INDEX `created` ON `cache_default` (`created`);--> statement-breakpoint
CREATE INDEX `expire` ON `cache_default` (`expire`);--> statement-breakpoint
CREATE INDEX `created` ON `cache_discovery` (`created`);--> statement-breakpoint
CREATE INDEX `expire` ON `cache_discovery` (`expire`);--> statement-breakpoint
CREATE INDEX `created` ON `cache_dynamic_page_cache` (`created`);--> statement-breakpoint
CREATE INDEX `expire` ON `cache_dynamic_page_cache` (`expire`);--> statement-breakpoint
CREATE INDEX `created` ON `cache_entity` (`created`);--> statement-breakpoint
CREATE INDEX `expire` ON `cache_entity` (`expire`);--> statement-breakpoint
CREATE INDEX `created` ON `cache_menu` (`created`);--> statement-breakpoint
CREATE INDEX `expire` ON `cache_menu` (`expire`);--> statement-breakpoint
CREATE INDEX `created` ON `cache_page` (`created`);--> statement-breakpoint
CREATE INDEX `expire` ON `cache_page` (`expire`);--> statement-breakpoint
CREATE INDEX `created` ON `cache_render` (`created`);--> statement-breakpoint
CREATE INDEX `expire` ON `cache_render` (`expire`);--> statement-breakpoint
CREATE INDEX `created` ON `cache_toolbar` (`created`);--> statement-breakpoint
CREATE INDEX `expire` ON `cache_toolbar` (`expire`);--> statement-breakpoint
CREATE INDEX `comment_field__comment_type__target_id` ON `comment` (`comment_type`);--> statement-breakpoint
CREATE INDEX `bundle` ON `comment__comment_body` (`bundle`);--> statement-breakpoint
CREATE INDEX `comment_body_format` ON `comment__comment_body` (`comment_body_format`);--> statement-breakpoint
CREATE INDEX `revision_id` ON `comment__comment_body` (`revision_id`);--> statement-breakpoint
CREATE INDEX `comment_count` ON `comment_entity_statistics` (`comment_count`);--> statement-breakpoint
CREATE INDEX `last_comment_timestamp` ON `comment_entity_statistics` (`last_comment_timestamp`);--> statement-breakpoint
CREATE INDEX `last_comment_uid` ON `comment_entity_statistics` (`last_comment_uid`);--> statement-breakpoint
CREATE INDEX `comment__entity_langcode` ON `comment_field_data` (`entity_id`,`entity_type`,`comment_type`,`default_langcode`);--> statement-breakpoint
CREATE INDEX `comment__id__default_langcode__langcode` ON `comment_field_data` (`cid`,`default_langcode`,`langcode`);--> statement-breakpoint
CREATE INDEX `comment__num_new` ON `comment_field_data` (`entity_id`,`entity_type`,`comment_type`,`status`,`created`,`cid`,`thread`);--> statement-breakpoint
CREATE INDEX `comment__status_comment_type` ON `comment_field_data` (`status`,`comment_type`,`cid`);--> statement-breakpoint
CREATE INDEX `comment__status_pid` ON `comment_field_data` (`pid`,`status`);--> statement-breakpoint
CREATE INDEX `comment_field__comment_type__target_id` ON `comment_field_data` (`comment_type`);--> statement-breakpoint
CREATE INDEX `comment_field__created` ON `comment_field_data` (`created`);--> statement-breakpoint
CREATE INDEX `comment_field__uid__target_id` ON `comment_field_data` (`uid`);--> statement-breakpoint
CREATE INDEX `address_hash` ON `fcc_license_en` (`address_hash`);--> statement-breakpoint
CREATE INDEX `call_sign` ON `fcc_license_hd` (`call_sign`);--> statement-breakpoint
CREATE INDEX `file_field__changed` ON `file_managed` (`changed`);--> statement-breakpoint
CREATE INDEX `file_field__status` ON `file_managed` (`status`);--> statement-breakpoint
CREATE INDEX `file_field__uid__target_id` ON `file_managed` (`uid`);--> statement-breakpoint
CREATE INDEX `file_field__uri` ON `file_managed` (`uri`);--> statement-breakpoint
CREATE INDEX `fid_count` ON `file_usage` (`fid`,`count`);--> statement-breakpoint
CREATE INDEX `fid_module` ON `file_usage` (`fid`,`module`);--> statement-breakpoint
CREATE INDEX `type_id` ON `file_usage` (`type`,`id`);--> statement-breakpoint
CREATE INDEX `allow` ON `flood` (`event`,`identifier`,`timestamp`);--> statement-breakpoint
CREATE INDEX `purge` ON `flood` (`expiration`);--> statement-breakpoint
CREATE INDEX `ham_address_field__geocode_status__value` ON `ham_address` (`geocode_status`);--> statement-breakpoint
CREATE INDEX `ham_address_field__location_id__target_id` ON `ham_address` (`location_id`);--> statement-breakpoint
CREATE INDEX `ham_address_field__osm_geocode_status__value` ON `ham_address` (`osm_geocode_status`);--> statement-breakpoint
CREATE INDEX `ham_address_field__user_id__target_id` ON `ham_address` (`user_id`);--> statement-breakpoint
CREATE INDEX `ham_location_field__user_id__target_id` ON `ham_location` (`user_id`);--> statement-breakpoint
CREATE INDEX `ham_station_field__address_hash` ON `ham_station` (`address_hash`);--> statement-breakpoint
CREATE INDEX `ham_station_field__callsign` ON `ham_station` (`callsign`);--> statement-breakpoint
CREATE INDEX `ham_station_field__user_id__target_id` ON `ham_station` (`user_id`);--> statement-breakpoint
CREATE INDEX `section_plugin_id` ON `help_search_items` (`section_plugin_id`);--> statement-breakpoint
CREATE INDEX `topic_id` ON `help_search_items` (`topic_id`);--> statement-breakpoint
CREATE INDEX `nid` ON `history` (`nid`);--> statement-breakpoint
CREATE INDEX `expire` ON `key_value_expire` (`expire`);--> statement-breakpoint
CREATE INDEX `menu_link_content__enabled_bundle` ON `menu_link_content_data` (`enabled`,`bundle`,`id`);--> statement-breakpoint
CREATE INDEX `menu_link_content__id__default_langcode__langcode` ON `menu_link_content_data` (`id`,`default_langcode`,`langcode`);--> statement-breakpoint
CREATE INDEX `menu_link_content__revision_id` ON `menu_link_content_data` (`revision_id`);--> statement-breakpoint
CREATE INDEX `menu_link_content_field__link__uri` ON `menu_link_content_data` (`link__uri`);--> statement-breakpoint
CREATE INDEX `menu_link_content__id__default_langcode__langcode` ON `menu_link_content_field_revision` (`id`,`default_langcode`,`langcode`);--> statement-breakpoint
CREATE INDEX `menu_link_content_field__link__uri` ON `menu_link_content_field_revision` (`link__uri`);--> statement-breakpoint
CREATE INDEX `menu_link_content__ef029a1897` ON `menu_link_content_revision` (`revision_user`);--> statement-breakpoint
CREATE INDEX `menu_link_content__id` ON `menu_link_content_revision` (`id`);--> statement-breakpoint
CREATE INDEX `menu_parent_expand_child` ON `menu_tree` (`menu_name`,`expanded`,`has_children`,`parent`);--> statement-breakpoint
CREATE INDEX `menu_parents` ON `menu_tree` (`menu_name`,`p1`,`p2`,`p3`,`p4`,`p5`,`p6`,`p7`,`p8`,`p9`);--> statement-breakpoint
CREATE INDEX `route_values` ON `menu_tree` (`route_name`,`route_param_key`);--> statement-breakpoint
CREATE INDEX `node_field__type__target_id` ON `node` (`type`);--> statement-breakpoint
CREATE INDEX `body_format` ON `node__body` (`body_format`);--> statement-breakpoint
CREATE INDEX `bundle` ON `node__body` (`bundle`);--> statement-breakpoint
CREATE INDEX `revision_id` ON `node__body` (`revision_id`);--> statement-breakpoint
CREATE INDEX `bundle` ON `node__comment` (`bundle`);--> statement-breakpoint
CREATE INDEX `revision_id` ON `node__comment` (`revision_id`);--> statement-breakpoint
CREATE INDEX `bundle` ON `node__field_image` (`bundle`);--> statement-breakpoint
CREATE INDEX `field_image_target_id` ON `node__field_image` (`field_image_target_id`);--> statement-breakpoint
CREATE INDEX `revision_id` ON `node__field_image` (`revision_id`);--> statement-breakpoint
CREATE INDEX `bundle` ON `node__field_tags` (`bundle`);--> statement-breakpoint
CREATE INDEX `field_tags_target_id` ON `node__field_tags` (`field_tags_target_id`);--> statement-breakpoint
CREATE INDEX `revision_id` ON `node__field_tags` (`revision_id`);--> statement-breakpoint
CREATE INDEX `node__frontpage` ON `node_field_data` (`promote`,`status`,`sticky`,`created`);--> statement-breakpoint
CREATE INDEX `node__id__default_langcode__langcode` ON `node_field_data` (`nid`,`default_langcode`,`langcode`);--> statement-breakpoint
CREATE INDEX `node__status_type` ON `node_field_data` (`status`,`type`,`nid`);--> statement-breakpoint
CREATE INDEX `node__title_type` ON `node_field_data` (`title`,`type`);--> statement-breakpoint
CREATE INDEX `node__vid` ON `node_field_data` (`vid`);--> statement-breakpoint
CREATE INDEX `node_field__changed` ON `node_field_data` (`changed`);--> statement-breakpoint
CREATE INDEX `node_field__created` ON `node_field_data` (`created`);--> statement-breakpoint
CREATE INDEX `node_field__type__target_id` ON `node_field_data` (`type`);--> statement-breakpoint
CREATE INDEX `node_field__uid__target_id` ON `node_field_data` (`uid`);--> statement-breakpoint
CREATE INDEX `node__id__default_langcode__langcode` ON `node_field_revision` (`nid`,`default_langcode`,`langcode`);--> statement-breakpoint
CREATE INDEX `node_field__uid__target_id` ON `node_field_revision` (`uid`);--> statement-breakpoint
CREATE INDEX `node__nid` ON `node_revision` (`nid`);--> statement-breakpoint
CREATE INDEX `node_field__langcode` ON `node_revision` (`langcode`);--> statement-breakpoint
CREATE INDEX `node_field__revision_uid__target_id` ON `node_revision` (`revision_uid`);--> statement-breakpoint
CREATE INDEX `body_format` ON `node_revision__body` (`body_format`);--> statement-breakpoint
CREATE INDEX `bundle` ON `node_revision__body` (`bundle`);--> statement-breakpoint
CREATE INDEX `revision_id` ON `node_revision__body` (`revision_id`);--> statement-breakpoint
CREATE INDEX `bundle` ON `node_revision__comment` (`bundle`);--> statement-breakpoint
CREATE INDEX `revision_id` ON `node_revision__comment` (`revision_id`);--> statement-breakpoint
CREATE INDEX `bundle` ON `node_revision__field_image` (`bundle`);--> statement-breakpoint
CREATE INDEX `field_image_target_id` ON `node_revision__field_image` (`field_image_target_id`);--> statement-breakpoint
CREATE INDEX `revision_id` ON `node_revision__field_image` (`revision_id`);--> statement-breakpoint
CREATE INDEX `bundle` ON `node_revision__field_tags` (`bundle`);--> statement-breakpoint
CREATE INDEX `field_tags_target_id` ON `node_revision__field_tags` (`field_tags_target_id`);--> statement-breakpoint
CREATE INDEX `revision_id` ON `node_revision__field_tags` (`revision_id`);--> statement-breakpoint
CREATE INDEX `path_alias__alias_langcode_id_status` ON `path_alias` (`alias`,`langcode`,`id`,`status`);--> statement-breakpoint
CREATE INDEX `path_alias__path_langcode_id_status` ON `path_alias` (`path`,`langcode`,`id`,`status`);--> statement-breakpoint
CREATE INDEX `path_alias__id` ON `path_alias_revision` (`id`);--> statement-breakpoint
CREATE INDEX `path_alias_revision__alias_langcode_id_status` ON `path_alias_revision` (`alias`,`langcode`,`id`,`status`);--> statement-breakpoint
CREATE INDEX `path_alias_revision__path_langcode_id_status` ON `path_alias_revision` (`path`,`langcode`,`id`,`status`);--> statement-breakpoint
CREATE INDEX `expire` ON `queue` (`expire`);--> statement-breakpoint
CREATE INDEX `name_created` ON `queue` (`name`,`created`);--> statement-breakpoint
CREATE INDEX `redirect__enabled_type` ON `redirect` (`enabled`,`type`,`rid`);--> statement-breakpoint
CREATE INDEX `redirect_field__redirect_redirect__uri` ON `redirect` (`redirect_redirect__uri`);--> statement-breakpoint
CREATE INDEX `redirect_field__redirect_source__path` ON `redirect` (`redirect_source__path`);--> statement-breakpoint
CREATE INDEX `redirect_field__uid__target_id` ON `redirect` (`uid`);--> statement-breakpoint
CREATE INDEX `source_language` ON `redirect` (`redirect_source__path`,`language`);--> statement-breakpoint
CREATE INDEX `alias` ON `router` (`alias`);--> statement-breakpoint
CREATE INDEX `pattern_outline_parts` ON `router` (`pattern_outline`,`number_parts`);--> statement-breakpoint
CREATE INDEX `sid_type` ON `search_index` (`sid`,`langcode`,`type`);--> statement-breakpoint
CREATE INDEX `expire` ON `semaphore` (`expire`);--> statement-breakpoint
CREATE INDEX `value` ON `semaphore` (`value`);--> statement-breakpoint
CREATE INDEX `timestamp` ON `sessions` (`timestamp`);--> statement-breakpoint
CREATE INDEX `uid` ON `sessions` (`uid`);--> statement-breakpoint
CREATE INDEX `shortcut_field__shortcut_set__target_id` ON `shortcut` (`shortcut_set`);--> statement-breakpoint
CREATE INDEX `shortcut__id__default_langcode__langcode` ON `shortcut_field_data` (`id`,`default_langcode`,`langcode`);--> statement-breakpoint
CREATE INDEX `shortcut_field__link__uri` ON `shortcut_field_data` (`link__uri`);--> statement-breakpoint
CREATE INDEX `shortcut_field__shortcut_set__target_id` ON `shortcut_field_data` (`shortcut_set`);--> statement-breakpoint
CREATE INDEX `set_name` ON `shortcut_set_users` (`set_name`);--> statement-breakpoint
CREATE INDEX `term_node` ON `taxonomy_index` (`tid`,`status`,`sticky`,`created`);--> statement-breakpoint
CREATE INDEX `bundle_delta_target_id` ON `taxonomy_term__parent` (`bundle`,`delta`,`parent_target_id`);--> statement-breakpoint
CREATE INDEX `parent_target_id` ON `taxonomy_term__parent` (`parent_target_id`);--> statement-breakpoint
CREATE INDEX `revision_id` ON `taxonomy_term__parent` (`revision_id`);--> statement-breakpoint
CREATE INDEX `taxonomy_term_field__vid__target_id` ON `taxonomy_term_data` (`vid`);--> statement-breakpoint
CREATE INDEX `taxonomy_term__id__default_langcode__langcode` ON `taxonomy_term_field_data` (`tid`,`default_langcode`,`langcode`);--> statement-breakpoint
CREATE INDEX `taxonomy_term__revision_id` ON `taxonomy_term_field_data` (`revision_id`);--> statement-breakpoint
CREATE INDEX `taxonomy_term__status_vid` ON `taxonomy_term_field_data` (`status`,`vid`,`tid`);--> statement-breakpoint
CREATE INDEX `taxonomy_term__tree` ON `taxonomy_term_field_data` (`vid`,`weight`,`name`);--> statement-breakpoint
CREATE INDEX `taxonomy_term__vid_name` ON `taxonomy_term_field_data` (`vid`,`name`);--> statement-breakpoint
CREATE INDEX `taxonomy_term_field__name` ON `taxonomy_term_field_data` (`name`);--> statement-breakpoint
CREATE INDEX `taxonomy_term__id__default_langcode__langcode` ON `taxonomy_term_field_revision` (`tid`,`default_langcode`,`langcode`);--> statement-breakpoint
CREATE INDEX `taxonomy_term_field__description__format` ON `taxonomy_term_field_revision` (`description__format`);--> statement-breakpoint
CREATE INDEX `taxonomy_term__tid` ON `taxonomy_term_revision` (`tid`);--> statement-breakpoint
CREATE INDEX `taxonomy_term_field__revision_user__target_id` ON `taxonomy_term_revision` (`revision_user`);--> statement-breakpoint
CREATE INDEX `bundle` ON `taxonomy_term_revision__parent` (`bundle`);--> statement-breakpoint
CREATE INDEX `parent_target_id` ON `taxonomy_term_revision__parent` (`parent_target_id`);--> statement-breakpoint
CREATE INDEX `revision_id` ON `taxonomy_term_revision__parent` (`revision_id`);--> statement-breakpoint
CREATE INDEX `bundle` ON `user__roles` (`bundle`);--> statement-breakpoint
CREATE INDEX `revision_id` ON `user__roles` (`revision_id`);--> statement-breakpoint
CREATE INDEX `roles_target_id` ON `user__roles` (`roles_target_id`);--> statement-breakpoint
CREATE INDEX `bundle` ON `user__user_picture` (`bundle`);--> statement-breakpoint
CREATE INDEX `revision_id` ON `user__user_picture` (`revision_id`);--> statement-breakpoint
CREATE INDEX `user_picture_target_id` ON `user__user_picture` (`user_picture_target_id`);--> statement-breakpoint
CREATE INDEX `module` ON `users_data` (`module`);--> statement-breakpoint
CREATE INDEX `name` ON `users_data` (`name`);--> statement-breakpoint
CREATE INDEX `user__id__default_langcode__langcode` ON `users_field_data` (`uid`,`default_langcode`,`langcode`);--> statement-breakpoint
CREATE INDEX `user_field__access` ON `users_field_data` (`access`);--> statement-breakpoint
CREATE INDEX `user_field__created` ON `users_field_data` (`created`);--> statement-breakpoint
CREATE INDEX `user_field__mail` ON `users_field_data` (`mail`);--> statement-breakpoint
CREATE INDEX `severity` ON `watchdog` (`severity`);--> statement-breakpoint
CREATE INDEX `type` ON `watchdog` (`type`);--> statement-breakpoint
CREATE INDEX `uid` ON `watchdog` (`uid`);
*/