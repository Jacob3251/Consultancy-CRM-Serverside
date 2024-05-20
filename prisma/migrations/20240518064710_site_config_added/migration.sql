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

    CONSTRAINT "Teammember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Testimonial" (
    "id" TEXT NOT NULL,
    "client_name" TEXT,
    "client_address" TEXT,
    "client_rating" TEXT,
    "client_review" TEXT,
    "client_imagelink" TEXT,

    CONSTRAINT "Testimonial_pkey" PRIMARY KEY ("id")
);

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
