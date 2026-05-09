-- CreateTable
CREATE TABLE `Category` (
    `slug` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `tagline` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `image` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`slug`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Product` (
    `id` VARCHAR(191) NOT NULL,
    `categorySlug` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `price` VARCHAR(191) NOT NULL,
    `wood` VARCHAR(191) NOT NULL,
    `woodBadge` VARCHAR(191) NOT NULL,
    `dimensions` VARCHAR(191) NOT NULL,
    `shortDescription` TEXT NOT NULL,
    `description` TEXT NOT NULL,
    `finish` VARCHAR(191) NOT NULL,
    `image` VARCHAR(191) NOT NULL,
    `features` JSON NOT NULL,
    `gallery` JSON NOT NULL,

    INDEX `Product_categorySlug_idx`(`categorySlug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProductSize` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `productId` VARCHAR(191) NOT NULL,
    `label` VARCHAR(191) NOT NULL,
    `price` VARCHAR(191) NOT NULL,
    `position` INTEGER NOT NULL DEFAULT 0,

    INDEX `ProductSize_productId_idx`(`productId`),
    INDEX `ProductSize_productId_position_idx`(`productId`, `position`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FeaturedProduct` (
    `position` INTEGER NOT NULL,
    `productId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `FeaturedProduct_productId_key`(`productId`),
    PRIMARY KEY (`position`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Inquiry` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NULL,
    `message` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `ipHash` VARCHAR(191) NULL,

    INDEX `Inquiry_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_categorySlug_fkey` FOREIGN KEY (`categorySlug`) REFERENCES `Category`(`slug`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductSize` ADD CONSTRAINT `ProductSize_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FeaturedProduct` ADD CONSTRAINT `FeaturedProduct_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

