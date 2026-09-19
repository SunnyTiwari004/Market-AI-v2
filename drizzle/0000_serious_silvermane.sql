CREATE TABLE "articles" (
	"dataset" text NOT NULL,
	"id" text NOT NULL,
	"publisher_id" text NOT NULL,
	"body" text NOT NULL,
	CONSTRAINT "articles_dataset_id_pk" PRIMARY KEY("dataset","id"),
	CONSTRAINT "article_body" CHECK (length("articles"."body") > 0)
);
--> statement-breakpoint
CREATE TABLE "assumption_evidence" (
	"dataset" text NOT NULL,
	"case_id" text NOT NULL,
	"evidence_id" text NOT NULL,
	CONSTRAINT "assumption_evidence_dataset_case_id_evidence_id_pk" PRIMARY KEY("dataset","case_id","evidence_id")
);
--> statement-breakpoint
CREATE TABLE "scenario_assumptions" (
	"dataset" text NOT NULL,
	"id" text NOT NULL,
	"listing_id" text NOT NULL,
	"cutoff" date NOT NULL,
	"method" text NOT NULL,
	"days" integer NOT NULL,
	CONSTRAINT "scenario_assumptions_dataset_id_pk" PRIMARY KEY("dataset","id"),
	CONSTRAINT "scenario_assumptions_dataset_listing_id_cutoff_method_unique" UNIQUE("dataset","listing_id","cutoff","method"),
	CONSTRAINT "stock_scenario_window" CHECK ("scenario_assumptions"."days" = 30)
);
--> statement-breakpoint
CREATE TABLE "balance_sheets" (
	"dataset" text NOT NULL,
	"id" text NOT NULL,
	"assets" numeric(22, 2) NOT NULL,
	"liabilities" numeric(22, 2) NOT NULL,
	"equity" numeric(22, 2) NOT NULL,
	"debt" numeric(22, 2) NOT NULL,
	"cash" numeric(22, 2) NOT NULL,
	"shares" numeric(20, 0) NOT NULL,
	CONSTRAINT "balance_sheets_dataset_id_pk" PRIMARY KEY("dataset","id"),
	CONSTRAINT "balance_reconciliation" CHECK ("balance_sheets"."assets" = "balance_sheets"."liabilities" + "balance_sheets"."equity" and "balance_sheets"."assets" >= 0 and "balance_sheets"."liabilities" >= 0 and "balance_sheets"."debt" >= 0 and "balance_sheets"."debt" <= "balance_sheets"."liabilities" and "balance_sheets"."cash" >= 0 and "balance_sheets"."cash" <= "balance_sheets"."assets" and "balance_sheets"."shares" > 0)
);
--> statement-breakpoint
CREATE TABLE "scenario_cases" (
	"dataset" text NOT NULL,
	"id" text NOT NULL,
	"assumption_id" text NOT NULL,
	"label" text NOT NULL,
	"g" numeric(32, 12) NOT NULL,
	"m" numeric(32, 12) NOT NULL,
	"rationale" text NOT NULL,
	CONSTRAINT "scenario_cases_dataset_id_pk" PRIMARY KEY("dataset","id"),
	CONSTRAINT "scenario_cases_dataset_assumption_id_label_unique" UNIQUE("dataset","assumption_id","label"),
	CONSTRAINT "case_domain" CHECK ("scenario_cases"."g" > -1 and "scenario_cases"."m" > 0 and "scenario_cases"."label" in ('Weak','Base','Strong'))
);
--> statement-breakpoint
CREATE TABLE "cash_flow_statements" (
	"dataset" text NOT NULL,
	"id" text NOT NULL,
	"ocf" numeric(22, 2) NOT NULL,
	"investing" numeric(22, 2) NOT NULL,
	"financing" numeric(22, 2) NOT NULL,
	"capex" numeric(22, 2) NOT NULL,
	"opening_cash" numeric(22, 2) NOT NULL,
	"closing_cash" numeric(22, 2) NOT NULL,
	CONSTRAINT "cash_flow_statements_dataset_id_pk" PRIMARY KEY("dataset","id"),
	CONSTRAINT "cash_reconciliation" CHECK ("cash_flow_statements"."opening_cash" + "cash_flow_statements"."ocf" + "cash_flow_statements"."investing" + "cash_flow_statements"."financing" = "cash_flow_statements"."closing_cash" and "cash_flow_statements"."capex" >= 0 and "cash_flow_statements"."opening_cash" >= 0 and "cash_flow_statements"."closing_cash" >= 0)
);
--> statement-breakpoint
CREATE TABLE "dataset_versions" (
	"version" text PRIMARY KEY NOT NULL,
	"method" text NOT NULL,
	"generator" text NOT NULL,
	"seed" text NOT NULL,
	"reference_at" timestamp with time zone NOT NULL,
	"calendar" text NOT NULL,
	"fiscal" text NOT NULL,
	"digest" text NOT NULL,
	"published" boolean DEFAULT false NOT NULL,
	"profile" text NOT NULL,
	CONSTRAINT "development_profile" CHECK ("dataset_versions"."profile" = 'three-company-development-slice')
);
--> statement-breakpoint
CREATE TABLE "source_documents" (
	"dataset" text NOT NULL,
	"id" text NOT NULL,
	"issuer_id" text NOT NULL,
	"document_type" text NOT NULL,
	"body" text NOT NULL,
	"publisher" text NOT NULL,
	CONSTRAINT "source_documents_dataset_id_pk" PRIMARY KEY("dataset","id"),
	CONSTRAINT "document_body" CHECK (length("source_documents"."body") > 0),
	CONSTRAINT "document_type" CHECK ("source_documents"."document_type" in ('annual','quarterly','announcement'))
);
--> statement-breakpoint
CREATE TABLE "evidence_records" (
	"dataset" text NOT NULL,
	"id" text NOT NULL,
	"kind" text NOT NULL,
	"title" text NOT NULL,
	"published_at" timestamp with time zone NOT NULL,
	"simulated" boolean NOT NULL,
	"digest" text NOT NULL,
	CONSTRAINT "evidence_records_dataset_id_pk" PRIMARY KEY("dataset","id"),
	CONSTRAINT "simulated_evidence" CHECK ("evidence_records"."simulated" = true),
	CONSTRAINT "evidence_kind" CHECK ("evidence_records"."kind" in ('document','article'))
);
--> statement-breakpoint
CREATE TABLE "evidence_issuers" (
	"dataset" text NOT NULL,
	"evidence_id" text NOT NULL,
	"issuer_id" text NOT NULL,
	CONSTRAINT "evidence_issuers_dataset_evidence_id_issuer_id_pk" PRIMARY KEY("dataset","evidence_id","issuer_id")
);
--> statement-breakpoint
CREATE TABLE "finding_evidence" (
	"dataset" text NOT NULL,
	"finding_id" text NOT NULL,
	"evidence_id" text NOT NULL,
	CONSTRAINT "finding_evidence_dataset_finding_id_evidence_id_pk" PRIMARY KEY("dataset","finding_id","evidence_id")
);
--> statement-breakpoint
CREATE TABLE "research_findings" (
	"dataset" text NOT NULL,
	"id" text NOT NULL,
	"snapshot_id" text NOT NULL,
	"rule_key" text NOT NULL,
	"field" text NOT NULL,
	"kind" text NOT NULL,
	CONSTRAINT "research_findings_dataset_id_pk" PRIMARY KEY("dataset","id"),
	CONSTRAINT "research_findings_dataset_snapshot_id_rule_key_unique" UNIQUE("dataset","snapshot_id","rule_key"),
	CONSTRAINT "finding_values" CHECK ("research_findings"."field" in ('business','growth','financial') and "research_findings"."kind" in ('positive','caution','neutral'))
);
--> statement-breakpoint
CREATE TABLE "income_statements" (
	"dataset" text NOT NULL,
	"id" text NOT NULL,
	"revenue" numeric(22, 2) NOT NULL,
	"ebit" numeric(22, 2) NOT NULL,
	"interest" numeric(22, 2) NOT NULL,
	"income" numeric(22, 2) NOT NULL,
	"weighted_shares" numeric(26, 6) NOT NULL,
	CONSTRAINT "income_statements_dataset_id_pk" PRIMARY KEY("dataset","id"),
	CONSTRAINT "income_inputs" CHECK ("income_statements"."revenue" >= 0 and "income_statements"."interest" >= 0 and "income_statements"."weighted_shares" > 0)
);
--> statement-breakpoint
CREATE TABLE "issuers" (
	"dataset" text NOT NULL,
	"id" text NOT NULL,
	"sector_id" text NOT NULL,
	"registry_key" text NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	CONSTRAINT "issuers_dataset_id_pk" PRIMARY KEY("dataset","id"),
	CONSTRAINT "issuers_dataset_slug_unique" UNIQUE("dataset","slug"),
	CONSTRAINT "issuers_dataset_registry_key_unique" UNIQUE("dataset","registry_key")
);
--> statement-breakpoint
CREATE TABLE "listings" (
	"dataset" text NOT NULL,
	"id" text NOT NULL,
	"issuer_id" text NOT NULL,
	"symbol" text NOT NULL,
	"listed_at" date NOT NULL,
	"venue" text DEFAULT 'Market AI Simulated Market' NOT NULL,
	"currency" text DEFAULT 'INR' NOT NULL,
	CONSTRAINT "listings_dataset_id_pk" PRIMARY KEY("dataset","id"),
	CONSTRAINT "listings_dataset_symbol_unique" UNIQUE("dataset","symbol"),
	CONSTRAINT "listings_dataset_issuer_id_unique" UNIQUE("dataset","issuer_id"),
	CONSTRAINT "symbol_format" CHECK ("listings"."symbol" ~ '^[A-Z]{3,8}$'),
	CONSTRAINT "listing_currency" CHECK ("listings"."currency" = 'INR')
);
--> statement-breakpoint
CREATE TABLE "method_definitions" (
	"version" text PRIMARY KEY NOT NULL,
	"specification_digest" text NOT NULL,
	"implementation_digest" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "financial_periods" (
	"dataset" text NOT NULL,
	"id" text NOT NULL,
	"issuer_id" text NOT NULL,
	"source_id" text NOT NULL,
	"basis" text NOT NULL,
	"start" date NOT NULL,
	"end" date NOT NULL,
	"published_at" timestamp with time zone NOT NULL,
	"currency" text NOT NULL,
	"scope" text NOT NULL,
	CONSTRAINT "financial_periods_dataset_id_pk" PRIMARY KEY("dataset","id"),
	CONSTRAINT "financial_periods_dataset_issuer_id_basis_start_end_unique" UNIQUE("dataset","issuer_id","basis","start","end"),
	CONSTRAINT "financial_periods_dataset_source_id_unique" UNIQUE("dataset","source_id"),
	CONSTRAINT "period_chronology" CHECK ("financial_periods"."start" <= "financial_periods"."end" and "financial_periods"."published_at" > "financial_periods"."end"::timestamp at time zone 'Asia/Kolkata'),
	CONSTRAINT "period_basis" CHECK ("financial_periods"."basis" in ('annual','quarterly') and "financial_periods"."currency" = 'INR' and "financial_periods"."scope" = 'standalone')
);
--> statement-breakpoint
CREATE TABLE "price_closes" (
	"dataset" text NOT NULL,
	"id" text NOT NULL,
	"listing_id" text NOT NULL,
	"date" date NOT NULL,
	"close" numeric(22, 2) NOT NULL,
	CONSTRAINT "price_closes_dataset_id_pk" PRIMARY KEY("dataset","id"),
	CONSTRAINT "price_closes_dataset_listing_id_date_unique" UNIQUE("dataset","listing_id","date"),
	CONSTRAINT "positive_close" CHECK ("price_closes"."close" > 0)
);
--> statement-breakpoint
CREATE TABLE "publishers" (
	"dataset" text NOT NULL,
	"id" text NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "publishers_dataset_id_pk" PRIMARY KEY("dataset","id"),
	CONSTRAINT "publishers_dataset_name_unique" UNIQUE("dataset","name")
);
--> statement-breakpoint
CREATE TABLE "scenario_sets" (
	"dataset" text NOT NULL,
	"id" text NOT NULL,
	"assumption_id" text NOT NULL,
	"listing_id" text NOT NULL,
	"cutoff" date NOT NULL,
	"output" jsonb NOT NULL,
	CONSTRAINT "scenario_sets_dataset_id_pk" PRIMARY KEY("dataset","id"),
	CONSTRAINT "scenario_sets_dataset_assumption_id_unique" UNIQUE("dataset","assumption_id"),
	CONSTRAINT "scenario_sets_dataset_listing_id_cutoff_unique" UNIQUE("dataset","listing_id","cutoff")
);
--> statement-breakpoint
CREATE TABLE "sectors" (
	"dataset" text NOT NULL,
	"id" text NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "sectors_dataset_id_pk" PRIMARY KEY("dataset","id"),
	CONSTRAINT "sectors_dataset_slug_unique" UNIQUE("dataset","slug")
);
--> statement-breakpoint
CREATE TABLE "snapshot_evidence" (
	"dataset" text NOT NULL,
	"snapshot_id" text NOT NULL,
	"evidence_id" text NOT NULL,
	CONSTRAINT "snapshot_evidence_dataset_snapshot_id_evidence_id_pk" PRIMARY KEY("dataset","snapshot_id","evidence_id")
);
--> statement-breakpoint
CREATE TABLE "snapshot_financial_inputs" (
	"dataset" text NOT NULL,
	"snapshot_id" text NOT NULL,
	"period_id" text NOT NULL,
	CONSTRAINT "snapshot_financial_inputs_dataset_snapshot_id_period_id_pk" PRIMARY KEY("dataset","snapshot_id","period_id")
);
--> statement-breakpoint
CREATE TABLE "snapshot_peer_inputs" (
	"dataset" text NOT NULL,
	"snapshot_id" text NOT NULL,
	"listing_id" text NOT NULL,
	CONSTRAINT "snapshot_peer_inputs_dataset_snapshot_id_listing_id_pk" PRIMARY KEY("dataset","snapshot_id","listing_id")
);
--> statement-breakpoint
CREATE TABLE "snapshot_price_inputs" (
	"dataset" text NOT NULL,
	"snapshot_id" text NOT NULL,
	"price_id" text NOT NULL,
	CONSTRAINT "snapshot_price_inputs_dataset_snapshot_id_price_id_pk" PRIMARY KEY("dataset","snapshot_id","price_id")
);
--> statement-breakpoint
CREATE TABLE "stock_snapshots" (
	"dataset" text NOT NULL,
	"id" text NOT NULL,
	"listing_id" text NOT NULL,
	"cutoff" date NOT NULL,
	"session" date NOT NULL,
	"horizon" text NOT NULL,
	"method" text NOT NULL,
	"scenario_id" text NOT NULL,
	"output" jsonb NOT NULL,
	"digest" text NOT NULL,
	CONSTRAINT "stock_snapshots_dataset_id_pk" PRIMARY KEY("dataset","id"),
	CONSTRAINT "stock_snapshots_dataset_listing_id_cutoff_horizon_method_unique" UNIQUE("dataset","listing_id","cutoff","horizon","method"),
	CONSTRAINT "snapshot_horizon" CHECK ("stock_snapshots"."horizon" in ('short','medium','long'))
);
--> statement-breakpoint
CREATE TABLE "trading_sessions" (
	"dataset" text NOT NULL,
	"date" date NOT NULL,
	"close_at" timestamp with time zone NOT NULL,
	CONSTRAINT "trading_sessions_dataset_date_pk" PRIMARY KEY("dataset","date"),
	CONSTRAINT "weekday_session" CHECK (extract(isodow from "trading_sessions"."date") between 1 and 5)
);
--> statement-breakpoint
ALTER TABLE "articles" ADD CONSTRAINT "articles_dataset_dataset_versions_version_fk" FOREIGN KEY ("dataset") REFERENCES "public"."dataset_versions"("version") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "articles" ADD CONSTRAINT "articles_dataset_id_evidence_records_dataset_id_fk" FOREIGN KEY ("dataset","id") REFERENCES "public"."evidence_records"("dataset","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "articles" ADD CONSTRAINT "articles_dataset_publisher_id_publishers_dataset_id_fk" FOREIGN KEY ("dataset","publisher_id") REFERENCES "public"."publishers"("dataset","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assumption_evidence" ADD CONSTRAINT "assumption_evidence_dataset_case_id_scenario_cases_dataset_id_fk" FOREIGN KEY ("dataset","case_id") REFERENCES "public"."scenario_cases"("dataset","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assumption_evidence" ADD CONSTRAINT "assumption_evidence_dataset_evidence_id_evidence_records_dataset_id_fk" FOREIGN KEY ("dataset","evidence_id") REFERENCES "public"."evidence_records"("dataset","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scenario_assumptions" ADD CONSTRAINT "scenario_assumptions_dataset_dataset_versions_version_fk" FOREIGN KEY ("dataset") REFERENCES "public"."dataset_versions"("version") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scenario_assumptions" ADD CONSTRAINT "scenario_assumptions_method_method_definitions_version_fk" FOREIGN KEY ("method") REFERENCES "public"."method_definitions"("version") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scenario_assumptions" ADD CONSTRAINT "scenario_assumptions_dataset_listing_id_listings_dataset_id_fk" FOREIGN KEY ("dataset","listing_id") REFERENCES "public"."listings"("dataset","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "balance_sheets" ADD CONSTRAINT "balance_sheets_dataset_dataset_versions_version_fk" FOREIGN KEY ("dataset") REFERENCES "public"."dataset_versions"("version") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "balance_sheets" ADD CONSTRAINT "balance_sheets_dataset_id_financial_periods_dataset_id_fk" FOREIGN KEY ("dataset","id") REFERENCES "public"."financial_periods"("dataset","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scenario_cases" ADD CONSTRAINT "scenario_cases_dataset_dataset_versions_version_fk" FOREIGN KEY ("dataset") REFERENCES "public"."dataset_versions"("version") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scenario_cases" ADD CONSTRAINT "scenario_cases_dataset_assumption_id_scenario_assumptions_dataset_id_fk" FOREIGN KEY ("dataset","assumption_id") REFERENCES "public"."scenario_assumptions"("dataset","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cash_flow_statements" ADD CONSTRAINT "cash_flow_statements_dataset_dataset_versions_version_fk" FOREIGN KEY ("dataset") REFERENCES "public"."dataset_versions"("version") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cash_flow_statements" ADD CONSTRAINT "cash_flow_statements_dataset_id_financial_periods_dataset_id_fk" FOREIGN KEY ("dataset","id") REFERENCES "public"."financial_periods"("dataset","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dataset_versions" ADD CONSTRAINT "dataset_versions_method_method_definitions_version_fk" FOREIGN KEY ("method") REFERENCES "public"."method_definitions"("version") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "source_documents" ADD CONSTRAINT "source_documents_dataset_dataset_versions_version_fk" FOREIGN KEY ("dataset") REFERENCES "public"."dataset_versions"("version") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "source_documents" ADD CONSTRAINT "source_documents_dataset_id_evidence_records_dataset_id_fk" FOREIGN KEY ("dataset","id") REFERENCES "public"."evidence_records"("dataset","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "source_documents" ADD CONSTRAINT "source_documents_dataset_issuer_id_issuers_dataset_id_fk" FOREIGN KEY ("dataset","issuer_id") REFERENCES "public"."issuers"("dataset","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evidence_records" ADD CONSTRAINT "evidence_records_dataset_dataset_versions_version_fk" FOREIGN KEY ("dataset") REFERENCES "public"."dataset_versions"("version") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evidence_issuers" ADD CONSTRAINT "evidence_issuers_dataset_evidence_id_evidence_records_dataset_id_fk" FOREIGN KEY ("dataset","evidence_id") REFERENCES "public"."evidence_records"("dataset","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evidence_issuers" ADD CONSTRAINT "evidence_issuers_dataset_issuer_id_issuers_dataset_id_fk" FOREIGN KEY ("dataset","issuer_id") REFERENCES "public"."issuers"("dataset","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "finding_evidence" ADD CONSTRAINT "finding_evidence_dataset_finding_id_research_findings_dataset_id_fk" FOREIGN KEY ("dataset","finding_id") REFERENCES "public"."research_findings"("dataset","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "finding_evidence" ADD CONSTRAINT "finding_evidence_dataset_evidence_id_evidence_records_dataset_id_fk" FOREIGN KEY ("dataset","evidence_id") REFERENCES "public"."evidence_records"("dataset","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "research_findings" ADD CONSTRAINT "research_findings_dataset_dataset_versions_version_fk" FOREIGN KEY ("dataset") REFERENCES "public"."dataset_versions"("version") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "research_findings" ADD CONSTRAINT "research_findings_dataset_snapshot_id_stock_snapshots_dataset_id_fk" FOREIGN KEY ("dataset","snapshot_id") REFERENCES "public"."stock_snapshots"("dataset","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "income_statements" ADD CONSTRAINT "income_statements_dataset_dataset_versions_version_fk" FOREIGN KEY ("dataset") REFERENCES "public"."dataset_versions"("version") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "income_statements" ADD CONSTRAINT "income_statements_dataset_id_financial_periods_dataset_id_fk" FOREIGN KEY ("dataset","id") REFERENCES "public"."financial_periods"("dataset","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "issuers" ADD CONSTRAINT "issuers_dataset_dataset_versions_version_fk" FOREIGN KEY ("dataset") REFERENCES "public"."dataset_versions"("version") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "issuers" ADD CONSTRAINT "issuers_dataset_sector_id_sectors_dataset_id_fk" FOREIGN KEY ("dataset","sector_id") REFERENCES "public"."sectors"("dataset","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "listings" ADD CONSTRAINT "listings_dataset_dataset_versions_version_fk" FOREIGN KEY ("dataset") REFERENCES "public"."dataset_versions"("version") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "listings" ADD CONSTRAINT "listings_dataset_issuer_id_issuers_dataset_id_fk" FOREIGN KEY ("dataset","issuer_id") REFERENCES "public"."issuers"("dataset","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "financial_periods" ADD CONSTRAINT "financial_periods_dataset_dataset_versions_version_fk" FOREIGN KEY ("dataset") REFERENCES "public"."dataset_versions"("version") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "financial_periods" ADD CONSTRAINT "financial_periods_dataset_issuer_id_issuers_dataset_id_fk" FOREIGN KEY ("dataset","issuer_id") REFERENCES "public"."issuers"("dataset","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "financial_periods" ADD CONSTRAINT "financial_periods_dataset_source_id_source_documents_dataset_id_fk" FOREIGN KEY ("dataset","source_id") REFERENCES "public"."source_documents"("dataset","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "price_closes" ADD CONSTRAINT "price_closes_dataset_dataset_versions_version_fk" FOREIGN KEY ("dataset") REFERENCES "public"."dataset_versions"("version") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "price_closes" ADD CONSTRAINT "price_closes_dataset_listing_id_listings_dataset_id_fk" FOREIGN KEY ("dataset","listing_id") REFERENCES "public"."listings"("dataset","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "price_closes" ADD CONSTRAINT "price_closes_dataset_date_trading_sessions_dataset_date_fk" FOREIGN KEY ("dataset","date") REFERENCES "public"."trading_sessions"("dataset","date") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "publishers" ADD CONSTRAINT "publishers_dataset_dataset_versions_version_fk" FOREIGN KEY ("dataset") REFERENCES "public"."dataset_versions"("version") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scenario_sets" ADD CONSTRAINT "scenario_sets_dataset_dataset_versions_version_fk" FOREIGN KEY ("dataset") REFERENCES "public"."dataset_versions"("version") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scenario_sets" ADD CONSTRAINT "scenario_sets_dataset_assumption_id_scenario_assumptions_dataset_id_fk" FOREIGN KEY ("dataset","assumption_id") REFERENCES "public"."scenario_assumptions"("dataset","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scenario_sets" ADD CONSTRAINT "scenario_sets_dataset_listing_id_listings_dataset_id_fk" FOREIGN KEY ("dataset","listing_id") REFERENCES "public"."listings"("dataset","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sectors" ADD CONSTRAINT "sectors_dataset_dataset_versions_version_fk" FOREIGN KEY ("dataset") REFERENCES "public"."dataset_versions"("version") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "snapshot_evidence" ADD CONSTRAINT "snapshot_evidence_dataset_snapshot_id_stock_snapshots_dataset_id_fk" FOREIGN KEY ("dataset","snapshot_id") REFERENCES "public"."stock_snapshots"("dataset","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "snapshot_evidence" ADD CONSTRAINT "snapshot_evidence_dataset_evidence_id_evidence_records_dataset_id_fk" FOREIGN KEY ("dataset","evidence_id") REFERENCES "public"."evidence_records"("dataset","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "snapshot_financial_inputs" ADD CONSTRAINT "snapshot_financial_inputs_dataset_snapshot_id_stock_snapshots_dataset_id_fk" FOREIGN KEY ("dataset","snapshot_id") REFERENCES "public"."stock_snapshots"("dataset","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "snapshot_financial_inputs" ADD CONSTRAINT "snapshot_financial_inputs_dataset_period_id_financial_periods_dataset_id_fk" FOREIGN KEY ("dataset","period_id") REFERENCES "public"."financial_periods"("dataset","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "snapshot_peer_inputs" ADD CONSTRAINT "snapshot_peer_inputs_dataset_snapshot_id_stock_snapshots_dataset_id_fk" FOREIGN KEY ("dataset","snapshot_id") REFERENCES "public"."stock_snapshots"("dataset","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "snapshot_peer_inputs" ADD CONSTRAINT "snapshot_peer_inputs_dataset_listing_id_listings_dataset_id_fk" FOREIGN KEY ("dataset","listing_id") REFERENCES "public"."listings"("dataset","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "snapshot_price_inputs" ADD CONSTRAINT "snapshot_price_inputs_dataset_snapshot_id_stock_snapshots_dataset_id_fk" FOREIGN KEY ("dataset","snapshot_id") REFERENCES "public"."stock_snapshots"("dataset","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "snapshot_price_inputs" ADD CONSTRAINT "snapshot_price_inputs_dataset_price_id_price_closes_dataset_id_fk" FOREIGN KEY ("dataset","price_id") REFERENCES "public"."price_closes"("dataset","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_snapshots" ADD CONSTRAINT "stock_snapshots_dataset_dataset_versions_version_fk" FOREIGN KEY ("dataset") REFERENCES "public"."dataset_versions"("version") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_snapshots" ADD CONSTRAINT "stock_snapshots_method_method_definitions_version_fk" FOREIGN KEY ("method") REFERENCES "public"."method_definitions"("version") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_snapshots" ADD CONSTRAINT "stock_snapshots_dataset_listing_id_listings_dataset_id_fk" FOREIGN KEY ("dataset","listing_id") REFERENCES "public"."listings"("dataset","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_snapshots" ADD CONSTRAINT "stock_snapshots_dataset_scenario_id_scenario_sets_dataset_id_fk" FOREIGN KEY ("dataset","scenario_id") REFERENCES "public"."scenario_sets"("dataset","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_snapshots" ADD CONSTRAINT "stock_snapshots_dataset_session_trading_sessions_dataset_date_fk" FOREIGN KEY ("dataset","session") REFERENCES "public"."trading_sessions"("dataset","date") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trading_sessions" ADD CONSTRAINT "trading_sessions_dataset_dataset_versions_version_fk" FOREIGN KEY ("dataset") REFERENCES "public"."dataset_versions"("version") ON DELETE no action ON UPDATE no action;