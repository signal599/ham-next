import { mysqlTable, mysqlSchema, AnyMySqlColumn, index, primaryKey, int, varchar, unique, tinyint, longtext, bigint, decimal, smallint, char, text, float, double } from "drizzle-orm/mysql-core"
import { sql } from "drizzle-orm"

export const batch = mysqlTable("batch", {
	bid: int({ unsigned: true }).autoincrement().notNull(),
	token: varchar({ length: 64 }).notNull(),
	timestamp: int().notNull(),
	// Warning: Can't parse longblob from database
	// longblobType: longblob("batch"),
},
(table) => [
	index("token").on(table.token),
	primaryKey({ columns: [table.bid], name: "batch_bid"}),
]);

export const blockContent = mysqlTable("block_content", {
	id: int({ unsigned: true }).autoincrement().notNull(),
	revisionId: int("revision_id", { unsigned: true }),
	type: varchar({ length: 32 }).notNull(),
	uuid: varchar({ length: 128 }).notNull(),
	langcode: varchar({ length: 12 }).notNull(),
},
(table) => [
	index("block_content_field__type__target_id").on(table.type),
	primaryKey({ columns: [table.id], name: "block_content_id"}),
	unique("block_content__revision_id").on(table.revisionId),
	unique("block_content_field__uuid__value").on(table.uuid),
]);

export const blockContentBody = mysqlTable("block_content__body", {
	bundle: varchar({ length: 128 }).default('').notNull(),
	deleted: tinyint().default(0).notNull(),
	entityId: int("entity_id", { unsigned: true }).notNull(),
	revisionId: int("revision_id", { unsigned: true }).notNull(),
	langcode: varchar({ length: 32 }).default('').notNull(),
	delta: int({ unsigned: true }).notNull(),
	bodyValue: longtext("body_value").notNull(),
	bodySummary: longtext("body_summary"),
	bodyFormat: varchar("body_format", { length: 255 }),
},
(table) => [
	index("body_format").on(table.bodyFormat),
	index("bundle").on(table.bundle),
	index("revision_id").on(table.revisionId),
	primaryKey({ columns: [table.entityId, table.deleted, table.delta, table.langcode], name: "block_content__body_entity_id_deleted_delta_langcode"}),
]);

export const blockContentFieldData = mysqlTable("block_content_field_data", {
	id: int({ unsigned: true }).notNull(),
	revisionId: int("revision_id", { unsigned: true }).notNull(),
	type: varchar({ length: 32 }).notNull(),
	langcode: varchar({ length: 12 }).notNull(),
	status: tinyint().notNull(),
	info: varchar({ length: 255 }),
	changed: int(),
	reusable: tinyint(),
	defaultLangcode: tinyint("default_langcode").notNull(),
	revisionTranslationAffected: tinyint("revision_translation_affected"),
},
(table) => [
	index("block_content__id__default_langcode__langcode").on(table.id, table.defaultLangcode, table.langcode),
	index("block_content__revision_id").on(table.revisionId),
	index("block_content__status_type").on(table.status, table.type, table.id),
	index("block_content_field__reusable").on(table.reusable),
	index("block_content_field__type__target_id").on(table.type),
	primaryKey({ columns: [table.id, table.langcode], name: "block_content_field_data_id_langcode"}),
]);

export const blockContentFieldRevision = mysqlTable("block_content_field_revision", {
	id: int({ unsigned: true }).notNull(),
	revisionId: int("revision_id", { unsigned: true }).notNull(),
	langcode: varchar({ length: 12 }).notNull(),
	status: tinyint().notNull(),
	info: varchar({ length: 255 }),
	changed: int(),
	defaultLangcode: tinyint("default_langcode").notNull(),
	revisionTranslationAffected: tinyint("revision_translation_affected"),
},
(table) => [
	index("block_content__id__default_langcode__langcode").on(table.id, table.defaultLangcode, table.langcode),
	primaryKey({ columns: [table.revisionId, table.langcode], name: "block_content_field_revision_revision_id_langcode"}),
]);

export const blockContentRevision = mysqlTable("block_content_revision", {
	id: int({ unsigned: true }).notNull(),
	revisionId: int("revision_id", { unsigned: true }).autoincrement().notNull(),
	langcode: varchar({ length: 12 }).notNull(),
	revisionUser: int("revision_user", { unsigned: true }),
	revisionCreated: int("revision_created"),
	revisionLog: longtext("revision_log"),
	revisionDefault: tinyint("revision_default"),
},
(table) => [
	index("block_content__id").on(table.id),
	index("block_content_field__revision_user__target_id").on(table.revisionUser),
	primaryKey({ columns: [table.revisionId], name: "block_content_revision_revision_id"}),
]);

export const blockContentRevisionBody = mysqlTable("block_content_revision__body", {
	bundle: varchar({ length: 128 }).default('').notNull(),
	deleted: tinyint().default(0).notNull(),
	entityId: int("entity_id", { unsigned: true }).notNull(),
	revisionId: int("revision_id", { unsigned: true }).notNull(),
	langcode: varchar({ length: 32 }).default('').notNull(),
	delta: int({ unsigned: true }).notNull(),
	bodyValue: longtext("body_value").notNull(),
	bodySummary: longtext("body_summary"),
	bodyFormat: varchar("body_format", { length: 255 }),
},
(table) => [
	index("body_format").on(table.bodyFormat),
	index("bundle").on(table.bundle),
	index("revision_id").on(table.revisionId),
	primaryKey({ columns: [table.entityId, table.revisionId, table.deleted, table.delta, table.langcode], name: "block_content_revision__body_entity_id_revision_id_deleted_delta_langcode"}),
]);

export const cacheAccessPolicy = mysqlTable("cache_access_policy", {
	cid: varchar({ length: 255 }).default('').notNull(),
	// Warning: Can't parse longblob from database
	// longblobType: longblob("data"),
	expire: bigint({ mode: "number" }).notNull(),
	created: decimal({ precision: 14, scale: 3 }).default('0.000').notNull(),
	serialized: smallint().notNull(),
	tags: longtext(),
	checksum: varchar({ length: 255 }).notNull(),
},
(table) => [
	index("created").on(table.created),
	index("expire").on(table.expire),
	primaryKey({ columns: [table.cid], name: "cache_access_policy_cid"}),
]);

export const cacheBootstrap = mysqlTable("cache_bootstrap", {
	cid: varchar({ length: 255 }).default('').notNull(),
	// Warning: Can't parse longblob from database
	// longblobType: longblob("data"),
	expire: bigint({ mode: "number" }).notNull(),
	created: decimal({ precision: 14, scale: 3 }).default('0.000').notNull(),
	serialized: smallint().notNull(),
	tags: longtext(),
	checksum: varchar({ length: 255 }).notNull(),
},
(table) => [
	index("created").on(table.created),
	index("expire").on(table.expire),
	primaryKey({ columns: [table.cid], name: "cache_bootstrap_cid"}),
]);

export const cacheConfig = mysqlTable("cache_config", {
	cid: varchar({ length: 255 }).default('').notNull(),
	// Warning: Can't parse longblob from database
	// longblobType: longblob("data"),
	expire: bigint({ mode: "number" }).notNull(),
	created: decimal({ precision: 14, scale: 3 }).default('0.000').notNull(),
	serialized: smallint().notNull(),
	tags: longtext(),
	checksum: varchar({ length: 255 }).notNull(),
},
(table) => [
	index("created").on(table.created),
	index("expire").on(table.expire),
	primaryKey({ columns: [table.cid], name: "cache_config_cid"}),
]);

export const cacheContainer = mysqlTable("cache_container", {
	cid: varchar({ length: 255 }).default('').notNull(),
	// Warning: Can't parse longblob from database
	// longblobType: longblob("data"),
	expire: bigint({ mode: "number" }).notNull(),
	created: decimal({ precision: 14, scale: 3 }).default('0.000').notNull(),
	serialized: smallint().notNull(),
	tags: longtext(),
	checksum: varchar({ length: 255 }).notNull(),
},
(table) => [
	index("created").on(table.created),
	index("expire").on(table.expire),
	primaryKey({ columns: [table.cid], name: "cache_container_cid"}),
]);

export const cacheData = mysqlTable("cache_data", {
	cid: varchar({ length: 255 }).default('').notNull(),
	// Warning: Can't parse longblob from database
	// longblobType: longblob("data"),
	expire: bigint({ mode: "number" }).notNull(),
	created: decimal({ precision: 14, scale: 3 }).default('0.000').notNull(),
	serialized: smallint().notNull(),
	tags: longtext(),
	checksum: varchar({ length: 255 }).notNull(),
},
(table) => [
	index("created").on(table.created),
	index("expire").on(table.expire),
	primaryKey({ columns: [table.cid], name: "cache_data_cid"}),
]);

export const cacheDefault = mysqlTable("cache_default", {
	cid: varchar({ length: 255 }).default('').notNull(),
	// Warning: Can't parse longblob from database
	// longblobType: longblob("data"),
	expire: bigint({ mode: "number" }).notNull(),
	created: decimal({ precision: 14, scale: 3 }).default('0.000').notNull(),
	serialized: smallint().notNull(),
	tags: longtext(),
	checksum: varchar({ length: 255 }).notNull(),
},
(table) => [
	index("created").on(table.created),
	index("expire").on(table.expire),
	primaryKey({ columns: [table.cid], name: "cache_default_cid"}),
]);

