/*
  Warnings:

  - A unique constraint covering the columns `[userId,parlorId]` on the table `ParlorMember` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ParlorMember_userId_parlorId_key" ON "ParlorMember"("userId", "parlorId");

-- AddForeignKey
ALTER TABLE "ParlorMember" ADD CONSTRAINT "ParlorMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
