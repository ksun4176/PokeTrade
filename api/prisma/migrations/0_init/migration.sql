-- CreateTable
CREATE TABLE `Discord_Channels` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `guild_id` VARCHAR(32) NOT NULL,
    `channel_id` VARCHAR(32) NOT NULL,
    `channel_type_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Expansion_Boosters` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `expansion_id` INTEGER NULL,
    `name` VARCHAR(16) NOT NULL,

    INDEX `expansion_id`(`expansion_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Expansions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(8) NOT NULL,
    `name` VARCHAR(32) NOT NULL,
    `total_cards` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Permissions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(32) NOT NULL,
    `hierarchy_level` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Players` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `display_name` VARCHAR(16) NOT NULL,
    `discord_id` VARCHAR(32) NOT NULL,
    `username` VARCHAR(32) NOT NULL,
    `friend_code` VARCHAR(20) NOT NULL,
    `permission_id` INTEGER NOT NULL DEFAULT 8,
    `main_id` INTEGER NULL,

    UNIQUE INDEX `discord_id`(`discord_id`),
    INDEX `permission_id`(`permission_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pokémon_Attack` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(32) NOT NULL,
    `description` MEDIUMTEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pokémon_Card_Dex` (
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
CREATE TABLE `Pokémon_Card_Language` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(16) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pokémon_Card_Rarities` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(32) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pokémon_Energy` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` INTEGER NOT NULL,
    `amount` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pokémon_Postfixes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(8) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pokémon_Stage` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(8) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pokémon_Trades` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pokemon_id` INTEGER NOT NULL,
    `player_id` INTEGER NOT NULL,
    `trade_type_id` INTEGER NOT NULL,

    INDEX `trade_type_id`(`trade_type_id`),
    INDEX `player_id`(`player_id`),
    UNIQUE INDEX `pokemon_id`(`pokemon_id`, `player_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pokémon_Types` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(16) NOT NULL,
    `weakness` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Trade_Types` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(8) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Player_Alts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `player_id` INTEGER NOT NULL,
    `alt_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Player_cards` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `dex_id` INTEGER NOT NULL,
    `favorite` BOOLEAN NOT NULL,
    `added` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Player_Decks` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `player_id` INTEGER NOT NULL,
    `player_card` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Player_Dex` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `dex_id` INTEGER NOT NULL,
    `player_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Expansion_Boosters` ADD CONSTRAINT `Expansion_Boosters_ibfk_1` FOREIGN KEY (`expansion_id`) REFERENCES `Expansions`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Players` ADD CONSTRAINT `Players_ibfk_1` FOREIGN KEY (`permission_id`) REFERENCES `Permissions`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pokémon_Card_Dex` ADD CONSTRAINT `Pokémon_Card_Dex_ibfk_1` FOREIGN KEY (`language_id`) REFERENCES `Pokémon_Card_Language`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pokémon_Card_Dex` ADD CONSTRAINT `Pokémon_Card_Dex_ibfk_2` FOREIGN KEY (`type_id`) REFERENCES `Pokémon_Types`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pokémon_Card_Dex` ADD CONSTRAINT `Pokémon_Card_Dex_ibfk_3` FOREIGN KEY (`rarity_id`) REFERENCES `Pokémon_Card_Rarities`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pokémon_Card_Dex` ADD CONSTRAINT `Pokémon_Card_Dex_ibfk_4` FOREIGN KEY (`name_postfix_id`) REFERENCES `Pokémon_Postfixes`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pokémon_Card_Dex` ADD CONSTRAINT `Pokémon_Card_Dex_ibfk_5` FOREIGN KEY (`expansion_id`) REFERENCES `Expansions`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pokémon_Card_Dex` ADD CONSTRAINT `Pokémon_Card_Dex_ibfk_6` FOREIGN KEY (`booster_id`) REFERENCES `Expansion_Boosters`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pokémon_Trades` ADD CONSTRAINT `Pokémon_Trades_ibfk_1` FOREIGN KEY (`player_id`) REFERENCES `Players`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pokémon_Trades` ADD CONSTRAINT `Pokémon_Trades_ibfk_2` FOREIGN KEY (`pokemon_id`) REFERENCES `Pokémon_Card_Dex`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pokémon_Trades` ADD CONSTRAINT `Pokémon_Trades_ibfk_3` FOREIGN KEY (`trade_type_id`) REFERENCES `Trade_Types`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

