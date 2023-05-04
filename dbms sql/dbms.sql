CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE OR REPLACE FUNCTION generate_uid(size INT) RETURNS TEXT AS $$
DECLARE
  characters TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  bytes BYTEA := gen_random_bytes(size);
  l INT := length(characters);
  i INT := 0;
  output TEXT := '';
BEGIN
  WHILE i < size LOOP
    output := output || substr(characters, get_byte(bytes, i) % l + 1, 1);
    i := i + 1;
  END LOOP;
  RETURN output;
END;
$$ LANGUAGE plpgsql VOLATILE;



create table hotel(
	hotel_id varchar(15) primary key not null default generate_uid(15),
	hotel_name varchar(25),
	country varchar(25),
	city varchar(25),
	postal_code int,
	street varchar(25)
);


create table customer(
	customer_id varchar(15) primary key not null default generate_uid(15),
	f_name varchar(15),
	l_name varchar(15),
	email varchar(50) unique,
	phone varchar(15),
	username varchar(15) unique,
	password varchar(255)
);


create table room_type(
	room_id varchar(15) primary key not null default generate_uid(15),
	hotel_id varchar(15),
	executive_room_a int,
	prime_room_a int,
	deluxe_room_a int,
	executive_room_t int,
	prime_room_t int,
	deluxe_room_t int,
	price int,
	constraint fk_hid foreign key(hotel_id) references hotel(hotel_id) on delete set null	
);

create table review(
	review_id varchar(15) primary key not null default generate_uid(15),
	customer_id varchar(15),
	review_comment varchar(100),
	rating int,
	constraint fk_cid foreign key(customer_id) references customer(customer_id) on delete set null
);

create table bookings(
	booking_id varchar(15) primary key not null default generate_uid(15),
	customer_id varchar(15),
	hotel_id varchar(15),
	no_person int,
	cin_date date,
	cout_date date,
	constraint fk_hid foreign key(hotel_id) references hotel(hotel_id) on delete set null,
	constraint fk_cid foreign key(customer_id) references customer(customer_id) on delete set null
);


INSERT INTO hotel (hotel_name, country, city, postal_code, street)
VALUES
   ('Serena Hotel', 'Pakistan', 'Islamabad', 44000, 'Khayaban-e-Suhrawardy'),
   ('Pearl Continental Hotel', 'Pakistan', 'Lahore', 54000, 'Shahrah-e-Quaid-e-Azam'),
   ('Movenpick Hotel', 'Pakistan', 'Karachi', 75600, 'Club Road'),
   ('Ramada Plaza Hotel', 'Pakistan', 'Rawalpindi', 46000, 'The Mall'),
   ('PC Hotel Gwadar', 'Pakistan', 'Gwadar', 91000, 'Gwadar West Bay'),
   ('Avari Lahore Hotel', 'Pakistan', 'Lahore', 54000, 'Mall Road'),
   ('Marriott Hotel', 'Pakistan', 'Islamabad', 44000, 'Aga Khan Road'),
   ('Pearl Continental Hotel', 'Pakistan', 'Rawalpindi', 46000, 'The Mall'),
   ('Islamabad Marriott Hotel', 'Pakistan', 'Islamabad', 44000, 'Aga Khan Road'),
   ('Ramada Hotel', 'Pakistan', 'Islamabad', 44000, 'Club Road'),
   ('Pearl Continental Hotel', 'Pakistan', 'Faisalabad', 38000, 'Lytton Road'),
   ('Serena Hotel', 'Pakistan', 'Faisalabad', 38000, 'Club Road'),
   ('Lahore Continental Hotel', 'Pakistan', 'Lahore', 54000, 'Shadman'),
   ('Avari Towers Karachi', 'Pakistan', 'Karachi', 75530, 'Fatima Jinnah Road'),
   ('Ramada Multan Hotel', 'Pakistan', 'Multan', 60000, 'Abdali Road'),
   ('Heritage Luxury Suites', 'Pakistan', 'Islamabad', 44000, 'Kaghan Road'),
   ('Hotel Crown Plaza', 'Pakistan', 'Rawalpindi', 46000, 'Adamjee Road'),
   ('Hotel One', 'Pakistan', 'Islamabad', 44000, 'IJP Road'),
   ('Hotel Grand Ambassador', 'Pakistan', 'Islamabad', 44000, 'Club Road'),
   ('Mehran Hotel Hyderabad', 'Pakistan', 'Hyderabad', 71000, 'Liaquat Road');



select hotel_id from hotel


INSERT INTO room_type (hotel_id, executive_room_a, prime_room_a, deluxe_room_a, executive_room_t, prime_room_t, deluxe_room_t, price)
VALUES
   ('r68R488LWwd9zmf', 5, 10, 20, 15, 25, 35, 5000),
   ('eOnHU9RSo1yUI7b', 8, 12, 22, 20, 30, 40, 6000),
   ('lhW6vDfwxE6DFrR', 7, 15, 25, 18, 35, 45, 5500),
   ('Qg7Cu8ZdWHCoEI7', 6, 13, 23, 17, 27, 37, 4500),
   ('6XuzqooqgHEZuaJ', 4, 8, 18, 12, 22, 32, 4000),
   ('A7G3H1oZxPtRggY', 10, 20, 30, 25, 40, 50, 7000),
   ('9mphIXMpgKAoged', 6, 12, 22, 16, 28, 38, 4500),
   ('YtFqCg7WaErK6EU', 9, 18, 28, 22, 35, 45, 6500),
   ('fxm10rMaeJRG91i', 8, 16, 26, 20, 32, 42, 6000),
   ('WYDdGTP6lUTsP5e', 5, 10, 20, 15, 25, 35, 5000),
   ('ZP6QwS3iixpX8yt', 7, 14, 24, 18, 33, 43, 5500),
   ('lnEEeKSsPxEDNNf', 6, 12, 22, 16, 28, 38, 4500),
   ('aptY1M2ncUHSUFr', 9, 19, 29, 23, 37, 47, 6500),
   ('HoNqlAgP8Y5UlyR', 7, 16, 26, 18, 32, 42, 5500),
   ('Co6sWcbjqnD2XLI', 5, 9, 19, 14, 24, 34, 4500),
   ('dHkAumz8QuY9BTx', 7, 13, 23, 17, 30, 40, 5000),
   ('T4KcjhGL7nLz5xE', 8, 15, 25, 20, 34, 44, 6000),
   ('Z40qVT3LN3lyGQi', 6, 11, 21, 15, 26, 36, 4500),
   ('3V8cJf6eLrcXe7t', 10, 21, 31, 27, 40, 50, 7500),
   ('PYuE9FKlcCg1vv6', 6, 14, 24, 18, 32, 42, 5000);







































