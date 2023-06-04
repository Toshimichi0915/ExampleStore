-- AlterTable
ALTER TABLE "shop_item_types" ALTER COLUMN "weight" DROP NOT NULL;

-- AlterTable
ALTER TABLE "shop_items" ADD COLUMN     "has_original_mail" BOOLEAN,
ADD COLUMN     "has_warranty" BOOLEAN;
