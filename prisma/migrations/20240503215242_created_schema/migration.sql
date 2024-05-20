/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[id]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('INCOME', 'EXPENSE');

-- CreateEnum
CREATE TYPE "TransactionMedium" AS ENUM ('Bank', 'Cash', 'Other');

-- CreateEnum
CREATE TYPE "ClientTypeEnum" AS ENUM ('VISIT', 'STUDY', 'IMMIGRATION', 'OTHER');

-- CreateEnum
CREATE TYPE "AttachmentForEnum" AS ENUM ('USER', 'CLIENT', 'LEADS');

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
ADD COLUMN     "contact_no" VARCHAR(11),
ADD COLUMN     "photolink" TEXT,
ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'Super-Admin',
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "verified" BOOLEAN NOT NULL DEFAULT true,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "User_id_seq";

-- CreateTable
CREATE TABLE "Role" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Permissions" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "desc" TEXT NOT NULL,
    "roleId" INTEGER,

    CONSTRAINT "Permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "transaction_type" "TransactionType" NOT NULL,
    "amount" INTEGER NOT NULL,
    "client_id" TEXT NOT NULL,
    "transaction_medium" "TransactionMedium" NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "clientType" "ClientTypeEnum" NOT NULL,
    "clientDesc" TEXT NOT NULL,
    "phone_no" VARCHAR(15) NOT NULL,
    "preferredDestination" TEXT,
    "dealAmount" INTEGER NOT NULL,
    "due" INTEGER NOT NULL,
    "recent_update" TEXT NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attachments" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "desc" TEXT NOT NULL,
    "fileLink" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "type" "AttachmentForEnum" NOT NULL,

    CONSTRAINT "Attachments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Role_id_key" ON "Role"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Role_title_key" ON "Role"("title");

-- CreateIndex
CREATE UNIQUE INDEX "Permissions_id_key" ON "Permissions"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_id_key" ON "Transaction"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Client_id_key" ON "Client"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Attachments_id_key" ON "Attachments"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- AddForeignKey
ALTER TABLE "Permissions" ADD CONSTRAINT "Permissions_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attachments" ADD CONSTRAINT "userAttachments" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attachments" ADD CONSTRAINT "clientAttachments" FOREIGN KEY ("ownerId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attachments" ADD CONSTRAINT "transactionAttachments" FOREIGN KEY ("ownerId") REFERENCES "Transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
