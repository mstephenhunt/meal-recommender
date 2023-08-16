-- CreateTable
CREATE TABLE "dietary_restrictions" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "display_name" TEXT NOT NULL,

    CONSTRAINT "dietary_restrictions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users_dietary_restrictions" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" INTEGER NOT NULL,
    "dietary_restriction_id" INTEGER NOT NULL,

    CONSTRAINT "users_dietary_restrictions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "dietary_restrictions_name_key" ON "dietary_restrictions"("name");
