CREATE TABLE Users
(
ID serial NOT NULL,
username varchar(30) NOT NULL,
email varchar(30) NOT NULL,
password varchar(30) NOT NULL,
token varchar(255),
PRIMARY KEY (ID),
UNIQUE(email),
UNIQUE(username)
);

CREATE TABLE UserInfo(
ID serial NOT NULL,
uid int not NULL,
gender varchar(2),
dob date,
fname varchar(30),
lname varchar(30),
PRIMARY KEY (ID),
FOREIGN KEY (uid) REFERENCES Users(ID) ON DELETE CASCADE
);
CREATE TABLE Events
(
ID serial NOT NULL,
uid int NOT NULL,
location varchar(30),
PRIMARY KEY (ID),
FOREIGN KEY (uid) REFERENCES Users(ID) ON DELETE CASCADE
);

CREATE TABLE goingTo
(
uid int NOT NULL,
eid int NOT NULL,
latitude double precision,
longitude double precision,
pref_loc varchar(30),
PRIMARY KEY (uid,eid),
FOREIGN KEY (uid) REFERENCES Users(ID) ON DELETE CASCADE,
FOREIGN KEY (eid) REFERENCES Events(ID) ON DELETE CASCADE
);

CREATE TABLE invited
(
from_uid int NOT NULL,
to_uid int NOT NULL,
eid int NOT NULL,
PRIMARY KEY (to_uid,eid),
FOREIGN KEY (from_uid) REFERENCES Users(ID) ON DELETE CASCADE,
FOREIGN KEY (to_uid) REFERENCES Users(ID) ON DELETE CASCADE,
FOREIGN KEY (eid) REFERENCES Events(ID) ON DELETE CASCADE
);

CREATE TABLE friendrequests
(
from_uid int NOT NULL,
to_uid int NOT NULL,
PRIMARY KEY (to_uid,from_uid),
FOREIGN KEY (from_uid) REFERENCES Users(ID) ON DELETE CASCADE,
FOREIGN KEY (to_uid) REFERENCES Users(ID) ON DELETE CASCADE
);

CREATE TABLE Messages
(
ID serial NOT NULL,
uid int NOT NULL,
eid int NOT NULL,
content varchar(200) NOT NULL,
time time NOT NULL default current_time,
PRIMARY KEY (ID),
FOREIGN KEY (uid) REFERENCES Users(ID) ON DELETE CASCADE,
FOREIGN KEY (eid) REFERENCES Events(ID) ON DELETE CASCADE
);

CREATE TABLE locationsuggestions
(
eid int NOT NULL,
location varchar(30) NOT NULL,
place_id varchar(30) NOT NULL,
time time NOT NULL default current_time,
PRIMARY KEY (eid,place_id),
FOREIGN KEY (eid) REFERENCES Events(ID) ON DELETE CASCADE
);

CREATE TABLE Privacy
(
ID serial NOT NULL,
uid int NOT NULL,
content varchar(2) not null,
location varchar(2) not null,
ginvite varchar(2),
finvite varchar(2),
FOREIGN KEY (uid) REFERENCES Users(ID) ON DELETE CASCADE,
PRIMARY KEY (ID)
);

CREATE TABLE Friendships
(
ID1 int NOT NULL,
ID2 int NOT NULL,
FOREIGN KEY (ID1) REFERENCES Users(ID) ON DELETE CASCADE,
FOREIGN KEY (ID2) REFERENCES Users(ID) ON DELETE CASCADE,
PRIMARY KEY (ID1,ID2)
);

CREATE TABLE Themes
(
ID serial NOT NULL,
uid int NOT NULL,
theme varchar(6) NOT NULL,
PRIMARY KEY (ID),
FOREIGN KEY (uid) REFERENCES Users(ID) ON DELETE CASCADE
);

CREATE TABLE FutureMeetings
(
mid serial NOT NULL,
moid int NOT NULL,
location varchar(200) NOT NULL,
time varchar(15),
date date NOT NULL,
PRIMARY KEY (mid),
FOREIGN KEY (moid) REFERENCES Users(ID) ON DELETE CASCADE
);

CREATE TABLE FutureGoingTo
(
uid int NOT NULL,
mid int NOT NULL,
PRIMARY KEY (uid,mid),
FOREIGN KEY (uid) REFERENCES Users(ID) ON DELETE CASCADE,
FOREIGN KEY (mid) REFERENCES FutureMeetings(mid) ON DELETE CASCADE
);

CREATE TABLE futureInvited
(
mid int NOT NULL,
moid int NOT NULL,
to_uid int NOT NULL,
PRIMARY KEY (mid, to_uid),
FOREIGN KEY (moid) REFERENCES Users(ID) ON DELETE CASCADE,
FOREIGN KEY (to_uid) REFERENCES Users(ID) ON DELETE CASCADE,
FOREIGN KEY (mid) REFERENCES FutureMeetings(mid) ON DELETE CASCADE
);
