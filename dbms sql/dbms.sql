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
	hotel_id varchar(15),
	room_id varchar(15) primary key not null default generate_uid(15),
	room_type varchar(15),
	price int,
	total_rooms int,
	available_rooms int,
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


CREATE OR REPLACE FUNCTION insert_dummy_rooms() RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO room_type (hotel_id,room_type,price,total_rooms,available_rooms)
  VALUES 
  (NEW.hotel_id,'EXECUTIVE ROOM',15000, 20, 20),
  (NEW.hotel_id,'PRIME ROOM',10000, 30, 30),
  (NEW.hotel_id,'DELUXE ROOM',7000, 40, 40);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER insert_dummy_rooms_trigger
AFTER INSERT ON hotel
FOR EACH ROW
EXECUTE FUNCTION insert_dummy_rooms();



INSERT INTO hotel (hotel_name, country, city, postal_code, street)
VALUES
   ('Serena Hotel', 'Pakistan', 'Islamabad', 44000, 'Khayaban-e-Suhrawardy'),
   ('Pearl Continental Hotel', 'Pakistan', 'Lahore', 54000, 'Shahrah-e-Quaid-e-Azam'),
   ('Movenpick Hotel', 'Pakistan', 'Karachi', 75600, 'Club Road'),
   ('Ramada Plaza Hotel', 'Pakistan', 'Rawalpindi', 46000, 'The Mall'),
   ('PC Hotel', 'Pakistan', 'Gwadar', 91000, 'Gwadar West Bay'),
   ('Avari Hotel', 'Pakistan', 'Lahore', 54000, 'Mall Road'),
   ('Prince Hotel', 'Pakistan', 'Islamabad', 44000, 'Aga Khan Road'),
   ('Pearl Continental Hotel', 'Pakistan', 'Rawalpindi', 46000, 'The Mall'),
   ('Marriott Hotel', 'Pakistan', 'Islamabad', 44000, 'Aga Khan Road'),
   ('Ramada Hotel', 'Pakistan', 'Islamabad', 44000, 'Club Road'),
   ('Pearl Continental Hotel', 'Pakistan', 'Faisalabad', 38000, 'Lytton Road'),
   ('Serena Hotel', 'Pakistan', 'Faisalabad', 38000, 'Club Road'),
   ('Continental Hotel', 'Pakistan', 'Lahore', 54000, 'Shadman'),
   ('Avari Towers', 'Pakistan', 'Karachi', 75530, 'Fatima Jinnah Road'),
   ('Ramada Hotel', 'Pakistan', 'Multan', 60000, 'Abdali Road'),
   ('Heritage Luxury Suites', 'Pakistan', 'Islamabad', 44000, 'Kaghan Road'),
   ('Hotel Crown Plaza', 'Pakistan', 'Rawalpindi', 46000, 'Adamjee Road'),
   ('Hotel One', 'Pakistan', 'Islamabad', 44000, 'IJP Road'),
   ('Hotel Grand Ambassador', 'Pakistan', 'Islamabad', 44000, 'Club Road'),
   ('Mehran Hotel', 'Pakistan', 'Hyderabad', 71000, 'Liaquat Road');







INSERT INTO customer (f_name,l_name,email,phone,username,password)
VALUES 
	('Sibtain','Haider','sibtain.moon@gmail.com','03128816802','sibbi','$2a$10$4S2.JjY.jP/KVmi48mIo7uAHtbBN/nJlH9Zm9HduGVcUZEE66ASSaa');
