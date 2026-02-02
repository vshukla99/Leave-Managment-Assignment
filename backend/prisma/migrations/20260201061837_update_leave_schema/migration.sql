-- AlterTable
ALTER TABLE `LeaveRequest` ALTER COLUMN `status` DROP DEFAULT;

-- CreateIndex
CREATE INDEX `LeaveCredit_expiresAt_idx` ON `LeaveCredit`(`expiresAt`);

-- CreateIndex
CREATE INDEX `LeaveCredit_userId_idx` ON `LeaveCredit`(`userId`);

-- CreateIndex
CREATE INDEX `LeaveRequest_leaveDate_idx` ON `LeaveRequest`(`leaveDate`);

-- RenameIndex
ALTER TABLE `LeaveRequest` RENAME INDEX `LeaveRequest_userId_fkey` TO `LeaveRequest_userId_idx`;
