CREATE TABLE `favorites` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`tmdbId` int NOT NULL,
	`mediaType` enum('movie','tv') NOT NULL,
	`title` text NOT NULL,
	`posterPath` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `favorites_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `userPreferences` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`language` varchar(10) NOT NULL DEFAULT 'en',
	`theme` varchar(20) NOT NULL DEFAULT 'dark',
	`autoPlayNextEpisode` int NOT NULL DEFAULT 1,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `userPreferences_id` PRIMARY KEY(`id`),
	CONSTRAINT `userPreferences_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `watchProgress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`tmdbId` int NOT NULL,
	`mediaType` enum('movie','tv') NOT NULL,
	`lastWatchedSeason` int,
	`lastWatchedEpisode` int,
	`lastWatchedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `watchProgress_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `watchlist` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`tmdbId` int NOT NULL,
	`mediaType` enum('movie','tv') NOT NULL,
	`title` text NOT NULL,
	`posterPath` text,
	`addedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `watchlist_id` PRIMARY KEY(`id`)
);
