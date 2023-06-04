UPDATE "shop_items" SET "has_original_mail" = false WHERE "has_original_mail" IS NULL;
UPDATE "shop_items" SET "has_warranty" = false WHERE "has_warranty" IS NULL;

-- AlterTable
ALTER TABLE "shop_items" ALTER COLUMN "has_original_mail" SET NOT NULL,
ALTER COLUMN "has_original_mail" SET DEFAULT false,
ALTER COLUMN "has_warranty" SET NOT NULL,
ALTER COLUMN "has_warranty" SET DEFAULT false;
