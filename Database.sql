CREATE DATABASE TTP;

CREATE TABLE GP_Customer(
	Ration_no CHAR(10) PRIMARY KEY,
    First_Name VARCHAR(20) NOT NULL,
    Middle_Name VARCHAR(20) NOT NULL,
    Last_Name VARCHAR(20) NOT NULL,
    Address VARCHAR(200) NOT NULL,
    Mob_no CHAR(10) NOT NULL UNIQUE,
    Email VARCHAR(30) UNIQUE,
    Aadhar_no CHAR(12) NOT NULL UNIQUE
);

CREATE TABLE GP_Supplier(
	Reg_no CHAR(12) PRIMARY KEY CHECK(Reg_no LIKE 'SP%'),
    First_Name VARCHAR(20) NOT NULL,
    Middle_Name VARCHAR(20) NOT NULL,
    Last_Name VARCHAR(20) NOT NULL,
    Address VARCHAR(200) NOT NULL,
    Mob_no CHAR(10) NOT NULL UNIQUE,
    Email VARCHAR(30) UNIQUE,
    Aadhar_no CHAR(12) NOT NULL UNIQUE,
    Pan_no CHAR(10) NOT NULL UNIQUE
);

CREATE TABLE GP_Distributor(
	Reg_no CHAR(12) PRIMARY KEY CHECK(Reg_no LIKE 'DA%'),
    First_Name VARCHAR(20) NOT NULL,
    Middle_Name VARCHAR(20) NOT NULL,
    Last_Name VARCHAR(20) NOT NULL,
    Address VARCHAR(200) NOT NULL,
    Mob_no CHAR(10) NOT NULL UNIQUE,
    Email VARCHAR(30) UNIQUE,
    Aadhar_no CHAR(12) NOT NULL UNIQUE,
    Pan_no CHAR(10) NOT NULL UNIQUE
);

CREATE TABLE GP_Commodity(
    Commodity_id CHAR(4) PRIMARY KEY,
    Name VARCHAR(20) NOT NULL UNIQUE,
    Description VARCHAR(500) NOT NULL,
    Unit VARCHAR(10) NOT NULL,
    Price FLOAT NOT NULL,
    image VARCHAR(100)
);

CREATE TABLE GP_Supplier_Stock(
    Reg_no CHAR(12),
    Commodity_id CHAR(4),
    Available_Quantity FLOAT NOT NULL,
    Max_Quantity FLOAT NOT NULL,
    PRIMARY KEY(Reg_no,Commodity_id),
    CHECK(Available_Quantity <= Max_Quantity),
    FOREIGN KEY(Reg_no) REFERENCES GP_Supplier(Reg_no),
    FOREIGN KEY(Commodity_id) REFERENCES GP_Commodity(Commodity_id)
);

CREATE TABLE GP_Distributor_Stock(
    Reg_no CHAR(12),
    Commodity_id CHAR(4),
    Available_Quantity FLOAT NOT NULL,
    PRIMARY KEY(Reg_no,Commodity_id),
    FOREIGN KEY(Reg_no) REFERENCES GP_Distributor(Reg_no),
    FOREIGN KEY(Commodity_id) REFERENCES GP_Commodity(Commodity_id)
);

CREATE TABLE GP_Customer_Quota(
    Ration_no CHAR(10),
    Commodity_id CHAR(4),
    Allotted_Quantity FLOAT NOT NULL,
    Remaining_Quantity FLOAT NOT NULL,
    PRIMARY KEY(Ration_no,Commodity_id),
    CHECK(Allotted_Quantity >= Remaining_Quantity),
    FOREIGN KEY(Ration_no) REFERENCES GP_Customer(Ration_no),
    FOREIGN KEY(Commodity_id) REFERENCES GP_Commodity(Commodity_id)
);

CREATE TABLE Customer(			
    Ration_no CHAR(10) PRIMARY KEY,
    Registration_DateTime DATETIME NOT NULL,
    Password CHAR(64) NOT NULL,	#FOR SHA_256 hash
    DB_Key BINARY(16) NOT NULL, #FOR AES_128 key
    FOREIGN KEY(Ration_no) REFERENCES GP_Customer(Ration_no)
);

