CREATE TABLE Users
(
ID serial NOT NULL,
username varchar(30) NOT NULL,
email varchar(30) NOT NULL,
password varchar(30) NOT NULL,
PRIMARY KEY (ID)
);

CREATE TABLE Events
(
ID serial NOT NULL,
uid int NOT NULL,
PRIMARY KEY (ID),
FOREIGN KEY (uid) REFERENCES Users(ID)
);

CREATE TABLE Messages
(
ID serial NOT NULL,
uid int NOT NULL,
eid int NOT NULL,
content varchar(200) NOT NULL,
time time NOT NULL,
PRIMARY KEY (ID),
FOREIGN KEY (uid) REFERENCES Users(ID),
FOREIGN KEY (eid) REFERENCES Events(ID)
);

CREATE TABLE Privacy
(
ID int NOT NULL,
content varchar(2) NOT NULL,
invite varchar(2) NOT NULL,
location varchar(2) NOT NULL,
FOREIGN KEY (ID) REFERENCES Users(ID),
PRIMARY KEY (ID)
);

CREATE TABLE Friendships
(
ID1 int NOT NULL,
ID2 int NOT NULL,
FOREIGN KEY (ID1) REFERENCES Users(ID),
FOREIGN KEY (ID2) REFERENCES Users(ID),
PRIMARY KEY (ID1,ID2)
);

CREATE TABLE Notes
(
ID serial NOT NULL,
uid int NOT NULL,
eid int NOT NULL,
content varchar(200) NOT NULL,
PRIMARY KEY (ID),
FOREIGN KEY (uid) REFERENCES Users(ID),
FOREIGN KEY (eid) REFERENCES Events(ID)
);

