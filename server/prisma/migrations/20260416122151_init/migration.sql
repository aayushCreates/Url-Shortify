-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refresh_tokens" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "short_urls" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "original_url" TEXT NOT NULL,
    "user_id" TEXT,
    "redirect_type" INTEGER NOT NULL DEFAULT 302,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "expires_at" TIMESTAMP(3),
    "password_hash" TEXT,
    "max_clicks" INTEGER,
    "total_clicks" INTEGER NOT NULL DEFAULT 0,
    "unique_clicks" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "short_urls_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "click_events" (
    "id" TEXT NOT NULL,
    "short_url_id" TEXT NOT NULL,
    "visitor_hash" TEXT NOT NULL,
    "country" TEXT,
    "city" TEXT,
    "device" TEXT,
    "browser" TEXT,
    "os" TEXT,
    "referrer" TEXT,
    "variant_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "click_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "click_stats" (
    "id" TEXT NOT NULL,
    "short_url_id" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "period_key" TEXT NOT NULL,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "uniques" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "click_stats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ab_variants" (
    "id" TEXT NOT NULL,
    "short_url_id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "weight" INTEGER NOT NULL DEFAULT 50,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "uniques" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ab_variants_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_token_key" ON "refresh_tokens"("token");

-- CreateIndex
CREATE INDEX "refresh_tokens_user_id_idx" ON "refresh_tokens"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "short_urls_slug_key" ON "short_urls"("slug");

-- CreateIndex
CREATE INDEX "short_urls_user_id_idx" ON "short_urls"("user_id");

-- CreateIndex
CREATE INDEX "short_urls_slug_idx" ON "short_urls"("slug");

-- CreateIndex
CREATE INDEX "short_urls_created_at_idx" ON "short_urls"("created_at");

-- CreateIndex
CREATE INDEX "short_urls_deleted_at_idx" ON "short_urls"("deleted_at");

-- CreateIndex
CREATE INDEX "click_events_short_url_id_created_at_idx" ON "click_events"("short_url_id", "created_at");

-- CreateIndex
CREATE INDEX "click_events_visitor_hash_idx" ON "click_events"("visitor_hash");

-- CreateIndex
CREATE INDEX "click_stats_short_url_id_period_idx" ON "click_stats"("short_url_id", "period");

-- CreateIndex
CREATE UNIQUE INDEX "click_stats_short_url_id_period_period_key_key" ON "click_stats"("short_url_id", "period", "period_key");

-- CreateIndex
CREATE INDEX "ab_variants_short_url_id_idx" ON "ab_variants"("short_url_id");

-- AddForeignKey
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "short_urls" ADD CONSTRAINT "short_urls_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "click_events" ADD CONSTRAINT "click_events_short_url_id_fkey" FOREIGN KEY ("short_url_id") REFERENCES "short_urls"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "click_stats" ADD CONSTRAINT "click_stats_short_url_id_fkey" FOREIGN KEY ("short_url_id") REFERENCES "short_urls"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ab_variants" ADD CONSTRAINT "ab_variants_short_url_id_fkey" FOREIGN KEY ("short_url_id") REFERENCES "short_urls"("id") ON DELETE CASCADE ON UPDATE CASCADE;
