-- AlterTable
ALTER TABLE `pokémon_trades` ADD COLUMN `updated` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0);

-- CreateTable
CREATE TABLE `session` (
    `id` VARCHAR(255) NOT NULL,
    `sid` VARCHAR(191) NOT NULL,
    `data` MEDIUMTEXT NOT NULL,
    `expiresAt` TIMESTAMP(6) NOT NULL,

    UNIQUE INDEX `session_sid_key`(`sid`),
    INDEX `expiresAt`(`expiresAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
