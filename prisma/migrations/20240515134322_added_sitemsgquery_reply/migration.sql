/*
  Warnings:

  - Added the required column `reply` to the `Sitemsgquery` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Sitemsgquery" ADD COLUMN     "reply" TEXT NOT NULL;
