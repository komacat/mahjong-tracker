-- DropForeignKey
ALTER TABLE "Game" DROP CONSTRAINT "Game_parlorId_fkey";

-- AlterTable
ALTER TABLE "Game" ALTER COLUMN "parlorId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_parlorId_fkey" FOREIGN KEY ("parlorId") REFERENCES "Parlor"("id") ON DELETE SET NULL ON UPDATE CASCADE;