CREATE TABLE Supplier(			
    Reg_no CHAR(12) PRIMARY KEY,
    Registration_DateTime DATETIME NOT NULL,
    Password CHAR(64) NOT NULL,	#FOR SHA_256 hash
    DB_Key BINARY(16) NOT NULL, #FOR AES_128 key
    FOREIGN KEY(Reg_no) REFERENCES GP_Supplier(Reg_no)
);
			
CREATE TABLE Distributor(			
    Reg_no CHAR(12) PRIMARY KEY,
    Registration_DateTime DATETIME NOT NULL,
    Password CHAR(64) NOT NULL,	#FOR SHA_256 hash,
    DB_Key BINARY(16) NOT NULL, #FOR AES_128 key,
    FOREIGN KEY(Reg_no) REFERENCES GP_Distributor(Reg_no)
);

CREATE TABLE Transaction_Cust_Supp(						
    Transaction_id CHAR(36) PRIMARY KEY, #FOR UUIDv4
    Customer_id CHAR(10) NOT NULL,
    Supplier_id CHAR(12) NOT NULL,
    No_of_items INT NOT NULL,
    Total_Amount FLOAT NOT NULL,
    DateTime DATETIME NOT NULL,
    Completed_phase INT NOT NULL,
    FOREIGN KEY(Customer_id) REFERENCES Customer(Ration_no),
    FOREIGN KEY(Supplier_id) REFERENCES Supplier(Reg_no),
    CHECK(Completed_phase <=2 AND Completed_phase >= 1) 
);

CREATE TABLE Transaction_Cust_Supp_Commodities(
    Transaction_id CHAR(36),
    Commodity_id CHAR(4), 	
    Quantity FLOAT NOT NULL,
    Total_Price FLOAT NOT NULL,
    PRIMARY KEY(Transaction_id,Commodity_id),
    FOREIGN KEY(Transaction_id) REFERENCES Transaction_Cust_Supp(Transaction_id),
    FOREIGN KEY(Commodity_id) REFERENCES GP_Commodity(Commodity_id) 
);			


CREATE TABLE Transaction_Cust_Supp_Payments_Confirmation(
    Transaction_id CHAR(36)	PRIMARY KEY,
    Payment_id CHAR(36) UNIQUE NOT NULL,
    Payment_mode VARCHAR(20) NOT NULL,	
    Payment_DateTime DATETIME NOT NULL,	
    Confirmation_DateTime DATETIME NOT NULL,
    FOREIGN KEY(Transaction_id) REFERENCES Transaction_Cust_Supp(Transaction_id)
);

CREATE TABLE Transaction_Supp_DA(						
    Transaction_id CHAR(36) PRIMARY KEY, #FOR UUIDv4
    Supplier_id CHAR(12) NOT NULL,
    DA_id CHAR(12) NOT NULL,
    No_of_items INT NOT NULL,
    Total_Amount FLOAT NOT NULL,
    DateTime DATETIME NOT NULL,
    Completed_phase INT NOT NULL,
    FOREIGN KEY(Supplier_id) REFERENCES Supplier(Reg_no),
    FOREIGN KEY(DA_id) REFERENCES Distributor(Reg_no),
    CHECK(Completed_phase <=2 AND Completed_phase >= 1) 
);

CREATE TABLE Transaction_Supp_DA_Commodities(
    Transaction_id CHAR(36),
    Commodity_id CHAR(4), 	
    Quantity FLOAT NOT NULL,
    Total_Price FLOAT NOT NULL,
    PRIMARY KEY(Transaction_id,Commodity_id),
    FOREIGN KEY(Transaction_id) REFERENCES Transaction_Supp_DA(Transaction_id),
    FOREIGN KEY(Commodity_id) REFERENCES GP_Commodity(Commodity_id) 
);			


CREATE TABLE Transaction_Supp_DA_Payments_Confirmation(
    Transaction_id CHAR(36)	PRIMARY KEY,
    Payment_id CHAR(36) UNIQUE NOT NULL,
    Payment_mode VARCHAR(20) NOT NULL,	
    Payment_DateTime DATETIME NOT NULL,	
    Confirmation_DateTime DATETIME NOT NULL,
    FOREIGN KEY(Transaction_id) REFERENCES Transaction_Supp_DA(Transaction_id)
);

			

