-- Ampliar URLs de imagen (R2 con rutas largas superaban VARCHAR(191)).
ALTER TABLE `Category` MODIFY `image` VARCHAR(512) NOT NULL;
ALTER TABLE `Product` MODIFY `image` VARCHAR(512) NOT NULL;
