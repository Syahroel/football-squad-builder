# ⚽ Football Squad Builder & Tactical Recommender

A comprehensive web application for managing football/soccer team squads with AI-powered tactical recommendations. Built with Next.js 14, TypeScript, Tailwind CSS, and Turso database.

## Features

- **Player Management**: Add, edit, delete, and organize players with detailed stats
- **AI Recommendations**: Get intelligent starting XI picks based on squad composition
- **Super Sub Suggestions**: Receive recommendations for impactful substitutes
- **Tactical Analysis**: Formation recommendations for different match scenarios
- **Strategic Guidance**: Tactical strategies for various opponent styles
- **Export Functionality**: Export recommendations as formatted text files

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: Tailwind CSS
- **Database**: Turso (LibSQL)
- **ORM**: Drizzle ORM
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Turso account (free at [turso.tech](https://turso.tech))

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd football-squad-builder
```

2. Install dependencies:
```bash
npm install
```

3. Set up Turso database:
```bash
# Install Turso CLI
curl -sSfL https://get.tur.so/install.sh | bash

# Create a new database
turso db create football-squad-builder

# Get database URL
turso db show football-squad-builder --url

# Create auth token
turso db tokens create football-squad-builder
```

4. Create `.env.local` file:
```env
TURSO_DATABASE_URL=libsql://your-database.turso.io
TURSO_AUTH_TOKEN=your-auth-token
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

5. Push database schema:
```bash
npm run db:push
```

6. Run development server:
```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000)

## Usage

### Adding Players

1. Navigate to Squad Builder
2. Click "Add Player"
3. Fill in player details:
   - Name
   - Overall Rating (OVR, 1-99)
   - Age (15-40)
   - Position
   - Playing Style
   - Original Club (optional)

### Generating Recommendations

1. Add at least 11 players to your squad
2. Click "Get AI Recommendations"
3. View:
   - Starting XI with tactical explanations
   - Super sub recommendations
   - Formation variations (balanced, offensive, defensive)
   - Tactical strategies for different scenarios

### Exporting

- Click "Export as TXT" to download formatted recommendations
- Share your tactical analysis with others

## Project Structure

```
football-squad-builder/
├── app/
│   ├── api/
│   │   ├── players/          # Player CRUD endpoints
│   │   └── recommendations/  # AI recommendation endpoint
│   ├── squad-builder/        # Main squad builder page
│   ├── layout.tsx
│   ├── page.tsx              # Homepage
│   └── globals.css
├── components/
│   ├── ui/                   # Reusable UI components
│   ├── PlayerCard.tsx
│   ├── PlayerForm.tsx
│   └── RecommendationDisplay.tsx
├── db/
│   ├── schema.ts             # Database schema
│   └── index.ts              # Database connection
├── lib/
│   ├── constants.ts          # Positions, formations, styles
│   ├── recommendations.ts    # AI recommendation engine
│   └── utils.ts
└── package.json
```

## AI Recommendation Algorithm

The recommendation engine considers:

1. **Position Compatibility**: Players must be able to play the assigned position
2. **Overall Rating**: Higher OVR players are prioritized (40% weight)
3. **Playing Style Fit**: Styles that complement the formation get bonuses
4. **Age Balance**: Wonderkids (17-23) receive priority
5. **Formation Optimization**: Best formation selected based on squad strengths

### Formation Selection Logic

- Strong wingers → 4-3-3
- Creative AMFs → 4-2-3-1
- Multiple quality CBs → 5-3-2
- Strong strikers → 4-4-2

## Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Database Migration

```bash
npm run db:push
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License

## Support

For issues and questions, please open an issue on GitHub.

---

Built with ⚽ for football managers and career mode enthusiasts
