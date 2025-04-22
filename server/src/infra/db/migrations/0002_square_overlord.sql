ALTER TABLE "shortens" RENAME COLUMN "shortened_url" TO "slug";--> statement-breakpoint
ALTER TABLE "shortens" DROP CONSTRAINT "shortens_shortened_url_unique";--> statement-breakpoint
ALTER TABLE "shortens" ADD CONSTRAINT "shortens_slug_unique" UNIQUE("slug");