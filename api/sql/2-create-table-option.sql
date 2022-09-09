CREATE TABLE `flight_options` (
    id_flights_options int not null auto_increment primary key,
    flight_id int not null,
    name varchar(255) not null,
    foreign key (flight_id) references flights(id_flights)
);

CREATE TABLE `flight_options_meta_calc_types` (
    id_flight_options_meta_calc_types int not null auto_increment primary key,
    mode varchar(255),
    percent int(1) not null
);

CREATE TABLE `flight_options_meta` (
    id_flights_options int not null auto_increment primary key,
    flight_option_id int not null,
    name varchar(255) not null,
    value varchar(255) not null,
    flight_option_calc_type_id int,
    foreign key (flight_option_id) references flight_options(id_flights_options),
    foreign key (flight_option_calc_type_id) references flight_options_meta_calc_types(id_flight_options_meta_calc_types)
);

CREATE TABLE `ticket_active_option` (
    id_ticket_active_option int not null auto_increment primary key,
    ticket_id int not null,
    option_id int not null,
    foreign key (ticket_id) references 
    foreign key (option_id) references 
);