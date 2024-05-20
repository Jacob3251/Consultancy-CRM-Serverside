/*
  Warnings:

  - You are about to drop the column `permissions` on the `Role` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Permissions" ADD COLUMN     "roleId" INTEGER;

-- AlterTable
ALTER TABLE "Role" DROP COLUMN "permissions";

-- AddForeignKey
ALTER TABLE "Permissions" ADD CONSTRAINT "Permissions_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;