export const cacheDiscovery = mysqlTable("cache_discovery", {
	cid: varchar({ length: 255 }).default('').notNull(),
	// Warning: Can't parse longblob from database
	// longblobType: longblob("data"),
	expire: bigint({ mode: "number" }).notNull(),
	created: decimal({ precision: 14, scale: 3 }).default('0.000').notNull(),
	serialized: smallint().notNull(),
	tags: longtext(),
	checksum: varchar({ length: 255 }).notNull(),
},
(table) => [
	index("created").on(table.created),
	index("expire").on(table.expire),
	primaryKey({ columns: [table.cid], name: "cache_discovery_cid"}),
]);

export const cacheDynamicPageCache = mysqlTable("cache_dynamic_page_cache", {
	cid: varchar({ length: 255 }).default('').notNull(),
	// Warning: Can't parse longblob from database
	// longblobType: longblob("data"),
	expire: bigint({ mode: "number" }).notNull(),
	created: decimal({ precision: 14, scale: 3 }).default('0.000').notNull(),
	serialized: smallint().notNull(),
	tags: longtext(),
	checksum: varchar({ length: 255 }).notNull(),
},
(table) => [
	index("created").on(table.created),
	index("expire").on(table.expire),
	primaryKey({ columns: [table.cid], name: "cache_dynamic_page_cache_cid"}),
]);

export const cacheEntity = mysqlTable("cache_entity", {
	cid: varchar({ length: 255 }).default('').notNull(),
	// Warning: Can't parse longblob from database
	// longblobType: longblob("data"),
	expire: bigint({ mode: "number" }).notNull(),
	created: decimal({ precision: 14, scale: 3 }).default('0.000').notNull(),
	serialized: smallint().notNull(),
	tags: longtext(),
	checksum: varchar({ length: 255 }).notNull(),
},
(table) => [
	index("created").on(table.created),
	index("expire").on(table.expire),
	primaryKey({ columns: [table.cid], name: "cache_entity_cid"}),
]);

export const cacheMenu = mysqlTable("cache_menu", {
	cid: varchar({ length: 255 }).default('').notNull(),
	// Warning: Can't parse longblob from database
	// longblobType: longblob("data"),
	expire: bigint({ mode: "number" }).notNull(),
	created: decimal({ precision: 14, scale: 3 }).default('0.000').notNull(),
	serialized: smallint().notNull(),
	tags: longtext(),
	checksum: varchar({ length: 255 }).notNull(),
},
(table) => [
	index("created").on(table.created),
	index("expire").on(table.expire),
	primaryKey({ columns: [table.cid], name: "cache_menu_cid"}),
]);

export const cachePage = mysqlTable("cache_page", {
	cid: varchar({ length: 255 }).default('').notNull(),
	// Warning: Can't parse longblob from database
	// longblobType: longblob("data"),
	expire: bigint({ mode: "number" }).notNull(),
	created: decimal({ precision: 14, scale: 3 }).default('0.000').notNull(),
	serialized: smallint().notNull(),
	tags: longtext(),
	checksum: varchar({ length: 255 }).notNull(),
},
(table) => [
	index("created").on(table.created),
	index("expire").on(table.expire),
	primaryKey({ columns: [table.cid], name: "cache_page_cid"}),
]);

export const cacheRender = mysqlTable("cache_render", {
	cid: varchar({ length: 255 }).default('').notNull(),
	// Warning: Can't parse longblob from database
	// longblobType: longblob("data"),
	expire: bigint({ mode: "number" }).notNull(),
	created: decimal({ precision: 14, scale: 3 }).default('0.000').notNull(),
	serialized: smallint().notNull(),
	tags: longtext(),
	checksum: varchar({ length: 255 }).notNull(),
},
(table) => [
	index("created").on(table.created),
	index("expire").on(table.expire),
	primaryKey({ columns: [table.cid], name: "cache_render_cid"}),
]);

export const cacheToolbar = mysqlTable("cache_toolbar", {
	cid: varchar({ length: 255 }).default('').notNull(),
	// Warning: Can't parse longblob from database
	// longblobType: longblob("data"),
	expire: bigint({ mode: "number" }).notNull(),
	created: decimal({ precision: 14, scale: 3 }).default('0.000').notNull(),
	serialized: smallint().notNull(),
	tags: longtext(),
	checksum: varchar({ length: 255 }).notNull(),
},
(table) => [
	index("created").on(table.created),
	index("expire").on(table.expire),
	primaryKey({ columns: [table.cid], name: "cache_toolbar_cid"}),
]);

export const cachetags = mysqlTable("cachetags", {
	tag: varchar({ length: 255 }).default('').notNull(),
	invalidations: int().default(0).notNull(),
},
(table) => [
	primaryKey({ columns: [table.tag], name: "cachetags_tag"}),
]);

export const comment = mysqlTable("comment", {
	cid: int({ unsigned: true }).autoincrement().notNull(),
	commentType: varchar("comment_type", { length: 32 }).notNull(),
	uuid: varchar({ length: 128 }).notNull(),
	langcode: varchar({ length: 12 }).notNull(),
},
(table) => [
	index("comment_field__comment_type__target_id").on(table.commentType),
	primaryKey({ columns: [table.cid], name: "comment_cid"}),
	unique("comment_field__uuid__value").on(table.uuid),
]);

export const commentCommentBody = mysqlTable("comment__comment_body", {
	bundle: varchar({ length: 128 }).default('').notNull(),
	deleted: tinyint().default(0).notNull(),
	entityId: int("entity_id", { unsigned: true }).notNull(),
	revisionId: int("revision_id", { unsigned: true }).notNull(),
	langcode: varchar({ length: 32 }).default('').notNull(),
	delta: int({ unsigned: true }).notNull(),
	commentBodyValue: longtext("comment_body_value").notNull(),
	commentBodyFormat: varchar("comment_body_format", { length: 255 }),
},
(table) => [
	index("bundle").on(table.bundle),
	index("comment_body_format").on(table.commentBodyFormat),
	index("revision_id").on(table.revisionId),
	primaryKey({ columns: [table.entityId, table.deleted, table.delta, table.langcode], name: "comment__comment_body_entity_id_deleted_delta_langcode"}),
]);

export const commentEntityStatistics = mysqlTable("comment_entity_statistics", {
	entityId: int("entity_id", { unsigned: true }).default(0).notNull(),
	entityType: varchar("entity_type", { length: 32 }).default('node').notNull(),
	fieldName: varchar("field_name", { length: 32 }).default('').notNull(),
	cid: int().default(0).notNull(),
	lastCommentTimestamp: bigint("last_comment_timestamp", { mode: "number" }).notNull(),
	lastCommentName: varchar("last_comment_name", { length: 60 }),
	lastCommentUid: int("last_comment_uid", { unsigned: true }).default(0).notNull(),
	commentCount: int("comment_count", { unsigned: true }).default(0).notNull(),
},
(table) => [
	index("comment_count").on(table.commentCount),
	index("last_comment_timestamp").on(table.lastCommentTimestamp),
	index("last_comment_uid").on(table.lastCommentUid),
	primaryKey({ columns: [table.entityId, table.entityType, table.fieldName], name: "comment_entity_statistics_entity_id_entity_type_field_name"}),
]);

export const commentFieldData = mysqlTable("comment_field_data", {
	cid: int({ unsigned: true }).notNull(),
	commentType: varchar("comment_type", { length: 32 }).notNull(),
	langcode: varchar({ length: 12 }).notNull(),
	status: tinyint().notNull(),
	uid: int({ unsigned: true }).notNull(),
	pid: int({ unsigned: true }),
	entityId: int("entity_id", { unsigned: true }),
	subject: varchar({ length: 64 }),
	name: varchar({ length: 60 }),
	mail: varchar({ length: 254 }),
	homepage: varchar({ length: 255 }),
	hostname: varchar({ length: 128 }),
	created: int().notNull(),
	changed: int(),
	thread: varchar({ length: 255 }).notNull(),
	entityType: varchar("entity_type", { length: 32 }).notNull(),
	fieldName: varchar("field_name", { length: 32 }).notNull(),
	defaultLangcode: tinyint("default_langcode").notNull(),
},
(table) => [
	index("comment__entity_langcode").on(table.entityId, table.entityType, table.commentType, table.defaultLangcode),
	index("comment__id__default_langcode__langcode").on(table.cid, table.defaultLangcode, table.langcode),
	index("comment__num_new").on(table.entityId, table.entityType, table.commentType, table.status, table.created, table.cid, table.thread),
	index("comment__status_comment_type").on(table.status, table.commentType, table.cid),
	index("comment__status_pid").on(table.pid, table.status),
	index("comment_field__comment_type__target_id").on(table.commentType),
	index("comment_field__created").on(table.created),
	index("comment_field__uid__target_id").on(table.uid),
	primaryKey({ columns: [table.cid, table.langcode], name: "comment_field_data_cid_langcode"}),
]);

