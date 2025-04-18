-- to show the functioning of our database, we have simulated a situation in this. in this simulation, we have tried to have every scenario we can have in our application, involving creation of data, updating, deletion and viewing of data. below is what the simulation is aiming to depit : 

-- a person named sarthak singh will sign up and select university of calgary as he studies there. we simulate him signing up. then he logs in and views his profile. then he browses the clubs available for joining in his university. he will join a club out of one of those clubs (as we have dummy data we will be using hard coded values to simulate this). he becomes a nomral member after joining. once joined he will view all the events of that university and rsvp for one of them. after this, he looks at the announcement associated to this event, go to the discussion channels and add a message saying that he does not want to go to the event anymore because it is just not for him. once this is done he will go and remove his rsvp for the event that he made. then he gets promoted to an admin. once an admin, he will update the description of the club he is admin in. 


USE ClubSync;

-- sarthak signs up with his information
INSERT INTO User (FirstName, LastName, Email, Password, Location, UniversityId)
VALUES ('Sarthak', 'Singh', 'sarthak@ucalgary.ca', 'password123', 'Calgary, AB', 2);

-- we checked the database for his user id for demonstration purposes -> user id = 8

-- sarthak views his profile
SELECT * 
FROM User 
WHERE UserId = 8;

-- browses all the clubs in his university
SELECT * 
FROM Club
WHERE UniversityId = (SELECT UniversityId FROM User WHERE UserId = 8);

-- join one of those clubs 
INSERT INTO ClubMember (UserId, ClubId, DateJoined)
VALUES (8, 3, '2025-03-30');

-- his member id becomes 10 (manually checked)
-- becomes a nromal member
INSERT INTO ClubNormalMember (MemberId, ClubId)
VALUES (10, 3);

-- browses all the events of that club
SELECT * 
FROM Event
WHERE ClubId = 3;

-- he will rsvp for one of these events
INSERT INTO RSVP (UserId, EventId, RSVPDate)
VALUES (8, 3, '2025-03-31');

-- he will then view al announcements regarding this event
SELECT * 
FROM Announcement
WHERE EventId = 3;

-- he will then go to the discussion channels 
SELECT * 
FROM DiscussionChannel
WHERE AnnouncementId = (SELECT AnnouncementId FROM Announcement WHERE EventId = 3);

-- add a message to the discussion channel saying he doesnt like it anymore
INSERT INTO Message (ChannelId, ClubMemberId, Content, DatePosted)
VALUES (
    (SELECT ChannelId FROM DiscussionChannel 
     WHERE AnnouncementId = (SELECT AnnouncementId FROM Announcement WHERE EventId = 3)),
    10,
    'oh this is not for me',
    '2025-04-01'
);

-- he will then delete his rsvp 
DELETE FROM RSVP
WHERE UserId = 8 AND EventId = 3;

-- he then gets promoted to admin 
INSERT INTO ClubAdmin (MemberId, ClubId)
VALUES (10, 3);

-- he then updates the description of the club 
UPDATE Club
SET Description = 'java agents are very cool i love them'
WHERE ClubId = 3;