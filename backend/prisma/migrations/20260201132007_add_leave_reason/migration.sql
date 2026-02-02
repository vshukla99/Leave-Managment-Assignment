/*
  Warnings:

  - Made the column `reason` on table `LeaveRequest` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `LeaveRequest` MODIFY `reason` VARCHAR(191) NOT NULL;
