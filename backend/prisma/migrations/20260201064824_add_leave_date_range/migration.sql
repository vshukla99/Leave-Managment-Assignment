/*
  Warnings:

  - You are about to drop the column `leaveDate` on the `LeaveRequest` table. All the data in the column will be lost.
  - Added the required column `fromDate` to the `LeaveRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `toDate` to the `LeaveRequest` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `LeaveRequest_leaveDate_idx` ON `LeaveRequest`;

-- AlterTable
ALTER TABLE `LeaveRequest` DROP COLUMN `leaveDate`,
    ADD COLUMN `fromDate` DATETIME(3) NOT NULL,
    ADD COLUMN `toDate` DATETIME(3) NOT NULL,
    MODIFY `status` ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING';

-- CreateIndex
CREATE INDEX `LeaveRequest_fromDate_toDate_idx` ON `LeaveRequest`(`fromDate`, `toDate`);

-- CreateIndex
CREATE INDEX `LeaveRequest_status_idx` ON `LeaveRequest`(`status`);
