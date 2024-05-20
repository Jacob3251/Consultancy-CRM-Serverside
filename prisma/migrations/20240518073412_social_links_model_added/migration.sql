-- CreateTable
CREATE TABLE "Sociallinks" (
    "id" TEXT NOT NULL,
    "fb_link" TEXT,
    "youtube_link" TEXT,
    "instagram_link" TEXT,

    CONSTRAINT "Sociallinks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Sociallinks_id_key" ON "Sociallinks"("id");
