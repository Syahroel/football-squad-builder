# API Documentation

## Base URL
- Development: `http://localhost:3000/api`
- Production: `https://your-app.vercel.app/api`

## Endpoints

### Players

#### GET /api/players
Get all players or filter by criteria.

**Query Parameters:**
- `position` (optional): Filter by position (e.g., `CF`, `GK`)
- `search` (optional): Search by player name

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "Player Name",
    "ovr": 85,
    "age": 21,
    "position": "CF",
    "playingStyle": "Goal Poacher",
    "originalClub": "Club Name",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "userId": "default"
  }
]
```

**Examples:**
```bash
# Get all players
curl http://localhost:3000/api/players

# Filter by position
curl http://localhost:3000/api/players?position=CF

# Search by name
curl http://localhost:3000/api/players?search=ronaldo
```

---

#### POST /api/players
Create a new player.

**Request Body:**
```json
{
  "name": "Player Name",
  "ovr": 85,
  "age": 21,
  "position": "CF",
  "playingStyle": "Goal Poacher",
  "originalClub": "Club Name"
}
```

**Validation:**
- `name`: Required, string
- `ovr`: Required, integer (1-99)
- `age`: Required, integer (15-40)
- `position`: Required, one of: GK, CB, LB, RB, DMF, CMF, AMF, LWF, RWF, CF, SS
- `playingStyle`: Required, must match position's available styles
- `originalClub`: Optional, string

**Response:**
```json
{
  "id": "uuid",
  "name": "Player Name",
  "ovr": 85,
  "age": 21,
  "position": "CF",
  "playingStyle": "Goal Poacher",
  "originalClub": "Club Name",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "userId": "default"
}
```

**Example:**
```bash
curl -X POST http://localhost:3000/api/players \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Cristiano Ronaldo",
    "ovr": 91,
    "age": 24,
    "position": "CF",
    "playingStyle": "Goal Poacher",
    "originalClub": "Manchester United"
  }'
```

---

#### PUT /api/players/[id]
Update an existing player.

**URL Parameters:**
- `id`: Player UUID

**Request Body:**
```json
{
  "name": "Updated Name",
  "ovr": 86,
  "age": 22,
  "position": "CF",
  "playingStyle": "Goal Poacher",
  "originalClub": "New Club"
}
```

**Response:**
```json
{
  "id": "uuid",
  "name": "Updated Name",
  "ovr": 86,
  "age": 22,
  "position": "CF",
  "playingStyle": "Goal Poacher",
  "originalClub": "New Club",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-02T00:00:00.000Z",
  "userId": "default"
}
```

**Example:**
```bash
curl -X PUT http://localhost:3000/api/players/abc-123 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Cristiano Ronaldo",
    "ovr": 92,
    "age": 25,
    "position": "CF",
    "playingStyle": "Goal Poacher",
    "originalClub": "Real Madrid"
  }'
```

---

#### DELETE /api/players/[id]
Delete a player.

**URL Parameters:**
- `id`: Player UUID

**Response:**
```json
{
  "success": true
}
```

**Example:**
```bash
curl -X DELETE http://localhost:3000/api/players/abc-123
```

---

### Recommendations

#### POST /api/recommendations
Generate AI-powered tactical recommendations.

**Requirements:**
- Minimum 11 players in database

**Response:**
```json
{
  "startingXI": {
    "formation": "4-3-3",
    "players": [
      {
        "player": {
          "id": "uuid",
          "name": "Player Name",
          "ovr": 85,
          "age": 21,
          "position": "CF",
          "playingStyle": "Goal Poacher",
          "originalClub": "Club Name"
        },
        "position": "CF",
        "explanation": "Best CF option with OVR 85. Clinical finisher in the box.",
        "isHighlighted": true
      }
    ]
  },
  "superSubs": [
    {
      "player": {
        "id": "uuid",
        "name": "Sub Player",
        "ovr": 82,
        "position": "LWF"
      },
      "reason": "Game-changing pace and dribbling to unlock tired defenses",
      "timing": "60th-70th minute when opponent legs are heavy"
    }
  ],
  "formations": [
    {
      "type": "balanced",
      "formation": "4-3-3",
      "description": "Your primary formation for kick-off and balanced play",
      "tacticalInstructions": [
        "Maintain shape and compactness",
        "Quick transitions from defense to attack"
      ],
      "whenToUse": "Start of match, when scores are level"
    }
  ],
  "tacticalStrategies": [
    {
      "scenario": "VS Full Defensive Teams (Low Block)",
      "strategies": [
        "Patience is key - don't force passes",
        "Use wingers to stretch the defense"
      ],
      "keyPlayers": ["Player 1", "Player 2"],
      "superSubTiming": "Bring on fresh wingers at 60-65 minutes"
    }
  ]
}
```

**Example:**
```bash
curl -X POST http://localhost:3000/api/recommendations
```

**Error Response (< 11 players):**
```json
{
  "error": "Need at least 11 players to generate recommendations"
}
```

---

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "error": "Validation error message"
}
```

