-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('INCOME', 'EXPENSE');

-- CreateEnum
CREATE TYPE "TransactionMedium" AS ENUM ('Bank', 'Cash', 'Other');

-- CreateEnum
CREATE TYPE "ClientTypeEnum" AS ENUM ('VISIT', 'STUDY', 'IMMIGRATION', 'OTHER');

-- CreateEnum
CREATE TYPE "AttachmentForEnum" AS ENUM ('USER', 'CLIENT', 'LEADS');

-- CreateEnum
CREATE TYPE "QueryStatus" AS ENUM ('Answered', 'Pending');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'Super-Admin',
    "verified" BOOLEAN NOT NULL DEFAULT true,
    "contact_no" VARCHAR(11),
    "photolink" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "storage_link" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "permissions" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Permissions" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "desc" TEXT NOT NULL,

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
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "clientType" "ClientTypeEnum",
    "clientDesc" TEXT,
    "clientEmail" TEXT,
    "phone_no" VARCHAR(15),
    "preferredDestination" TEXT,
    "dealAmount" INTEGER DEFAULT 0,
    "due" INTEGER DEFAULT 0,
    "recent_update" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "client_image" TEXT DEFAULT '',

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "clientType" "ClientTypeEnum",
    "clientDesc" TEXT,
    "clientEmail" TEXT,
    "phone_no" VARCHAR(15),
    "preferredDestination" TEXT,
    "dealAmount" INTEGER DEFAULT 0,
    "due" INTEGER DEFAULT 0,
    "recent_update" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lead_image" TEXT DEFAULT '',

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attachments" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "desc" TEXT NOT NULL,
    "fileLink" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ownerId" TEXT NOT NULL,
    "type" "AttachmentForEnum" NOT NULL,

    CONSTRAINT "Attachments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sitemsgquery" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone_no" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "reply" TEXT NOT NULL DEFAULT '',
    "status" "QueryStatus" NOT NULL DEFAULT 'Pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Sitemsgquery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Siteconfig" (
    "id" TEXT NOT NULL,
    "home_banner" TEXT,
    "home_sub_banner" TEXT,
    "cta_title" TEXT,
    "cta_sub_title" TEXT,
    "services_banner" TEXT,
    "services_sub_banner" TEXT,
    "services_banner_content" TEXT,
    "uk_office_address" TEXT,
    "uk_office_cell" TEXT,
    "bd_corporate_address" TEXT,
    "bd_corporate_cell" TEXT,
    "bd_legal_address" TEXT,
    "bd_legal_cell" TEXT,

    CONSTRAINT "Siteconfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Homeservice" (
    "id" TEXT NOT NULL,
    "home_service_title" TEXT,
    "home_service_category" TEXT,
    "home_service_site_link" TEXT,

    CONSTRAINT "Homeservice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Servicepackage" (
    "id" TEXT NOT NULL,
    "service_package_title" TEXT,
    "service_package_content" TEXT,
    "service_package_imageLink" TEXT,
    "storage_imagelink" TEXT DEFAULT '',

    CONSTRAINT "Servicepackage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Serviceexpertise" (
    "id" TEXT NOT NULL,
    "service_expertise_title" TEXT,
    "service_expertise_content" TEXT,

    CONSTRAINT "Serviceexpertise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Teammember" (
    "id" TEXT NOT NULL,
    "member_name" TEXT,
    "member_position" TEXT,
    "member_imagelink" TEXT,
    "storage_imagelink" TEXT DEFAULT '',

    CONSTRAINT "Teammember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Testimonial" (
    "id" TEXT NOT NULL,
    "client_name" TEXT,
    "client_address" TEXT,
    "client_rating" INTEGER,
    "client_review" TEXT,
    "client_imagelink" TEXT,
    "storage_imagelink" TEXT DEFAULT '',

    CONSTRAINT "Testimonial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sociallinks" (
    "id" TEXT NOT NULL,
    "fb_link" TEXT,
    "youtube_link" TEXT,
    "instagram_link" TEXT,

    CONSTRAINT "Sociallinks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Email" (
    "id" TEXT NOT NULL,
    "email_body" TEXT,
    "email_to" TEXT[],
    "email_from" TEXT NOT NULL,
    "email_subject" TEXT NOT NULL,
    "email_attachments" JSONB NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Email_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Registeredemails" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "app_key" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "Registeredemails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomPage" (
    "id" TEXT NOT NULL,
    "pageTitle" TEXT NOT NULL DEFAULT '',
    "siteUrl" TEXT NOT NULL DEFAULT '',
    "category" TEXT NOT NULL DEFAULT '',
    "metaTitle" TEXT NOT NULL DEFAULT '',
    "metaDiscription" TEXT NOT NULL DEFAULT '',
    "metaKeywords" TEXT NOT NULL DEFAULT '',
    "pageData" JSONB,

    CONSTRAINT "CustomPage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "progress" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "report" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,

    CONSTRAINT "progress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

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
CREATE UNIQUE INDEX "Client_clientEmail_key" ON "Client"("clientEmail");

-- CreateIndex
CREATE UNIQUE INDEX "Lead_id_key" ON "Lead"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Lead_clientEmail_key" ON "Lead"("clientEmail");

-- CreateIndex
CREATE UNIQUE INDEX "Attachments_id_key" ON "Attachments"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Sitemsgquery_id_key" ON "Sitemsgquery"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Siteconfig_id_key" ON "Siteconfig"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Homeservice_id_key" ON "Homeservice"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Servicepackage_id_key" ON "Servicepackage"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Serviceexpertise_id_key" ON "Serviceexpertise"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Teammember_id_key" ON "Teammember"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Testimonial_id_key" ON "Testimonial"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Sociallinks_id_key" ON "Sociallinks"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Email_id_key" ON "Email"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Registeredemails_id_key" ON "Registeredemails"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Registeredemails_email_key" ON "Registeredemails"("email");

-- CreateIndex
CREATE UNIQUE INDEX "CustomPage_id_key" ON "CustomPage"("id");

-- CreateIndex
CREATE UNIQUE INDEX "CustomPage_siteUrl_key" ON "CustomPage"("siteUrl");

-- CreateIndex
CREATE UNIQUE INDEX "progress_id_key" ON "progress"("id");

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;
