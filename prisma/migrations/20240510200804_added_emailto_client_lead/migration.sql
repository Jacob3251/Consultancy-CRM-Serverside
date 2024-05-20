/*
  Warnings:

  - A unique constraint covering the columns `[clientEmail]` on the table `Client` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[clientEmail]` on the table `Lead` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Client" ADD COLUMN     "clientEmail" TEXT;

-- AlterTable
ALTER TABLE "Lead" ADD COLUMN     "clientEmail" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Client_clientEmail_key" ON "Client"("clientEmail");

-- CreateIndex
CREATE UNIQUE INDEX "Lead_clientEmail_key" ON "Lead"("clientEmail");
