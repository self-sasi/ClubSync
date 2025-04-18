CREATE DATABASE ClubSync;

USE ClubSync;

-- a table for university. we have the location, university name and university Id (primary key)
CREATE TABLE University (
    UniversityId INT PRIMARY KEY AUTO_INCREMENT,
    UniversityName VARCHAR(255) NOT NULL,
    Location VARCHAR(255)  
);

-- a table for every single user who comes on the platform and signs up. basic user information with a foreign key referring to UniversityId of University. this means that every user in our database has to belong to a single university. the primary key is the userId
CREATE TABLE User (
    UserId INT PRIMARY KEY AUTO_INCREMENT,
    FirstName VARCHAR(100) NOT NULL,
    LastName VARCHAR(100) NOT NULL,
    Email VARCHAR(255) NOT NULL UNIQUE,
    Password VARCHAR(255) NOT NULL,
    Location VARCHAR(255),
    UniversityId INT NOT NULL,
    FOREIGN KEY (UniversityId) REFERENCES University(UniversityId)
);

-- a table for clubs, clubId will denote it as it is unique. there is a foreign key referring to university. means every club in our database has to belong to a university as well. 
CREATE TABLE Club (
    ClubId INT PRIMARY KEY AUTO_INCREMENT,
    ClubName VARCHAR(255) NOT NULL,
    Description TEXT,
    CreationDate DATE,
    UniversityId INT NOT NULL,
    FOREIGN KEY (UniversityId) REFERENCES University(UniversityId)
);

-- a table for club member, there is a member Id which is the primary key (we could have used clubId with member Id but we just felt that having a seperate member Id would ease things later on). there are two foreign keys, userId and ClubId, referring to a club that the user has joined and his user Id. we can use this to get all the clubs that the user has joined using his userId
CREATE TABLE ClubMember (
    MemberId INT PRIMARY KEY AUTO_INCREMENT,  
    UserId INT NOT NULL,
    ClubId INT NOT NULL,
    DateJoined DATE,
    FOREIGN KEY (UserId) REFERENCES User(UserId),
    FOREIGN KEY (ClubId) REFERENCES Club(ClubId)
);

-- a subclass of club admin, this will only store club admins. stores the admins of clubs using memberId, and clubId. both are foreign keys. 
CREATE TABLE ClubAdmin (
    MemberId INT PRIMARY KEY,
    ClubId INT NOT NULL,
    FOREIGN KEY (MemberId) REFERENCES ClubMember(MemberId),
    FOREIGN KEY (ClubId) REFERENCES Club(ClubId)
);

-- similar as ClubAdmin but for normal members instead. 
CREATE TABLE ClubNormalMember (
    MemberId INT PRIMARY KEY,
    ClubId INT NOT NULL,
    FOREIGN KEY (MemberId) REFERENCES ClubMember(MemberId),
    FOREIGN KEY (ClubId) REFERENCES Club(ClubId)
);

-- table for storing events, has event Id as primary key and refers to a club using a foreign key, depicting that an event has to be arranged by a club. 
CREATE TABLE Event (
    EventId INT PRIMARY KEY AUTO_INCREMENT,
    ClubId INT NOT NULL,
    Name VARCHAR(255) NOT NULL,
    EventDate DATE,
    Location VARCHAR(255),
    Status VARCHAR(50),
    FOREIGN KEY (ClubId) REFERENCES Club(ClubId)
);

-- table for storing the information of who will attend what event. has userId an devent Id and rsvp date. 
CREATE TABLE RSVP (
    UserId INT NOT NULL,
    EventId INT NOT NULL,
    RSVPDate DATE,
    PRIMARY KEY (UserId, EventId),
    FOREIGN KEY (UserId) REFERENCES User(UserId),
    FOREIGN KEY (EventId) REFERENCES Event(EventId)
);

-- table for announcements. has announementId as primary key and eventId and clubId as a foreign key. basically saying that announcements are in clubs, regarding events. 
CREATE TABLE Announcement (
    AnnouncementId INT PRIMARY KEY AUTO_INCREMENT,
    ClubId INT NOT NULL,
    EventId INT NOT NULL,
    Content TEXT NOT NULL,
    DatePosted DATE,
    FOREIGN KEY (ClubId) REFERENCES Club(ClubId),
    FOREIGN KEY (EventId) REFERENCES Event(EventId)
);

-- discussion channel has channelId as primary key, announcement Id as foreign key as discussions channels are about an announcement. 
CREATE TABLE DiscussionChannel (
    ChannelId INT PRIMARY KEY AUTO_INCREMENT,
    AnnouncementId INT NOT NULL UNIQUE,
    ChannelName VARCHAR(255) NOT NULL,
    Description TEXT,
    FOREIGN KEY (AnnouncementId) REFERENCES Announcement(AnnouncementId)
);

-- message Id as primary key, channel Id and clubmember Id are foreign keys. this says that the channel Id has messages that belong to it and a clubmember is linked to a message (as they are the ones who message)
CREATE TABLE Message (
    MessageId INT PRIMARY KEY AUTO_INCREMENT,
    ChannelId INT NOT NULL,
    ClubMemberId INT NOT NULL,  
    Content TEXT NOT NULL,
    DatePosted DATE,
    FOREIGN KEY (ChannelId) REFERENCES DiscussionChannel(ChannelId),
    FOREIGN KEY (ClubMemberId) REFERENCES ClubMember(MemberId)
);

-- comment has comment Id as primary key. references to a clubmember and a message Id. a comment is basically on a message posted in a discussion channel. 
CREATE TABLE Comment (
    CommentId INT PRIMARY KEY AUTO_INCREMENT,  
    MessageId INT NOT NULL,
    ClubMemberId INT NOT NULL,
    Content TEXT NOT NULL,
    DatePosted DATE,
    FOREIGN KEY (MessageId) REFERENCES Message(MessageId),
    FOREIGN KEY (ClubMemberId) REFERENCES ClubMember(MemberId)
);

-- table for storing information of which admin manages which events or which event is managed by whom 
CREATE TABLE Manages (
    MemberId INT NOT NULL,
    EventId INT NOT NULL,
    PRIMARY KEY (MemberId, EventId),
    FOREIGN KEY (MemberId) REFERENCES ClubAdmin(MemberId),
    FOREIGN KEY (EventId) REFERENCES Event(EventId)
);
