import { pool } from '../config/database.js';

export async function fetchAllClubs(universityId : number) {
    const [clubs] = await pool.query("SELECT * FROM Club WHERE Club.UniversityId = ? ;", universityId);
    return clubs;
}

export async function fetchUserClubs(userId : number) {
    const [clubs] = await pool.query("SELECT * FROM Club WHERE ClubId IN (SELECT ClubId FROM ClubMember WHERE UserId = ?);", userId);
    return clubs;
}

export async function fetchClub(clubId : number) {
    const [club] = await pool.query("SELECT * FROM Club WHERE ClubId = ? ;", clubId);
    return club;
}

export async function fetchClubMembers(clubId : number) {
    const [normalMembers] = await pool.query("SELECT User.FirstName, User.LastName, ClubMember.MemberId, ClubMember.DateJoined FROM ClubMember JOIN User ON User.UserId = ClubMember.UserId WHERE ClubMember.MemberId IN (SELECT MemberId FROM ClubNormalMember WHERE ClubNormalMember.ClubId = ?);", clubId);
    const [adminMembers] = await pool.query("SELECT User.FirstName, User.LastName, ClubMember.MemberId, ClubMember.DateJoined FROM ClubMember JOIN User ON User.UserId = ClubMember.UserId WHERE ClubMember.MemberId IN (SELECT MemberId FROM ClubAdmin WHERE ClubAdmin.ClubId = ?);", clubId);

    return {
        normal : normalMembers,
        admin : adminMembers,
    }
}


