-- LOCATION --

CREATE TABLE IF NOT EXISTS flight_sell.location (
    id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(256) NOT NULL,
    UNIQUE (`name`)
);

-- DIRECTION --

CREATE TABLE IF NOT EXISTS flight_sell.direction (
    id          INT(11)         NOT NULL AUTO_INCREMENT PRIMARY KEY,
    departure   INT(11)         NOT NULL,
    destination INT(11)         NOT NULL,

    FOREIGN KEY (departure)                 REFERENCES flight_sell.`location`(`id`),
    FOREIGN KEY (destination)               REFERENCES flight_sell.`location`(`id`),
    UNIQUE (departure, destination)
);

-- USER --

CREATE TABLE IF NOT EXISTS flight_sell.user (
    id              INT(11)         NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name`          VARCHAR(128)    NOT NULL,
    mail            VARCHAR(256)   NOT NULL,
    `password`      VARCHAR(1024)   NOT NULL,

    UNIQUE (mail)    
);

-- EUR RATE --

CREATE TABLE IF NOT EXISTS flight_sell.eur_rate (
    id              INT(11)         NOT NULL AUTO_INCREMENT PRIMARY KEY,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    USD             VARCHAR(32)     NOT NULL,
    JPY             VARCHAR(32)     NOT NULL,
    BGN             VARCHAR(32)     NOT NULL,
    CZK             VARCHAR(32)     NOT NULL,
    DKK             VARCHAR(32)     NOT NULL,
    GBP             VARCHAR(32)     NOT NULL,
    HUF             VARCHAR(32)     NOT NULL,
    PLN             VARCHAR(32)     NOT NULL,
    RON             VARCHAR(32)     NOT NULL,
    SEK             VARCHAR(32)     NOT NULL,
    CHF             VARCHAR(32)     NOT NULL,
    ISK             VARCHAR(32)     NOT NULL,
    NOK             VARCHAR(32)     NOT NULL,
    HRK             VARCHAR(32)     NOT NULL,
    `TRY`           VARCHAR(32)     NOT NULL,
    AUD             VARCHAR(32)     NOT NULL,
    BRL             VARCHAR(32)     NOT NULL,
    CAD             VARCHAR(32)     NOT NULL,
    CNY             VARCHAR(32)     NOT NULL,
    HKD             VARCHAR(32)     NOT NULL,
    IDR             VARCHAR(32)     NOT NULL,
    ILS             VARCHAR(32)     NOT NULL,
    INR             VARCHAR(32)     NOT NULL,
    KRW             VARCHAR(32)     NOT NULL,
    MXN             VARCHAR(32)     NOT NULL,
    MYR             VARCHAR(32)     NOT NULL,
    NZD             VARCHAR(32)     NOT NULL,
    PHP             VARCHAR(32)     NOT NULL,
    SGD             VARCHAR(32)     NOT NULL,
    THB             VARCHAR(32)     NOT NULL,
    ZAR             VARCHAR(32)     NOT NULL
);

-- FLIGHT ORIGIN --

CREATE TABLE IF NOT EXISTS flight_sell.flight_origin (
    id              INT(11)         NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name`          VARCHAR(128)    NOT NULL,

    UNIQUE (`name`)
);

-- FLIGHT --

CREATE TABLE IF NOT EXISTS flight_sell.flight (
    id              INT(11)         NOT NULL AUTO_INCREMENT PRIMARY KEY,
    reference       VARCHAR(128)    NOT NULL UNIQUE,
    direction       INT(11)         NOT NULL,
    price           VARCHAR(32)     NOT NULL,
    disponibility   INT(6)          NOT NULL,
    origin          INT(11)         NOT NULL,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (direction) REFERENCES flight_sell.direction(id),
    FOREIGN KEY (origin) REFERENCES flight_sell.flight_origin(id)
);

-- FLIGHT OPTION VALUE TYPE -- 

CREATE TABLE IF NOT EXISTS flight_sell.flight_option_value_type (
    id              INT(11)         NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `type`          VARCHAR(128)    NOT NULL,
    isPercent       INT(1)          NOT NULL,

    UNIQUE (`type`, isPercent)
);

-- FLIGHT OPTION --

CREATE TABLE IF NOT EXISTS flight_sell.flight_option (
    id              INT(11)         NOT NULL AUTO_INCREMENT PRIMARY KEY,
    flight          INT(11)         NOT NULL,
    `name`          VARCHAR(128)    NOT NULL,
    `value`         VARCHAR(32)     NOT NULL,
    value_type      INT(11)         NOT NULL,

    FOREIGN KEY (flight) REFERENCES flight_sell.flight(id),
    FOREIGN KEY (value_type) REFERENCES flight_sell.flight_option_value_type(id)
);

-- ORDER --

CREATE TABLE IF NOT EXISTS flight_sell.order (
    id              INT(11)         NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user            INT(11)         NOT NULL,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user) REFERENCES flight_sell.user(id)
);

-- TICKET --

CREATE TABLE IF NOT EXISTS flight_sell.ticket (
    id              INT(11)         NOT NULL AUTO_INCREMENT PRIMARY KEY,
    flight          INT(11)         NOT NULL,
    `order`         INT(11)         NOT NULL,

    FOREIGN KEY (flight) REFERENCES flight_sell.flight(id),
    FOREIGN KEY (`order`) REFERENCES flight_sell.`order`(id)
);

-- TICKET OPTION --

CREATE TABLE IF NOT EXISTS flight_sell.ticket_option (
    id              INT(11)         NOT NULL AUTO_INCREMENT PRIMARY KEY,
    ticket          INT(11)         NOT NULL,
    flight_option   INT(11)         NOT NULL,

    FOREIGN KEY (ticket) REFERENCES flight_sell.ticket(id),
    FOREIGN KEY (flight_option) REFERENCES flight_sell.flight_option(id)
);

-- INSERTS --

INSERT INTO flight_sell.flight_option_value_type ( `type`, isPercent )
VALUES
    ('add', 0),
    ('sub', 0),
    ('add', 1),
    ('sub', 1);

INSERT INTO flight_sell.location (`name`)
VALUES
    ('CDG'),
    ('JFK'),
    ('DTW');

INSERT INTO flight_sell.direction (departure, destination)
VALUES
    (1, 2),
    (1, 3),
    (2, 3);

INSERT INTO flight_sell.flight_origin (`name`)
VALUES
    ("local");

INSERT INTO flight_sell.flight (`reference`, direction, price, disponibility, origin)
VALUES
    ("AAA-1", 1, "1000", 750, 1),
    ("BBB-1", 2, "700", 500, 1),
    ("CCC-1", 3, "300", 250, 1);

INSERT INTO flight_sell.flight_option (flight, `name`, `value`, value_type)
VALUES
    (1, "A/R", "5", 4),
    (2, "A/R", "5", 4),
    (3, "A/R", "5", 4),
    
    (1, "Champagne", "100", 1),
    
    (1, "First Class", "150", 3),
    (2, "First Class", "150", 3),
    (3, "First Class", "150", 3);