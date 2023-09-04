/*
  Warnings:

  - A unique constraint covering the columns `[user_id,recipe_id]` on the table `user_recipes` will be added. If there are existing duplicate values, this will fail.

*/
-- Drop all non-unique values
DELETE FROM user_recipes
WHERE (user_id, recipe_id, created_at) NOT IN (
    SELECT user_id, recipe_id, MAX(created_at)
    FROM user_recipes
    GROUP BY user_id, recipe_id
);

-- CreateIndex
CREATE UNIQUE INDEX "user_recipes_user_id_recipe_id_key" ON "user_recipes"("user_id", "recipe_id");
