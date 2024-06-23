/*
  Warnings:

  - You are about to drop the `CustomPage` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "CustomPage";

-- CreateTable
CREATE TABLE "page" (
    "id" TEXT NOT NULL,
    "pageTitle" TEXT NOT NULL DEFAULT '',
    "siteUrl" TEXT NOT NULL DEFAULT '',
    "category" TEXT NOT NULL DEFAULT '',
    "metaTitle" TEXT NOT NULL DEFAULT '',
    "metaDiscription" TEXT NOT NULL DEFAULT '',
    "metaKeywords" TEXT NOT NULL DEFAULT '',
    "pageData" JSONB,

    CONSTRAINT "page_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "page_id_key" ON "page"("id");

-- CreateIndex
CREATE UNIQUE INDEX "page_siteUrl_key" ON "page"("siteUrl");
