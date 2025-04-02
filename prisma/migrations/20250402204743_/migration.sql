/*
  Warnings:

  - Added the required column `parlorId` to the `Game` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "parlorId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_parlorId_fkey" FOREIGN KEY ("parlorId") REFERENCES "Parlor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
