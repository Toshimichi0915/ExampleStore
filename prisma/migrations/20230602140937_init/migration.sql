-- CreateEnum
CREATE TYPE "user_roles" AS ENUM ('admin');

-- CreateEnum
CREATE TYPE "charge_status" AS ENUM ('initializing', 'created', 'confirmed', 'failed', 'delayed', 'pending', 'resolved', 'invalidated');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "roles" "user_roles"[],

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shop_items" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "type" TEXT,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "shop_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shop_item_types" (
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "shop_item_types_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "charges" (
    "id" TEXT NOT NULL,
    "status" "charge_status" NOT NULL DEFAULT 'initializing',
    "product" TEXT NOT NULL,
    "coinbase_id" TEXT,
    "charge_url" TEXT,
    "userId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "charges_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_name_key" ON "users"("name");

-- CreateIndex
CREATE UNIQUE INDEX "shop_item_types_name_key" ON "shop_item_types"("name");

-- CreateIndex
CREATE UNIQUE INDEX "charges_coinbase_id_key" ON "charges"("coinbase_id");

-- AddForeignKey
ALTER TABLE "shop_items" ADD CONSTRAINT "shop_items_type_fkey" FOREIGN KEY ("type") REFERENCES "shop_item_types"("name") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "charges" ADD CONSTRAINT "charges_product_fkey" FOREIGN KEY ("product") REFERENCES "shop_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;
