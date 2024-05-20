-- DropForeignKey
ALTER TABLE "Attachments" DROP CONSTRAINT "clientAttachments";

-- DropForeignKey
ALTER TABLE "Attachments" DROP CONSTRAINT "leadAttachments";

-- DropForeignKey
ALTER TABLE "Attachments" DROP CONSTRAINT "transactionAttachments";

-- DropForeignKey
ALTER TABLE "Attachments" DROP CONSTRAINT "userAttachments";

-- DropForeignKey
ALTER TABLE "Permissions" DROP CONSTRAINT "Permissions_roleId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_client_id_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_leadId_fkey";

-- AddForeignKey
ALTER TABLE "Permissions" ADD CONSTRAINT "Permissions_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attachments" ADD CONSTRAINT "userAttachments" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attachments" ADD CONSTRAINT "clientAttachments" FOREIGN KEY ("ownerId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attachments" ADD CONSTRAINT "transactionAttachments" FOREIGN KEY ("ownerId") REFERENCES "Transaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attachments" ADD CONSTRAINT "leadAttachments" FOREIGN KEY ("ownerId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;
