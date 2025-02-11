-- CreateTable
CREATE TABLE `account_cards` (
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
CREATE TABLE `discord_channels` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `guild_id` VARCHAR(32) NOT NULL,
    `channel_id` VARCHAR(32) NOT NULL,
    `channel_type_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `expansion_boosters` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `expansion_id` INTEGER NULL,
    `name` VARCHAR(16) NOT NULL,

    INDEX `expansion_id`(`expansion_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `expansions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(8) NOT NULL,
    `name` VARCHAR(32) NOT NULL,
    `total_cards` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `permissions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(32) NOT NULL,
    `hierarchy_level` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `players` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `discord_id` VARCHAR(32) NOT NULL,
    `username` VARCHAR(32) NOT NULL,
    `permission_id` INTEGER NOT NULL DEFAULT 8,

    UNIQUE INDEX `discord_id`(`discord_id`),
    INDEX `permission_id`(`permission_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pokémon_attack` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(32) NOT NULL,
    `description` MEDIUMTEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pokémon_card_dex` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `dex_id` INTEGER NOT NULL,
    `name` VARCHAR(32) NOT NULL,
    `name_postfix_id` INTEGER NULL,
    `hp` INTEGER NULL,
    `type_id` INTEGER NULL,
    `rarity_id` INTEGER NOT NULL,
    `expansion_id` INTEGER NOT NULL,
    `booster_id` INTEGER NOT NULL,
    `evolution_stage_id` INTEGER NULL,
    `ability_id` INTEGER NULL,
    `attack_one_id` INTEGER NULL,
    `attack_two_id` INTEGER NULL,
    `attack_three_id` INTEGER NULL,
    `pre-evolution_id` INTEGER NULL,
    `evolution_id` INTEGER NULL,
    `illustrator_id` INTEGER NULL,
    `language_id` INTEGER NULL,

    INDEX `Pokémon_Card_Dex_ibfk_5`(`expansion_id`),
    INDEX `booster_id`(`booster_id`),
    INDEX `language_id`(`language_id`),
    INDEX `name_variation_id`(`name_postfix_id`),
    INDEX `rarity_id`(`rarity_id`),
    INDEX `type_id`(`type_id`),
    UNIQUE INDEX `dex_id`(`dex_id`, `expansion_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pokémon_card_language` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(16) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pokémon_card_rarities` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(32) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pokémon_energy` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` INTEGER NOT NULL,
    `amount` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pokémon_postfixes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(8) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pokémon_stage` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(8) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pokémon_trades` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `card_id` INTEGER NOT NULL,
    `account_id` INTEGER NOT NULL,
    `trade_type_id` INTEGER NOT NULL,

    INDEX `account_id`(`account_id`),
    INDEX `trade_type_id`(`trade_type_id`),
    UNIQUE INDEX `card_id`(`card_id`, `account_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pokémon_types` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(16) NOT NULL,
    `weakness` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `trade_types` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(8) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `accounts` ADD CONSTRAINT `Accounts_ibfk_1` FOREIGN KEY (`player_id`) REFERENCES `players`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `expansion_boosters` ADD CONSTRAINT `Expansion_Boosters_ibfk_1` FOREIGN KEY (`expansion_id`) REFERENCES `expansions`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `players` ADD CONSTRAINT `Players_ibfk_1` FOREIGN KEY (`permission_id`) REFERENCES `permissions`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pokémon_card_dex` ADD CONSTRAINT `Pokémon_Card_Dex_ibfk_1` FOREIGN KEY (`language_id`) REFERENCES `pokémon_card_language`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pokémon_card_dex` ADD CONSTRAINT `Pokémon_Card_Dex_ibfk_2` FOREIGN KEY (`type_id`) REFERENCES `pokémon_types`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pokémon_card_dex` ADD CONSTRAINT `Pokémon_Card_Dex_ibfk_3` FOREIGN KEY (`rarity_id`) REFERENCES `pokémon_card_rarities`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pokémon_card_dex` ADD CONSTRAINT `Pokémon_Card_Dex_ibfk_4` FOREIGN KEY (`name_postfix_id`) REFERENCES `pokémon_postfixes`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pokémon_card_dex` ADD CONSTRAINT `Pokémon_Card_Dex_ibfk_5` FOREIGN KEY (`expansion_id`) REFERENCES `expansions`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pokémon_card_dex` ADD CONSTRAINT `Pokémon_Card_Dex_ibfk_6` FOREIGN KEY (`booster_id`) REFERENCES `expansion_boosters`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pokémon_trades` ADD CONSTRAINT `Pokémon_Trades_ibfk_1` FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pokémon_trades` ADD CONSTRAINT `Pokémon_Trades_ibfk_2` FOREIGN KEY (`card_id`) REFERENCES `pokémon_card_dex`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pokémon_trades` ADD CONSTRAINT `Pokémon_Trades_ibfk_3` FOREIGN KEY (`trade_type_id`) REFERENCES `trade_types`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