export const config = mysqlTable("config", {
	collection: varchar({ length: 255 }).default('').notNull(),
	name: varchar({ length: 255 }).default('').notNull(),
	// Warning: Can't parse longblob from database
	// longblobType: longblob("data"),
},
(table) => [
	primaryKey({ columns: [table.collection, table.name], name: "config_collection_name"}),
]);

export const configExport = mysqlTable("config_export", {
	collection: varchar({ length: 255 }).default('').notNull(),
	name: varchar({ length: 255 }).default('').notNull(),
	// Warning: Can't parse longblob from database
	// longblobType: longblob("data"),
},
(table) => [
	primaryKey({ columns: [table.collection, table.name], name: "config_export_collection_name"}),
]);

export const configImport = mysqlTable("config_import", {
	collection: varchar({ length: 255 }).default('').notNull(),
	name: varchar({ length: 255 }).default('').notNull(),
	// Warning: Can't parse longblob from database
	// longblobType: longblob("data"),
},
(table) => [
	primaryKey({ columns: [table.collection, table.name], name: "config_import_collection_name"}),
]);

export const configSnapshot = mysqlTable("config_snapshot", {
	collection: varchar({ length: 255 }).default('').notNull(),
	name: varchar({ length: 255 }).default('').notNull(),
	// Warning: Can't parse longblob from database
	// longblobType: longblob("data"),
},
(table) => [
	primaryKey({ columns: [table.collection, table.name], name: "config_snapshot_collection_name"}),
]);

export const fccLicenseAm = mysqlTable("fcc_license_am", {
	recordType: char("record_type", { length: 2 }).notNull(),
	uniqueSystemIdentifier: decimal("unique_system_identifier", { precision: 9, scale: 0 }).notNull(),
	ulsFileNum: char("uls_file_num", { length: 14 }),
	ebfNumber: varchar("ebf_number", { length: 30 }),
	callsign: char({ length: 10 }),
	operatorClass: char("operator_class", { length: 1 }),
	groupCode: char("group_code", { length: 1 }),
	regionCode: tinyint("region_code"),
	trusteeCallsign: char("trustee_callsign", { length: 10 }),
	trusteeIndicator: char("trustee_indicator", { length: 1 }),
	physicianCertification: char("physician_certification", { length: 1 }),
	veSignature: char("ve_signature", { length: 1 }),
	systematicCallsignChange: char("systematic_callsign_change", { length: 1 }),
	vanityCallsignChange: char("vanity_callsign_change", { length: 1 }),
	vanityRelationship: char("vanity_relationship", { length: 12 }),
	previousCallsign: char("previous_callsign", { length: 10 }),
	previousOperatorClass: char("previous_operator_class", { length: 1 }),
	trusteeName: varchar("trustee_name", { length: 50 }),
	rowHash: varchar("row_hash", { length: 40 }),
},
(table) => [
	primaryKey({ columns: [table.uniqueSystemIdentifier], name: "fcc_license_am_unique_system_identifier"}),
]);

export const fccLicenseEn = mysqlTable("fcc_license_en", {
	recordType: char("record_type", { length: 2 }).notNull(),
	uniqueSystemIdentifier: decimal("unique_system_identifier", { precision: 9, scale: 0 }).notNull(),
	ulsFileNumber: char("uls_file_number", { length: 14 }),
	ebfNumber: varchar("ebf_number", { length: 30 }),
	callSign: char("call_sign", { length: 10 }),
	entityType: char("entity_type", { length: 2 }),
	licenseeId: char("licensee_id", { length: 9 }),
	entityName: varchar("entity_name", { length: 200 }),
	firstName: varchar("first_name", { length: 20 }),
	mi: char({ length: 1 }),
	lastName: varchar("last_name", { length: 20 }),
	suffix: char({ length: 3 }),
	phone: char({ length: 10 }),
	fax: char({ length: 10 }),
	email: varchar({ length: 50 }),
	streetAddress: varchar("street_address", { length: 82 }),
	city: varchar({ length: 20 }),
	state: char({ length: 2 }),
	zipCode: char("zip_code", { length: 10 }),
	poBox: varchar("po_box", { length: 20 }),
	attentionLine: varchar("attention_line", { length: 35 }),
	sgin: char({ length: 3 }),
	frn: char({ length: 10 }),
	applicantTypeCode: char("applicant_type_code", { length: 1 }),
	applicantTypeOther: char("applicant_type_other", { length: 40 }),
	statusCode: char("status_code", { length: 1 }),
	statusDate: char("status_date", { length: 10 }),
	rowHash: varchar("row_hash", { length: 40 }),
	addressHash: varchar("address_hash", { length: 40 }),
},
(table) => [
	index("address_hash").on(table.addressHash),
	primaryKey({ columns: [table.uniqueSystemIdentifier], name: "fcc_license_en_unique_system_identifier"}),
]);

export const fccLicenseHd = mysqlTable("fcc_license_hd", {
	recordType: char("record_type", { length: 2 }).notNull(),
	uniqueSystemIdentifier: decimal("unique_system_identifier", { precision: 9, scale: 0 }).notNull(),
	ulsFileNumber: char("uls_file_number", { length: 14 }),
	ebfNumber: varchar("ebf_number", { length: 30 }),
	callSign: char("call_sign", { length: 10 }),
	licenseStatus: char("license_status", { length: 1 }),
	radioServiceCode: char("radio_service_code", { length: 2 }),
	grantDate: char("grant_date", { length: 10 }),
	expiredDate: char("expired_date", { length: 10 }),
	cancellationDate: char("cancellation_date", { length: 10 }),
	eligibilityRuleNum: char("eligibility_rule_num", { length: 10 }),
	applicantTypeCodeReserved: char("applicant_type_code_reserved", { length: 1 }),
	alien: char({ length: 1 }),
	alienGovernment: char("alien_government", { length: 1 }),
	alienCorporation: char("alien_corporation", { length: 1 }),
	alienOfficer: char("alien_officer", { length: 1 }),
	alienControl: char("alien_control", { length: 1 }),
	revoked: char({ length: 1 }),
	convicted: char({ length: 1 }),
	adjudged: char({ length: 1 }),
	involvedReserved: char("involved_reserved", { length: 1 }),
	commonCarrier: char("common_carrier", { length: 1 }),
	nonCommonCarrier: char("non_common_carrier", { length: 1 }),
	privateComm: char("private_comm", { length: 1 }),
	fixed: char({ length: 1 }),
	mobile: char({ length: 1 }),
	radiolocation: char({ length: 1 }),
	satellite: char({ length: 1 }),
	developmentalOrSta: char("developmental_or_sta", { length: 1 }),
	interconnectedService: char("interconnected_service", { length: 1 }),
	certifierFirstName: varchar("certifier_first_name", { length: 20 }),
	certifierMi: char("certifier_mi", { length: 1 }),
	certifierLastName: varchar("certifier_last_name", { length: 20 }),
	certifierSuffix: char("certifier_suffix", { length: 3 }),
	certifierTitle: char("certifier_title", { length: 40 }),
	gender: char({ length: 1 }),
	africanAmerican: char("african_american", { length: 1 }),
	nativeAmerican: char("native_american", { length: 1 }),
	hawaiian: char({ length: 1 }),
	asian: char({ length: 1 }),
	white: char({ length: 1 }),
	ethnicity: char({ length: 1 }),
	effectiveDate: char("effective_date", { length: 10 }),
	lastActionDate: char("last_action_date", { length: 10 }),
	auctionId: int("auction_id"),
	regStatBroadServ: char("reg_stat_broad_serv", { length: 1 }),
	bandManager: char("band_manager", { length: 1 }),
	typeServBroadServ: char("type_serv_broad_serv", { length: 1 }),
	alienRuling: char("alien_ruling", { length: 1 }),
	licenseeNameChange: char("licensee_name_change", { length: 1 }),
	rowHash: varchar("row_hash", { length: 40 }),
	totalHash: varchar("total_hash", { length: 40 }),
},
(table) => [
	index("call_sign").on(table.callSign),
	primaryKey({ columns: [table.uniqueSystemIdentifier], name: "fcc_license_hd_unique_system_identifier"}),
]);

export const fileManaged = mysqlTable("file_managed", {
	fid: int({ unsigned: true }).autoincrement().notNull(),
	uuid: varchar({ length: 128 }).notNull(),
	langcode: varchar({ length: 12 }).notNull(),
	uid: int({ unsigned: true }),
	filename: varchar({ length: 255 }),
	uri: varchar({ length: 255 }).notNull(),
	filemime: varchar({ length: 255 }),
	filesize: bigint({ mode: "number", unsigned: true }),
	status: tinyint().notNull(),
	created: int(),
	changed: int().notNull(),
},
(table) => [
	index("file_field__changed").on(table.changed),
	index("file_field__status").on(table.status),
	index("file_field__uid__target_id").on(table.uid),
	index("file_field__uri").on(table.uri),
	primaryKey({ columns: [table.fid], name: "file_managed_fid"}),
	unique("file_field__uuid__value").on(table.uuid),
]);

