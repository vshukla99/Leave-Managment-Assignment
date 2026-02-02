/*
  Warnings:

  - You are about to drop the column `hours` on the `LeaveCredit` table. All the data in the column will be lost.
  - You are about to drop the column `remaining` on the `LeaveCredit` table. All the data in the column will be lost.
  - You are about to drop the column `hours` on the `LeaveRequest` table. All the data in the column will be lost.
  - Added the required column `hoursGranted` to the `LeaveCredit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hoursRemaining` to the `LeaveCredit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hoursRequested` to the `LeaveRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `LeaveCredit` DROP COLUMN `hours`,
    DROP COLUMN `remaining`,
    ADD COLUMN `hoursGranted` INTEGER NOT NULL,
    ADD COLUMN `hoursRemaining` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `LeaveRequest` DROP COLUMN `hours`,
    ADD COLUMN `hoursRequested` INTEGER NOT NULL,
    ADD COLUMN `status` ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'APPROVED';

-- CreateIndex
CREATE INDEX `LeaveCredit_userId_createdAt_idx` ON `LeaveCredit`(`userId`, `createdAt`);
