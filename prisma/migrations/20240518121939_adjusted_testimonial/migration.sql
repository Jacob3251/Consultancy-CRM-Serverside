/*
  Warnings:

  - The `client_rating` column on the `Testimonial` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Testimonial" ADD COLUMN     "storage_imagelink" TEXT DEFAULT '',
DROP COLUMN "client_rating",
ADD COLUMN     "client_rating" INTEGER;