export const fileUsage = mysqlTable("file_usage", {
	fid: int({ unsigned: true }).notNull(),
	module: varchar({ length: 50 }).default('').notNull(),
	type: varchar({ length: 64 }).default('').notNull(),
	id: varchar({ length: 64 }).default('0').notNull(),
	count: int({ unsigned: true }).default(0).notNull(),
},
(table) => [
	index("fid_count").on(table.fid, table.count),
	index("fid_module").on(table.fid, table.module),
	index("type_id").on(table.type, table.id),
	primaryKey({ columns: [table.fid, table.type, table.id, table.module], name: "file_usage_fid_type_id_module"}),
]);

export const flood = mysqlTable("flood", {
	fid: int().autoincrement().notNull(),
	event: varchar({ length: 64 }).default('').notNull(),
	identifier: varchar({ length: 128 }).default('').notNull(),
	timestamp: bigint({ mode: "number" }).notNull(),
	expiration: bigint({ mode: "number" }).notNull(),
},
(table) => [
	index("allow").on(table.event, table.identifier, table.timestamp),
	index("purge").on(table.expiration),
	primaryKey({ columns: [table.fid], name: "flood_fid"}),
]);

export const hamAddress = mysqlTable("ham_address", {
	id: int({ unsigned: true }).autoincrement().notNull(),
	uuid: varchar({ length: 128 }).notNull(),
	langcode: varchar({ length: 12 }).notNull(),
	hash: varchar({ length: 40 }),
	addressLangcode: varchar("address__langcode", { length: 32 }),
	addressCountryCode: varchar("address__country_code", { length: 2 }),
	addressAdministrativeArea: varchar("address__administrative_area", { length: 255 }),
	addressLocality: varchar("address__locality", { length: 255 }),
	addressDependentLocality: varchar("address__dependent_locality", { length: 255 }),
	addressPostalCode: varchar("address__postal_code", { length: 255 }),
	addressSortingCode: varchar("address__sorting_code", { length: 255 }),
	addressAddressLine1: varchar("address__address_line1", { length: 255 }),
	addressAddressLine2: varchar("address__address_line2", { length: 255 }),
	addressAddressLine3: varchar("address__address_line3", { length: 255 }),
	addressOrganization: varchar("address__organization", { length: 255 }),
	addressGivenName: varchar("address__given_name", { length: 255 }),
	addressAdditionalName: varchar("address__additional_name", { length: 255 }),
	addressFamilyName: varchar("address__family_name", { length: 255 }),
	geocodeProvider: varchar("geocode_provider", { length: 2 }),
	geocodeStatus: int("geocode_status"),
	geocodeResponse: longtext("geocode_response"),
	locationId: int("location_id", { unsigned: true }),
	osmGeocodeStatus: int("osm_geocode_status"),
	osmGeocodeResponse: longtext("osm_geocode_response"),
	osmLatitude: decimal("osm_latitude", { precision: 10, scale: 7 }),
	osmLongitude: decimal("osm_longitude", { precision: 10, scale: 7 }),
	userId: int("user_id", { unsigned: true }).notNull(),
	status: tinyint().notNull(),
	created: int(),
	changed: int(),
	geocodeTime: int("geocode_time"),
	geocodePriority: int("geocode_priority"),
},
(table) => [
	index("ham_address_field__geocode_status__value").on(table.geocodeStatus),
	index("ham_address_field__location_id__target_id").on(table.locationId),
	index("ham_address_field__osm_geocode_status__value").on(table.osmGeocodeStatus),
	index("ham_address_field__user_id__target_id").on(table.userId),
	primaryKey({ columns: [table.id], name: "ham_address_id"}),
	unique("ham_address_field__hash").on(table.hash),
	unique("ham_address_field__uuid__value").on(table.uuid),
]);

export const hamLocation = mysqlTable("ham_location", {
	id: int({ unsigned: true }).autoincrement().notNull(),
	uuid: varchar({ length: 128 }).notNull(),
	langcode: varchar({ length: 12 }).notNull(),
	userId: int("user_id", { unsigned: true }).notNull(),
	latitude: decimal({ precision: 10, scale: 7 }),
	longitude: decimal({ precision: 10, scale: 7 }),
	status: tinyint().notNull(),
	created: int(),
	changed: int(),
},
(table) => [
	index("ham_location_field__user_id__target_id").on(table.userId),
	primaryKey({ columns: [table.id], name: "ham_location_id"}),
	unique("ham_location__latlng").on(table.latitude, table.longitude),
	unique("ham_location_field__uuid__value").on(table.uuid),
]);

export const hamStation = mysqlTable("ham_station", {
	id: int({ unsigned: true }).autoincrement().notNull(),
	uuid: varchar({ length: 128 }).notNull(),
	langcode: varchar({ length: 12 }).notNull(),
	callsign: varchar({ length: 20 }).notNull(),
	firstName: varchar("first_name", { length: 255 }),
	middleName: varchar("middle_name", { length: 255 }),
	lastName: varchar("last_name", { length: 255 }),
	suffix: varchar({ length: 3 }),
	organization: varchar({ length: 255 }),
	operatorClass: varchar("operator_class", { length: 1 }),
	previousCallsign: varchar("previous_callsign", { length: 20 }),
	totalHash: varchar("total_hash", { length: 40 }),
	addressHash: varchar("address_hash", { length: 40 }).notNull(),
	userId: int("user_id", { unsigned: true }).notNull(),
	status: tinyint().notNull(),
	created: int(),
	changed: int(),
},
(table) => [
	index("ham_station_field__address_hash").on(table.addressHash),
	index("ham_station_field__callsign").on(table.callsign),
	index("ham_station_field__user_id__target_id").on(table.userId),
	primaryKey({ columns: [table.id], name: "ham_station_id"}),
	unique("ham_station_field__uuid__value").on(table.uuid),
]);

export const hamStationExport = mysqlTable("ham_station_export", {
	batchUuid: varchar("batch_uuid", { length: 255 }).notNull(),
	id: int({ unsigned: true }).notNull(),
	callsign: varchar({ length: 255 }),
	firstName: varchar("first_name", { length: 255 }),
	lastName: varchar("last_name", { length: 255 }),
	address: varchar({ length: 255 }),
	city: varchar({ length: 255 }),
	state: varchar({ length: 2 }),
	zip: varchar({ length: 10 }),
	operatorClass: varchar("operator_class", { length: 1 }),
	isClub: tinyint("is_club", { unsigned: true }),
	latitude: decimal({ precision: 10, scale: 7 }),
	longitude: decimal({ precision: 10, scale: 7 }),
	timestamp: int({ unsigned: true }).notNull(),
},
(table) => [
	primaryKey({ columns: [table.batchUuid, table.id], name: "ham_station_export_batch_uuid_id"}),
]);

export const hamStationSort = mysqlTable("ham_station_sort", {
	batchUuid: varchar("batch_uuid", { length: 255 }).notNull(),
	id: int({ unsigned: true }).notNull(),
	sortOrder: int("sort_order", { unsigned: true }),
},
(table) => [
	primaryKey({ columns: [table.batchUuid, table.id], name: "ham_station_sort_batch_uuid_id"}),
	unique("sort_order").on(table.batchUuid, table.sortOrder),
]);

export const helpSearchItems = mysqlTable("help_search_items", {
	sid: int({ unsigned: true }).autoincrement().notNull(),
	sectionPluginId: varchar("section_plugin_id", { length: 255 }).default('').notNull(),
	permission: varchar({ length: 255 }).default('').notNull(),
	topicId: varchar("topic_id", { length: 255 }).default('').notNull(),
},
(table) => [
	index("section_plugin_id").on(table.sectionPluginId),
	index("topic_id").on(table.topicId),
	primaryKey({ columns: [table.sid], name: "help_search_items_sid"}),
]);

export const history = mysqlTable("history", {
	uid: int().default(0).notNull(),
	nid: int({ unsigned: true }).default(0).notNull(),
	timestamp: bigint({ mode: "number" }).notNull(),
},
(table) => [
	index("nid").on(table.nid),
	primaryKey({ columns: [table.uid, table.nid], name: "history_uid_nid"}),
]);

export const keyValue = mysqlTable("key_value", {
	collection: varchar({ length: 128 }).default('').notNull(),
	name: varchar({ length: 128 }).default('').notNull(),
	// Warning: Can't parse longblob from database
	// longblobType: longblob("value").notNull(),
},
(table) => [
	primaryKey({ columns: [table.collection, table.name], name: "key_value_collection_name"}),
]);

export const keyValueExpire = mysqlTable("key_value_expire", {
	collection: varchar({ length: 128 }).default('').notNull(),
	name: varchar({ length: 128 }).default('').notNull(),
	// Warning: Can't parse longblob from database
	// longblobType: longblob("value").notNull(),
	expire: int().default(2147483647).notNull(),
},
(table) => [
	index("expire").on(table.expire),
	primaryKey({ columns: [table.collection, table.name], name: "key_value_expire_collection_name"}),
]);

export const menuLinkContent = mysqlTable("menu_link_content", {
	id: int({ unsigned: true }).autoincrement().notNull(),
	revisionId: int("revision_id", { unsigned: true }),
	bundle: varchar({ length: 32 }).notNull(),
	uuid: varchar({ length: 128 }).notNull(),
	langcode: varchar({ length: 12 }).notNull(),
},
(table) => [
	primaryKey({ columns: [table.id], name: "menu_link_content_id"}),
	unique("menu_link_content__revision_id").on(table.revisionId),
	unique("menu_link_content_field__uuid__value").on(table.uuid),
]);

