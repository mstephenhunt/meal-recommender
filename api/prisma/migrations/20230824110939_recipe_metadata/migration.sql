-- DropIndex
DROP INDEX "recipes_name_key";

-- CreateTable
CREATE TABLE "recipe_dietary_restrictions" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "recipe_id" INTEGER NOT NULL,
    "dietary_restriction_id" INTEGER NOT NULL,

    CONSTRAINT "recipe_dietary_restrictions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recipe_user_generated" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "recipe_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "recipe_user_generated_pkey" PRIMARY KEY ("id")
);
