/*
  Warnings:

  - A unique constraint covering the columns `[user_id,allergen_id]` on the table `user_allergens` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id,ingredient_id]` on the table `user_ingredients` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "user_diets" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" INTEGER NOT NULL,
    "diet_id" INTEGER NOT NULL,

    CONSTRAINT "user_diets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_diets_user_id_diet_id_key" ON "user_diets"("user_id", "diet_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_allergens_user_id_allergen_id_key" ON "user_allergens"("user_id", "allergen_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_ingredients_user_id_ingredient_id_key" ON "user_ingredients"("user_id", "ingredient_id");
