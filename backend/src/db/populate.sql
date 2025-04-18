-- Use the ClubSync database
USE ClubSync;

-- we first make some universities and add their locations. id is set to auto increment so we wont be assigning manual id. 
INSERT INTO University (UniversityName, Location) VALUES
('Harvard', 'Cambridge, MA'),
('UCalgary', 'Calgary, AB'),
('IIT Mumbai', 'Mumbai, India');

-- we make dummy users, please note that we have set a common password for now as we will be implementing hashing from the backend side of our application and storing the hashed values. 
INSERT INTO User (FirstName, LastName, Email, Password, Location, UniversityId) VALUES
('John', 'Doe', 'johndoe@harvard.edu', 'password123', 'Cambridge, MA', 1),
('Priya', 'Sharma', 'priyasharma@harvard.edu', 'password123', 'Cambridge, MA', 1),
('Alice', 'Smith', 'alice.smith@ucalgary.ca', 'password123', 'Calgary, AB', 2),
('Rahul', 'Verma', 'rahul.verma@ucalgary.ca', 'password123', 'Calgary, AB', 2),
('Sanjay', 'Patel', 'sanjay.patel@iitm.ac.in', 'password123', 'Mumbai, India', 3),
('Emily', 'Johnson', 'emily.johnson@iitm.ac.in', 'password123', 'Mumbai, India', 3),
('Rohit', 'Mehta', 'rohit.mehta@iitm.ac.in', 'password123', 'Mumbai, India', 3);

-- making clubs for universities and giving them descriptions and dates. 
INSERT INTO Club (ClubName, Description, CreationDate, UniversityId) VALUES
('Harvard Debate Club', 'A club for debate enthusiasts', '2025-01-15', 1),
('Harvard Music Club', 'A club for music lovers', '2025-02-10', 1),
('UCalgary Tech Club', 'Tech talks and coding sessions', '2025-03-01', 2),
('UCalgary Art Club', 'Exploring art and creativity', '2025-03-05', 2),
('IIT Mumbai Coding Club', 'Coding and hackathons', '2025-02-20', 3),
('IIT Mumbai Cultural Club', 'Celebrating culture and arts', '2025-02-25', 3);

-- we then add club members into clubs

-- in harvard debate club, john doe will join this and we will also make him a admin later on
INSERT INTO ClubMember (UserId, ClubId, DateJoined) VALUES (1, 1, '2025-03-10');
-- priya sharma will join harvard music club and be admin later
INSERT INTO ClubMember (UserId, ClubId, DateJoined) VALUES (2, 2, '2025-03-11');
-- alice smith joins tech club from ucalgary and will be admin
INSERT INTO ClubMember (UserId, ClubId, DateJoined) VALUES (3, 3, '2025-03-12');
-- rahul joins ucalgary art club and will be admin
INSERT INTO ClubMember (UserId, ClubId, DateJoined) VALUES (4, 4, '2025-03-13');
-- sanjay joins iit mumbai coding club and will be admin
INSERT INTO ClubMember (UserId, ClubId, DateJoined) VALUES (5, 5, '2025-03-14');
-- emily joins iit cultural club and will be admin
INSERT INTO ClubMember (UserId, ClubId, DateJoined) VALUES (6, 6, '2025-03-15');

-- normal members
-- john joins harvard music club as a normal member
INSERT INTO ClubMember (UserId, ClubId, DateJoined) VALUES (1, 2, '2025-03-20');  
-- rahul also joins ucalgary tech as normal member
INSERT INTO ClubMember (UserId, ClubId, DateJoined) VALUES (4, 3, '2025-03-21'); 
-- rohit joins iit coding club as nomral member

-- here we assign admin roles
INSERT INTO ClubAdmin (MemberId, ClubId) VALUES
(1, 1),  -- john - harvard debate
(2, 2),  -- priya - harvard music
(3, 3),  -- alice - ucalgary tech
(4, 4),  -- rahil - ucalgary art
(5, 5),  -- sanjay - iit coding
(6, 6);  -- emily - iit cultural

