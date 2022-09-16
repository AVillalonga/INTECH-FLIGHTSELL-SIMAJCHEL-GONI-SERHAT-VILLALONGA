/* ************************************************ */
/*                                                  */
/* INTECH Fligh Sell - Dump                         */
/*                                                  */
/* ************************************************ */

/* ************************************************ */
/* Create Table                                     */
/* ************************************************ */

CREATE TABLE IF NOT EXISTS `flight_sell`.`location` (
    `id`                INT(11)         NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name`              VARCHAR(1024)   NOT NULL
);

/* ************************************************ */

CREATE TABLE IF NOT EXISTS `flight_sell`.`flight` (
    `id`                INT(11)         NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `reference`         VARCHAR(128)    NOT NULL UNIQUE,
    `departure_id`      INT(11)         NOT NULL,
    `destination_id`    INT(11)         NOT NULL,
    `price`             VARCHAR(32)     NOT NULL,
    `disponibility`     INT(6)          NOT NULL,

    FOREIGN KEY (`departure_id`)    REFERENCES `location`(`id`),
    FOREIGN KEY (`destination_id`)  REFERENCES `location`(`id`)
);

/* ************************************************ */

CREATE TABLE IF NOT EXISTS `flight_sell`.`customer` (
    `id`                INT(11)         NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name`              VARCHAR(128)    NOT NULL,
    `mail`              VARCHAR(256)    NOT NULL,
    `password`          VARCHAR(1024)   NOT NULL,

    CONSTRAINT mail                 UNIQUE (mail)
);

/* ************************************************ */

CREATE TABLE IF NOT EXISTS `flight_sell`.`order` (
    `id`                INT(11)         NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `customer_id`       INT(11)         NOT NULL,

    FOREIGN KEY (`customer_id`)     REFERENCES `customer`(`id`)
);

/* ************************************************ */

CREATE TABLE IF NOT EXISTS `flight_sell`.`ticket` (
    `id`                INT(11)         NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `flight_id`         INT(11)         NOT NULL,
    `order_id`          INT(11)         NOT NULL,
    `created_at`        TIMESTAMP       NOT NULL,

    FOREIGN KEY (`flight_id`)       REFERENCES `flight`(`id`),
    FOREIGN KEY (`order_id`)        REFERENCES `order`(`id`)
);

/* ************************************************ */

CREATE TABLE IF NOT EXISTS `flight_sell`.`flight_option` (
    `id`                INT(11)         NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name`              VARCHAR(256)    NOT NULL
);

/* ************************************************ */

CREATE TABLE IF NOT EXISTS `flight_sell`.`flight_option_meta_type` (
    `id`                INT(11)         NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `type`              VARCHAR(256)    NOT NULL,
    `isPercent`         INT(1)          NOT NULL
);

/* ************************************************ */

CREATE TABLE IF NOT EXISTS `flight_sell`.`flight_option_meta` (
    `id`                INT(11)         NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `flight_option_id`  INT(11)         NOT NULL,
    `flight_id`         INT(11)         NOT NULl,        
    `flight_option_meta_type` INT(11)   NOT NULL,
    `name`              VARCHAR(256)    NOT NULL,
    `value`             VARCHAR(256)    NOT NULL,

    FOREIGN KEY (`flight_id`)           REFERENCES `flight`(`id`),
    FOREIGN KEY (`flight_option_id`)    REFERENCES `flight_option`(`id`),
    FOREIGN KEY (`flight_option_meta_type`) REFERENCES `flight_option_meta_type`(`id`)

);

/* ************************************************ */

CREATE TABLE IF NOT EXISTS `flight_sell`.`ticket_option` (
    `id`                INT(11)         NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `ticket_id`         INT(11)         NOT NULL,
    `flight_option_meta_id`INT(11)         NOT NULL,

    FOREIGN KEY (`ticket_id`)           REFERENCES `ticket`(`id`),
    FOREIGN KEY (`flight_option_meta_id`)    REFERENCES `flight_option_meta`(`id`)
);

/* ************************************************ */

CREATE TABLE IF NOT EXISTS `flight_sell`.`order_option` (
    `id`                INT(11)         NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `order_id`          INT(11)         NOT NULL,
    `flight_option_meta_id` INT(11)     NOT NULL,

    FOREIGN KEY (`order_id`)           REFERENCES `order`(`id`),
    FOREIGN KEY (`flight_option_meta_id`)    REFERENCES `flight_option_meta`(`id`)
);

/* ************************************************ */
/* Data                                             */
/* ************************************************ */

INSERT INTO `flight_option_meta_type` (`type`, `isPercent`) VALUES
('add', 0),
('sub', 0),
('add', 1),
('sub', 1);

/* ************************************************ */

INSERT INTO `location`(`name`) VALUES
('CDG'),
('JFK'),
('DTW');

/* ************************************************ */

INSERT INTO `flight`(`reference`, `departure_id`, `destination_id`, `price`, `disponibility`) VALUES
("AAA", 1, 2, "1000", 750),
("BBB", 1, 3, "700", 500),
("CCC", 2, 3, "300", 250);

/* ************************************************ */

INSERT INTO `flight_option` (`name`) VALUES
('global'),
('boisson');

/* ************************************************ */

INSERT INTO `flight_option_meta` (`flight_id`, `flight_option_id`, `flight_option_meta_type`, `name`, `value`) VALUES
(1, 1, 4, 'AR', '5'),
(2, 1, 4, 'AR', '5'),
(3, 1, 4, 'AR', '5'),

(1, 2, 1, 'champagne', '100'),

(1, 1, 4, 'firstClass', '50'),
(2, 1, 4, 'firstClass', '50'),
(3, 1, 4, 'firstClass', '50');