export const menuLinkContentData = mysqlTable("menu_link_content_data", {
	id: int({ unsigned: true }).notNull(),
	revisionId: int("revision_id", { unsigned: true }).notNull(),
	bundle: varchar({ length: 32 }).notNull(),
	langcode: varchar({ length: 12 }).notNull(),
	enabled: tinyint().notNull(),
	title: varchar({ length: 255 }),
	description: varchar({ length: 255 }),
	menuName: varchar("menu_name", { length: 255 }),
	linkUri: varchar("link__uri", { length: 2048 }),
	linkTitle: varchar("link__title", { length: 255 }),
	// Warning: Can't parse longblob from database
	// longblobType: longblob("link__options"),
	external: tinyint(),
	rediscover: tinyint(),
	weight: int(),
	expanded: tinyint(),
	parent: varchar({ length: 255 }),
	changed: int(),
	defaultLangcode: tinyint("default_langcode").notNull(),
	revisionTranslationAffected: tinyint("revision_translation_affected"),
},
(table) => [
	index("menu_link_content__enabled_bundle").on(table.enabled, table.bundle, table.id),
	index("menu_link_content__id__default_langcode__langcode").on(table.id, table.defaultLangcode, table.langcode),
	index("menu_link_content__revision_id").on(table.revisionId),
	index("menu_link_content_field__link__uri").on(table.linkUri),
	primaryKey({ columns: [table.id, table.langcode], name: "menu_link_content_data_id_langcode"}),
]);

export const menuLinkContentFieldRevision = mysqlTable("menu_link_content_field_revision", {
	id: int({ unsigned: true }).notNull(),
	revisionId: int("revision_id", { unsigned: true }).notNull(),
	langcode: varchar({ length: 12 }).notNull(),
	enabled: tinyint().notNull(),
	title: varchar({ length: 255 }),
	description: varchar({ length: 255 }),
	linkUri: varchar("link__uri", { length: 2048 }),
	linkTitle: varchar("link__title", { length: 255 }),
	// Warning: Can't parse longblob from database
	// longblobType: longblob("link__options"),
	external: tinyint(),
	changed: int(),
	defaultLangcode: tinyint("default_langcode").notNull(),
	revisionTranslationAffected: tinyint("revision_translation_affected"),
},
(table) => [
	index("menu_link_content__id__default_langcode__langcode").on(table.id, table.defaultLangcode, table.langcode),
	index("menu_link_content_field__link__uri").on(table.linkUri),
	primaryKey({ columns: [table.revisionId, table.langcode], name: "menu_link_content_field_revision_revision_id_langcode"}),
]);

export const menuLinkContentRevision = mysqlTable("menu_link_content_revision", {
	id: int({ unsigned: true }).notNull(),
	revisionId: int("revision_id", { unsigned: true }).autoincrement().notNull(),
	langcode: varchar({ length: 12 }).notNull(),
	revisionUser: int("revision_user", { unsigned: true }),
	revisionCreated: int("revision_created"),
	revisionLogMessage: longtext("revision_log_message"),
	revisionDefault: tinyint("revision_default"),
},
(table) => [
	index("menu_link_content__ef029a1897").on(table.revisionUser),
	index("menu_link_content__id").on(table.id),
	primaryKey({ columns: [table.revisionId], name: "menu_link_content_revision_revision_id"}),
]);

export const menuTree = mysqlTable("menu_tree", {
	menuName: varchar("menu_name", { length: 32 }).default('').notNull(),
	mlid: int({ unsigned: true }).autoincrement().notNull(),
	id: varchar({ length: 255 }).notNull(),
	parent: varchar({ length: 255 }).default('').notNull(),
	routeName: varchar("route_name", { length: 255 }),
	routeParamKey: varchar("route_param_key", { length: 2048 }),
	// Warning: Can't parse longblob from database
	// longblobType: longblob("route_parameters"),
	url: varchar({ length: 2048 }).default('').notNull(),
	// Warning: Can't parse longblob from database
	// longblobType: longblob("title"),
	// Warning: Can't parse longblob from database
	// longblobType: longblob("description"),
	class: text(),
	// Warning: Can't parse longblob from database
	// longblobType: longblob("options"),
	provider: varchar({ length: 50 }).default('system').notNull(),
	enabled: smallint().default(1).notNull(),
	discovered: smallint().notNull(),
	expanded: smallint().notNull(),
	weight: int().default(0).notNull(),
	// Warning: Can't parse longblob from database
	// longblobType: longblob("metadata"),
	hasChildren: smallint("has_children").notNull(),
	depth: smallint().notNull(),
	p1: int({ unsigned: true }).default(0).notNull(),
	p2: int({ unsigned: true }).default(0).notNull(),
	p3: int({ unsigned: true }).default(0).notNull(),
	p4: int({ unsigned: true }).default(0).notNull(),
	p5: int({ unsigned: true }).default(0).notNull(),
	p6: int({ unsigned: true }).default(0).notNull(),
	p7: int({ unsigned: true }).default(0).notNull(),
	p8: int({ unsigned: true }).default(0).notNull(),
	p9: int({ unsigned: true }).default(0).notNull(),
	formClass: varchar("form_class", { length: 255 }),
},
(table) => [
	index("menu_parent_expand_child").on(table.menuName, table.expanded, table.hasChildren, table.parent),
	index("menu_parents").on(table.menuName, table.p1, table.p2, table.p3, table.p4, table.p5, table.p6, table.p7, table.p8, table.p9),
	index("route_values").on(table.routeName, table.routeParamKey),
	primaryKey({ columns: [table.mlid], name: "menu_tree_mlid"}),
	unique("id").on(table.id),
]);

export const node = mysqlTable("node", {
	nid: int({ unsigned: true }).autoincrement().notNull(),
	vid: int({ unsigned: true }),
	type: varchar({ length: 32 }).notNull(),
	uuid: varchar({ length: 128 }).notNull(),
	langcode: varchar({ length: 12 }).notNull(),
},
(table) => [
	index("node_field__type__target_id").on(table.type),
	primaryKey({ columns: [table.nid], name: "node_nid"}),
	unique("node__vid").on(table.vid),
	unique("node_field__uuid__value").on(table.uuid),
]);

export const nodeBody = mysqlTable("node__body", {
	bundle: varchar({ length: 128 }).default('').notNull(),
	deleted: tinyint().default(0).notNull(),
	entityId: int("entity_id", { unsigned: true }).notNull(),
	revisionId: int("revision_id", { unsigned: true }).notNull(),
	langcode: varchar({ length: 32 }).default('').notNull(),
	delta: int({ unsigned: true }).notNull(),
	bodyValue: longtext("body_value").notNull(),
	bodySummary: longtext("body_summary"),
	bodyFormat: varchar("body_format", { length: 255 }),
},
(table) => [
	index("body_format").on(table.bodyFormat),
	index("bundle").on(table.bundle),
	index("revision_id").on(table.revisionId),
	primaryKey({ columns: [table.entityId, table.deleted, table.delta, table.langcode], name: "node__body_entity_id_deleted_delta_langcode"}),
]);

export const nodeComment = mysqlTable("node__comment", {
	bundle: varchar({ length: 128 }).default('').notNull(),
	deleted: tinyint().default(0).notNull(),
	entityId: int("entity_id", { unsigned: true }).notNull(),
	revisionId: int("revision_id", { unsigned: true }).notNull(),
	langcode: varchar({ length: 32 }).default('').notNull(),
	delta: int({ unsigned: true }).notNull(),
	commentStatus: int("comment_status").default(0).notNull(),
},
(table) => [
	index("bundle").on(table.bundle),
	index("revision_id").on(table.revisionId),
	primaryKey({ columns: [table.entityId, table.deleted, table.delta, table.langcode], name: "node__comment_entity_id_deleted_delta_langcode"}),
]);

export const nodeFieldImage = mysqlTable("node__field_image", {
	bundle: varchar({ length: 128 }).default('').notNull(),
	deleted: tinyint().default(0).notNull(),
	entityId: int("entity_id", { unsigned: true }).notNull(),
	revisionId: int("revision_id", { unsigned: true }).notNull(),
	langcode: varchar({ length: 32 }).default('').notNull(),
	delta: int({ unsigned: true }).notNull(),
	fieldImageTargetId: int("field_image_target_id", { unsigned: true }).notNull(),
	fieldImageAlt: varchar("field_image_alt", { length: 512 }),
	fieldImageTitle: varchar("field_image_title", { length: 1024 }),
	fieldImageWidth: int("field_image_width", { unsigned: true }),
	fieldImageHeight: int("field_image_height", { unsigned: true }),
},
(table) => [
	index("bundle").on(table.bundle),
	index("field_image_target_id").on(table.fieldImageTargetId),
	index("revision_id").on(table.revisionId),
	primaryKey({ columns: [table.entityId, table.deleted, table.delta, table.langcode], name: "node__field_image_entity_id_deleted_delta_langcode"}),
]);

