/*
  Warnings:

  - You are about to drop the column `roleId` on the `Permissions` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Permissions" DROP CONSTRAINT "Permissions_roleId_fkey";

-- AlterTable
ALTER TABLE "Permissions" DROP COLUMN "roleId";

-- AlterTable
ALTER TABLE "Role" ADD COLUMN     "permissions" TEXT[];