### 404 Not Found
```json
{
  "error": "Player not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Failed to perform operation"
}
```

---

## Rate Limiting

Currently no rate limiting is implemented. For production use, consider:
- Vercel's built-in rate limiting
- Custom middleware for API protection
- Authentication for sensitive operations

---

## Data Models

### Player
```typescript
{
  id: string;              // UUID
  name: string;            // Player name
  ovr: number;             // Overall rating (1-99)
  age: number;             // Age (15-40)
  position: string;        // Position code
  playingStyle: string;    // Playing style
  originalClub: string | null;  // Club name
  createdAt: Date;         // Creation timestamp
  updatedAt: Date;         // Last update timestamp
  userId: string;          // User ID (default: "default")
}
```

### Positions
```
GK, CB, LB, RB, DMF, CMF, AMF, LWF, RWF, CF, SS
```

### Playing Styles by Position
```typescript
{
  GK: ['Offensive Goalkeeper', 'Defensive Goalkeeper'],
  CB: ['Extra Frontman', 'Build Up', 'Destroyer', 'The Wall'],
  LB: ['Offensive Fullback', 'Defensive Fullback', 'Roaming Flank'],
  RB: ['Offensive Fullback', 'Defensive Fullback', 'Roaming Flank'],
  DMF: ['Anchor Man', 'Destroyer', 'Orchestrator', 'Box-to-Box'],
  CMF: ['Box-to-Box', 'Hole Player', 'Orchestrator', 'The Destroyer'],
  AMF: ['Classic No. 10', 'Hole Player', 'Creative Playmaker', 'Box-to-Box'],
  LWF: ['Prolific Winger', 'Roaming Flank', 'Goal Poacher'],
  RWF: ['Prolific Winger', 'Roaming Flank', 'Goal Poacher'],
  CF: ['Goal Poacher', 'Fox In The Box', 'Advanced Striker', 'Target Man'],
  SS: ['Creative Playmaker', 'Hole Player', 'Dummy Runner']
}
```

### Formations
```
4-3-3, 4-4-2, 4-2-3-1, 3-5-2, 5-3-2, 4-2-4, 3-4-3
```

---

## Testing with cURL

### Complete Workflow Example

```bash
# 1. Add a goalkeeper
curl -X POST http://localhost:3000/api/players \
  -H "Content-Type: application/json" \
  -d '{"name":"Gianluigi Donnarumma","ovr":89,"age":24,"position":"GK","playingStyle":"Defensive Goalkeeper","originalClub":"PSG"}'

# 2. Add defenders (repeat for CB, LB, RB)
curl -X POST http://localhost:3000/api/players \
  -H "Content-Type: application/json" \
  -d '{"name":"Virgil van Dijk","ovr":90,"age":31,"position":"CB","playingStyle":"Build Up","originalClub":"Liverpool"}'

# 3. Add midfielders (repeat for DMF, CMF, AMF)
curl -X POST http://localhost:3000/api/players \
  -H "Content-Type: application/json" \
  -d '{"name":"Kevin De Bruyne","ovr":91,"age":32,"position":"AMF","playingStyle":"Classic No. 10","originalClub":"Man City"}'

# 4. Add forwards (repeat for LWF, RWF, CF)
curl -X POST http://localhost:3000/api/players \
  -H "Content-Type: application/json" \
  -d '{"name":"Kylian Mbappe","ovr":91,"age":24,"position":"CF","playingStyle":"Goal Poacher","originalClub":"PSG"}'

# 5. Get all players
curl http://localhost:3000/api/players

# 6. Generate recommendations (after adding 11+ players)
curl -X POST http://localhost:3000/api/recommendations
```

---

## Postman Collection

Import this JSON into Postman for easy testing:

```json
{
  "info": {
    "name": "Football Squad Builder API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Get All Players",
      "request": {
        "method": "GET",
        "url": "{{baseUrl}}/api/players"
      }
    },
    {
      "name": "Create Player",
      "request": {
        "method": "POST",
        "url": "{{baseUrl}}/api/players",
        "header": [{"key": "Content-Type", "value": "application/json"}],
        "body": {
          "mode": "raw",
          "raw": "{\"name\":\"Test Player\",\"ovr\":80,\"age\":22,\"position\":\"CF\",\"playingStyle\":\"Goal Poacher\",\"originalClub\":\"Test FC\"}"
        }
      }
    },
    {
      "name": "Generate Recommendations",
      "request": {
        "method": "POST",
        "url": "{{baseUrl}}/api/recommendations"
      }
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:3000"
    }
  ]
}
```

---

**For more information, see the main README.md**