export const nodeFieldTags = mysqlTable("node__field_tags", {
	bundle: varchar({ length: 128 }).default('').notNull(),
	deleted: tinyint().default(0).notNull(),
	entityId: int("entity_id", { unsigned: true }).notNull(),
	revisionId: int("revision_id", { unsigned: true }).notNull(),
	langcode: varchar({ length: 32 }).default('').notNull(),
	delta: int({ unsigned: true }).notNull(),
	fieldTagsTargetId: int("field_tags_target_id", { unsigned: true }).notNull(),
},
(table) => [
	index("bundle").on(table.bundle),
	index("field_tags_target_id").on(table.fieldTagsTargetId),
	index("revision_id").on(table.revisionId),
	primaryKey({ columns: [table.entityId, table.deleted, table.delta, table.langcode], name: "node__field_tags_entity_id_deleted_delta_langcode"}),
]);

export const nodeAccess = mysqlTable("node_access", {
	nid: int({ unsigned: true }).default(0).notNull(),
	langcode: varchar({ length: 12 }).default('').notNull(),
	fallback: tinyint({ unsigned: true }).default(1).notNull(),
	gid: int({ unsigned: true }).default(0).notNull(),
	realm: varchar({ length: 255 }).default('').notNull(),
	grantView: tinyint("grant_view", { unsigned: true }).default(0).notNull(),
	grantUpdate: tinyint("grant_update", { unsigned: true }).default(0).notNull(),
	grantDelete: tinyint("grant_delete", { unsigned: true }).default(0).notNull(),
},
(table) => [
	primaryKey({ columns: [table.nid, table.gid, table.realm, table.langcode], name: "node_access_nid_gid_realm_langcode"}),
]);

export const nodeFieldData = mysqlTable("node_field_data", {
	nid: int({ unsigned: true }).notNull(),
	vid: int({ unsigned: true }).notNull(),
	type: varchar({ length: 32 }).notNull(),
	langcode: varchar({ length: 12 }).notNull(),
	status: tinyint().notNull(),
	uid: int({ unsigned: true }).notNull(),
	title: varchar({ length: 255 }).notNull(),
	created: int().notNull(),
	changed: int().notNull(),
	promote: tinyint().notNull(),
	sticky: tinyint().notNull(),
	defaultLangcode: tinyint("default_langcode").notNull(),
	revisionTranslationAffected: tinyint("revision_translation_affected"),
},
(table) => [
	index("node__frontpage").on(table.promote, table.status, table.sticky, table.created),
	index("node__id__default_langcode__langcode").on(table.nid, table.defaultLangcode, table.langcode),
	index("node__status_type").on(table.status, table.type, table.nid),
	index("node__title_type").on(table.title, table.type),
	index("node__vid").on(table.vid),
	index("node_field__changed").on(table.changed),
	index("node_field__created").on(table.created),
	index("node_field__type__target_id").on(table.type),
	index("node_field__uid__target_id").on(table.uid),
	primaryKey({ columns: [table.nid, table.langcode], name: "node_field_data_nid_langcode"}),
]);

export const nodeFieldRevision = mysqlTable("node_field_revision", {
	nid: int({ unsigned: true }).notNull(),
	vid: int({ unsigned: true }).notNull(),
	langcode: varchar({ length: 12 }).notNull(),
	status: tinyint().notNull(),
	uid: int({ unsigned: true }).notNull(),
	title: varchar({ length: 255 }),
	created: int(),
	changed: int(),
	promote: tinyint(),
	sticky: tinyint(),
	defaultLangcode: tinyint("default_langcode").notNull(),
	revisionTranslationAffected: tinyint("revision_translation_affected"),
},
(table) => [
	index("node__id__default_langcode__langcode").on(table.nid, table.defaultLangcode, table.langcode),
	index("node_field__uid__target_id").on(table.uid),
	primaryKey({ columns: [table.vid, table.langcode], name: "node_field_revision_vid_langcode"}),
]);

export const nodeRevision = mysqlTable("node_revision", {
	nid: int({ unsigned: true }).notNull(),
	vid: int({ unsigned: true }).autoincrement().notNull(),
	langcode: varchar({ length: 12 }).notNull(),
	revisionUid: int("revision_uid", { unsigned: true }),
	revisionTimestamp: int("revision_timestamp"),
	revisionLog: longtext("revision_log"),
	revisionDefault: tinyint("revision_default"),
},
(table) => [
	index("node__nid").on(table.nid),
	index("node_field__langcode").on(table.langcode),
	index("node_field__revision_uid__target_id").on(table.revisionUid),
	primaryKey({ columns: [table.vid], name: "node_revision_vid"}),
]);

export const nodeRevisionBody = mysqlTable("node_revision__body", {
	bundle: varchar({ length: 128 }).default('').notNull(),
	deleted: tinyint().default(0).notNull(),
	entityId: int("entity_id", { unsigned: true }).notNull(),
	revisionId: int("revision_id", { unsigned: true }).notNull(),
	langcode: varchar({ length: 32 }).default('').notNull(),
	delta: int({ unsigned: true }).notNull(),
	bodyValue: longtext("body_value").notNull(),
	bodySummary: longtext("body_summary"),
	bodyFormat: varchar("body_format", { length: 255 }),
},
(table) => [
	index("body_format").on(table.bodyFormat),
	index("bundle").on(table.bundle),
	index("revision_id").on(table.revisionId),
	primaryKey({ columns: [table.entityId, table.revisionId, table.deleted, table.delta, table.langcode], name: "node_revision__body_entity_id_revision_id_deleted_delta_langcode"}),
]);

export const nodeRevisionComment = mysqlTable("node_revision__comment", {
	bundle: varchar({ length: 128 }).default('').notNull(),
	deleted: tinyint().default(0).notNull(),
	entityId: int("entity_id", { unsigned: true }).notNull(),
	revisionId: int("revision_id", { unsigned: true }).notNull(),
	langcode: varchar({ length: 32 }).default('').notNull(),
	delta: int({ unsigned: true }).notNull(),
	commentStatus: int("comment_status").default(0).notNull(),
},
(table) => [
	index("bundle").on(table.bundle),
	index("revision_id").on(table.revisionId),
	primaryKey({ columns: [table.entityId, table.revisionId, table.deleted, table.delta, table.langcode], name: "node_revision__comment_entity_id_revision_id_deleted_delta_langcode"}),
]);

export const nodeRevisionFieldImage = mysqlTable("node_revision__field_image", {
	bundle: varchar({ length: 128 }).default('').notNull(),
	deleted: tinyint().default(0).notNull(),
	entityId: int("entity_id", { unsigned: true }).notNull(),
	revisionId: int("revision_id", { unsigned: true }).notNull(),
	langcode: varchar({ length: 32 }).default('').notNull(),
	delta: int({ unsigned: true }).notNull(),
	fieldImageTargetId: int("field_image_target_id", { unsigned: true }).notNull(),
	fieldImageAlt: varchar("field_image_alt", { length: 512 }),
	fieldImageTitle: varchar("field_image_title", { length: 1024 }),
	fieldImageWidth: int("field_image_width", { unsigned: true }),
	fieldImageHeight: int("field_image_height", { unsigned: true }),
},
(table) => [
	index("bundle").on(table.bundle),
	index("field_image_target_id").on(table.fieldImageTargetId),
	index("revision_id").on(table.revisionId),
	primaryKey({ columns: [table.entityId, table.revisionId, table.deleted, table.delta, table.langcode], name: "node_revision__field_image_entity_id_revision_id_deleted_delta_langcode"}),
]);

export const nodeRevisionFieldTags = mysqlTable("node_revision__field_tags", {
	bundle: varchar({ length: 128 }).default('').notNull(),
	deleted: tinyint().default(0).notNull(),
	entityId: int("entity_id", { unsigned: true }).notNull(),
	revisionId: int("revision_id", { unsigned: true }).notNull(),
	langcode: varchar({ length: 32 }).default('').notNull(),
	delta: int({ unsigned: true }).notNull(),
	fieldTagsTargetId: int("field_tags_target_id", { unsigned: true }).notNull(),
},
(table) => [
	index("bundle").on(table.bundle),
	index("field_tags_target_id").on(table.fieldTagsTargetId),
	index("revision_id").on(table.revisionId),
	primaryKey({ columns: [table.entityId, table.revisionId, table.deleted, table.delta, table.langcode], name: "node_revision__field_tags_entity_id_revision_id_deleted_delta_langcode"}),
]);

export const pathAlias = mysqlTable("path_alias", {
	id: int({ unsigned: true }).autoincrement().notNull(),
	revisionId: int("revision_id", { unsigned: true }),
	uuid: varchar({ length: 128 }).notNull(),
	langcode: varchar({ length: 12 }).notNull(),
	path: varchar({ length: 255 }),
	alias: varchar({ length: 255 }),
	status: tinyint().notNull(),
},
(table) => [
	index("path_alias__alias_langcode_id_status").on(table.alias, table.langcode, table.id, table.status),
	index("path_alias__path_langcode_id_status").on(table.path, table.langcode, table.id, table.status),
	primaryKey({ columns: [table.id], name: "path_alias_id"}),
	unique("path_alias__revision_id").on(table.revisionId),
	unique("path_alias_field__uuid__value").on(table.uuid),
]);

