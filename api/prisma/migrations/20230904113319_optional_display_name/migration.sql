-- AlterTable
ALTER TABLE "ingredients" ADD COLUMN     "display_name" TEXT;

UPDATE "ingredients"
SET "display_name" = "name";

UPDATE "ingredients"
SET "display_name" = INITCAP("display_name");
