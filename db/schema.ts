import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const players = sqliteTable('players', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  ovr: integer('ovr').notNull(),
  age: integer('age').notNull(),
  position: text('position').notNull(),
  playingStyle: text('playing_style').notNull(),
  originalClub: text('original_club'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  userId: text('user_id').default('default'),
});

export const squads = sqliteTable('squads', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  formation: text('formation').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  userId: text('user_id').default('default'),
});

export const squadPlayers = sqliteTable('squad_players', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  squadId: text('squad_id').notNull().references(() => squads.id, { onDelete: 'cascade' }),
  playerId: text('player_id').notNull().references(() => players.id, { onDelete: 'cascade' }),
  isStarter: integer('is_starter', { mode: 'boolean' }).notNull().default(false),
  positionInFormation: text('position_in_formation'),
});

export const recommendations = sqliteTable('recommendations', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  squadId: text('squad_id').notNull().references(() => squads.id, { onDelete: 'cascade' }),
  recommendationData: text('recommendation_data', { mode: 'json' }).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export type Player = typeof players.$inferSelect;
export type NewPlayer = typeof players.$inferInsert;
export type Squad = typeof squads.$inferSelect;
export type NewSquad = typeof squads.$inferInsert;
export type SquadPlayer = typeof squadPlayers.$inferSelect;
export type Recommendation = typeof recommendations.$inferSelect;
