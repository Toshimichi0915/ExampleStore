-- AlterTable
ALTER TABLE "environment" ADD COLUMN     "campaign" TEXT,
ADD COLUMN     "channel_url" TEXT NOT NULL DEFAULT 'https://example.com',
ADD COLUMN     "mail_to" TEXT NOT NULL DEFAULT 'test@example.com';
