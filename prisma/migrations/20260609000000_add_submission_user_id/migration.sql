ALTER TABLE "submissions"
ADD COLUMN "user_id" TEXT;

CREATE UNIQUE INDEX "submissions_user_id_key"
ON "submissions"("user_id");

ALTER TABLE "submissions"
ADD CONSTRAINT "submissions_user_id_fkey"
FOREIGN KEY ("user_id")
REFERENCES "users"("id")
ON DELETE SET NULL
ON UPDATE CASCADE;
