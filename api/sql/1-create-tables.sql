CREATE table `locations`
(
    id_locations int not null auto_increment primary key,
    name varchar(1024) not null
);


create table `flights`
(
    id_flights int not null auto_increment primary key,
    ref varchar(128) not null,
    departure_id int not null,
    destination_id int not null,
    price varchar(1024) not null,
    disponibility int not null,
    foreign key (departure_id) references locations(id_locations),
    foreign key (destination_id) references locations(id_locations)
);

create table `users`
(
    id_users int not null auto_increment primary key,
    name varchar(128) not null,
    mail varchar(255) not null,
    password varchar(1024) not null
);

create table `orders`
(
    id_orders int not null auto_increment primary key,
    id_users int not null,
    foreign key (id_users) references users(id_users)
);

create table `tickets`
(
    id_tickets int not null auto_increment primary key,
    id_flights int not null,
    id_orders int not null,
    ticket_date timestamp not null,
    foreign key (id_flights) references flights(id_flights),
    foreign key (id_orders) references orders(id_orders)
);