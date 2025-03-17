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
ALTER TABLE `Pokémon_Trades` DROP FOREIGN KEY `Pokémon_Trades_ibfk_1`;

-- DropForeignKey
ALTER TABLE `Pokémon_Trades` DROP FOREIGN KEY `Pokémon_Trades_ibfk_2`;

-- DropIndex
DROP INDEX `player_id` ON `Pokémon_Trades`;

-- DropIndex
DROP INDEX `pokemon_id` ON `Pokémon_Trades`;

-- AlterTable
ALTER TABLE `Players`
    MODIFY `display_name` VARCHAR(16) NULL,
    MODIFY `friend_code` VARCHAR(20) NULL;

ALTER TABLE `Players`
    RENAME COLUMN `display_name` TO `do_not_use_dname`,
    RENAME COLUMN `friend_code` TO `do_not_use_fc`,
    DROP COLUMN `main_id`,
    ADD COLUMN `access_token` VARCHAR(191) NULL,
    ADD COLUMN `refresh_token` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Pokémon_Trades` 
    MODIFY COLUMN `player_id` INTEGER NULL;
ALTER TABLE `Pokémon_Trades`
    RENAME COLUMN `player_id` TO `do_not_use_player`,
    ADD COLUMN `account_id` INTEGER NOT NULL,
    ADD COLUMN `updated` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0);

-- DropTable
DROP TABLE `Player_Alts`;

-- DropTable
DROP TABLE `Player_Cards`;

-- DropTable
DROP TABLE `Player_Decks`;

-- DropTable
DROP TABLE `Player_Dex`;

-- CreateTable
CREATE TABLE `Account_Card` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `dex_id` INTEGER NOT NULL,
    `favorite` BOOLEAN NOT NULL,
    `added` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Account_Decks` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `account_id` INTEGER NOT NULL,
    `card_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Account_Dex` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `dex_id` INTEGER NOT NULL,
    `account_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Accounts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `in_game_name` VARCHAR(32) NOT NULL,
    `friend_code` VARCHAR(32) NOT NULL,
    `player_id` INTEGER NOT NULL,

    UNIQUE INDEX `friend_code`(`friend_code`),
    INDEX `player_id`(`player_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Session` (
    `id` VARCHAR(255) NOT NULL,
    `sid` VARCHAR(191) NOT NULL,
    `data` MEDIUMTEXT NOT NULL,
    `expiresAt` TIMESTAMP(6) NOT NULL,

    UNIQUE INDEX `Session_sid_key`(`sid`),
    INDEX `expiresAt`(`expiresAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `account_id` ON `Pokémon_Trades`(`account_id`);

-- CreateIndex
CREATE UNIQUE INDEX `pokemon_account_id` ON `Pokémon_Trades`(`pokemon_id`, `account_id`);

-- AddForeignKey
ALTER TABLE `Accounts` ADD CONSTRAINT `Accounts_ibfk_1` FOREIGN KEY (`player_id`) REFERENCES `Players`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pokémon_Trades` ADD CONSTRAINT `Pokémon_Trades_ibfk_1` FOREIGN KEY (`account_id`) REFERENCES `Accounts`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pokémon_Trades` ADD CONSTRAINT `Pokémon_Trades_ibfk_2` FOREIGN KEY (`pokemon_id`) REFERENCES `Pokémon_Card_Dex`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;
