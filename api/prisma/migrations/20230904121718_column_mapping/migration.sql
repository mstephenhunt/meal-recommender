/*
  Warnings:

  - You are about to drop the column `recipeId` on the `user_recipes` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `user_recipes` table. All the data in the column will be lost.
  - Added the required column `recipe_id` to the `user_recipes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `user_recipes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user_recipes" 
ADD COLUMN     "recipe_id" INTEGER,
ADD COLUMN     "user_id" INTEGER;

-- Set the recipe_id column to be the value of the current recipeId column
UPDATE "user_recipes" SET "recipe_id" = "recipeId";

-- Likewise with the user_id column
UPDATE "user_recipes" SET "user_id" = "userId";

-- Set the new columns to not null
ALTER TABLE "user_recipes"
ALTER COLUMN "recipe_id" SET NOT NULL,
ALTER COLUMN "user_id" SET NOT NULL;

-- Drop the currentRecipeId and userId columns
ALTER TABLE "user_recipes" 
DROP COLUMN "recipeId",
DROP COLUMN "userId";

