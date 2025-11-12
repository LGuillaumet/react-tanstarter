CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"discord_id" text NOT NULL,
	"name" text NOT NULL,
	"email" text,
	"email_verified" boolean,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_discord_id_unique" UNIQUE("discord_id"),
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "patate" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"rules" text,
	"theme" text,
	"current_user_id" text,
	"process_step" text DEFAULT 'DRAFT' NOT NULL,
	"discord_server_id" text NOT NULL,
	"discord_channel_id" text,
	"start_date" timestamp,
	"end_date" timestamp,
	"created_by" text NOT NULL,
	"updated_by" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "patate_file" (
	"id" serial PRIMARY KEY NOT NULL,
	"patate_id" integer NOT NULL,
	"user_id" text NOT NULL,
	"url" text NOT NULL,
	"type" text NOT NULL,
	"size" integer NOT NULL,
	"comment" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "patate_file_comment" (
	"id" serial PRIMARY KEY NOT NULL,
	"patate_file_id" integer NOT NULL,
	"user_id" text NOT NULL,
	"message" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "patate_file_like" (
	"id" serial PRIMARY KEY NOT NULL,
	"patate_file_id" integer NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "patate_participant" (
	"id" serial PRIMARY KEY NOT NULL,
	"patate_id" integer NOT NULL,
	"user_id" text NOT NULL,
	"order" integer,
	"role" text NOT NULL,
	"validated_submission_at" timestamp,
	"invalidated_submission_at" timestamp,
	"confirm_participation" boolean DEFAULT false NOT NULL,
	"number_of_refused_participations" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp,
	CONSTRAINT "number_of_refused_participations" CHECK ("patate_participant"."number_of_refused_participations" <= 2)
);
--> statement-breakpoint
CREATE TABLE "patate_problem" (
	"id" serial PRIMARY KEY NOT NULL,
	"patate_id" integer NOT NULL,
	"from_user_id" text NOT NULL,
	"to_user_id" text NOT NULL,
	"thread_user_id" text NOT NULL,
	"message" text NOT NULL,
	"is_resolved" boolean DEFAULT false NOT NULL,
	"admin_discord_id" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "patate" ADD CONSTRAINT "patate_current_user_id_user_id_fk" FOREIGN KEY ("current_user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "patate" ADD CONSTRAINT "patate_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "patate" ADD CONSTRAINT "patate_updated_by_user_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "patate_file" ADD CONSTRAINT "patate_file_patate_id_patate_id_fk" FOREIGN KEY ("patate_id") REFERENCES "public"."patate"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "patate_file" ADD CONSTRAINT "patate_file_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "patate_file_comment" ADD CONSTRAINT "patate_file_comment_patate_file_id_patate_file_id_fk" FOREIGN KEY ("patate_file_id") REFERENCES "public"."patate_file"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "patate_file_comment" ADD CONSTRAINT "patate_file_comment_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "patate_file_like" ADD CONSTRAINT "patate_file_like_patate_file_id_patate_file_id_fk" FOREIGN KEY ("patate_file_id") REFERENCES "public"."patate_file"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "patate_file_like" ADD CONSTRAINT "patate_file_like_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "patate_participant" ADD CONSTRAINT "patate_participant_patate_id_patate_id_fk" FOREIGN KEY ("patate_id") REFERENCES "public"."patate"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "patate_participant" ADD CONSTRAINT "patate_participant_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "patate_problem" ADD CONSTRAINT "patate_problem_patate_id_patate_id_fk" FOREIGN KEY ("patate_id") REFERENCES "public"."patate"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "patate_problem" ADD CONSTRAINT "patate_problem_from_user_id_user_id_fk" FOREIGN KEY ("from_user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "patate_problem" ADD CONSTRAINT "patate_problem_to_user_id_user_id_fk" FOREIGN KEY ("to_user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "patate_problem" ADD CONSTRAINT "patate_problem_thread_user_id_user_id_fk" FOREIGN KEY ("thread_user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;