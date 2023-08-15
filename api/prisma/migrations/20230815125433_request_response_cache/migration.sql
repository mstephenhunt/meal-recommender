-- CreateTable
CREATE TABLE "request_cache" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "url" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "headers" JSONB,
    "body" JSONB,

    CONSTRAINT "request_cache_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "response_cache" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "status_code" INTEGER NOT NULL,
    "headers" JSONB,
    "body" JSONB,

    CONSTRAINT "response_cache_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "request_response_cache" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "requestId" INTEGER NOT NULL,
    "responseId" INTEGER NOT NULL,

    CONSTRAINT "request_response_cache_pkey" PRIMARY KEY ("id")
);
