-- CreateTable
CREATE TABLE "Email" (
    "id" TEXT NOT NULL,
    "email_body" TEXT,
    "email_to" TEXT[],
    "email_from" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Email_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Email_id_key" ON "Email"("id");
