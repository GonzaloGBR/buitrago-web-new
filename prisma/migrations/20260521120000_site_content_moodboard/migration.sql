-- Collage de la pantalla de carga (5 tarjetas; la 6.ª sigue siendo el hero).
ALTER TABLE `SiteContent`
  ADD COLUMN `moodboardCollage1` VARCHAR(800) NOT NULL DEFAULT '' AFTER `homeHeroImage`,
  ADD COLUMN `moodboardCollage2` VARCHAR(800) NOT NULL DEFAULT '' AFTER `moodboardCollage1`,
  ADD COLUMN `moodboardCollage3` VARCHAR(800) NOT NULL DEFAULT '' AFTER `moodboardCollage2`,
  ADD COLUMN `moodboardCollage4` VARCHAR(800) NOT NULL DEFAULT '' AFTER `moodboardCollage3`,
  ADD COLUMN `moodboardCollage5` VARCHAR(800) NOT NULL DEFAULT '' AFTER `moodboardCollage4`;
