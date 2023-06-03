/*
  Warnings:

  - A unique constraint covering the columns `[weight]` on the table `shop_item_types` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "shop_item_types" ADD COLUMN     "weight" SERIAL;

-- CreateIndex
CREATE UNIQUE INDEX "shop_item_types_weight_key" ON "shop_item_types"("weight");
