-- CreateTable
CREATE TABLE `WoodSpecies` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `slug` VARCHAR(191) NOT NULL,
    `label` VARCHAR(191) NOT NULL,
    `position` INTEGER NOT NULL DEFAULT 0,

    UNIQUE INDEX `WoodSpecies_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FinishOption` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `slug` VARCHAR(191) NOT NULL,
    `label` VARCHAR(191) NOT NULL,
    `position` INTEGER NOT NULL DEFAULT 0,

    UNIQUE INDEX `FinishOption_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

INSERT INTO `WoodSpecies` (`slug`, `label`, `position`) VALUES
('cedro', 'Cedro', 0),
('roble', 'Roble', 1),
('nogal', 'Nogal', 2),
('quina', 'Quina', 3),
('petiribi', 'Petiribí', 4);

INSERT INTO `FinishOption` (`slug`, `label`, `position`) VALUES
('mate', 'Mate', 0),
('semi_brillante', 'Semi-brillante', 1),
('brillante', 'Brillante', 2);
