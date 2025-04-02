/*
  Warnings:

  - Added the required column `status` to the `ParlorMember` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ParlorJoinRequestStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- AlterTable
ALTER TABLE "ParlorMember" ADD COLUMN     "status" "ParlorJoinRequestStatus" NOT NULL;
