# Football Squad Builder - Project Summary

## Overview
A full-stack web application for managing football squads with AI-powered tactical recommendations. Built for career mode enthusiasts and football managers.

## Architecture

### Frontend (Next.js 14 App Router)
- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React hooks (useState, useEffect)
- **UI Components**: Custom components built with Tailwind

### Backend (Next.js API Routes)
- **API Layer**: Next.js API routes
- **Database**: Turso (LibSQL - SQLite for the edge)
- **ORM**: Drizzle ORM
- **Validation**: Zod schemas (via React Hook Form)

### Database Schema

#### Players Table
- id (UUID, primary key)
- name (string)
- ovr (integer, 1-99)
- age (integer, 15-40)
- position (string)
- playingStyle (string)
- originalClub (string, nullable)
- createdAt (timestamp)
- updatedAt (timestamp)
- userId (string, for future multi-user support)

#### Squads Table (Future Enhancement)
- id (UUID, primary key)
- name (string)
- formation (string)
- createdAt (timestamp)
- updatedAt (timestamp)
- userId (string)

#### Squad_Players Table (Future Enhancement)
- Junction table for many-to-many relationship
- Links squads to players with position data

#### Recommendations Table (Future Enhancement)
- Caches AI recommendations
- JSON storage for flexibility

## Core Features Implemented

### 1. Player Management ✅
- Add new players with full validation
- Edit existing players
- Delete players with confirmation
- Search players by name
- Filter players by position
- View all players in card layout
- Real-time stats (total players, avg OVR, avg age)

### 2. AI Recommendation Engine ✅
- **Starting XI Selection**: Analyzes squad and recommends best 11 players
- **Formation Selection**: Automatically picks optimal formation
- **Super Sub Recommendations**: Suggests 3 impact substitutes
- **Formation Variations**: Provides balanced, offensive, and defensive setups
- **Tactical Strategies**: Generates strategies for different opponent styles

### 3. Export Functionality ✅
- Export recommendations as formatted text file
- Professional formatting with Unicode characters
- Includes all tactical analysis sections

## AI Algorithm Details

### Position Compatibility Matrix
```typescript
GK → GK only
CB → CB only
LB → LB, CB
RB → RB, CB
DMF → DMF, CMF, CB
CMF → CMF, DMF, AMF
AMF → AMF, CMF, LWF, RWF, SS
LWF → LWF, AMF, LB, SS
RWF → RWF, AMF, RB, SS
CF → CF, SS
SS → SS, CF, AMF
```

### Scoring System
1. **Base Score**: Player OVR
2. **Position Match Bonus**: +10 (exact), +5 (compatible)
3. **Playing Style Bonus**: +5-8 (formation-specific)
4. **Age Bonus**: +3 (17-23), +2 (24-28)

### Formation Selection Logic
- **4-3-3**: Strong wingers (avg OVR > 75)
- **4-2-3-1**: Creative AMFs present
- **5-3-2**: 4+ quality center backs
- **4-4-2**: Strong strikers (avg OVR > 75)

### Super Sub Criteria
1. High impact potential (OVR 70+)
2. Different playing style than starters
3. Position versatility
4. Game-changing abilities (pace, finishing)

## API Endpoints

### Players
- `GET /api/players` - List all players (with optional filters)
- `POST /api/players` - Create new player
- `PUT /api/players/[id]` - Update player
- `DELETE /api/players/[id]` - Delete player

### Recommendations
- `POST /api/recommendations` - Generate AI recommendations

## File Structure
```
football-squad-builder/
├── app/
│   ├── api/
│   │   ├── players/
│   │   │   ├── route.ts (GET, POST)
│   │   │   └── [id]/route.ts (PUT, DELETE)
│   │   └── recommendations/
│   │       └── route.ts (POST)
│   ├── squad-builder/
│   │   └── page.tsx (Main app interface)
│   ├── layout.tsx (Root layout)
│   ├── page.tsx (Homepage)
│   └── globals.css
├── components/
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   └── card.tsx
│   ├── PlayerCard.tsx (Display player info)
│   ├── PlayerForm.tsx (Add/edit players)
│   └── RecommendationDisplay.tsx (Show AI results)
├── db/
│   ├── schema.ts (Drizzle schema)
│   └── index.ts (Database connection)
├── lib/
│   ├── constants.ts (Positions, formations, styles)
│   ├── recommendations.ts (AI engine)
│   ├── utils.ts (Helper functions)
│   └── sample-data.ts (Test data)
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── drizzle.config.ts
├── next.config.js
├── README.md
├── SETUP.md
└── .gitignore
```