-- here we assign normal member roles
INSERT INTO ClubNormalMember (MemberId, ClubId) VALUES
(7, 2),  -- john - harvard music
(8, 3),  -- rahul - ucalgary tech
(9, 5);  -- rohit - iit coding

-- we make dummy events for clubs with their dates and status and name
INSERT INTO Event (ClubId, Name, EventDate, Location, Status) VALUES
(1, 'Debate Championship', '2025-04-15', 'Harvard Yard', 'Scheduled'),
(2, 'Music Concert', '2025-05-01', 'Harvard Hall', 'Scheduled'),
(3, 'Tech Talk', '2025-04-20', 'UCalgary TFDL', 'Scheduled'),
(4, 'Art Exhibition', '2025-05-05', 'UCalgary MacHall', 'Scheduled'),
(5, 'Hackathon', '2025-04-25', 'IIT Mumbai Campus', 'Scheduled'),
(6, 'Cultural Fest', '2025-05-10', 'IIT Mumbai Auditorium', 'Scheduled');

-- rsvp table is populated with basically information of who will be attending what event and when he accepted to do it 
INSERT INTO RSVP (UserId, EventId, RSVPDate) VALUES
(1, 1, '2025-04-01'),  -- john - debate chapionship
(2, 2, '2025-04-02'),  -- priya - music concert
(3, 3, '2025-04-03'),  -- alice - tech talk
(4, 4, '2025-04-04'),  -- rahil - art ex
(5, 5, '2025-04-05'),  -- sanjay - hackathon
(6, 6, '2025-04-06'),  -- emily - culture fest
(7, 5, '2025-04-07');  -- rohit - hackathon

-- announcement table for announcements
INSERT INTO Announcement (ClubId, EventId, Content, DatePosted) VALUES
(1, 1, 'Debate rules updated. Please check the guidelines.', '2025-04-10'),
(3, 3, 'Tech Talk keynote speaker announced. Stay tuned for more details.', '2025-04-12'),
(5, 5, 'Hackathon guidelines published. Register now!', '2025-04-15');

-- discussion channel for all the announcements
INSERT INTO DiscussionChannel (AnnouncementId, ChannelName, Description) VALUES
(1, 'Debate Discussion', 'Discuss the debate rules.'),
(2, 'Tech Talk Discussion', 'Discuss the tech talk event.'),
(3, 'Hackathon Discussion', 'Discuss the hackathon guidelines.');

-- simulate dummy messages

-- messages in debate channel
INSERT INTO Message (ChannelId, ClubMemberId, Content, DatePosted) VALUES
(1, 1, 'Please review the updated rules.', '2025-04-11'),  
(1, 7, 'I have a question about the new rules.', '2025-04-12');  

-- messages in tech talk
INSERT INTO Message (ChannelId, ClubMemberId, Content, DatePosted) VALUES
(2, 3, 'Excited about the keynote speaker announcement.', '2025-04-13');

-- messages in hackathon
INSERT INTO Message (ChannelId, ClubMemberId, Content, DatePosted) VALUES
(3, 5, 'Looking forward to a competitive hackathon.', '2025-04-16');

-- comments
INSERT INTO Comment (MessageId, ClubMemberId, Content, DatePosted) VALUES
(1, 7, 'Thanks for the update.', '2025-04-12'),
(2, 1, 'Feel free to ask any questions.', '2025-04-13');

-- assign manager for all events
INSERT INTO Manages (MemberId, EventId) VALUES
(1, 1),  -- john - debate championship
(2, 2),  -- priya - music concert
(3, 3),  -- alice - tech talk
(4, 4),  -- rahul - art ex
(5, 5),  -- sanjay - hackathon
(6, 6);  -- emily - culture fest
