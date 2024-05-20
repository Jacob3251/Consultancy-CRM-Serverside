-- AlterTable
ALTER TABLE "Client" ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "clientType" DROP NOT NULL,
ALTER COLUMN "clientDesc" DROP NOT NULL,
ALTER COLUMN "phone_no" DROP NOT NULL,
ALTER COLUMN "dealAmount" DROP NOT NULL,
ALTER COLUMN "due" DROP NOT NULL,
ALTER COLUMN "recent_update" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "leadId" TEXT;

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "clientType" "ClientTypeEnum",
    "clientDesc" TEXT,
    "phone_no" VARCHAR(15),
    "preferredDestination" TEXT,
    "dealAmount" INTEGER,
    "due" INTEGER,
    "recent_update" TEXT,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Lead_id_key" ON "Lead"("id");

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attachments" ADD CONSTRAINT "leadAttachments" FOREIGN KEY ("ownerId") REFERENCES "Lead"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