## Key Technologies

### Dependencies
- `next@14.2.5` - React framework
- `react@18.3.1` - UI library
- `@libsql/client@0.6.0` - Turso database client
- `drizzle-orm@0.31.2` - TypeScript ORM
- `react-hook-form@7.51.5` - Form management
- `zod@3.23.8` - Schema validation
- `jspdf@2.5.1` - PDF generation
- `lucide-react@0.395.0` - Icons
- `tailwindcss@3.4.4` - Styling

### Dev Dependencies
- `typescript@5.5.2`
- `drizzle-kit@0.22.7` - Database migrations
- `eslint` - Code linting

## Deployment Guide

### Prerequisites
1. GitHub account
2. Vercel account (free)
3. Turso account (free)

### Steps
1. **Setup Turso Database**
   ```bash
   turso db create football-squad-builder
   turso db show football-squad-builder --url
   turso db tokens create football-squad-builder
   ```

2. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

3. **Deploy to Vercel**
   - Import GitHub repository
   - Add environment variables:
     - `TURSO_DATABASE_URL`
     - `TURSO_AUTH_TOKEN`
     - `NEXT_PUBLIC_APP_URL`
   - Deploy

4. **Initialize Database**
   ```bash
   npm run db:push
   ```

## Future Enhancements

### Phase 2 Features
- [ ] User authentication (NextAuth.js)
- [ ] Save multiple squads per user
- [ ] Drag-and-drop pitch visualization
- [ ] PDF export with visual formations
- [ ] Share squads via unique URLs
- [ ] Player comparison tool
- [ ] Formation builder with visual editor
- [ ] Match simulation based on tactics

### Phase 3 Features
- [ ] Player development tracking
- [ ] Transfer market integration
- [ ] Team chemistry calculator
- [ ] Advanced statistics dashboard
- [ ] Mobile app (React Native)
- [ ] Community squad sharing
- [ ] AI-powered opponent analysis

## Performance Considerations

### Optimizations Implemented
- Server-side rendering for SEO
- API route caching (future)
- Efficient database queries with Drizzle
- Minimal client-side JavaScript
- Tailwind CSS for small bundle size

### Scalability
- Turso edge database (low latency globally)
- Vercel edge functions (fast API responses)
- Stateless architecture (easy horizontal scaling)

## Testing Strategy

### Manual Testing Checklist
- [ ] Add player with all fields
- [ ] Edit player information
- [ ] Delete player
- [ ] Search players by name
- [ ] Filter players by position
- [ ] Generate recommendations with 11+ players
- [ ] Export recommendations as text
- [ ] Verify formation logic
- [ ] Check super sub selection
- [ ] Test tactical strategies generation

### Future Automated Testing
- Unit tests for recommendation algorithm
- Integration tests for API routes
- E2E tests with Playwright
- Component tests with React Testing Library

## Success Metrics

### MVP Completion ✅
- [x] Player CRUD operations
- [x] AI recommendation engine
- [x] Starting XI selection
- [x] Super sub recommendations
- [x] Formation variations
- [x] Tactical strategies
- [x] Text export
- [x] Responsive design
- [x] Database persistence

### Next Milestones
- [ ] 100+ users
- [ ] 1000+ squads created
- [ ] 5000+ recommendations generated
- [ ] Deploy to production
- [ ] Gather user feedback

## Contributing

### Development Workflow
1. Fork repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

### Code Standards
- TypeScript strict mode
- ESLint configuration
- Prettier formatting
- Meaningful commit messages
- Component documentation

## License
MIT License - Free to use and modify

## Support
- GitHub Issues for bugs
- Discussions for feature requests
- Email support (future)

---

**Built with passion for football and technology** ⚽💻
