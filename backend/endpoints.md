# API Endpoints Documentation

## Authentication

### POST `/api/auth/signup`
Registers a user.

#### Request Body:
```ts
export interface User {
    UserId?: number;
    FirstName: string;
    LastName: string;
    Email: string;
    Password: string;
    Location?: string;
    UniversityId: number;
}
```

#### Responses:
- ✅ `201 Created`: `{ message: "User registered successfully" }`
- ❌ `500 Internal Server Error`: `{ error: err.message }`

---

### POST `/api/auth/login`
Logs a user in.

#### Request Body:
```ts
{
    Email: string;
    Password: string;
}
```

#### Response:
```ts
{
    UserId?: number;
    FirstName: string;
    LastName: string;
    Email: string;
    Location?: string;
    UniversityId: number;
}
```

---

### POST `/api/auth/verify`
Logs a user in without using credentials. uses token istead

#### Request Body:
```ts
// only Bearer token
```

#### Response:
```ts
{
    UserId?: number;
    FirstName: string;
    LastName: string;
    Email: string;
    Location?: string;
    UniversityId: number;
}
```

---

### PUT `/api/auth/`
Updates user information

#### Request Body:
```ts
Baerer token,
userUpdateObject =
{
    "UserId": 18,
    "FirstName": "sasi",
    "LastName": "singh",
    "Email": "sasi@gmail.com",
    "Location": null,
    "UniversityId": 2
}
```

#### Response:
```ts
// just confirmation 204
```

---
### PUT `/api/auth/password`
Updates user password

#### Request Body:
```ts
Baerer token,
passwordSet =
{
    "UserId": 18,
    "new": "sasi",
    "old": "sasi123"
}
```

#### Response:
```ts
// just confirmation 204
```

---

## University

### GET `/api/uni`
Fetches all universities.

#### Response:
- Array of university objects

---

## Profile

### GET `/api/profile`
Retrieves a user profile by userId.

#### URL Parameter:
- authentication token in header

#### Response:
```ts
{
    UserId?: number;
    FirstName: string;
    LastName: string;
    Email: string;
    Location?: string;
    UniversityId: number;
}
```

---

## Clubs

### GET `/api/clubs/university/:universityId`
Fetches all clubs for a given university.

#### URL Parameter:
- `universityId`: ID of the university

#### Response:
- Array of club objects:

```ts
{
    ClubId: number;
    ClubName: string;
    Description: string;
    CreationDate: string; // ISO date string
    UniversityId: number;
}
```

---

### GET `/api/clubs`
Fetches all clubs for a given user.

#### URL Parameter:
- authentication token in header

#### Response:
- Array of club objects:

```ts
{
    ClubId: number;
    ClubName: string;
    Description: string;
    CreationDate: string; // ISO date string
    UniversityId: number;
}
```

---

### GET `/api/clubs/club/:clubId`
Fetches a club for a user.

#### URL Parameter:
- `clubid`: ID of the Club

#### Response:
club object:

```ts
{
    ClubId: number;
    ClubName: string;
    Description: string;
    CreationDate: string; // ISO date string
    UniversityId: number;
}
```
---

### GET `/api/clubs/club/:clubId/members`
gets all members of the given club

#### URL Parameter:
- `clubid`: ID of the Club

#### Response:
an object that has normal members array and admin array

```ts
{
    normal : [...]
    admin : [...]
}
```
---

### GET `/api/clubs/club/:clubId/events`
gets all events of the given club

#### URL Parameter:
- `clubid`: ID of the Club

#### Response:
an array of event objects

```ts
[
    {
        "EventId": 2,
        "ClubId": 2,
        "Name": "Music Concert",
        "EventDate": "2025-05-01T06:00:00.000Z",
        "Location": "Harvard Hall",
        "Status": "Scheduled"
    }
    ...
]
```

### GET `/api/clubs/club/:clubId/announcements`
gets all announcements of the given club

#### URL Parameter:
- `clubid`: ID of the Club

#### Response:
an array of announcement objects

```ts
TODO
```

### GET `/api/clubs/club/:clubId/announcements/:announcementId`
gets all events of the given club

#### URL Parameter:
- `clubid`: ID of the Club
- `announcementid`: ID of the announcement

#### Response:
an array of announcement objects

```ts
TODO
```