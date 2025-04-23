import { pool } from '../config/database.js';

export async function fetchClubAnnouncements(clubId: number) {
  const [rows] = await pool.query<any[]>(`
    SELECT 
      a.AnnouncementId,
      a.Content AS AnnouncementContent,
      a.DatePosted AS AnnouncementDate,
      e.EventId,
      e.Name AS EventName,
      e.EventDate,
      e.Location,
      e.Status,
      dc.ChannelId,
      dc.ChannelName,
      dc.Description AS ChannelDescription,
      m.MessageId,
      m.Content AS MessageContent,
      m.DatePosted AS MessageDate,
      CONCAT(u1.FirstName, ' ', u1.LastName) AS MessageAuthor,
      c.CommentId,
      c.Content AS CommentContent,
      c.DatePosted AS CommentDate,
      CONCAT(u2.FirstName, ' ', u2.LastName) AS CommentAuthor
    FROM Announcement a
    JOIN Event e ON a.EventId = e.EventId
    LEFT JOIN DiscussionChannel dc ON dc.AnnouncementId = a.AnnouncementId
    LEFT JOIN Message m ON m.ChannelId = dc.ChannelId
    LEFT JOIN ClubMember cm1 ON m.ClubMemberId = cm1.MemberId
    LEFT JOIN User u1 ON u1.UserId = cm1.UserId
    LEFT JOIN Comment c ON c.MessageId = m.MessageId
    LEFT JOIN ClubMember cm2 ON c.ClubMemberId = cm2.MemberId
    LEFT JOIN User u2 ON u2.UserId = cm2.UserId
    WHERE a.ClubId = ?
  `, [clubId]);

  // Build nested structure
  const announcementsMap: Record<number, any> = {};

  for (const row of rows) {
    const annId = row.AnnouncementId;
    if (!announcementsMap[annId]) {
      announcementsMap[annId] = {
        AnnouncementId: annId,
        Content: row.AnnouncementContent,
        DatePosted: row.AnnouncementDate,
        Event: {
          EventId: row.EventId,
          Name: row.EventName,
          EventDate: row.EventDate,
          Location: row.Location,
          Status: row.Status
        },
        Channels: {}
      };
    }

    const chanId = row.ChannelId;
    if (chanId && !announcementsMap[annId].Channels[chanId]) {
      announcementsMap[annId].Channels[chanId] = {
        ChannelId: chanId,
        ChannelName: row.ChannelName,
        Description: row.ChannelDescription,
        Messages: {}
      };
    }

    const msgId = row.MessageId;
    if (chanId && msgId && !announcementsMap[annId].Channels[chanId].Messages[msgId]) {
      announcementsMap[annId].Channels[chanId].Messages[msgId] = {
        MessageId: msgId,
        Content: row.MessageContent,
        DatePosted: row.MessageDate,
        AuthorName: row.MessageAuthor,
        Comments: []
      };
    }

    if (chanId && msgId && row.CommentId) {
      announcementsMap[annId].Channels[chanId].Messages[msgId].Comments.push({
        CommentId: row.CommentId,
        Content: row.CommentContent,
        DatePosted: row.CommentDate,
        AuthorName: row.CommentAuthor
      });
    }
  }

  // Convert nested maps to arrays
  return Object.values(announcementsMap).map((announcement: any) => {
    announcement.Channels = Object.values(announcement.Channels).map((channel: any) => {
      channel.Messages = Object.values(channel.Messages);
      return channel;
    });
    return announcement;
  });
}

export async function createAnnouncement(clubId: number, eventId: number, content: string) {
  await pool.query(
    `INSERT INTO Announcement (ClubId, EventId, Content, DatePosted)
     VALUES (?, ?, ?, CURDATE())`,
    [clubId, eventId, content]
  );
}

export async function createDiscussionChannel(announcementId: number, channelName: string, description: string) {
  await pool.query(
    `INSERT INTO DiscussionChannel (AnnouncementId, ChannelName, Description)
     VALUES (?, ?, ?)`,
    [announcementId, channelName, description]
  );
}

export async function postMessage(clubMemberId: number, channelId: number, content: string): Promise<void> {
  await pool.query(
    `INSERT INTO Message (ChannelId, ClubMemberId, Content, DatePosted)
     VALUES (?, ?, ?, CURDATE())`,
    [channelId, clubMemberId, content]
  );
}

export async function addComment(clubMemberId: number, messageId: number, content: string): Promise<void> {
  await pool.query(
    `INSERT INTO Comment (MessageId, ClubMemberId, Content, DatePosted)
     VALUES (?, ?, ?, CURDATE())`,
    [messageId, clubMemberId, content]
  );
}



  