export const pathAliasRevision = mysqlTable("path_alias_revision", {
	id: int({ unsigned: true }).notNull(),
	revisionId: int("revision_id", { unsigned: true }).autoincrement().notNull(),
	langcode: varchar({ length: 12 }).notNull(),
	path: varchar({ length: 255 }),
	alias: varchar({ length: 255 }),
	status: tinyint().notNull(),
	revisionDefault: tinyint("revision_default"),
},
(table) => [
	index("path_alias__id").on(table.id),
	index("path_alias_revision__alias_langcode_id_status").on(table.alias, table.langcode, table.id, table.status),
	index("path_alias_revision__path_langcode_id_status").on(table.path, table.langcode, table.id, table.status),
	primaryKey({ columns: [table.revisionId], name: "path_alias_revision_revision_id"}),
]);

export const queue = mysqlTable("queue", {
	itemId: int("item_id", { unsigned: true }).autoincrement().notNull(),
	name: varchar({ length: 255 }).default('').notNull(),
	// Warning: Can't parse longblob from database
	// longblobType: longblob("data"),
	expire: bigint({ mode: "number" }).notNull(),
	created: bigint({ mode: "number" }).notNull(),
},
(table) => [
	index("expire").on(table.expire),
	index("name_created").on(table.name, table.created),
	primaryKey({ columns: [table.itemId], name: "queue_item_id"}),
]);

export const redirect = mysqlTable("redirect", {
	rid: int().autoincrement().notNull(),
	type: varchar({ length: 255 }).notNull(),
	uuid: varchar({ length: 128 }).notNull(),
	language: varchar({ length: 12 }).notNull(),
	hash: varchar({ length: 64 }),
	uid: int({ unsigned: true }),
	redirectSourcePath: varchar("redirect_source__path", { length: 2048 }),
	// Warning: Can't parse longblob from database
	// longblobType: longblob("redirect_source__query"),
	redirectRedirectUri: varchar("redirect_redirect__uri", { length: 2048 }),
	redirectRedirectTitle: varchar("redirect_redirect__title", { length: 255 }),
	// Warning: Can't parse longblob from database
	// longblobType: longblob("redirect_redirect__options"),
	statusCode: int("status_code"),
	created: int(),
	enabled: tinyint().notNull(),
},
(table) => [
	index("redirect__enabled_type").on(table.enabled, table.type, table.rid),
	index("redirect_field__redirect_redirect__uri").on(table.redirectRedirectUri),
	index("redirect_field__redirect_source__path").on(table.redirectSourcePath),
	index("redirect_field__uid__target_id").on(table.uid),
	index("source_language").on(table.redirectSourcePath, table.language),
	primaryKey({ columns: [table.rid], name: "redirect_rid"}),
	unique("hash").on(table.hash),
	unique("redirect_field__uuid__value").on(table.uuid),
]);

export const router = mysqlTable("router", {
	name: varchar({ length: 255 }).default('').notNull(),
	path: varchar({ length: 255 }).default('').notNull(),
	patternOutline: varchar("pattern_outline", { length: 255 }).default('').notNull(),
	fit: int().default(0).notNull(),
	// Warning: Can't parse longblob from database
	// longblobType: longblob("route"),
	numberParts: smallint("number_parts").notNull(),
	alias: varchar({ length: 255 }),
},
(table) => [
	index("alias").on(table.alias),
	index("pattern_outline_parts").on(table.patternOutline, table.numberParts),
	primaryKey({ columns: [table.name], name: "router_name"}),
]);

export const searchDataset = mysqlTable("search_dataset", {
	sid: int({ unsigned: true }).default(0).notNull(),
	langcode: varchar({ length: 12 }).default('').notNull(),
	type: varchar({ length: 64 }).notNull(),
	data: longtext().notNull(),
	reindex: int({ unsigned: true }).default(0).notNull(),
},
(table) => [
	primaryKey({ columns: [table.sid, table.langcode, table.type], name: "search_dataset_sid_langcode_type"}),
]);

export const searchIndex = mysqlTable("search_index", {
	word: varchar({ length: 50 }).default('').notNull(),
	sid: int({ unsigned: true }).default(0).notNull(),
	langcode: varchar({ length: 12 }).default('').notNull(),
	type: varchar({ length: 64 }).notNull(),
	score: float(),
},
(table) => [
	index("sid_type").on(table.sid, table.langcode, table.type),
	primaryKey({ columns: [table.word, table.sid, table.langcode, table.type], name: "search_index_word_sid_langcode_type"}),
]);

export const searchTotal = mysqlTable("search_total", {
	word: varchar({ length: 50 }).default('').notNull(),
	count: float(),
},
(table) => [
	primaryKey({ columns: [table.word], name: "search_total_word"}),
]);

export const semaphore = mysqlTable("semaphore", {
	name: varchar({ length: 255 }).default('').notNull(),
	value: varchar({ length: 255 }).default('').notNull(),
	expire: double().notNull(),
},
(table) => [
	index("expire").on(table.expire),
	index("value").on(table.value),
	primaryKey({ columns: [table.name], name: "semaphore_name"}),
]);

export const sequences = mysqlTable("sequences", {
	value: int({ unsigned: true }).autoincrement().notNull(),
},
(table) => [
	primaryKey({ columns: [table.value], name: "sequences_value"}),
]);

export const sessions = mysqlTable("sessions", {
	uid: int({ unsigned: true }).notNull(),
	sid: varchar({ length: 128 }).notNull(),
	hostname: varchar({ length: 128 }).default('').notNull(),
	timestamp: bigint({ mode: "number" }).notNull(),
	// Warning: Can't parse longblob from database
	// longblobType: longblob("session"),
},
(table) => [
	index("timestamp").on(table.timestamp),
	index("uid").on(table.uid),
	primaryKey({ columns: [table.sid], name: "sessions_sid"}),
]);

export const shortcut = mysqlTable("shortcut", {
	id: int({ unsigned: true }).autoincrement().notNull(),
	shortcutSet: varchar("shortcut_set", { length: 32 }).notNull(),
	uuid: varchar({ length: 128 }).notNull(),
	langcode: varchar({ length: 12 }).notNull(),
},
(table) => [
	index("shortcut_field__shortcut_set__target_id").on(table.shortcutSet),
	primaryKey({ columns: [table.id], name: "shortcut_id"}),
	unique("shortcut_field__uuid__value").on(table.uuid),
]);

export const shortcutFieldData = mysqlTable("shortcut_field_data", {
	id: int({ unsigned: true }).notNull(),
	shortcutSet: varchar("shortcut_set", { length: 32 }).notNull(),
	langcode: varchar({ length: 12 }).notNull(),
	title: varchar({ length: 255 }),
	weight: int(),
	linkUri: varchar("link__uri", { length: 2048 }),
	linkTitle: varchar("link__title", { length: 255 }),
	// Warning: Can't parse longblob from database
	// longblobType: longblob("link__options"),
	defaultLangcode: tinyint("default_langcode").notNull(),
},
(table) => [
	index("shortcut__id__default_langcode__langcode").on(table.id, table.defaultLangcode, table.langcode),
	index("shortcut_field__link__uri").on(table.linkUri),
	index("shortcut_field__shortcut_set__target_id").on(table.shortcutSet),
	primaryKey({ columns: [table.id, table.langcode], name: "shortcut_field_data_id_langcode"}),
]);

export const shortcutSetUsers = mysqlTable("shortcut_set_users", {
	uid: int({ unsigned: true }).default(0).notNull(),
	setName: varchar("set_name", { length: 32 }).default('').notNull(),
},
(table) => [
	index("set_name").on(table.setName),
	primaryKey({ columns: [table.uid], name: "shortcut_set_users_uid"}),
]);

export const taxonomyIndex = mysqlTable("taxonomy_index", {
	nid: int({ unsigned: true }).default(0).notNull(),
	tid: int({ unsigned: true }).default(0).notNull(),
	status: int().default(1).notNull(),
	sticky: tinyint().default(0),
	created: int().default(0).notNull(),
},
(table) => [
	index("term_node").on(table.tid, table.status, table.sticky, table.created),
	primaryKey({ columns: [table.nid, table.tid], name: "taxonomy_index_nid_tid"}),
]);

export const taxonomyTermParent = mysqlTable("taxonomy_term__parent", {
	bundle: varchar({ length: 128 }).default('').notNull(),
	deleted: tinyint().default(0).notNull(),
	entityId: int("entity_id", { unsigned: true }).notNull(),
	revisionId: int("revision_id", { unsigned: true }).notNull(),
	langcode: varchar({ length: 32 }).default('').notNull(),
	delta: int({ unsigned: true }).notNull(),
	parentTargetId: int("parent_target_id", { unsigned: true }).notNull(),
},
(table) => [
	index("bundle_delta_target_id").on(table.bundle, table.delta, table.parentTargetId),
	index("parent_target_id").on(table.parentTargetId),
	index("revision_id").on(table.revisionId),
	primaryKey({ columns: [table.entityId, table.deleted, table.delta, table.langcode], name: "taxonomy_term__parent_entity_id_deleted_delta_langcode"}),
]);

