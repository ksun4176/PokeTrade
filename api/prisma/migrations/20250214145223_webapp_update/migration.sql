/*
  Warnings:

  - You are about to drop the column `display_name` on the `players` table. All the data in the column will be lost.
  - You are about to drop the column `friend_code` on the `players` table. All the data in the column will be lost.
  - You are about to drop the column `main_id` on the `players` table. All the data in the column will be lost.
  - You are about to drop the column `player_id` on the `pokémon_trades` table. All the data in the column will be lost.
  - You are about to drop the `player_alts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `player_cards` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `player_decks` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `player_dex` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[pokemon_id,account_id]` on the table `pokémon_trades` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `account_id` to the `pokémon_trades` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `pokémon_trades` DROP FOREIGN KEY `Pokémon_Trades_ibfk_1`;

-- DropForeignKey
ALTER TABLE `pokémon_trades` DROP FOREIGN KEY `Pokémon_Trades_ibfk_2`;

-- DropIndex
DROP INDEX `player_id` ON `pokémon_trades`;

-- DropIndex
DROP INDEX `pokemon_id` ON `pokémon_trades`;

-- AlterTable
ALTER TABLE `players`
    MODIFY `display_name` VARCHAR(16) NULL,
    MODIFY `friend_code` VARCHAR(20) NULL;

ALTER TABLE `players`
    RENAME COLUMN `display_name` TO `do_not_use_dname`,
    RENAME COLUMN `friend_code` TO `do_not_use_fc`,
    RENAME COLUMN `main_id` TO `do_not_use_main`,
    ADD COLUMN `access_token` VARCHAR(191) NULL,
    ADD COLUMN `refresh_token` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `pokémon_trades` 
    MODIFY COLUMN `player_id` INTEGER NULL;
ALTER TABLE `pokémon_trades`
    RENAME COLUMN `player_id` TO `do_not_use_player`,
    ADD COLUMN `account_id` INTEGER NOT NULL,
    ADD COLUMN `updated` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0);

-- DropTable
DROP TABLE `player_alts`;

-- DropTable
DROP TABLE `player_cards`;

-- DropTable
DROP TABLE `player_decks`;

-- DropTable
DROP TABLE `player_dex`;

-- CreateTable
CREATE TABLE `account_card` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `dex_id` INTEGER NOT NULL,
    `favorite` BOOLEAN NOT NULL,
    `added` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `account_decks` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `account_id` INTEGER NOT NULL,
    `card_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `account_dex` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `dex_id` INTEGER NOT NULL,
    `account_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `accounts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `in_game_name` VARCHAR(32) NOT NULL,
    `friend_code` VARCHAR(32) NOT NULL,
    `player_id` INTEGER NOT NULL,

    UNIQUE INDEX `friend_code`(`friend_code`),
    INDEX `player_id`(`player_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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

-- CreateIndex
CREATE INDEX `account_id` ON `pokémon_trades`(`account_id`);

-- CreateIndex
CREATE UNIQUE INDEX `pokemon_account_id` ON `pokémon_trades`(`pokemon_id`, `account_id`);

-- AddForeignKey
ALTER TABLE `accounts` ADD CONSTRAINT `Accounts_ibfk_1` FOREIGN KEY (`player_id`) REFERENCES `players`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pokémon_trades` ADD CONSTRAINT `Pokémon_Trades_ibfk_1` FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pokémon_trades` ADD CONSTRAINT `Pokémon_Trades_ibfk_2` FOREIGN KEY (`pokemon_id`) REFERENCES `pokémon_card_dex`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;
