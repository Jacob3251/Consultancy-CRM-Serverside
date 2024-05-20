/*
  Warnings:

  - Added the required column `status` to the `Sitemsgquery` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "QueryStatus" AS ENUM ('Answered', 'Pending');

-- AlterTable
ALTER TABLE "Sitemsgquery" ADD COLUMN     "status" "QueryStatus" NOT NULL;