export const taxonomyTermData = mysqlTable("taxonomy_term_data", {
	tid: int({ unsigned: true }).autoincrement().notNull(),
	revisionId: int("revision_id", { unsigned: true }),
	vid: varchar({ length: 32 }).notNull(),
	uuid: varchar({ length: 128 }).notNull(),
	langcode: varchar({ length: 12 }).notNull(),
},
(table) => [
	index("taxonomy_term_field__vid__target_id").on(table.vid),
	primaryKey({ columns: [table.tid], name: "taxonomy_term_data_tid"}),
	unique("taxonomy_term__revision_id").on(table.revisionId),
	unique("taxonomy_term_field__uuid__value").on(table.uuid),
]);

export const taxonomyTermFieldData = mysqlTable("taxonomy_term_field_data", {
	tid: int({ unsigned: true }).notNull(),
	revisionId: int("revision_id", { unsigned: true }).notNull(),
	vid: varchar({ length: 32 }).notNull(),
	langcode: varchar({ length: 12 }).notNull(),
	status: tinyint().notNull(),
	name: varchar({ length: 255 }).notNull(),
	descriptionValue: longtext("description__value"),
	descriptionFormat: varchar("description__format", { length: 255 }),
	weight: int().notNull(),
	changed: int(),
	defaultLangcode: tinyint("default_langcode").notNull(),
	revisionTranslationAffected: tinyint("revision_translation_affected"),
},
(table) => [
	index("taxonomy_term__id__default_langcode__langcode").on(table.tid, table.defaultLangcode, table.langcode),
	index("taxonomy_term__revision_id").on(table.revisionId),
	index("taxonomy_term__status_vid").on(table.status, table.vid, table.tid),
	index("taxonomy_term__tree").on(table.vid, table.weight, table.name),
	index("taxonomy_term__vid_name").on(table.vid, table.name),
	index("taxonomy_term_field__name").on(table.name),
	primaryKey({ columns: [table.tid, table.langcode], name: "taxonomy_term_field_data_tid_langcode"}),
]);

export const taxonomyTermFieldRevision = mysqlTable("taxonomy_term_field_revision", {
	tid: int({ unsigned: true }).notNull(),
	revisionId: int("revision_id", { unsigned: true }).notNull(),
	langcode: varchar({ length: 12 }).notNull(),
	status: tinyint().notNull(),
	name: varchar({ length: 255 }),
	descriptionValue: longtext("description__value"),
	descriptionFormat: varchar("description__format", { length: 255 }),
	changed: int(),
	defaultLangcode: tinyint("default_langcode").notNull(),
	revisionTranslationAffected: tinyint("revision_translation_affected"),
},
(table) => [
	index("taxonomy_term__id__default_langcode__langcode").on(table.tid, table.defaultLangcode, table.langcode),
	index("taxonomy_term_field__description__format").on(table.descriptionFormat),
	primaryKey({ columns: [table.revisionId, table.langcode], name: "taxonomy_term_field_revision_revision_id_langcode"}),
]);

export const taxonomyTermRevision = mysqlTable("taxonomy_term_revision", {
	tid: int({ unsigned: true }).notNull(),
	revisionId: int("revision_id", { unsigned: true }).autoincrement().notNull(),
	langcode: varchar({ length: 12 }).notNull(),
	revisionUser: int("revision_user", { unsigned: true }),
	revisionCreated: int("revision_created"),
	revisionLogMessage: longtext("revision_log_message"),
	revisionDefault: tinyint("revision_default"),
},
(table) => [
	index("taxonomy_term__tid").on(table.tid),
	index("taxonomy_term_field__revision_user__target_id").on(table.revisionUser),
	primaryKey({ columns: [table.revisionId], name: "taxonomy_term_revision_revision_id"}),
]);

export const taxonomyTermRevisionParent = mysqlTable("taxonomy_term_revision__parent", {
	bundle: varchar({ length: 128 }).default('').notNull(),
	deleted: tinyint().default(0).notNull(),
	entityId: int("entity_id", { unsigned: true }).notNull(),
	revisionId: int("revision_id", { unsigned: true }).notNull(),
	langcode: varchar({ length: 32 }).default('').notNull(),
	delta: int({ unsigned: true }).notNull(),
	parentTargetId: int("parent_target_id", { unsigned: true }).notNull(),
},
(table) => [
	index("bundle").on(table.bundle),
	index("parent_target_id").on(table.parentTargetId),
	index("revision_id").on(table.revisionId),
	primaryKey({ columns: [table.entityId, table.revisionId, table.deleted, table.delta, table.langcode], name: "taxonomy_term_revision__parent_entity_id_revision_id_deleted_delta_langcode"}),
]);

export const userRoles = mysqlTable("user__roles", {
	bundle: varchar({ length: 128 }).default('').notNull(),
	deleted: tinyint().default(0).notNull(),
	entityId: int("entity_id", { unsigned: true }).notNull(),
	revisionId: int("revision_id", { unsigned: true }).notNull(),
	langcode: varchar({ length: 32 }).default('').notNull(),
	delta: int({ unsigned: true }).notNull(),
	rolesTargetId: varchar("roles_target_id", { length: 255 }).notNull(),
},
(table) => [
	index("bundle").on(table.bundle),
	index("revision_id").on(table.revisionId),
	index("roles_target_id").on(table.rolesTargetId),
	primaryKey({ columns: [table.entityId, table.deleted, table.delta, table.langcode], name: "user__roles_entity_id_deleted_delta_langcode"}),
]);

export const userUserPicture = mysqlTable("user__user_picture", {
	bundle: varchar({ length: 128 }).default('').notNull(),
	deleted: tinyint().default(0).notNull(),
	entityId: int("entity_id", { unsigned: true }).notNull(),
	revisionId: int("revision_id", { unsigned: true }).notNull(),
	langcode: varchar({ length: 32 }).default('').notNull(),
	delta: int({ unsigned: true }).notNull(),
	userPictureTargetId: int("user_picture_target_id", { unsigned: true }).notNull(),
	userPictureAlt: varchar("user_picture_alt", { length: 512 }),
	userPictureTitle: varchar("user_picture_title", { length: 1024 }),
	userPictureWidth: int("user_picture_width", { unsigned: true }),
	userPictureHeight: int("user_picture_height", { unsigned: true }),
},
(table) => [
	index("bundle").on(table.bundle),
	index("revision_id").on(table.revisionId),
	index("user_picture_target_id").on(table.userPictureTargetId),
	primaryKey({ columns: [table.entityId, table.deleted, table.delta, table.langcode], name: "user__user_picture_entity_id_deleted_delta_langcode"}),
]);

export const users = mysqlTable("users", {
	uid: int({ unsigned: true }).autoincrement().notNull(),
	uuid: varchar({ length: 128 }).notNull(),
	langcode: varchar({ length: 12 }).notNull(),
},
(table) => [
	primaryKey({ columns: [table.uid], name: "users_uid"}),
	unique("user_field__uuid__value").on(table.uuid),
]);

export const usersData = mysqlTable("users_data", {
	uid: int({ unsigned: true }).default(0).notNull(),
	module: varchar({ length: 50 }).default('').notNull(),
	name: varchar({ length: 128 }).default('').notNull(),
	// Warning: Can't parse longblob from database
	// longblobType: longblob("value"),
	serialized: tinyint({ unsigned: true }).default(0),
},
(table) => [
	index("module").on(table.module),
	index("name").on(table.name),
	primaryKey({ columns: [table.uid, table.module, table.name], name: "users_data_uid_module_name"}),
]);

export const usersFieldData = mysqlTable("users_field_data", {
	uid: int({ unsigned: true }).notNull(),
	langcode: varchar({ length: 12 }).notNull(),
	preferredLangcode: varchar("preferred_langcode", { length: 12 }),
	preferredAdminLangcode: varchar("preferred_admin_langcode", { length: 12 }),
	name: varchar({ length: 60 }).notNull(),
	pass: varchar({ length: 255 }),
	mail: varchar({ length: 254 }),
	timezone: varchar({ length: 32 }),
	status: tinyint(),
	created: int().notNull(),
	changed: int(),
	access: int().notNull(),
	login: int(),
	init: varchar({ length: 254 }),
	defaultLangcode: tinyint("default_langcode").notNull(),
},
(table) => [
	index("user__id__default_langcode__langcode").on(table.uid, table.defaultLangcode, table.langcode),
	index("user_field__access").on(table.access),
	index("user_field__created").on(table.created),
	index("user_field__mail").on(table.mail),
	primaryKey({ columns: [table.uid, table.langcode], name: "users_field_data_uid_langcode"}),
	unique("user__name").on(table.name, table.langcode),
]);

export const watchdog = mysqlTable("watchdog", {
	wid: bigint({ mode: "number" }).autoincrement().notNull(),
	uid: int({ unsigned: true }).default(0).notNull(),
	type: varchar({ length: 64 }).default('').notNull(),
	message: longtext().notNull(),
	// Warning: Can't parse longblob from database
	// longblobType: longblob("variables").notNull(),
	severity: tinyint({ unsigned: true }).default(0).notNull(),
	link: text(),
	location: text().notNull(),
	referer: text(),
	hostname: varchar({ length: 128 }).default('').notNull(),
	timestamp: bigint({ mode: "number" }).notNull(),
},
(table) => [
	index("severity").on(table.severity),
	index("type").on(table.type),
	index("uid").on(table.uid),
	primaryKey({ columns: [table.wid], name: "watchdog_wid"}),
]);
