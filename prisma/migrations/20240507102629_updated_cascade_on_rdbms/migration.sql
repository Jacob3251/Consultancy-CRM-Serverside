/*
  Warnings:

  - You are about to drop the column `leadId` on the `Transaction` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_leadId_fkey";

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "leadId";
