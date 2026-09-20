CREATE TABLE "collection_memberships" (
	"dataset" text NOT NULL,
	"collection_id" text NOT NULL,
	"listing_id" text NOT NULL,
	"rationale" text NOT NULL,
	CONSTRAINT "collection_memberships_dataset_collection_id_listing_id_pk" PRIMARY KEY("dataset","collection_id","listing_id")
);
--> statement-breakpoint
CREATE TABLE "collections" (
	"dataset" text NOT NULL,
	"id" text NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"rationale" text NOT NULL,
	CONSTRAINT "collections_dataset_id_pk" PRIMARY KEY("dataset","id"),
	CONSTRAINT "collections_dataset_slug_unique" UNIQUE("dataset","slug")
);
--> statement-breakpoint
CREATE TABLE "concepts" (
	"dataset" text NOT NULL,
	"id" text NOT NULL,
	"key" text NOT NULL,
	"definition" text NOT NULL,
	"formula" text NOT NULL,
	"limitations" text NOT NULL,
	"body" text NOT NULL,
	CONSTRAINT "concepts_dataset_id_pk" PRIMARY KEY("dataset","id"),
	CONSTRAINT "concepts_dataset_key_unique" UNIQUE("dataset","key")
);
--> statement-breakpoint
CREATE TABLE "recorded_events" (
	"dataset" text NOT NULL,
	"id" text NOT NULL,
	"kind" text NOT NULL,
	"occurred_at" timestamp with time zone NOT NULL,
	"published_at" timestamp with time zone NOT NULL,
	"summary" text NOT NULL,
	"issuer_id" text,
	"sector_id" text NOT NULL,
	"evidence_id" text NOT NULL,
	CONSTRAINT "recorded_events_dataset_id_pk" PRIMARY KEY("dataset","id"),
	CONSTRAINT "event_chronology" CHECK ("recorded_events"."occurred_at" <= "recorded_events"."published_at")
);
--> statement-breakpoint
CREATE TABLE "evidence_offers" (
	"dataset" text NOT NULL,
	"evidence_id" text NOT NULL,
	"offer_id" text NOT NULL,
	"rationale" text NOT NULL,
	CONSTRAINT "evidence_offers_dataset_evidence_id_offer_id_pk" PRIMARY KEY("dataset","evidence_id","offer_id")
);
--> statement-breakpoint
CREATE TABLE "evidence_sectors" (
	"dataset" text NOT NULL,
	"evidence_id" text NOT NULL,
	"sector_id" text NOT NULL,
	"rationale" text NOT NULL,
	CONSTRAINT "evidence_sectors_dataset_evidence_id_sector_id_pk" PRIMARY KEY("dataset","evidence_id","sector_id")
);
--> statement-breakpoint
CREATE TABLE "ipo_assumptions" (
	"dataset" text NOT NULL,
	"id" text NOT NULL,
	"offer_id" text NOT NULL,
	"cutoff" timestamp with time zone NOT NULL,
	"method" text NOT NULL,
	"window" text NOT NULL,
	"cases" jsonb NOT NULL,
	"digest" text NOT NULL,
	CONSTRAINT "ipo_assumptions_dataset_id_pk" PRIMARY KEY("dataset","id"),
	CONSTRAINT "ipo_assumptions_dataset_offer_id_cutoff_unique" UNIQUE("dataset","offer_id","cutoff"),
	CONSTRAINT "ipo_scenario_window" CHECK ("ipo_assumptions"."window"='listing-day')
);
--> statement-breakpoint
CREATE TABLE "ipo_evidence" (
	"dataset" text NOT NULL,
	"snapshot_id" text NOT NULL,
	"evidence_id" text NOT NULL,
	CONSTRAINT "ipo_evidence_dataset_snapshot_id_evidence_id_pk" PRIMARY KEY("dataset","snapshot_id","evidence_id")
);
--> statement-breakpoint
CREATE TABLE "ipo_financial_inputs" (
	"dataset" text NOT NULL,
	"snapshot_id" text NOT NULL,
	"period_id" text NOT NULL,
	CONSTRAINT "ipo_financial_inputs_dataset_snapshot_id_period_id_pk" PRIMARY KEY("dataset","snapshot_id","period_id")
);
--> statement-breakpoint
CREATE TABLE "ipo_peer_inputs" (
	"dataset" text NOT NULL,
	"snapshot_id" text NOT NULL,
	"listing_id" text NOT NULL,
	CONSTRAINT "ipo_peer_inputs_dataset_snapshot_id_listing_id_pk" PRIMARY KEY("dataset","snapshot_id","listing_id")
);
--> statement-breakpoint
CREATE TABLE "ipo_price_inputs" (
	"dataset" text NOT NULL,
	"snapshot_id" text NOT NULL,
	"price_id" text NOT NULL,
	CONSTRAINT "ipo_price_inputs_dataset_snapshot_id_price_id_pk" PRIMARY KEY("dataset","snapshot_id","price_id")
);
--> statement-breakpoint
CREATE TABLE "ipo_snapshots" (
	"dataset" text NOT NULL,
	"id" text NOT NULL,
	"offer_id" text NOT NULL,
	"cutoff" timestamp with time zone NOT NULL,
	"method" text NOT NULL,
	"assumption_id" text NOT NULL,
	"output" jsonb NOT NULL,
	"scenarios" jsonb NOT NULL,
	"digest" text NOT NULL,
	CONSTRAINT "ipo_snapshots_dataset_id_pk" PRIMARY KEY("dataset","id"),
	CONSTRAINT "ipo_snapshots_dataset_offer_id_cutoff_unique" UNIQUE("dataset","offer_id","cutoff")
);
--> statement-breakpoint
CREATE TABLE "offer_holders" (
	"dataset" text NOT NULL,
	"offer_id" text NOT NULL,
	"key" text NOT NULL,
	"label" text NOT NULL,
	"promoter" boolean NOT NULL,
	"pre" numeric(20, 0) NOT NULL,
	"sold" numeric(20, 0) NOT NULL,
	"fresh" numeric(20, 0) NOT NULL,
	"transferred" numeric(20, 0) NOT NULL,
	"source_id" text NOT NULL,
	CONSTRAINT "offer_holders_dataset_offer_id_key_pk" PRIMARY KEY("dataset","offer_id","key"),
	CONSTRAINT "holder_quantities" CHECK ("offer_holders"."pre">=0 and "offer_holders"."sold">=0 and "offer_holders"."sold"<="offer_holders"."pre" and "offer_holders"."fresh">=0 and "offer_holders"."transferred">=0)
);
--> statement-breakpoint
CREATE TABLE "offer_proceeds" (
	"dataset" text NOT NULL,
	"offer_id" text NOT NULL,
	"key" text NOT NULL,
	"purpose" text NOT NULL,
	"fraction" numeric(13, 12) NOT NULL,
	"source_id" text NOT NULL,
	CONSTRAINT "offer_proceeds_dataset_offer_id_key_pk" PRIMARY KEY("dataset","offer_id","key"),
	CONSTRAINT "proceeds_fraction" CHECK ("offer_proceeds"."fraction">0 and "offer_proceeds"."fraction"<=1)
);
--> statement-breakpoint
CREATE TABLE "offer_reservations" (
	"dataset" text NOT NULL,
	"offer_id" text NOT NULL,
	"category" text NOT NULL,
	"shares" numeric(20, 0) NOT NULL,
	"source_id" text NOT NULL,
	CONSTRAINT "offer_reservations_dataset_offer_id_category_pk" PRIMARY KEY("dataset","offer_id","category"),
	CONSTRAINT "reservation_positive" CHECK ("offer_reservations"."shares">0)
);
--> statement-breakpoint
CREATE TABLE "offer_subscriptions" (
	"dataset" text NOT NULL,
	"offer_id" text NOT NULL,
	"category" text NOT NULL,
	"observed_at" timestamp with time zone NOT NULL,
	"subscribed" numeric(20, 0) NOT NULL,
	"source_id" text NOT NULL,
	CONSTRAINT "offer_subscriptions_dataset_offer_id_category_observed_at_pk" PRIMARY KEY("dataset","offer_id","category","observed_at"),
	CONSTRAINT "subscription_nonnegative" CHECK ("offer_subscriptions"."subscribed">=0)
);
--> statement-breakpoint
CREATE TABLE "ipo_offers" (
	"dataset" text NOT NULL,
	"id" text NOT NULL,
	"issuer_id" text NOT NULL,
	"slug" text NOT NULL,
	"opens_at" timestamp with time zone NOT NULL,
	"closes_at" timestamp with time zone NOT NULL,
	"expected_listing" date NOT NULL,
	"actual_listing" timestamp with time zone,
	"listing_id" text,
	"low" numeric(22, 2) NOT NULL,
	"high" numeric(22, 2) NOT NULL,
	"final_price" numeric(22, 2),
	"final_published_at" timestamp with time zone,
	"lot" integer NOT NULL,
	"pre_shares" numeric(20, 0) NOT NULL,
	"fresh_shares" numeric(20, 0) NOT NULL,
	"ofs_shares" numeric(20, 0) NOT NULL,
	"expenses" numeric(22, 2) NOT NULL,
	"terms_published_at" timestamp with time zone NOT NULL,
	"source_id" text NOT NULL,
	"lifecycle_id" text,
	CONSTRAINT "ipo_offers_dataset_id_pk" PRIMARY KEY("dataset","id"),
	CONSTRAINT "ipo_offers_dataset_slug_unique" UNIQUE("dataset","slug"),
	CONSTRAINT "ipo_offers_dataset_issuer_id_unique" UNIQUE("dataset","issuer_id"),
	CONSTRAINT "offer_terms" CHECK ("ipo_offers"."low">0 and "ipo_offers"."high">="ipo_offers"."low" and "ipo_offers"."lot">0 and "ipo_offers"."pre_shares">0 and "ipo_offers"."fresh_shares">=0 and "ipo_offers"."ofs_shares">=0 and "ipo_offers"."fresh_shares"+"ipo_offers"."ofs_shares">0 and "ipo_offers"."expenses">=0 and "ipo_offers"."opens_at"<="ipo_offers"."closes_at" and ("ipo_offers"."actual_listing" is null or "ipo_offers"."closes_at"<"ipo_offers"."actual_listing") and ("ipo_offers"."final_price" is null or "ipo_offers"."final_price" between "ipo_offers"."low" and "ipo_offers"."high"))
);
--> statement-breakpoint
CREATE TABLE "theme_memberships" (
	"dataset" text NOT NULL,
	"theme_id" text NOT NULL,
	"listing_id" text NOT NULL,
	"rationale" text NOT NULL,
	CONSTRAINT "theme_memberships_dataset_theme_id_listing_id_pk" PRIMARY KEY("dataset","theme_id","listing_id")
);
--> statement-breakpoint
CREATE TABLE "themes" (
	"dataset" text NOT NULL,
	"id" text NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"rationale" text NOT NULL,
	CONSTRAINT "themes_dataset_id_pk" PRIMARY KEY("dataset","id"),
	CONSTRAINT "themes_dataset_slug_unique" UNIQUE("dataset","slug")
);
--> statement-breakpoint
ALTER TABLE "dataset_versions" DROP CONSTRAINT "development_profile";--> statement-breakpoint
ALTER TABLE "source_documents" DROP CONSTRAINT "document_type";--> statement-breakpoint
ALTER TABLE "evidence_records" DROP CONSTRAINT "evidence_kind";--> statement-breakpoint
ALTER TABLE "collection_memberships" ADD CONSTRAINT "collection_memberships_dataset_collection_id_collections_dataset_id_fk" FOREIGN KEY ("dataset","collection_id") REFERENCES "public"."collections"("dataset","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "collection_memberships" ADD CONSTRAINT "collection_memberships_dataset_listing_id_listings_dataset_id_fk" FOREIGN KEY ("dataset","listing_id") REFERENCES "public"."listings"("dataset","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "collections" ADD CONSTRAINT "collections_dataset_dataset_versions_version_fk" FOREIGN KEY ("dataset") REFERENCES "public"."dataset_versions"("version") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "concepts" ADD CONSTRAINT "concepts_dataset_dataset_versions_version_fk" FOREIGN KEY ("dataset") REFERENCES "public"."dataset_versions"("version") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "concepts" ADD CONSTRAINT "concepts_dataset_id_evidence_records_dataset_id_fk" FOREIGN KEY ("dataset","id") REFERENCES "public"."evidence_records"("dataset","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recorded_events" ADD CONSTRAINT "recorded_events_dataset_dataset_versions_version_fk" FOREIGN KEY ("dataset") REFERENCES "public"."dataset_versions"("version") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recorded_events" ADD CONSTRAINT "recorded_events_dataset_issuer_id_issuers_dataset_id_fk" FOREIGN KEY ("dataset","issuer_id") REFERENCES "public"."issuers"("dataset","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recorded_events" ADD CONSTRAINT "recorded_events_dataset_sector_id_sectors_dataset_id_fk" FOREIGN KEY ("dataset","sector_id") REFERENCES "public"."sectors"("dataset","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recorded_events" ADD CONSTRAINT "recorded_events_dataset_evidence_id_evidence_records_dataset_id_fk" FOREIGN KEY ("dataset","evidence_id") REFERENCES "public"."evidence_records"("dataset","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evidence_offers" ADD CONSTRAINT "evidence_offers_dataset_evidence_id_evidence_records_dataset_id_fk" FOREIGN KEY ("dataset","evidence_id") REFERENCES "public"."evidence_records"("dataset","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evidence_offers" ADD CONSTRAINT "evidence_offers_dataset_offer_id_ipo_offers_dataset_id_fk" FOREIGN KEY ("dataset","offer_id") REFERENCES "public"."ipo_offers"("dataset","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evidence_sectors" ADD CONSTRAINT "evidence_sectors_dataset_evidence_id_evidence_records_dataset_id_fk" FOREIGN KEY ("dataset","evidence_id") REFERENCES "public"."evidence_records"("dataset","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evidence_sectors" ADD CONSTRAINT "evidence_sectors_dataset_sector_id_sectors_dataset_id_fk" FOREIGN KEY ("dataset","sector_id") REFERENCES "public"."sectors"("dataset","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ipo_assumptions" ADD CONSTRAINT "ipo_assumptions_dataset_dataset_versions_version_fk" FOREIGN KEY ("dataset") REFERENCES "public"."dataset_versions"("version") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ipo_assumptions" ADD CONSTRAINT "ipo_assumptions_method_method_definitions_version_fk" FOREIGN KEY ("method") REFERENCES "public"."method_definitions"("version") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ipo_assumptions" ADD CONSTRAINT "ipo_assumptions_dataset_offer_id_ipo_offers_dataset_id_fk" FOREIGN KEY ("dataset","offer_id") REFERENCES "public"."ipo_offers"("dataset","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ipo_evidence" ADD CONSTRAINT "ipo_evidence_dataset_snapshot_id_ipo_snapshots_dataset_id_fk" FOREIGN KEY ("dataset","snapshot_id") REFERENCES "public"."ipo_snapshots"("dataset","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ipo_evidence" ADD CONSTRAINT "ipo_evidence_dataset_evidence_id_evidence_records_dataset_id_fk" FOREIGN KEY ("dataset","evidence_id") REFERENCES "public"."evidence_records"("dataset","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ipo_financial_inputs" ADD CONSTRAINT "ipo_financial_inputs_dataset_snapshot_id_ipo_snapshots_dataset_id_fk" FOREIGN KEY ("dataset","snapshot_id") REFERENCES "public"."ipo_snapshots"("dataset","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ipo_financial_inputs" ADD CONSTRAINT "ipo_financial_inputs_dataset_period_id_financial_periods_dataset_id_fk" FOREIGN KEY ("dataset","period_id") REFERENCES "public"."financial_periods"("dataset","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ipo_peer_inputs" ADD CONSTRAINT "ipo_peer_inputs_dataset_snapshot_id_ipo_snapshots_dataset_id_fk" FOREIGN KEY ("dataset","snapshot_id") REFERENCES "public"."ipo_snapshots"("dataset","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ipo_peer_inputs" ADD CONSTRAINT "ipo_peer_inputs_dataset_listing_id_listings_dataset_id_fk" FOREIGN KEY ("dataset","listing_id") REFERENCES "public"."listings"("dataset","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ipo_price_inputs" ADD CONSTRAINT "ipo_price_inputs_dataset_snapshot_id_ipo_snapshots_dataset_id_fk" FOREIGN KEY ("dataset","snapshot_id") REFERENCES "public"."ipo_snapshots"("dataset","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ipo_price_inputs" ADD CONSTRAINT "ipo_price_inputs_dataset_price_id_price_closes_dataset_id_fk" FOREIGN KEY ("dataset","price_id") REFERENCES "public"."price_closes"("dataset","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ipo_snapshots" ADD CONSTRAINT "ipo_snapshots_dataset_dataset_versions_version_fk" FOREIGN KEY ("dataset") REFERENCES "public"."dataset_versions"("version") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ipo_snapshots" ADD CONSTRAINT "ipo_snapshots_method_method_definitions_version_fk" FOREIGN KEY ("method") REFERENCES "public"."method_definitions"("version") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ipo_snapshots" ADD CONSTRAINT "ipo_snapshots_dataset_offer_id_ipo_offers_dataset_id_fk" FOREIGN KEY ("dataset","offer_id") REFERENCES "public"."ipo_offers"("dataset","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ipo_snapshots" ADD CONSTRAINT "ipo_snapshots_dataset_assumption_id_ipo_assumptions_dataset_id_fk" FOREIGN KEY ("dataset","assumption_id") REFERENCES "public"."ipo_assumptions"("dataset","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "offer_holders" ADD CONSTRAINT "offer_holders_dataset_offer_id_ipo_offers_dataset_id_fk" FOREIGN KEY ("dataset","offer_id") REFERENCES "public"."ipo_offers"("dataset","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "offer_holders" ADD CONSTRAINT "offer_holders_dataset_source_id_evidence_records_dataset_id_fk" FOREIGN KEY ("dataset","source_id") REFERENCES "public"."evidence_records"("dataset","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "offer_proceeds" ADD CONSTRAINT "offer_proceeds_dataset_offer_id_ipo_offers_dataset_id_fk" FOREIGN KEY ("dataset","offer_id") REFERENCES "public"."ipo_offers"("dataset","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "offer_proceeds" ADD CONSTRAINT "offer_proceeds_dataset_source_id_evidence_records_dataset_id_fk" FOREIGN KEY ("dataset","source_id") REFERENCES "public"."evidence_records"("dataset","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "offer_reservations" ADD CONSTRAINT "offer_reservations_dataset_offer_id_ipo_offers_dataset_id_fk" FOREIGN KEY ("dataset","offer_id") REFERENCES "public"."ipo_offers"("dataset","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "offer_reservations" ADD CONSTRAINT "offer_reservations_dataset_source_id_evidence_records_dataset_id_fk" FOREIGN KEY ("dataset","source_id") REFERENCES "public"."evidence_records"("dataset","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "offer_subscriptions" ADD CONSTRAINT "offer_subscriptions_dataset_offer_id_category_offer_reservations_dataset_offer_id_category_fk" FOREIGN KEY ("dataset","offer_id","category") REFERENCES "public"."offer_reservations"("dataset","offer_id","category") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "offer_subscriptions" ADD CONSTRAINT "offer_subscriptions_dataset_source_id_evidence_records_dataset_id_fk" FOREIGN KEY ("dataset","source_id") REFERENCES "public"."evidence_records"("dataset","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ipo_offers" ADD CONSTRAINT "ipo_offers_dataset_dataset_versions_version_fk" FOREIGN KEY ("dataset") REFERENCES "public"."dataset_versions"("version") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ipo_offers" ADD CONSTRAINT "ipo_offers_dataset_issuer_id_issuers_dataset_id_fk" FOREIGN KEY ("dataset","issuer_id") REFERENCES "public"."issuers"("dataset","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ipo_offers" ADD CONSTRAINT "ipo_offers_dataset_listing_id_listings_dataset_id_fk" FOREIGN KEY ("dataset","listing_id") REFERENCES "public"."listings"("dataset","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ipo_offers" ADD CONSTRAINT "ipo_offers_dataset_source_id_source_documents_dataset_id_fk" FOREIGN KEY ("dataset","source_id") REFERENCES "public"."source_documents"("dataset","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ipo_offers" ADD CONSTRAINT "ipo_offers_dataset_lifecycle_id_source_documents_dataset_id_fk" FOREIGN KEY ("dataset","lifecycle_id") REFERENCES "public"."source_documents"("dataset","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "theme_memberships" ADD CONSTRAINT "theme_memberships_dataset_theme_id_themes_dataset_id_fk" FOREIGN KEY ("dataset","theme_id") REFERENCES "public"."themes"("dataset","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "theme_memberships" ADD CONSTRAINT "theme_memberships_dataset_listing_id_listings_dataset_id_fk" FOREIGN KEY ("dataset","listing_id") REFERENCES "public"."listings"("dataset","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "themes" ADD CONSTRAINT "themes_dataset_dataset_versions_version_fk" FOREIGN KEY ("dataset") REFERENCES "public"."dataset_versions"("version") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dataset_versions" ADD CONSTRAINT "development_profile" CHECK ("dataset_versions"."profile" in ('three-company-development-slice','full-release-1-universe'));--> statement-breakpoint
ALTER TABLE "source_documents" ADD CONSTRAINT "document_type" CHECK ("source_documents"."document_type" in ('annual','quarterly','announcement','offer','lifecycle'));--> statement-breakpoint
ALTER TABLE "evidence_records" ADD CONSTRAINT "evidence_kind" CHECK ("evidence_records"."kind" in ('document','article','concept'));