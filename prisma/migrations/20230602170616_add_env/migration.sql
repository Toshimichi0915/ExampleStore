-- CreateTable
CREATE TABLE "environment" (
    "id" TEXT NOT NULL DEFAULT '_',
    "telegram_url" TEXT NOT NULL DEFAULT 'https://example.com',
    "terms_of_service" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "environment_pkey" PRIMARY KEY ("id")
);
