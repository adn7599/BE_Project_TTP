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

CREATE TABLE Customer(			
    Ration_no CHAR(10) PRIMARY KEY,
    Registration_DateTime DATETIME NOT NULL,
    Password CHAR(64) NOT NULL,	#FOR SHA_256 hash
    Public_key CHAR(130) NOT NULL, #ECDSA 
    Private_key CHAR(64) NOT NULL, #ECDSA 
    Relay_Password CHAR(12) NOT NULL, #For Relay authentication
    FOREIGN KEY(Ration_no) REFERENCES GP_Customer(Ration_no)
);

CREATE TABLE Supplier(			
    Reg_no CHAR(12) PRIMARY KEY,
    Registration_DateTime DATETIME NOT NULL,
    Password CHAR(64) NOT NULL,	#FOR SHA_256 hash
    Public_key CHAR(130) NOT NULL, #ECDSA 
    Private_key CHAR(64) NOT NULL, #ECDSA 
    Relay_Password CHAR(12) NOT NULL, #For Relay authentication
    FOREIGN KEY(Reg_no) REFERENCES GP_Supplier(Reg_no)
);
			
CREATE TABLE Distributor(			
    Reg_no CHAR(12) PRIMARY KEY,
    Registration_DateTime DATETIME NOT NULL,
    Password CHAR(64) NOT NULL,	#FOR SHA_256 hash in hex
    Public_key CHAR(130) NOT NULL, #ECDSA 
    Private_key CHAR(64) NOT NULL, #ECDSA 
    Relay_Password CHAR(12) NOT NULL, #For Relay authentication
    FOREIGN KEY(Reg_no) REFERENCES GP_Distributor(Reg_no)
);

