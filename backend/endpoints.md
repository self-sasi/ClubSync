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

## University

### GET `/api/uni`
Fetches all universities.

#### Response:
- Array of university objects

---

## Profile

### GET `/api/profile/:id`
Retrieves a user profile by userId.

#### URL Parameter:
- `id`: UserId

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

### GET `/api/clubs/user/:userId`
Fetches all clubs for a given user.

#### URL Parameter:
- `userId`: ID of the user

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

### GET `/api/clubs/user/club/:clubId`
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